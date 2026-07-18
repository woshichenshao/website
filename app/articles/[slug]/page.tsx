import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText, SiteFooter, SiteHeader } from "../../components";
import { getPostBySlug, getPosts } from "../../content";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.publishedAt,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const date = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(post.publishedAt));

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="shell">
        <header className="article-header">
          <Link className="back-link" href="/articles">
            ← 返回文章
          </Link>
          <p className="eyebrow">AI × 技术 × 个人实践</p>
          <h1>{post.title}</h1>
          <p className="lead">{post.summary}</p>
          <div className="article-meta">
            <time dateTime={post.publishedAt}>{date}</time>
            <span>{post.readTime} 分钟阅读</span>
            <span>界外 / 作者</span>
          </div>
        </header>
        <hr className="article-rule" />
        <div className="article-body">
          <RichText blocks={post.body} />
          <aside className="editor-note">
            <strong>首发编辑说明</strong>
            当前内容用于呈现完整博客体验。正式广泛传播前，请用你的真实工具、项目与结果替换示例经历。
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
