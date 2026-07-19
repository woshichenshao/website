param(
  [Parameter(Mandatory = $true)]
  [string]$JobsPath
)

$ErrorActionPreference = 'Stop'
$jobs = Get-Content -Raw -Encoding UTF8 -LiteralPath $JobsPath | ConvertFrom-Json
if (-not $jobs -or $jobs.Count -eq 0) {
  Write-Output '{"converted":0}'
  exit 0
}

function Print-DocumentToPdf {
  param($Document, $Word, [string]$OutputPath)
  $Word.ActivePrinter = 'Microsoft Print to PDF'
  $missing = [Type]::Missing
  $arguments = [object[]]@($false, $false, 0, $OutputPath, $missing, $missing, $missing, $missing, $missing, $missing, $true, $true, $missing, $missing, $missing, $missing, $missing, $missing)
  [void]$Document.GetType().InvokeMember('PrintOut', [Reflection.BindingFlags]::InvokeMethod, $null, $Document, $arguments)
  for ($attempt = 0; $attempt -lt 30; $attempt += 1) {
    if ((Test-Path -LiteralPath $OutputPath) -and (Get-Item -LiteralPath $OutputPath).Length -gt 0) { return }
    Start-Sleep -Milliseconds 500
  }
  throw 'PDF 打印超时'
}

$word = $null
$converted = 0
$failures = @()
try {
  $word = New-Object -ComObject Word.Application
  $word.Visible = $false
  $word.DisplayAlerts = 0
  foreach ($job in $jobs) {
    $document = $null
    try {
      $outputDirectory = Split-Path -Parent $job.output
      New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
      $sourceExtension = [System.IO.Path]::GetExtension($job.source)
      $localSource = Join-Path $outputDirectory "$($job.id)-source$sourceExtension"
      Copy-Item -LiteralPath $job.source -Destination $localSource -Force
      $document = $word.Documents.Open($localSource, $false, $true, $false)
      try {
        $document.ExportAsFixedFormat($job.output, 17, $false, 0, 0, 1, 99999, 0, $true, $true, 1, $true, $true, $false)
      }
      catch {
        try {
          $document.SaveAs2($job.output, 17)
        }
        catch {
          $temporaryDocx = "$($job.output).docx"
          $document.SaveAs2($temporaryDocx, 16)
          $document.Close(0)
          [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($document)
          $document = $word.Documents.Open($temporaryDocx, $false, $true, $false)
          try {
            $document.ExportAsFixedFormat($job.output, 17, $false, 0, 0, 1, 99999, 0, $true, $true, 1, $true, $true, $false)
          }
          catch {
            Print-DocumentToPdf -Document $document -Word $word -OutputPath $job.output
          }
        }
      }
      $converted += 1
    }
    catch {
      $failures += @{ id = $job.id; source = $job.source; error = $_.Exception.Message }
    }
    finally {
      if ($null -ne $document) {
        $document.Close(0)
        [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($document)
      }
    }
  }
}
finally {
  if ($null -ne $word) {
    $word.Quit()
    [void][System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($word)
  }
  [GC]::Collect()
  [GC]::WaitForPendingFinalizers()
}

$result = @{ converted = $converted; failures = $failures }
$result | ConvertTo-Json -Depth 4 -Compress
if ($failures.Count -gt 0) { exit 2 }
