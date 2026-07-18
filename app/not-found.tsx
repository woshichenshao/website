import Link from "next/link";
import { SiteFooter, SiteHeader } from "./components";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="not-found shell">
        <div>
          <p className="eyebrow">404 / Page not found</p>
          <h1>这一页还没有写下</h1>
          <p>你访问的内容可能已移动，或者仍在准备中。</p>
          <Link className="text-link" href="/">
            返回首页 →
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
