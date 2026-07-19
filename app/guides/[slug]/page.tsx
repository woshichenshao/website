import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, ModelingContent, SiteFooter, SiteHeader } from "../../components";
import { getGuide, guides } from "../../modeling-data";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return guides.map((guide) => ({ slug: guide.slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  return guide ? { title: guide.title, description: guide.summary, openGraph: { type: "article", title: guide.title, description: guide.summary } } : {};
}

export default async function GuidePage({ params }: PageProps) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  const currentIndex = guides.findIndex((item) => item.slug === guide.slug);
  const nextGuide = guides[(currentIndex + 1) % guides.length];
  const structuredData = { "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.summary, inLanguage: "zh-CN", author: { "@type": "Person", name: "界外" } };
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="shell detail-page">
        <Breadcrumbs items={[{ label: "首页", href: "/" }, { label: guide.category }, { label: guide.title }]} />
        <header className="guide-header">
          <div><p className="eyebrow">{guide.category} / {guide.stage}</p><h1>{guide.title}</h1><p>{guide.summary}</p></div>
          <dl><div><dt>难度</dt><dd>{guide.difficulty}</dd></div><div><dt>阅读</dt><dd>{guide.minutes} 分钟</dd></div><div><dt>标签</dt><dd>{guide.tags.join(" · ")}</dd></div></dl>
        </header>
        <div className="guide-layout">
          <article><ModelingContent blocks={guide.body} /></article>
          <aside className="source-note"><strong>整理说明</strong><p>{guide.sourceNote}</p><p>本文为原创二次整理，不提供原始文件下载，也不替代当届赛事官方规则。</p></aside>
        </div>
        <Link className="next-reading" href={`/guides/${nextGuide.slug}`}><span>下一篇</span><strong>{nextGuide.title}</strong><b>→</b></Link>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  );
}
