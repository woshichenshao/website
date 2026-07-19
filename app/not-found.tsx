import Link from "next/link";
import { SiteFooter, SiteHeader } from "./components";

export default function NotFound() {
  return <><SiteHeader /><main id="main-content" className="not-found shell"><p className="eyebrow">404 / Not found</p><h1>这条路径还没有模型</h1><p>页面可能已移动，或资料尚未进入公开索引。</p><Link className="button primary" href="/">返回首页</Link></main><SiteFooter /></>;
}
