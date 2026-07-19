import { createHash } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const workRoot = join(root, "work", "papers");
const preparedRoot = join(workRoot, "prepared");
const qaRoot = join(workRoot, "qa");
const sourceManifestPath = join(workRoot, "source-manifest.json");
const outputManifestPath = join(workRoot, "prepared-manifest.json");
const python = process.env.CODEX_PYTHON ?? "C:\\Users\\狗熊岭第一控卫\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
const pythonPath = join(workRoot, "pydeps");
const popplerBin = process.env.CODEX_POPPLER_BIN ?? "C:\\Users\\狗熊岭第一控卫\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\native\\poppler\\Library\\bin";
const pdfInfoExe = join(popplerBin, "pdfinfo.exe");
const pdfToPpmExe = join(popplerBin, "pdftoppm.exe");

if (!existsSync(sourceManifestPath)) throw new Error("请先运行 npm run papers:index");
mkdirSync(preparedRoot, { recursive: true });
mkdirSync(qaRoot, { recursive: true });

const manifest = JSON.parse(readFileSync(sourceManifestPath, "utf8"));
if (manifest.count !== 521 || manifest.records.length !== 521) throw new Error("源文件清单必须包含 521 条记录");

const wordJobs = manifest.records
  .filter((record) => record.source.kind === "file" && [".doc", ".docx"].includes(extname(record.source.path).toLowerCase()))
  .map((record) => ({ id: record.id, source: record.source.path, output: join(preparedRoot, `${record.id}.pdf`) }))
  .filter((job) => !existsSync(job.output));
if (wordJobs.length) {
  const jobsPath = join(workRoot, "word-jobs.json");
  writeFileSync(jobsPath, JSON.stringify(wordJobs, null, 2), "utf8");
  run("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", join(root, "scripts", "convert-word-to-pdf.ps1"), "-JobsPath", jobsPath], "Word 转 PDF");
}

const scanJobs = manifest.records
  .filter((record) => record.source.kind !== "file")
  .map((record) => ({ id: record.id, source: record.source, output: join(preparedRoot, `${record.id}.pdf`) }))
  .filter((job) => !existsSync(job.output));
if (scanJobs.length) {
  const jobsPath = join(workRoot, "scan-jobs.json");
  writeFileSync(jobsPath, JSON.stringify(scanJobs, null, 2), "utf8");
  run(python, [join(root, "scripts", "images-to-pdf.py"), jobsPath], "扫描稿合并", { PYTHONPATH: pythonPath });
}

const prepared = [];
for (let index = 0; index < manifest.records.length; index += 1) {
  const record = manifest.records[index];
  const extension = record.source.kind === "file" ? extname(record.source.path).toLowerCase() : "";
  const finalPath = extension === ".pdf" ? record.source.path : join(preparedRoot, `${record.id}.pdf`);
  if (!existsSync(finalPath) || statSync(finalPath).size === 0) throw new Error(`缺少转换结果：${record.id}`);
  const info = pdfInfo(finalPath);
  if (!Number.isInteger(info.pages) || info.pages < 1) throw new Error(`页数异常：${record.id}`);
  const exhaustive = extension !== ".pdf";
  renderCheck(finalPath, record.id, info.pages, exhaustive);
  const bytes = statSync(finalPath).size;
  const sha256 = await hashFile(finalPath);
  prepared.push({
    id: record.id,
    title: record.title,
    year: record.year,
    paperCode: record.paperCode,
    sourceFormat: record.sourceFormat,
    objectKey: `papers/${record.id}.pdf`,
    finalPath,
    pageCount: info.pages,
    bytes,
    sha256,
    renderCheck: exhaustive ? "all-pages" : "first-and-last",
  });
  if ((index + 1) % 25 === 0 || index + 1 === manifest.records.length) {
    console.log(`已校验 ${index + 1}/${manifest.records.length}`);
  }
}

const ids = new Set(prepared.map((record) => record.id));
if (prepared.length !== 521 || ids.size !== 521 || prepared.some((record) => record.pageCount < 1)) {
  throw new Error("准备结果未通过 521 篇完整性门槛");
}
writeFileSync(outputManifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), count: prepared.length, records: prepared }, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ count: prepared.length, pages: prepared.reduce((sum, item) => sum + item.pageCount, 0), bytes: prepared.reduce((sum, item) => sum + item.bytes, 0) }));

function run(command, args, label, extraEnv = {}) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, ...extraEnv } });
  if (result.status !== 0) throw new Error(`${label}失败\n${result.stdout}\n${result.stderr}`);
  if (result.stdout.trim()) console.log(result.stdout.trim());
}

function pdfInfo(path) {
  const result = spawnSync(pdfInfoExe, [path], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`PDF 完整性检查失败：${path}\n${result.stderr}`);
  const pages = Number(result.stdout.match(/^Pages:\s+(\d+)/m)?.[1]);
  return { pages };
}

function renderCheck(path, id, pages, exhaustive) {
  const target = join(qaRoot, id);
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  const args = exhaustive
    ? ["-png", "-scale-to", "900", path, join(target, "page")]
    : ["-f", "1", "-l", "1", "-singlefile", "-png", "-scale-to", "900", path, join(target, "first")];
  run(pdfToPpmExe, args, `页面渲染检查 ${id}`);
  if (!exhaustive && pages > 1) run(pdfToPpmExe, ["-f", String(pages), "-l", String(pages), "-singlefile", "-png", "-scale-to", "900", path, join(target, "last")], `末页渲染检查 ${id}`);
  const images = readdirSync(target).filter((name) => name.endsWith(".png"));
  const expected = exhaustive ? pages : Math.min(pages, 2);
  if (images.length !== expected || images.some((name) => statSync(join(target, name)).size < 1024)) {
    throw new Error(`页面渲染数量或内容异常：${id}，预期 ${expected} 页，实际 ${images.length} 页`);
  }
  rmSync(target, { recursive: true, force: true });
}

function hashFile(path) {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(path);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}
