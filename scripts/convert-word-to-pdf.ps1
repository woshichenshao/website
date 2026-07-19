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
      $document = $word.Documents.Open($job.source, $false, $true, $false)
      try {
        $document.ExportAsFixedFormat($job.output, 17, $false, 0, 0, 1, 99999, 0, $true, $true, 1, $true, $true, $false)
      }
      catch {
        $document.SaveAs2($job.output, 17)
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
