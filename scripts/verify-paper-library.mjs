import { createHash } from "node:crypto";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const manifestPath = join(process.cwd(), "work", "papers", "prepared-manifest.json");
if (!existsSync(manifestPath)) throw new Error("缺少 prepared-manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
if (manifest.count !== 521 || manifest.records.length !== 521) throw new Error("准备清单不是 521 条");
if (new Set(manifest.records.map((item) => item.id)).size !== 521) throw new Error("准备清单存在重复 ID");

for (let index = 0; index < manifest.records.length; index += 1) {
  const record = manifest.records[index];
  if (!existsSync(record.finalPath) || statSync(record.finalPath).size !== record.bytes || record.pageCount < 1) throw new Error(`文件状态不一致：${record.id}`);
  const sha256 = await hashFile(record.finalPath);
  if (sha256 !== record.sha256) throw new Error(`校验值不一致：${record.id}`);
  if ((index + 1) % 50 === 0 || index + 1 === manifest.records.length) console.log(`已复核 ${index + 1}/${manifest.records.length}`);
}
console.log(JSON.stringify({ count: manifest.records.length, pages: manifest.records.reduce((sum, item) => sum + item.pageCount, 0), bytes: manifest.records.reduce((sum, item) => sum + item.bytes, 0) }));

function hashFile(path) {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(path);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}
