import Link from "next/link";
import type { ContentBlock } from "./content";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="接口之外首页">
          <strong>接口之外</strong>
          <span>实践笔记 / 2026</span>
        </Link>
        <nav aria-label="主导航">
          <Link href="/articles">文章</Link>
          <Link href="/about">关于</Link>
          <a href="mailto:3229124317@qq.com">联系</a>
          <a href="https://github.com/woshichenshao" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer shell">
      <p>© 2026 界外</p>
      <p>以清晰、诚实与可验证为写作原则</p>
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
          return (
            <pre key={key} aria-label={block.language ? `${block.language} 代码示例` : "代码示例"}>
              <code>{block.code}</code>
            </pre>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={key}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        return <p key={key}>{block.text}</p>;
      })}
    </div>
  );
}
