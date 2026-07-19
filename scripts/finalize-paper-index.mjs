import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const indexPath = join(process.cwd(), "data", "paper-index.json");
const uploadedPath = join(process.cwd(), "work", "papers", "uploaded-manifest.json");
if (!existsSync(uploadedPath)) throw new Error("缺少 R2 上传核对清单");
const index = JSON.parse(readFileSync(indexPath, "utf8"));
const uploaded = JSON.parse(readFileSync(uploadedPath, "utf8"));
if (index.count !== 521 || uploaded.count !== 521) throw new Error("论文索引或上传清单不是 521 条");
const byId = new Map(uploaded.records.map((record) => [record.id, record]));
index.records = index.records.map((record) => {
  const stored = byId.get(record.id);
  if (!stored || stored.pageCount < 1) throw new Error(`缺少已上传论文：${record.id}`);
  return {
    ...record,
    availability: "在线只读",
    viewerAvailable: true,
    pageCount: stored.pageCount,
    sourceFormat: stored.sourceFormat,
  };
});
index.generatedAt = new Date().toISOString();
index.policy = "全部 521 篇论文均已取得全文公开展示授权；仅提供站内 Canvas 只读阅读，不提供复制、打印、下载入口或公开存储地址。";
writeFileSync(indexPath, JSON.stringify(index, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ count: index.records.length, viewerAvailable: index.records.filter((record) => record.viewerAvailable).length }));
