import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components";
import { guides } from "../modeling-data";

export const metadata: Metadata = {
  title: "备赛路线",
  description: "从赛前准备、选题、建模、验证、写作到提交的数学建模竞赛路线。",
};

const stages = [
  { stage: "赛前", window: "比赛前 2—4 周", goal: "跑通一次完整的小型模拟赛", tasks: ["确定三人主责与同步规则", "统一代码、论文和数据目录", "练习一项基础模型与一种绘图工具", "用旧题完成一次限时复盘"] },
  { stage: "选题", window: "开赛后 0—6 小时", goal: "选定一条能验证的主路线", tasks: ["两轮阅读候选题", "列输入、输出、约束和数据风险", "跑出最小基线", "建立论文目录与符号表"] },
  { stage: "建模", window: "6—36 小时", goal: "得到可解释、可复现的核心结果", tasks: ["冻结原始数据", "记录假设与模型理由", "保存参数和运行环境", "同步生成图表与文字结论"] },
  { stage: "验证", window: "24—48 小时", goal: "知道模型在哪些条件下可信", tasks: ["与简单基线比较", "做样本外或滚动验证", "扰动关键参数", "检查量纲、约束和极端值"] },
  { stage: "写作", window: "36—60 小时", goal: "形成完整论证链", tasks: ["摘要写关键方法和数值", "图表先结论后解释", "前后统一符号和单位", "局限与推广写具体条件"] },
  { stage: "提交", window: "最后 12 小时", goal: "正确、完整、按时提交", tasks: ["非作者通读摘要和结论", "在另一台电脑复现核心结果", "检查匿名、编号和引用", "提前导出并上传最终文件"] },
];

export default function RoadmapPage() {
  const routeGuides = guides.filter((guide) => ["备赛路线", "数据与代码", "论文写作"].includes(guide.category));
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="shell">
        <header className="page-hero roadmap-hero">
          <p className="eyebrow">Roadmap / 备赛路线</p>
          <h1>不要等开赛后，<br />才第一次走完整流程</h1>
          <p>把一场比赛拆成六个阶段。每个阶段只有一个核心目标，以及一组可以交叉检查的产出。</p>
        </header>

        <section className="roadmap-timeline" aria-label="数学建模竞赛六阶段路线">
          {stages.map((item, index) => (
            <article key={item.stage}>
              <div className="timeline-index"><span>{String(index + 1).padStart(2, "0")}</span><i /></div>
              <div className="timeline-copy"><p>{item.window}</p><h2>{item.stage}</h2><strong>{item.goal}</strong></div>
              <ul>{item.tasks.map((task) => <li key={task}>{task}</li>)}</ul>
            </article>
          ))}
        </section>

        <section className="route-reading">
          <div className="section-heading"><p className="section-kicker">Reading order</p><h2>按这个顺序开始</h2></div>
          <div className="route-reading-grid">
            {routeGuides.map((guide) => (
              <Link href={`/guides/${guide.slug}`} key={guide.slug}>
                <span>{guide.stage} · {guide.minutes} 分钟</span><h3>{guide.title}</h3><p>{guide.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
