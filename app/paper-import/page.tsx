"use client";

import { useMemo, useState } from "react";

type Progress = { done: number; total: number; message: string; failed: string[] };

export default function PaperImportPage() {
  const [token, setToken] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<Progress>({ done: 0, total: 0, message: "等待选择论文目录", failed: [] });
  const validFiles = useMemo(() => files.filter((file) => /^paper-[a-z0-9-]+\.pdf$/i.test(file.name)), [files]);

  async function startUpload() {
    if (!token || validFiles.length === 0 || running) return;
    setRunning(true);
    const queue = [...validFiles];
    const failed: string[] = [];
    let done = 0;
    setProgress({ done, total: queue.length, message: "开始导入私有论文库", failed });
    const workers = Array.from({ length: 1 }, async () => {
      while (queue.length) {
        const file = queue.shift();
        if (!file) break;
        try {
          await uploadFile(file, token);
          done += 1;
          setProgress({ done, total: validFiles.length, message: `已核对 ${file.name}`, failed: [...failed] });
        } catch (error) {
          failed.push(`${file.name}: ${error instanceof Error ? error.message : String(error)}`);
          setProgress({ done, total: validFiles.length, message: `${file.name} 导入失败`, failed: [...failed] });
        }
      }
    });
    await Promise.all(workers);
    setProgress({ done, total: validFiles.length, message: failed.length ? "本批导入结束，但存在失败项" : "本批文件已全部导入并核对", failed: [...failed] });
    setRunning(false);
  }

  return (
    <main className="import-page">
      <section className="import-panel">
        <p className="eyebrow">Private paper ingestion</p>
        <h1>论文私有存储导入</h1>
        <p>一次性内部页面。支持分批选择命名为 paper-id.pdf 的文件；521 篇全部完成后删除本页和导入令牌。</p>
        <label>导入令牌<input data-testid="paper-import-token" type="password" value={token} onChange={(event) => setToken(event.target.value)} autoComplete="off" /></label>
        <label>论文文件<input data-testid="paper-import-files" type="file" accept="application/pdf,.pdf" multiple onChange={(event) => setFiles(Array.from(event.target.files ?? []))} /></label>
        <div className="import-summary"><strong>{validFiles.length}</strong><span>/ 521 个有效 PDF</span></div>
        <button data-testid="paper-import-start" type="button" disabled={running || !token || validFiles.length === 0} onClick={startUpload}>{running ? "正在导入……" : "开始导入"}</button>
        <div className="import-progress" aria-live="polite"><progress max={Math.max(progress.total, 1)} value={progress.done} /><p>{progress.done} / {progress.total} · {progress.message}</p></div>
        {progress.failed.length ? <details open><summary>{progress.failed.length} 个失败项</summary><pre>{progress.failed.join("\n")}</pre></details> : null}
      </section>
    </main>
  );
}

async function uploadFile(file: File, token: string) {
  const id = file.name.replace(/\.pdf$/i, "");
  const endpoint = `/_internal/paper-upload/${id}`;
  const headers = { authorization: `Bearer ${token}` };
  const existing = await fetch(endpoint, { method: "HEAD", headers });
  if (existing.ok && Number(existing.headers.get("content-length")) === file.size) return;
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  const checksum = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  const start = await checkedFetch(`${endpoint}/multipart/start`, {
    method: "POST", headers: { ...headers, "content-type": "application/json" }, body: JSON.stringify({ sha256: checksum }),
  });
  const { uploadId } = await start.json();
  const encodedUploadId = encodeURIComponent(uploadId);
  const parts = [];
  const chunkSize = 6 * 1024 * 1024;
  try {
    for (let offset = 0, partNumber = 1; offset < file.size; offset += chunkSize, partNumber += 1) {
      const bytes = new Uint8Array(await file.slice(offset, Math.min(file.size, offset + chunkSize)).arrayBuffer());
      let binary = "";
      for (let index = 0; index < bytes.length; index += 32768) binary += String.fromCharCode(...bytes.subarray(index, index + 32768));
      const response = await checkedFetch(`${endpoint}/multipart/${encodedUploadId}/part/${partNumber}`, {
        method: "PUT", headers: { ...headers, "content-type": "application/json" }, body: JSON.stringify({ data: btoa(binary) }),
      });
      parts.push(await response.json());
    }
    await checkedFetch(`${endpoint}/multipart/${encodedUploadId}/complete`, {
      method: "POST", headers: { ...headers, "content-type": "application/json" }, body: JSON.stringify({ parts }),
    });
  } catch (error) {
    await fetch(`${endpoint}/multipart/${encodedUploadId}`, { method: "DELETE", headers }).catch(() => undefined);
    throw error;
  }
  const check = await fetch(endpoint, { method: "HEAD", headers });
  if (!check.ok || Number(check.headers.get("content-length")) !== file.size) throw new Error("上传后对象长度不一致");
}

async function checkedFetch(input: string, init: RequestInit) {
  let lastError: Error | undefined;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await fetch(input, init);
    if (response.ok) return response;
    lastError = new Error(`HTTP ${response.status}: ${(await response.text()).slice(0, 200)}`);
  }
  throw lastError;
}
