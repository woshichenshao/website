import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, sep } from "node:path";

const sourceRoot = join(process.cwd(), "资料", "1992-2025数学建模国赛优秀论文大汇总！");
const outputPath = join(process.cwd(), "data", "paper-index.json");

if (!existsSync(sourceRoot)) throw new Error("未找到历年论文资料目录");

function walk(root) {
  const files = [];
  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const absolute = join(current, entry.name);
      if (entry.isDirectory()) stack.push(absolute);
      if (entry.isFile()) files.push({ absolute, size: statSync(absolute).size });
    }
  }
  return files;
}

function removeCopySuffix(filename) {
  const extension = extname(filename);
  return filename.slice(0, -extension.length).replace(/\s*[（(]1[）)]$/u, "") + extension;
}

function isPaperFile(file) {
  const extension = extname(file.absolute).toLowerCase();
  if (![".pdf", ".doc", ".docx"].includes(extension)) return false;

  const relativePath = relative(sourceRoot, file.absolute);
  const segments = relativePath.split(sep);
  const filename = segments.at(-1) ?? "";
  const nestedFolders = segments.slice(1, -1).join("/");
  const year = Number(segments[0]?.match(/(19|20)\d{2}/)?.[0]);

  if (!year || /(?:真题|赛题|附件)/u.test(nestedFolders)) return false;
  if (/^(?:format\d*|[A-F]题|附件\d*)[（(]?1?[）)]?\.(?:pdf|docx?|PDF)$/iu.test(filename)) return false;

  return /(?:优秀论文|展示论文)/u.test(nestedFolders)
    || /优秀论文/u.test(filename)
    || new RegExp(`^${year}[A-F](?:[：:\s-]|$)`, "iu").test(filename)
    || /^[A-F]\d{3,}/iu.test(filename);
}

function inferType(title) {
  if (/(?:评价|评估|排序|权重)/u.test(title)) return "评价";
  if (/(?:分类|聚类|识别|判别)/u.test(title)) return "分类与聚类";
  if (/(?:预测|预报|趋势|时间序列)/u.test(title)) return "预测";
  if (/(?:优化|最优|规划|调度|决策|路径|分配|策略)/u.test(title)) return "优化";
  if (/(?:机理|微分方程|动力学|传播|传热|物理|守恒)/u.test(title)) return "机理";
  return "综合";
}

function extractCode(year, filename, topFolder) {
  const base = filename.replace(/\.[^.]+$/, "");
  const codeMatch = base.match(/^([A-F]\d{3})/iu) ?? topFolder.match(/([A-F]\d{3})/iu);
  if (codeMatch) return codeMatch[1].toUpperCase();
  const problemMatch = base.match(new RegExp(`^${year}年?([A-F])题?`, "iu"));
  return problemMatch ? problemMatch[1].toUpperCase() : undefined;
}

function cleanTitle(year, filename, code) {
  const extension = extname(filename);
  let title = filename.slice(0, -extension.length).replace(/\s*[（(]1[）)]$/u, "").trim();
  if (/^[A-F]\d{3,}$/iu.test(title)) return `${year} 年国赛优秀论文 ${title.toUpperCase()}`;
  title = title
    .replace(new RegExp(`^${year}年?[A-F]题?优秀论文[①②③④⑤⑥⑦⑧⑨⑩\d]*\\s*`, "u"), "")
    .replace(new RegExp(`^${year}[A-F][：:\s-]*`, "iu"), "")
    .trim();
  return title || `${year} 年国赛优秀论文 ${code ?? ""}`.trim();
}

const seenNormalizedPaths = new Set();
const candidates = [];

for (const file of walk(sourceRoot).filter(isPaperFile)) {
  const relativePath = relative(sourceRoot, file.absolute);
  const segments = relativePath.split(sep);
  const year = Number(segments[0].match(/(19|20)\d{2}/)?.[0]);
  const filename = segments.at(-1);
  const normalizedFilename = removeCopySuffix(filename);
  const normalizedPath = [...segments.slice(0, -1), normalizedFilename].join("/").toLocaleLowerCase("zh-CN");
  if (seenNormalizedPaths.has(normalizedPath)) continue;
  seenNormalizedPaths.add(normalizedPath);

  const code = extractCode(year, normalizedFilename, segments[0]);
  const title = cleanTitle(year, normalizedFilename, code);
  const extension = extname(normalizedFilename).toLowerCase();
  candidates.push({
    id: `paper-${createHash("sha1").update(`${year}|${code ?? ""}|${title}`).digest("hex").slice(0, 12)}`,
    title,
    category: "优秀论文",
    competition: "全国大学生数学建模竞赛",
    year,
    problem: code?.slice(0, 1),
    paperCode: code && code.length > 1 ? code : undefined,
    problemType: inferType(title),
    format: extension === ".pdf" ? "PDF" : "DOCX",
    summary: "历年优秀论文元数据条目，仅用于检索、选题训练与方法复盘，不提供原文下载。",
    collection: "1992—2025 数学建模国赛优秀论文汇总",
    availability: "仅索引",
  });
}

const scannedCollections = [
  [2022, "A001"], [2022, "A171"], [2022, "B035"], [2022, "B086"], [2022, "C229"], [2022, "E014"],
  [2024, "A016"], [2024, "A053"], [2024, "A163"], [2024, "A178"], [2024, "A242"], [2024, "B159"],
  [2024, "B195"], [2024, "B196"], [2024, "C038"], [2024, "C063"], [2024, "C094"], [2024, "C234"],
  [2024, "D033"], [2024, "E010"], [2024, "E061"], [2024, "E218"],
];

for (const [year, code] of scannedCollections) {
  candidates.push({
    id: `paper-${year}-${code.toLowerCase()}`,
    title: `${year} 年国赛优秀论文 ${code}`,
    category: "优秀论文",
    competition: "全国大学生数学建模竞赛",
    year,
    problem: code.slice(0, 1),
    paperCode: code,
    problemType: "综合",
    format: "图像集",
    summary: "扫描版优秀论文元数据条目，仅用于检索与后续原创整理，不提供原文下载。",
    collection: "1992—2025 数学建模国赛优秀论文汇总",
    availability: "仅索引",
  });
}

const byPaper = new Map();
for (const item of candidates) {
  const key = item.paperCode ? `${item.year}|${item.paperCode}` : `${item.year}|${item.title}`;
  const existing = byPaper.get(key);
  if (!existing || (existing.format !== "PDF" && item.format === "PDF")) byPaper.set(key, item);
}

const records = [...byPaper.values()].sort((a, b) => b.year - a.year || (a.paperCode ?? a.title).localeCompare(b.paperCode ?? b.title, "zh-CN"));
const byYear = Object.fromEntries([...new Set(records.map((item) => item.year))].sort((a, b) => b - a).map((year) => [year, records.filter((item) => item.year === year).length]));

const output = {
  generatedAt: new Date().toISOString(),
  policy: "仅公开论文元数据；不包含本地路径、文件链接、下载地址、作者个人信息或论文正文。",
  count: records.length,
  byYear,
  records,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(output, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ count: records.length, byYear }));
