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
    summary:
      "从零散对话到可复用系统：拆解输入、协作、校验与归档四个环节，让 AI 从偶尔灵光变成可靠的日常能力。",
    publishedAt: "2026-07-16T08:00:00.000Z",
    readTime: 12,
    featured: true,
    body: [
      {
        type: "paragraph",
        text: "多数人第一次使用 AI，会从一个巨大的问题开始：把任务完整地丢进去，然后期待一个可以直接交付的答案。真正稳定的工作流恰好相反——它把不确定性拆小，把判断留在人手里。",
      },
      { type: "heading", text: "先设计输入，而不是先写提示词" },
      {
        type: "paragraph",
        text: "我会先把上下文分为目标、素材、限制和验收标准四部分。目标说明为什么做，素材提供事实，限制划出不能越过的边界，验收标准则告诉我们什么时候算完成。",
      },
      {
        type: "list",
        items: [
          "目标：最后要支持哪个决定或交付物。",
          "素材：只提供与任务有关、可以核验的事实。",
          "限制：明确语气、范围、时间和不可公开的信息。",
          "验收：用具体检查项代替“写得更好”之类的模糊要求。",
        ],
      },
      { type: "heading", text: "让 AI 负责展开，让人负责收敛" },
      {
        type: "paragraph",
        text: "AI 擅长快速铺开候选路径，人更擅长理解真实语境中的代价。因此我通常先让它给出三个方向，再亲自选定判断标准，最后让它围绕一个方向深入，而不是不断生成更多版本。",
      },
      {
        type: "quote",
        text: "可靠的 AI 工作流，不是减少人的判断，而是把判断放在最有价值的位置。",
      },
      { type: "heading", text: "把校验写进流程" },
      {
        type: "paragraph",
        text: "事实、数字、链接和代码都需要独立校验。对于重要内容，我会要求列出来源与假设；对于代码，我会运行构建和测试；对于文案，我会逐句检查是否包含未经证实的个人经历。",
      },
      {
        type: "paragraph",
        text: "这篇文章是一份首发内容草稿。正式公开传播前，请把工具名称、案例与结果替换为你的真实经历，让文章真正属于你。",
      },
    ],
  },
  {
    title: "不是所有自动化都值得做",
    slug: "not-every-automation-is-worth-building",
    summary: "用频率、稳定性和失败成本判断一件事是否应该自动化，避免为了技术感制造新的维护负担。",
    publishedAt: "2026-07-09T08:00:00.000Z",
    readTime: 8,
    body: [
      {
        type: "paragraph",
        text: "自动化很迷人，因为它让一次成功看起来像永久节省。但真正的成本不只在第一次编写，还包括规则变化、权限失效、异常处理和未来的理解成本。",
      },
      { type: "heading", text: "三个判断维度" },
      {
        type: "list",
        items: [
          "频率：任务是否高频到足以收回搭建成本。",
          "稳定性：输入和规则是否足够稳定，半年后仍大致相同。",
          "失败成本：自动执行出错时，能否快速发现并安全恢复。",
        ],
      },
      {
        type: "paragraph",
        text: "低频、规则多变且失败后果严重的任务，通常更适合做成检查清单或半自动工具。高频、规则清晰、结果容易验证的任务，才适合完整自动化。",
      },
      { type: "heading", text: "先消除，再自动化" },
      {
        type: "paragraph",
        text: "在写脚本之前，先问一次：这一步是否真的需要存在？很多流程的最佳优化不是更快地执行，而是合并重复输入、减少审批层级，或者直接删除没有读者的报告。",
      },
      {
        type: "quote",
        text: "自动化不是奖章。它只是当流程已经合理时，用来降低重复劳动的一种手段。",
      },
      {
        type: "paragraph",
        text: "这篇文章是一份编辑草稿。建议补充一个你亲自放弃自动化、最终反而节省时间的真实案例。",
      },
    ],
  },
  {
    title: "一次小型 AI 项目的完整复盘",
    slug: "small-ai-project-retrospective",
    summary: "从问题定义、最小样本到上线后的失败记录，梳理一个小型 AI 项目最容易被忽略的关键步骤。",
    publishedAt: "2026-06-28T08:00:00.000Z",
    readTime: 10,
    body: [
      {
        type: "paragraph",
        text: "一个 AI 项目最危险的时刻，往往不是模型输出明显错误，而是演示足够惊艳，让团队跳过了问题定义和真实数据验证。小项目同样需要一条克制的验证路径。",
      },
      { type: "heading", text: "从二十条真实样本开始" },
      {
        type: "paragraph",
        text: "与其先争论模型和框架，不如收集二十条真实输入，手工写出理想输出，并标出最不能接受的错误。这个小样本会迅速暴露需求中模糊的词，也能成为后续回归测试的起点。",
      },
      { type: "heading", text: "给失败留下位置" },
      {
        type: "list",
        items: [
          "无法判断时允许明确拒答，而不是强行生成。",
          "保留原始输入、输出和人工修正，方便复盘。",
          "为高风险动作增加人工确认，不把建议直接变成执行。",
          "上线后优先查看失败样本，而不是只看平均成功率。",
        ],
      },
      {
        type: "paragraph",
        text: "项目复盘不应只记录模型准确率，还要记录用户是否更快完成任务、需要多少人工修正，以及团队能否解释一次失败为什么发生。",
      },
      {
        type: "quote",
        text: "一个小型 AI 项目的价值，不在于它用了多新的模型，而在于它是否让一个真实流程变得更可靠。",
      },
      {
        type: "paragraph",
        text: "这篇文章是一份结构化首发草稿。正式发布前，请替换为你亲自参与的项目背景、样本数量与复盘结论。",
      },
    ],
  },
];

type SanitySpan = { text?: string };
type SanityBlock = {
  _type?: string;
  style?: string;
  listItem?: string;
  language?: string;
  code?: string;
  children?: SanitySpan[];
};
type SanityPost = Omit<Post, "body"> & { body?: SanityBlock[] };

function plainText(block: SanityBlock) {
  return (block.children ?? []).map((child) => child.text ?? "").join("");
}

function normalizeBody(body: SanityBlock[] = []): ContentBlock[] {
  return body.flatMap((block): ContentBlock[] => {
    if (block._type === "code" || block._type === "codeBlock") {
      return [{ type: "code", code: block.code ?? "", language: block.language }];
    }
    const text = plainText(block);
    if (!text) return [];
    if (block.listItem) return [{ type: "list", items: [text] }];
    if (block.style === "h2" || block.style === "h3") return [{ type: "heading", text }];
    if (block.style === "blockquote") return [{ type: "quote", text }];
    return [{ type: "paragraph", text }];
  });
}

async function fetchSanityPosts(): Promise<Post[] | null> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  if (!projectId) return null;

  const query = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    summary,
    publishedAt,
    readTime,
    featured,
    body
  }`;
  const endpoint = `https://${projectId}.api.sanity.io/v2025-02-19/data/query/${dataset}?query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(endpoint, { next: { revalidate: 300 } });
    if (!response.ok) return null;
    const payload = (await response.json()) as { result?: SanityPost[] };
    if (!payload.result?.length) return null;
    return payload.result.map((post) => ({
      ...post,
      readTime: post.readTime ?? 8,
      body: normalizeBody(post.body),
    }));
  } catch {
    return null;
  }
}

export async function getPosts() {
  return (await fetchSanityPosts()) ?? localPosts;
}

export async function getPostBySlug(slug: string) {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug);
}
