import Link from "next/link";
import type { ContentBlock } from "./content";
import type { ModelingBlock } from "./modeling-data";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="接口之外首页">
          <strong>接口之外</strong>
          <span>数学建模竞赛知识站</span>
        </Link>
        <nav aria-label="主导航">
          <Link href="/">首页</Link>
          <Link href="/roadmap">备赛路线</Link>
          <Link href="/methods">方法库</Link>
          <Link href="/resources">资料索引</Link>
          <Link href="/about">关于</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer shell">
      <div>
        <strong>接口之外</strong>
        <p>把赛题、模型与论文连接成可复用的方法。</p>
      </div>
      <div className="footer-links">
        <a href="mailto:3229124317@qq.com">3229124317@qq.com</a>
        <a href="https://github.com/woshichenshao" target="_blank" rel="noreferrer">GitHub</a>
      </div>
      <p>© 2026 界外 · 原创整理，不替代赛事官方规则</p>
    </footer>
  );
}

export function RichText({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="prose">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        if (block.type === "heading") return <h2 key={key}>{block.text}</h2>;
        if (block.type === "quote") return <blockquote key={key}>{block.text}</blockquote>;
        if (block.type === "code") {
          return <pre key={key}><code>{block.code}</code></pre>;
        }
        if (block.type === "list") {
          return <ul key={key}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
        }
        return <p key={key}>{block.text}</p>;
      })}
    </div>
  );
}

export function ModelingContent({ blocks }: { blocks: ModelingBlock[] }) {
  return (
    <div className="modeling-prose">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        if (block.type === "heading") return <h2 key={key}>{block.text}</h2>;
        if (block.type === "paragraph") return <p key={key}>{block.text}</p>;
        if (block.type === "list") return <ul key={key}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
        if (block.type === "checklist") {
          return (
            <div className="checklist" key={key}>
              {block.items.map((item) => <div key={item}><span aria-hidden="true">✓</span><p>{item}</p></div>)}
            </div>
          );
        }
        if (block.type === "steps") {
          return (
            <ol className="content-steps" key={key}>
              {block.items.map((item, stepIndex) => (
                <li key={item.title}>
                  <span>{String(stepIndex + 1).padStart(2, "0")}</span>
                  <div><h3>{item.title}</h3><p>{item.text}</p></div>
                </li>
              ))}
            </ol>
          );
        }
        if (block.type === "callout") {
          return <aside className={`callout ${block.tone}`} key={key}><strong>{block.title}</strong><p>{block.text}</p></aside>;
        }
        if (block.type === "formula") {
          return (
            <figure className="formula-card" key={key}>
              <figcaption>{block.label}</figcaption>
              <div>{block.expression}</div>
              <p>{block.note}</p>
            </figure>
          );
        }
        return (
          <div className="comparison-wrap" key={key}>
            <table>
              <thead><tr>{block.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
              <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="面包屑导航">
      {items.map((item, index) => (
        <span key={item.label}>
          {index > 0 ? <i aria-hidden="true">/</i> : null}
          {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
        </span>
      ))}
    </nav>
  );
}
