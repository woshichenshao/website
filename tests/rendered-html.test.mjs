import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the mathematical modeling homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /接口之外｜数学建模竞赛知识站/);
  assert.match(html, /从赛题到论文/);
  assert.match(html, /一场比赛的五个交付节点/);
  assert.match(html, /六个入口，一条完整论证链/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/);
});

test("renders roadmap and method library", async () => {
  const roadmap = await render("/roadmap");
  assert.equal(roadmap.status, 200);
  assert.match(await roadmap.text(), /不要等开赛后/);
  const methods = await render("/methods");
  assert.equal(methods.status, 200);
  const html = await methods.text();
  assert.match(html, /算法不是起点/);
  assert.match(html, /综合评价/);
  assert.match(html, /组合建模/);
});

test("renders guide and method detail pages", async () => {
  const guide = await render("/guides/ai-modeling-workflow");
  assert.equal(guide.status, 200);
  const guideHtml = await guide.text();
  assert.match(guideHtml, /六道核验门/);
  assert.match(guideHtml, /不让 AI 编造数据/);
  const method = await render("/methods/forecasting");
  assert.equal(method.status, 200);
  assert.match(await method.text(), /滚动验证/);
});

test("renders the searchable resource index with privacy boundary", async () => {
  const response = await render("/resources");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /关键词/);
  assert.match(html, /1992 年全国大学生数学建模竞赛资料集/);
  assert.match(html, /第一版不开放下载/);
  assert.match(html, /不发布获奖名单中的个人信息/);
  assert.doesNotMatch(html, /D:\\website\\资料/);
});

test("keeps legacy article links readable", async () => {
  const article = await render("/articles/ai-as-a-second-workbench");
  assert.equal(article.status, 200);
  const html = await article.text();
  assert.match(html, /先设计输入，而不是先写提示词/);
  assert.match(html, /历史内容说明/);
});

test("publishes all discoverability routes", async () => {
  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  assert.match(xml, /http:\/\/localhost\/roadmap/);
  assert.match(xml, /http:\/\/localhost\/methods\/forecasting/);
  assert.match(xml, /http:\/\/localhost\/guides\/paper-structure/);
  assert.match(xml, /http:\/\/localhost\/resources/);
  const robots = await render("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Sitemap: http:\/\/localhost\/sitemap.xml/);
});

test("returns not found for unknown dynamic content", async () => {
  const response = await render("/guides/does-not-exist");
  assert.equal(response.status, 404);
});
