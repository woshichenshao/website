import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "./components";
import { getPosts } from "./content";

export const metadata: Metadata = {
  title: { absolute: "接口之外｜AI、技术与个人实践" },
  description:
    "界外的 AI 技术实践笔记：记录工具、工作流与项目复盘，把复杂技术写成可以真正使用的方法。",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date(value))
    .replaceAll("/", ".");
}

export default async function Home() {
  const posts = await getPosts();
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const recent = posts.filter((post) => post.slug !== featured?.slug).slice(0, 2);

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="hero shell" aria-labelledby="hero-title">
          <p className="eyebrow">AI × 技术 × 个人实践</p>
          <div className="hero-grid">
            <h1 id="hero-title">把复杂技术，写成可以真正使用的方法</h1>
            <p className="hero-intro">
              记录 AI 工具、工作流与项目复盘。少一点追逐热点，多一点可验证的实践。
            </p>
          </div>
        </section>

        {featured ? (
          <section className="story-grid shell" aria-labelledby="featured-heading">
            <article className="featured-story">
              <p className="section-kicker" id="featured-heading">
                本期精选 / Featured
              </p>
              <div className="featured-content">
                <span className="story-number" aria-hidden="true">
                  01
                </span>
                <div>
                  <h2>
                    <Link href={`/articles/${featured.slug}`}>{featured.title}</Link>
                  </h2>
                  <p>{featured.summary}</p>
                  <div className="story-meta">
                    <time dateTime={featured.publishedAt}>
                      {formatDate(featured.publishedAt)}
                    </time>
                    <span>{featured.readTime} 分钟阅读</span>
                    <Link href={`/articles/${featured.slug}`}>阅读全文 →</Link>
                  </div>
                </div>
              </div>
            </article>

            <aside className="recent-stories" aria-labelledby="recent-heading">
              <p className="section-kicker" id="recent-heading">
                最近文章 / Notes
              </p>
              {recent.map((post) => (
                <article className="recent-row" key={post.slug}>
                  <div>
                    <h3>
                      <Link href={`/articles/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p>
                      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      <span aria-hidden="true"> · </span>
                      {post.readTime} 分钟阅读
                    </p>
                  </div>
                  <Link
                    className="arrow-link"
                    href={`/articles/${post.slug}`}
                    aria-label={`阅读《${post.title}》`}
                  >
                    →
                  </Link>
                </article>
              ))}
            </aside>
          </section>
        ) : null}

        <section className="author-note shell" aria-labelledby="about-heading">
          <p className="section-kicker" id="about-heading">
            作者札记 / About
          </p>
          <p>
            我是界外，一名持续把新技术放进真实工作里检验的人。这里不贩卖捷径，只记录有效的方法、失败的判断，以及值得反复使用的经验。
          </p>
          <Link href="/about">认识作者</Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
