export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; code: string; language?: string };

export type Post = {
  title: string;
  slug: string;
  summary: string;
  publishedAt: string;
  readTime: number;
  featured?: boolean;
  body: ContentBlock[];
};

const localPosts: Post[] = [
  {
    title: "我如何把 AI 变成稳定的第二工作台",
    slug: "ai-as-a-second-workbench",
    summary: "从零散对话到可复用系统：拆解输入、协作、校验与归档四个环节。",
    publishedAt: "2026-07-16T08:00:00.000Z",
    readTime: 12,
    featured: true,
    body: [
      { type: "paragraph", text: "可靠的 AI 工作流不是把整个任务一次性交给模型，而是把目标、材料、限制与验收标准说清楚，再把关键判断保留在人手里。" },
      { type: "heading", text: "先设计输入，而不是先写提示词" },
      { type: "list", items: ["目标：最后支持哪个决定或交付物。", "材料：只提供与任务有关、可以核验的事实。", "限制：明确范围、时间与不可公开的信息。", "验收：把“写得更好”改成具体检查项。"] },
      { type: "heading", text: "让 AI 负责展开，让人负责收敛" },
      { type: "paragraph", text: "AI 擅长快速铺开候选路径，人更擅长理解真实语境中的代价。先生成少量候选，再用明确标准选择并深入，比反复生成更多版本更可靠。" },
      { type: "quote", text: "可靠的 AI 工作流，不是减少人的判断，而是把判断放在最有价值的位置。" },
    ],
  },
  {
    title: "不是所有自动化都值得做",
    slug: "not-every-automation-is-worth-building",
    summary: "用频率、稳定性和失败成本判断一件事是否应该自动化。",
    publishedAt: "2026-07-09T08:00:00.000Z",
    readTime: 8,
    body: [
      { type: "paragraph", text: "自动化的成本不只在第一次编写，还包括规则变化、权限失效、异常处理和未来的理解成本。" },
      { type: "heading", text: "三个判断维度" },
      { type: "list", items: ["频率：任务是否足够高频。", "稳定性：输入和规则是否长期稳定。", "失败成本：出错后能否快速发现并安全恢复。"] },
      { type: "quote", text: "自动化不是奖章，只是当流程已经合理时降低重复劳动的手段。" },
    ],
  },
  {
    title: "一次小型 AI 项目的完整复盘",
    slug: "small-ai-project-retrospective",
    summary: "从问题定义、最小样本到上线后的失败记录，梳理最容易被忽略的步骤。",
    publishedAt: "2026-06-28T08:00:00.000Z",
    readTime: 10,
    body: [
      { type: "paragraph", text: "一个 AI 项目最危险的时刻，往往不是输出明显错误，而是演示足够惊艳，让团队跳过了问题定义和真实数据验证。" },
      { type: "heading", text: "从二十条真实样本开始" },
      { type: "paragraph", text: "先收集真实输入，手工写出理想输出，并标出最不能接受的错误。这组样本会迅速暴露需求里的模糊词，也能成为后续回归测试的起点。" },
      { type: "list", items: ["无法判断时允许明确拒答。", "保留原始输入、输出和人工修正。", "为高风险动作增加人工确认。", "上线后优先查看失败样本。"] },
    ],
  },
];

export async function getPosts() {
  return localPosts;
}

export async function getPostBySlug(slug: string) {
  return localPosts.find((post) => post.slug === slug);
}
