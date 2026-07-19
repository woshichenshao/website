import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components";
import { indexedPaperCount, resources } from "../modeling-data";
import { ResourceCatalog } from "./resource-catalog";

export const metadata: Metadata = {
  title: "资料索引",
  description: "按年份、赛事、题型与内容类型筛选数学建模赛题、优秀论文、模板和方法资料。",
};

export default function ResourcesPage() {
  const firstYear = Math.min(...resources.flatMap((item) => item.year ? [item.year] : []));
  const lastYear = Math.max(...resources.flatMap((item) => item.year ? [item.year] : []));
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="shell">
        <header className="page-hero resource-hero">
          <div><p className="eyebrow">Resource index / 资料索引</p><h1>先找到方向，<br />再打开资料</h1></div>
          <div className="archive-stat"><strong>{firstYear}—{lastYear}</strong><span>{indexedPaperCount} 篇优秀论文 · {resources.length} 条资料元数据</span><p>论文已按年份、题号和论文编号加入索引。网站不保存公开原文地址，也不提供下载。</p></div>
        </header>
        <aside className="policy-note"><strong>论文索引说明</strong><p>索引只展示论文题目、年份、题号、论文编号、格式和题型标签。页面没有原文链接、下载按钮或本地文件路径。</p></aside>
        <ResourceCatalog resources={resources} />
      </main>
      <SiteFooter />
    </>
  );
}
