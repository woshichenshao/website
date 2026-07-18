import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components";
import { getPosts } from "../content";

export const metadata: Metadata = {
  title: "文章",
  description: "接口之外的全部 AI 工具、工作流与项目复盘文章。",
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

export default async function ArticlesPage() {
  const posts = await getPosts();

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="shell">
        <header className="page-intro">
          <div>
            <p className="eyebrow">Archive / 文章归档</p>
            <h1>实践，而后记录</h1>
          </div>
          <p>围绕 AI 工具、可靠工作流与小型项目复盘，沉淀能够再次使用的方法。</p>
        </header>
        <ol className="article-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <div>
                <h2>
                  <Link href={`/articles/${post.slug}`}>{post.title}</Link>
                </h2>
                <p>{post.summary}</p>
                <span className="read-time">{post.readTime} 分钟阅读</span>
              </div>
              <Link className="arrow-link" href={`/articles/${post.slug}`} aria-label={`阅读《${post.title}》`}>
                →
              </Link>
            </li>
          ))}
        </ol>
      </main>
      <SiteFooter />
    </>
  );
}
