import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the finished blog homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>接口之外｜AI、技术与个人实践<\/title>/);
  assert.match(html, /把复杂技术，写成可以真正使用的方法/);
  assert.match(html, /我如何把 AI 变成稳定的第二工作台/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/);
});

test("renders the archive and article routes", async () => {
  const archive = await render("/articles");
  assert.equal(archive.status, 200);
  assert.match(await archive.text(), /实践，而后记录/);

  const article = await render("/articles/ai-as-a-second-workbench");
  assert.equal(article.status, 200);
  const html = await article.text();
  assert.match(html, /先设计输入，而不是先写提示词/);
  assert.match(html, /首发编辑说明/);
});

test("publishes discoverability files from the request host", async () => {
  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  assert.match(await sitemap.text(), /http:\/\/localhost\/articles\/ai-as-a-second-workbench/);

  const robots = await render("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Sitemap: http:\/\/localhost\/sitemap.xml/);
});
