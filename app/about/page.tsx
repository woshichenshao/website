import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components";

export const metadata: Metadata = {
  title: "关于",
  description: "关于接口之外数学建模竞赛知识站、内容原则与资料公开边界。",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="shell about-modeling">
        <header className="page-hero"><p className="eyebrow">About / 关于</p><h1>资料可以很多，<br />判断必须清楚</h1><p>“接口之外”把零散的赛题、论文、课程和工具整理成可以执行、验证与复用的数学建模方法。</p></header>
        <section className="principle-grid">
          <article><span>01</span><h2>先讲问题，再讲算法</h2><p>模型必须回应明确任务。我们会说明适用条件、输入输出、验证方法和失败边界。</p></article>
          <article><span>02</span><h2>区分原文与整理</h2><p>网站内容以原创总结为主，标注整理依据，不把第三方材料包装成原创成果。</p></article>
          <article><span>03</span><h2>让结论可以复核</h2><p>数值、代码、图表与引用都需要独立检查。AI 只能辅助，不能替代参赛者的判断。</p></article>
        </section>
        <section className="about-boundary"><div><p className="section-kicker">Publication policy</p><h2>资料公开边界</h2></div><div><p>本地资料库约 10.34 GB，包含历年论文、讲义、模板、代码、数据与赛事材料。第一版只发布去重后的元数据和原创整理，不开放原文件下载。</p><ul><li>不公开获奖名单中的姓名与学校</li><li>不发布进行中赛事的答案或解题包</li><li>不公开可执行文件、压缩包和大型数据集</li><li>未来下载内容必须进入明确授权白名单</li></ul></div></section>
        <section className="contact-panel"><div><p className="section-kicker">Contact</p><h2>纠错、建议与合作</h2></div><p>发现方法说明、资料元数据或引用存在问题，欢迎通过邮箱或 GitHub 联系。我们会优先修正影响判断与复现的错误。</p><div><a href="mailto:3229124317@qq.com">发送邮件</a><a href="https://github.com/woshichenshao" target="_blank" rel="noreferrer">访问 GitHub</a></div></section>
        <Link className="back-to-home" href="/">← 返回首页</Link>
      </main>
      <SiteFooter />
    </>
  );
}
