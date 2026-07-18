import { getPosts } from "../content";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const posts = await getPosts();
  const urls = [
    { path: "", date: "2026-07-19" },
    { path: "/articles", date: "2026-07-19" },
    { path: "/about", date: "2026-07-19" },
    ...posts.map((post) => ({ path: `/articles/${post.slug}`, date: post.publishedAt.slice(0, 10) })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ path, date }) => `  <url><loc>${origin}${path}</loc><lastmod>${date}</lastmod></url>`).join("\n")}
</urlset>`;
  return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
}
