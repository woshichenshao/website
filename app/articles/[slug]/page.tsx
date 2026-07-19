import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText, SiteFooter, SiteHeader } from "../../components";
import { getPostBySlug, getPosts } from "../../content";

type PageProps = { params: Promise<{ slug: string }> };
export async function generateStaticParams() { return (await getPosts()).map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> { const post = await getPostBySlug((await params).slug); return post ? { title: post.title, description: post.summary } : {}; }

export default async function ArticlePage({ params }: PageProps) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();
  const date = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric" }).format(new Date(post.publishedAt));
  return <><SiteHeader /><main id="main-content" className="shell"><header className="article-header"><Link className="back-link" href="/articles">← 返回历史文章</Link><p className="eyebrow">AI · 技术 · 个人实践</p><h1>{post.title}</h1><p className="lead">{post.summary}</p><div className="article-meta"><time dateTime={post.publishedAt}>{date}</time><span>{post.readTime} 分钟阅读</span><span>界外 / 作者</span></div></header><hr className="article-rule" /><div className="article-body"><RichText blocks={post.body} /><aside className="editor-note"><strong>历史内容说明</strong>这篇文章保留自网站转型前的技术实践栏目。数学建模竞赛内容请从首页或备赛路线进入。</aside></div></main><SiteFooter /></>;
}
