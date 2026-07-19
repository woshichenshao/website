import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components";

export const metadata: Metadata = {
  title: "关于界外",
  description: "关于接口之外、作者界外，以及这里坚持的写作原则。",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="shell about-page">
        <p className="eyebrow">About / 关于</p>
        <h1>技术会变化，判断值得积累</h1>
        <p className="about-lead">
          我是界外。这个笔名代表一种写作立场：不只停留在产品界面和流行说法里，而是继续追问工具如何进入真实工作、哪里会失败，以及什么值得留下。
        </p>
        <div className="about-grid">
          <section>
            <h2>写什么</h2>
            <p>AI 工具、个人工作流、小型项目复盘，以及技术选择背后的判断。</p>
          </section>
          <section>
            <h2>怎么写</h2>
            <p>优先记录亲自验证的过程，区分事实、推测和个人经验，不用热度代替结论。</p>
          </section>
          <section>
            <h2>为什么写</h2>
            <p>把一次性的探索整理成可以再次使用的方法，也让失败的判断拥有复盘价值。</p>
          </section>
        </div>
        <p className="about-lead">
          目前网站处于首发版本。你可以通过{" "}
          <a className="text-link" href="mailto:3229124317@qq.com">
            邮件
          </a>{" "}
          或{" "}
          <a
            className="text-link"
            href="https://github.com/woshichenshao"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>{" "}
          联系我。
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
