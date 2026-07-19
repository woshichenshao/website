import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components";
import { getPosts } from "../content";

export const metadata: Metadata = { title: "历史文章", description: "接口之外早期关于 AI 工具、工作流与项目复盘的文章。" };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value)).replaceAll("/", ".");
}

export default async function ArticlesPage() {
  const posts = await getPosts();
  return (
    <><SiteHeader /><main id="main-content" className="shell">
      <header className="page-intro"><div><p className="eyebrow">Archive / 历史文章</p><h1>技术实践，继续保留</h1></div><p>这些是“接口之外”转型前关于 AI 工具、工作流与项目复盘的文章，原有链接继续有效。</p></header>
      <ol className="article-list">{posts.map((post) => <li key={post.slug}><time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time><div><h2><Link href={`/articles/${post.slug}`}>{post.title}</Link></h2><p>{post.summary}</p><span className="read-time">{post.readTime} 分钟阅读</span></div><Link className="round-arrow" href={`/articles/${post.slug}`} aria-label={`阅读${post.title}`}>→</Link></li>)}</ol>
    </main><SiteFooter /></>
  );
}
