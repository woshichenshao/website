import { createHash } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";

const projectRoot = process.cwd();
const sourceRoot = join(projectRoot, "资料");
const outputPath = join(projectRoot, "data", "resource-audit.json");

if (!existsSync(sourceRoot)) {
  throw new Error("未找到资料目录：" + sourceRoot);
}

const files = [];
const stack = [sourceRoot];

while (stack.length) {
  const current = stack.pop();
  for (const entry of readdirSync(current, { withFileTypes: true })) {
    const absolute = join(current, entry.name);
    if (entry.isDirectory()) stack.push(absolute);
    if (entry.isFile()) {
      const stats = statSync(absolute);
      files.push({
        absolute,
        relative: relative(sourceRoot, absolute),
        size: stats.size,
        extension: extname(entry.name).toLowerCase() || "[none]",
      });
    }
  }
}

function normalizeCopyName(value) {
  return value
    .replace(/\s*[\(（]\d+[\)）](?=\.[^.]+$)/u, "")
    .replace(/\\/g, "/")
    .toLowerCase();
}

const byCandidate = new Map();
for (const file of files) {
  const key = `${normalizeCopyName(file.relative)}::${file.size}`;
  const group = byCandidate.get(key) ?? [];
  group.push(file);
  byCandidate.set(key, group);
}

async function sha256(path) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest("hex");
}

const duplicateGroups = [];
for (const group of byCandidate.values()) {
  if (group.length < 2) continue;
  const byHash = new Map();
  for (const file of group) {
    const hash = await sha256(file.absolute);
    const matches = byHash.get(hash) ?? [];
    matches.push(file);
    byHash.set(hash, matches);
  }
  for (const [hash, matches] of byHash) {
    if (matches.length < 2) continue;
    duplicateGroups.push({
      hash,
      copies: matches.length,
      bytesPerCopy: matches[0].size,
      normalizedExtension: matches[0].extension,
    });
  }
}

const extensions = {};
for (const file of files) {
  const item = (extensions[file.extension] ??= { files: 0, bytes: 0 });
  item.files += 1;
  item.bytes += file.size;
}

const confirmedDuplicateFiles = duplicateGroups.reduce((sum, group) => sum + group.copies - 1, 0);
const confirmedDuplicateBytes = duplicateGroups.reduce(
  (sum, group) => sum + (group.copies - 1) * group.bytesPerCopy,
  0,
);

const report = {
  generatedAt: new Date().toISOString(),
  sourceLabel: "D:/website/资料",
  policy: "仅生成聚合统计；不记录公开文件路径，不修改源文件。",
  totals: {
    files: files.length,
    bytes: files.reduce((sum, file) => sum + file.size, 0),
    confirmedDuplicateGroups: duplicateGroups.length,
    confirmedDuplicateFiles,
    confirmedDuplicateBytes,
  },
  extensions: Object.fromEntries(
    Object.entries(extensions).sort(([, a], [, b]) => b.files - a.files),
  ),
  publicationExclusions: [
    "获奖名单中的姓名与学校",
    "未确认结束赛事的解题材料",
    "可执行文件与压缩包",
    "未进入公开白名单的原文或大型数据集",
  ],
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(report, null, 2) + "\n", "utf8");
console.log(JSON.stringify(report.totals));
