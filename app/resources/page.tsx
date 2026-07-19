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
          <div className="archive-stat"><strong>{firstYear}—{lastYear}</strong><span>{indexedPaperCount} 篇优秀论文 · {resources.length} 条资料元数据</span><p>论文已按年份、题号和论文编号加入索引。全文通过站内只读阅读器展示，不提供下载入口或公开存储地址。</p></div>
        </header>
        <aside className="policy-note"><strong>论文阅读说明</strong><p>全部论文均已取得公开展示授权。校验完成的条目可站内翻页和缩放；阅读器不提供复制、打印或下载功能，但公开在线阅读无法绝对阻止截图或技术抓取。</p></aside>
        <ResourceCatalog resources={resources} />
      </main>
      <SiteFooter />
    </>
  );
}
