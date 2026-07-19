import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, SiteFooter, SiteHeader } from "../../components";
import { getMethod, methods } from "../../modeling-data";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return methods.map((method) => ({ slug: method.slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const method = getMethod((await params).slug);
  return method ? { title: method.name, description: method.summary } : {};
}

export default async function MethodDetailPage({ params }: PageProps) {
  const method = getMethod((await params).slug);
  if (!method) notFound();
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="shell detail-page">
        <Breadcrumbs items={[{ label: "首页", href: "/" }, { label: "方法库", href: "/methods" }, { label: method.name }]} />
        <header className="detail-header">
          <p className="eyebrow">{method.english}</p><h1>{method.name}</h1><p>{method.summary}</p>
        </header>
        <div className="method-detail-grid">
          <section><p className="section-kicker">Use when</p><h2>什么时候使用</h2><p>{method.useWhen}</p></section>
          <section><p className="section-kicker">Inputs / Outputs</p><h2>输入与输出</h2><div className="io-grid"><div><strong>输入</strong><ul>{method.inputs.map((item) => <li key={item}>{item}</li>)}</ul></div><div><strong>输出</strong><ul>{method.outputs.map((item) => <li key={item}>{item}</li>)}</ul></div></div></section>
          <section><p className="section-kicker">Model candidates</p><h2>候选模型</h2><div className="tag-cloud">{method.recommendedModels.map((item) => <span key={item}>{item}</span>)}</div></section>
          <section><p className="section-kicker">Validation</p><h2>最低验证要求</h2><ul className="check-list-simple">{method.validation.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section className="pitfall-section"><p className="section-kicker">Pitfalls</p><h2>常见误区</h2><ol>{method.pitfalls.map((item, index) => <li key={item}><span>{index + 1}</span>{item}</li>)}</ol></section>
        </div>
        <Link className="next-reading" href={`/guides/${method.guideSlug}`}><span>继续阅读</span><strong>查看相关专题指南</strong><b>→</b></Link>
      </main>
      <SiteFooter />
    </>
  );
}
