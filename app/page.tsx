import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "./components";
import { guides, methods, modelingCategories, resources } from "./modeling-data";

export const metadata: Metadata = {
  title: { absolute: "接口之外｜数学建模竞赛知识站" },
  description: "面向数学建模竞赛参赛者的备赛路线、模型方法、论文写作、AI 辅助与历年资料索引。",
};

const workflow = [
  ["01", "理解赛题", "目标、数据、约束与子问题"],
  ["02", "选择模型", "先建立基线，再比较候选"],
  ["03", "编程求解", "数据版本、参数与代码可复现"],
  ["04", "结果验证", "误差、敏感性与现实边界"],
  ["05", "论文提交", "论证链、格式与交叉检查"],
];

export default function Home() {
  const featuredGuides = guides.slice(0, 4);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "接口之外",
    description: "数学建模竞赛知识站",
    inLanguage: "zh-CN",
  };

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="math-hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Mathematical Modeling / 数学建模</p>
            <h1 id="hero-title">从赛题到论文，<br />把建模做成一套方法</h1>
            <p className="hero-intro">面向零基础到进阶参赛者，连接问题理解、模型选择、代码求解、结果验证与论文表达。</p>
            <div className="hero-actions">
              <Link className="button primary" href="/roadmap">从备赛路线开始</Link>
              <Link className="button secondary" href="/resources">检索历年资料</Link>
            </div>
          </div>
          <aside className="hero-model-card" aria-label="建模闭环">
            <div className="coordinate-label">MODEL / 01</div>
            <div className="model-equation">问题<br /><span>→</span> 模型<br /><span>→</span> 证据</div>
            <p>复杂不是目标。<br />可解释、可验证、可复现才是。</p>
          </aside>
        </section>

        <section className="workflow shell" aria-labelledby="workflow-title">
          <div className="section-heading">
            <p className="section-kicker">Competition workflow</p>
            <h2 id="workflow-title">一场比赛的五个交付节点</h2>
          </div>
          <ol className="workflow-grid">
            {workflow.map(([number, title, text]) => (
              <li key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></li>
            ))}
          </ol>
        </section>

        <section className="category-section shell" aria-labelledby="category-title">
          <div className="section-heading split-heading">
            <div><p className="section-kicker">Knowledge map</p><h2 id="category-title">六个入口，一条完整论证链</h2></div>
            <p>不从资料数量出发，而从比赛中真正需要做出的判断出发。</p>
          </div>
          <div className="category-grid">
            {modelingCategories.map((category) => (
              <Link href={category.href} className="category-card" key={category.title}>
                <span>{category.number}</span><h3>{category.title}</h3><p>{category.description}</p><b>进入栏目 →</b>
              </Link>
            ))}
          </div>
        </section>

        <section className="quick-methods shell" aria-labelledby="method-title">
          <div className="section-heading split-heading">
            <div><p className="section-kicker">Method selector</p><h2 id="method-title">先看问题输出，再选模型</h2></div>
            <Link className="text-link" href="/methods">查看完整方法库 →</Link>
          </div>
          <div className="method-strip">
            {methods.slice(0, 5).map((method) => (
              <Link href={`/methods/${method.slug}`} key={method.slug}>
                <span>{method.english}</span><h3>{method.name}</h3><p>{method.summary}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="featured-guides shell" aria-labelledby="guide-title">
          <div className="section-heading split-heading">
            <div><p className="section-kicker">Start here</p><h2 id="guide-title">推荐学习路线</h2></div>
            <p>{guides.length} 篇原创指南 · {resources.length} 条精选索引</p>
          </div>
          <div className="guide-list">
            {featuredGuides.map((guide, index) => (
              <article key={guide.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><p>{guide.category} · {guide.difficulty}</p><h3><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h3><p>{guide.summary}</p></div>
                <Link className="round-arrow" href={`/guides/${guide.slug}`} aria-label={`阅读${guide.title}`}>→</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="archive-cta shell">
          <div><p className="section-kicker">1992—2025</p><h2>历年资料，不再靠翻文件夹寻找</h2></div>
          <p>按年份、赛事、题型与内容类型筛选。原始资料保留在本地，网站只发布去重后的元数据与原创说明。</p>
          <Link className="button primary" href="/resources">打开资料索引</Link>
        </section>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  );
}
