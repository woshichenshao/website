import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, SiteFooter, SiteHeader } from "../../components";
import { getPaper } from "../../modeling-data";
import { PaperViewer } from "./paper-viewer";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const paper = getPaper(id);
  if (!paper?.viewerAvailable) return {};
  return {
    title: paper.title,
    description: `${paper.year ?? "历年"} 数学建模优秀论文站内只读全文。`,
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function PaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paper = getPaper(id);
  if (!paper?.viewerAvailable || !paper.pageCount) notFound();

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="shell paper-page">
        <Breadcrumbs items={[{ label: "首页", href: "/" }, { label: "资料索引", href: "/resources" }, { label: paper.title }]} />
        <header className="paper-header">
          <div>
            <p className="eyebrow">Read-only paper / 全文只读</p>
            <h1>{paper.title}</h1>
            <p>{paper.year} · {paper.paperCode ?? `${paper.problem ?? "综合"} 题`} · {paper.sourceFormat ?? paper.format} · {paper.pageCount} 页</p>
          </div>
          <aside><strong>阅读边界</strong><p>仅供在线阅读与学习复盘。阅读器不提供复制、打印或下载功能；请尊重论文授权与学术规范。</p></aside>
        </header>
        <PaperViewer paperId={paper.id} title={paper.title} expectedPages={paper.pageCount} />
      </main>
      <SiteFooter />
    </>
  );
}
