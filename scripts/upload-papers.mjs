import { closeSync, openSync, readFileSync, readSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const siteUrl = process.env.PAPER_SITE_URL?.replace(/\/$/, "");
const uploadToken = process.env.PAPER_UPLOAD_TOKEN;
const bypassToken = process.env.SITES_BYPASS_TOKEN;
if (!siteUrl || !uploadToken || !bypassToken) throw new Error("缺少 PAPER_SITE_URL、PAPER_UPLOAD_TOKEN 或 SITES_BYPASS_TOKEN");

const manifestPath = join(process.cwd(), "work", "papers", "prepared-manifest.json");
const outputPath = join(process.cwd(), "work", "papers", "uploaded-manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
if (manifest.count !== 521) throw new Error("上传清单不是 521 条");

let completed = 0;
const results = [];
const queue = [...manifest.records];
const workers = Array.from({ length: 2 }, async () => {
  while (queue.length) {
    const record = queue.shift();
    await uploadAndVerify(record);
    results.push({ id: record.id, objectKey: record.objectKey, bytes: record.bytes, sha256: record.sha256, pageCount: record.pageCount, sourceFormat: record.sourceFormat });
    completed += 1;
    console.log(`已上传并核对 ${completed}/521：${record.id}`);
  }
});
await Promise.all(workers);
results.sort((a, b) => a.id.localeCompare(b.id));
if (results.length !== 521 || new Set(results.map((item) => item.id)).size !== 521) throw new Error("R2 上传结果未达到 521 条");
writeFileSync(outputPath, JSON.stringify({ generatedAt: new Date().toISOString(), count: results.length, records: results }, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ count: results.length, bytes: results.reduce((sum, item) => sum + item.bytes, 0) }));

async function uploadAndVerify(record) {
  const endpoint = `${siteUrl}/_internal/paper-upload/${record.id}`;
  const existing = await request(endpoint, { method: "HEAD" }, false);
  if (existing?.ok && Number(existing.headers.get("content-length")) === record.bytes && existing.headers.get("x-paper-sha256") === record.sha256) return;

  const start = await request(`${endpoint}/multipart/start`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sha256: record.sha256 }),
  });
  const { uploadId } = await start.json();
  const encodedUploadId = encodeURIComponent(uploadId);
  const parts = [];
  const chunkSize = 6 * 1024 * 1024;
  const handle = openSync(record.finalPath, "r");
  try {
    let offset = 0;
    let partNumber = 1;
    while (offset < record.bytes) {
      const size = Math.min(chunkSize, record.bytes - offset);
      const chunk = Buffer.allocUnsafe(size);
      const bytesRead = readSync(handle, chunk, 0, size, offset);
      if (bytesRead !== size) throw new Error(`读取分片失败：${record.id}`);
      const response = await retryRequest(`${endpoint}/multipart/${encodedUploadId}/part/${partNumber}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ data: chunk.toString("base64") }),
      });
      parts.push(await response.json());
      offset += size;
      partNumber += 1;
    }
    await retryRequest(`${endpoint}/multipart/${encodedUploadId}/complete`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ parts }),
    });
  } catch (error) {
    await request(`${endpoint}/multipart/${encodedUploadId}`, { method: "DELETE" }, false).catch(() => {});
    throw new Error(`上传失败：${record.id}：${error}`);
  } finally {
    closeSync(handle);
  }
  const check = await request(endpoint, { method: "HEAD" });
  if (Number(check.headers.get("content-length")) !== record.bytes || check.headers.get("x-paper-sha256") !== record.sha256) throw new Error(`对象长度或校验值不一致：${record.id}`);
}

async function retryRequest(url, init) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await request(url, init);
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
  throw lastError;
}

async function request(url, init, throwOnFailure = true) {
  const response = await fetch(url, {
    ...init,
    headers: {
      authorization: `Bearer ${uploadToken}`,
      "OAI-Sites-Authorization": `Bearer ${bypassToken}`,
      ...init.headers,
    },
  });
  if (throwOnFailure && !response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  return response;
}
