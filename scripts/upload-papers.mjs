import { createReadStream, readFileSync, writeFileSync } from "node:fs";
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
const workers = Array.from({ length: 3 }, async () => {
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

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await request(endpoint, {
        method: "PUT",
        headers: {
          "content-type": "application/pdf",
          "content-length": String(record.bytes),
          "x-paper-sha256": record.sha256,
        },
        body: createReadStream(record.finalPath),
        duplex: "half",
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      const check = await request(endpoint, { method: "HEAD" });
      if (Number(check.headers.get("content-length")) !== record.bytes || check.headers.get("x-paper-sha256") !== record.sha256) throw new Error("对象长度或校验值不一致");
      return;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
  throw new Error(`上传失败：${record.id}：${lastError}`);
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
