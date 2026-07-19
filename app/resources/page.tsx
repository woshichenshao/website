import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components";
import { resources } from "../modeling-data";
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
          <div className="archive-stat"><strong>{firstYear}—{lastYear}</strong><span>{resources.length} 条精选元数据</span><p>原始文件保留在本地。网站仅提供去重索引与原创说明，第一版不开放下载。</p></div>
        </header>
        <aside className="policy-note"><strong>公开边界</strong><p>不发布获奖名单中的个人信息、可执行文件、压缩包、大型数据集，以及未确认结束赛事的答案和完整解决方案。</p></aside>
        <ResourceCatalog resources={resources} />
      </main>
      <SiteFooter />
    </>
  );
}
