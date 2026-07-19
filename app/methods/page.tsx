import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components";
import { methods } from "../modeling-data";

export const metadata: Metadata = {
  title: "方法库",
  description: "按问题输出、数据条件和验证方式选择数学建模方法。",
};

export default function MethodsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="shell">
        <header className="page-hero method-hero">
          <p className="eyebrow">Method library / 方法库</p>
          <h1>算法不是起点，<br />问题结构才是</h1>
          <p>先明确要输出排序、标签、预测、方案还是系统规律，再比较模型的前提、数据需求与验证方法。</p>
        </header>
        <section className="method-library" aria-label="数学建模方法列表">
          {methods.map((method, index) => (
            <article key={method.slug}>
              <div className="method-number">M{String(index + 1).padStart(2, "0")}</div>
              <div className="method-main"><p>{method.english}</p><h2>{method.name}</h2><strong>{method.summary}</strong><p>{method.useWhen}</p></div>
              <div className="method-models"><span>候选模型</span><ul>{method.recommendedModels.slice(0, 4).map((model) => <li key={model}>{model}</li>)}</ul></div>
              <Link className="round-arrow" href={`/methods/${method.slug}`} aria-label={`查看${method.name}`}>→</Link>
            </article>
          ))}
        </section>
        <aside className="integrity-banner"><strong>方法选择原则</strong><p>先跑通可解释的基线，再用更复杂的方法解决明确缺陷。任何模型都需要与问题假设、数据质量和验证设计一起说明。</p></aside>
      </main>
      <SiteFooter />
    </>
  );
}
