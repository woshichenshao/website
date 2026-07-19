export type ModelingBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "checklist"; items: string[] }
  | { type: "callout"; tone: "note" | "warning" | "success"; title: string; text: string }
  | { type: "comparison"; columns: string[]; rows: string[][] }
  | { type: "formula"; label: string; expression: string; note: string };

export type Guide = {
  slug: string;
  title: string;
  summary: string;
  category: "备赛路线" | "题型与方法" | "数据与代码" | "论文写作" | "AI 辅助建模";
  stage: "赛前" | "选题" | "建模" | "验证" | "写作" | "提交";
  difficulty: "入门" | "进阶";
  minutes: number;
  tags: string[];
  sourceNote: string;
  body: ModelingBlock[];
};

export type Method = {
  slug: string;
  name: string;
  english: string;
  summary: string;
  useWhen: string;
  inputs: string[];
  outputs: string[];
  recommendedModels: string[];
  validation: string[];
  pitfalls: string[];
  guideSlug: string;
};

export type ResourceRecord = {
  id: string;
  title: string;
  category: "历年赛题" | "优秀论文" | "课程讲义" | "论文模板" | "AI 提示词" | "工具与代码";
  competition: "全国大学生数学建模竞赛" | "其他赛事" | "通用";
  year?: number;
  problem?: string;
  problemType: "综合" | "评价" | "分类与聚类" | "预测" | "优化" | "机理" | "写作";
  format: "PDF" | "DOCX" | "XLSX" | "MATLAB" | "合集";
  summary: string;
  collection: string;
  availability: "仅索引" | "原创摘要";
};

export const modelingCategories = [
  { number: "01", title: "备赛路线", description: "从组队、选题到提交，把三天拆成可以执行的时间表。", href: "/roadmap" },
  { number: "02", title: "题型与方法", description: "先判断问题结构，再选择模型，不从算法名字倒推赛题。", href: "/methods" },
  { number: "03", title: "数据与代码", description: "清洗、探索、求解、可视化与复现，每一步都保留证据。", href: "/guides/data-preprocessing" },
  { number: "04", title: "论文写作", description: "让假设、模型、结果和结论形成一条可检查的论证链。", href: "/guides/paper-structure" },
  { number: "05", title: "AI 辅助建模", description: "把 AI 放进分阶段工作流，并为数值、代码与引用设置核验门。", href: "/guides/ai-modeling-workflow" },
  { number: "06", title: "历年资料", description: "按年份、赛事、题型和内容类型检索，不在海量文件里迷路。", href: "/resources" },
] as const;

export const guides: Guide[] = [
  {
    slug: "competition-overview",
    title: "第一次参赛：先看懂一场数学建模比赛",
    summary: "把数学建模理解成一次有截止时间的研究协作，而不是算法背诵比赛。",
    category: "备赛路线",
    stage: "赛前",
    difficulty: "入门",
    minutes: 8,
    tags: ["新手", "全流程", "准备"],
    sourceNote: "根据《数学建模·国赛速成课》与历年赛题结构二次整理。",
    body: [
      { type: "paragraph", text: "比赛真正考察的是：能否把自然语言问题转成可计算的问题，给出有依据的结果，并用一篇结构完整的论文让别人复核。模型复杂度不是唯一标准，问题理解、假设边界和验证质量同样重要。" },
      { type: "steps", items: [
        { title: "理解赛题", text: "圈出目标、约束、数据、评价指标与需要回答的子问题。" },
        { title: "建立模型", text: "先写变量和关系，再决定算法；保留选择理由与替代方案。" },
        { title: "求解与验证", text: "代码产出不是终点，要检查量纲、边界、误差和稳定性。" },
        { title: "论文表达", text: "让摘要、模型、图表和结论回答同一组问题。" },
      ] },
      { type: "callout", tone: "success", title: "最小成功标准", text: "每个结论都能指回一个模型、一个结果或一项验证；队友能够在另一台电脑上复现核心结果。" },
    ],
  },
  {
    slug: "team-roles",
    title: "三人队伍如何分工，才不会各做各的",
    summary: "用主责而不是岗位墙分工，让建模、编程和写作持续交换信息。",
    category: "备赛路线",
    stage: "赛前",
    difficulty: "入门",
    minutes: 7,
    tags: ["组队", "协作", "复现"],
    sourceNote: "根据速成课中的比赛流程与论文提交检查项扩展整理。",
    body: [
      { type: "comparison", columns: ["主责", "主要产出", "必须同步给队友"], rows: [
        ["问题与模型", "问题拆解、假设、模型路线", "变量定义、模型边界、替代方案"],
        ["数据与计算", "清洗脚本、求解代码、图表", "数据版本、参数、运行说明、异常结果"],
        ["论文与校验", "论文主稿、符号表、格式", "缺失证据、前后矛盾、提交风险"],
      ] },
      { type: "paragraph", text: "主责不等于独占。每个关键结论至少由两个人检查：模型负责人解释逻辑，计算负责人确认数值，写作负责人检查是否被准确表达。" },
      { type: "checklist", items: ["建立唯一文件命名规则", "固定每 3—4 小时短同步", "图表同时保存生成代码", "论文主稿只保留一个权威版本", "提交前由非作者复核摘要与结论"] },
    ],
  },
  {
    slug: "competition-timeline",
    title: "三天比赛时间线：什么时候该停止继续加模型",
    summary: "把截止时间倒推成五个交付节点，避免最后一晚才开始写论文。",
    category: "备赛路线",
    stage: "提交",
    difficulty: "入门",
    minutes: 9,
    tags: ["时间管理", "提交", "检查清单"],
    sourceNote: "根据国赛速成课的流程建议与论文模板章节要求扩展整理。",
    body: [
      { type: "steps", items: [
        { title: "0—6 小时：选题", text: "完成两题快速评估，确定主问题、数据可用性和最小模型。" },
        { title: "6—24 小时：跑通", text: "得到第一版可解释结果，同时建立论文骨架和符号表。" },
        { title: "24—42 小时：完善", text: "改进模型、补图表、完成验证；新模型必须能改善明确指标。" },
        { title: "42—60 小时：成稿", text: "模型冻结，集中解决论证、图表编号和结论一致性。" },
        { title: "最后 12 小时：审稿", text: "交叉复现、摘要重写、格式与提交文件检查，预留上传时间。" },
      ] },
      { type: "callout", tone: "warning", title: "模型冻结线", text: "进入成稿阶段后，除非发现结论错误，不再替换主模型。新增复杂度必须换来可证明的结果改善。" },
    ],
  },
  {
    slug: "problem-selection",
    title: "选题不是凭感觉：用 30 分钟做两轮筛选",
    summary: "比较理解成本、数据质量、可验证性和队伍能力，而不是只看题目是否熟悉。",
    category: "题型与方法",
    stage: "选题",
    difficulty: "入门",
    minutes: 8,
    tags: ["选题", "风险", "决策"],
    sourceNote: "根据近五年赛题分类材料与通用选题流程原创整理。",
    body: [
      { type: "comparison", columns: ["维度", "高分信号", "风险信号"], rows: [
        ["问题理解", "能复述每个子问题的输入输出", "关键名词无法定义"],
        ["数据", "字段含义清楚且可做质量检查", "需要大量不可获得的外部数据"],
        ["模型", "至少有一条能跑通的基线", "只能依赖陌生且难验证的算法"],
        ["验证", "有真实值、约束或稳定性指标", "只能展示结果，无法判断好坏"],
      ] },
      { type: "formula", label: "选题评分", expression: "S = 0.30U + 0.25D + 0.25V + 0.20T", note: "U 为理解度，D 为数据可用性，V 为可验证性，T 为团队匹配度；评分只用于暴露分歧，不代替讨论。" },
    ],
  },
  {
    slug: "problem-types",
    title: "六类常见题型：先识别任务，再谈算法",
    summary: "用输出形式和评价方式区分评价、分类聚类、预测、优化与机理问题。",
    category: "题型与方法",
    stage: "选题",
    difficulty: "入门",
    minutes: 12,
    tags: ["题型", "模型选择", "算法"],
    sourceNote: "根据速成课六类模型章节与算法匹配表重新组织。",
    body: [
      { type: "comparison", columns: ["题型", "典型输出", "首先追问"], rows: [
        ["评价", "排序、得分、等级", "指标权重从哪里来？"],
        ["分类", "已知类别标签", "标签是否可靠且不平衡？"],
        ["聚类", "数据中的自然分组", "距离是否能表达相似性？"],
        ["预测", "未来数值或概率", "时间泄漏和外推风险是什么？"],
        ["优化", "满足约束的最优方案", "目标函数是否代表真实目标？"],
        ["机理", "变量关系与动态规律", "守恒、因果和参数可辨识性如何？"],
      ] },
      { type: "callout", tone: "note", title: "组合题很常见", text: "一道题可能先预测需求，再优化调度，最后评价方案。按子问题拆分任务，不要给整道题贴唯一标签。" },
    ],
  },
  {
    slug: "evaluation-classification-clustering",
    title: "评价、分类与聚类：三个容易混淆的任务",
    summary: "区分排序、预测标签与发现结构，并为权重、标签和距离分别设置验证。",
    category: "题型与方法",
    stage: "建模",
    difficulty: "进阶",
    minutes: 14,
    tags: ["综合评价", "分类", "聚类"],
    sourceNote: "根据速成课评价、分类、聚类章节二次整理。",
    body: [
      { type: "paragraph", text: "评价回答谁更优，分类回答新样本属于哪个已知类别，聚类则探索数据可能存在的分组。三者都可能输出标签，但问题假设完全不同。" },
      { type: "list", items: ["评价：同时报告权重来源与权重扰动后的排名稳定性。", "分类：使用独立测试集、混淆矩阵，并处理类别不平衡。", "聚类：比较不同距离、不同簇数，并结合业务含义解释分组。"] },
      { type: "callout", tone: "warning", title: "常见误区", text: "熵权法只能利用数据离散程度确定权重，不自动等于指标的重要程度；聚类轮廓系数高，也不保证分组有实际含义。" },
    ],
  },
  {
    slug: "forecasting-models",
    title: "预测模型：先建立时间基线，再追求复杂度",
    summary: "从朴素基线、滚动验证和误差诊断出发，避免随机切分造成时间泄漏。",
    category: "题型与方法",
    stage: "建模",
    difficulty: "进阶",
    minutes: 13,
    tags: ["预测", "时间序列", "回归"],
    sourceNote: "根据速成课预测章节和近年赛题分类材料原创整理。",
    body: [
      { type: "steps", items: [
        { title: "建立基线", text: "均值、上一期、季节朴素法或简单线性回归必须先跑。" },
        { title: "按时间验证", text: "训练永远早于验证，使用滚动窗口观察不同阶段表现。" },
        { title: "诊断误差", text: "按时间、区间和群体拆解误差，确认模型在哪些条件下失效。" },
        { title: "给出区间", text: "重要预测同时报告不确定性或情景范围，不只给单点。" },
      ] },
      { type: "formula", label: "相对误差", expression: "MAPE = (1/n) Σ |(yᵢ - ŷᵢ) / yᵢ|", note: "当真实值接近 0 时 MAPE 会失真，应改用 MAE、RMSE 或带尺度的指标。" },
    ],
  },
  {
    slug: "optimization-mechanism",
    title: "优化与机理模型：让目标、约束和规律都能解释",
    summary: "把现实限制写成数学约束，用敏感性分析判断最优解是否可靠。",
    category: "题型与方法",
    stage: "建模",
    difficulty: "进阶",
    minutes: 15,
    tags: ["优化", "机理", "约束"],
    sourceNote: "根据速成课优化与机理模型章节及算法匹配资料重写。",
    body: [
      { type: "paragraph", text: "优化模型的核心不是求解器，而是目标函数和约束是否忠实表达现实。机理模型的核心也不是微分方程数量，而是变量关系是否有守恒、因果或经验依据。" },
      { type: "checklist", items: ["明确决策变量及单位", "区分硬约束与软约束", "报告不可行情况及原因", "与简单启发式方案比较", "扰动关键参数并重新求解", "解释最优解为何变化"] },
      { type: "callout", tone: "warning", title: "最优不等于可用", text: "如果输入参数稍微变化，方案就完全不同，应报告稳健方案或多个情景，而不是只给一个精确最优值。" },
    ],
  },
  {
    slug: "data-preprocessing",
    title: "数据预处理：每一次删除和填补都要能被解释",
    summary: "建立原始层、清洗层和分析层，避免比赛后期无法复现数据版本。",
    category: "数据与代码",
    stage: "建模",
    difficulty: "入门",
    minutes: 11,
    tags: ["数据清洗", "探索分析", "复现"],
    sourceNote: "根据速成课数据处理内容与 AI 数据预处理提示词整理。",
    body: [
      { type: "steps", items: [
        { title: "先做数据字典", text: "记录字段含义、单位、时间范围、缺失编码和来源。" },
        { title: "再做质量报告", text: "统计缺失、重复、异常范围、类别分布与时间连续性。" },
        { title: "保留处理日志", text: "每条规则写明原因、影响行数和处理前后对比。" },
        { title: "冻结分析版本", text: "模型只读取明确版本的清洗数据，禁止手工覆盖原始文件。" },
      ] },
      { type: "checklist", items: ["原始文件只读", "统一单位和时间格式", "区分结构性缺失与随机缺失", "异常值先解释再处理", "标准化参数只用训练集估计", "图表可由代码重新生成"] },
    ],
  },
  {
    slug: "model-validation",
    title: "模型检验：不要只证明模型能跑",
    summary: "从基线、样本外表现、敏感性、稳健性和现实约束五个方向检查结论。",
    category: "数据与代码",
    stage: "验证",
    difficulty: "进阶",
    minutes: 12,
    tags: ["验证", "敏感性", "误差"],
    sourceNote: "根据速成课模型检验内容与专用检验提示词二次整理。",
    body: [
      { type: "comparison", columns: ["检验", "回答的问题", "最低产出"], rows: [
        ["基线比较", "复杂模型是否真的更好？", "同一指标下的基线结果"],
        ["样本外验证", "对未见数据是否有效？", "独立验证集或滚动验证"],
        ["敏感性分析", "参数变化会不会推翻结论？", "关键参数扰动曲线"],
        ["稳健性检验", "换方法或样本是否仍成立？", "替代设定的对比表"],
        ["现实校验", "结果是否违反常识或约束？", "量纲、边界与极端情况检查"],
      ] },
      { type: "callout", tone: "success", title: "好的验证段落", text: "先说明检验目的，再描述设计和指标，最后解释结果对主结论意味着什么。只贴一张误差图不算完成验证。" },
    ],
  },
  {
    slug: "paper-structure",
    title: "论文结构：让每一节都推动结论向前",
    summary: "按照问题、假设、模型、结果、检验和结论组织证据，而不是按比赛过程写流水账。",
    category: "论文写作",
    stage: "写作",
    difficulty: "入门",
    minutes: 14,
    tags: ["论文", "摘要", "结构"],
    sourceNote: "根据 2025 数学建模国赛 Word/LaTeX 模板与写作提示整理。",
    body: [
      { type: "steps", items: [
        { title: "摘要", text: "用问题—方法—结果—检验—结论的顺序，写出关键数值。" },
        { title: "问题分析", text: "解释子问题关系、主要困难和整体路线，不照抄题面。" },
        { title: "假设与符号", text: "说明简化的必要性和适用边界，统一变量与单位。" },
        { title: "模型与求解", text: "先解释结构，再给公式、参数、算法和实现细节。" },
        { title: "结果与检验", text: "图表先给发现，再解释原因，并用验证支持可信度。" },
        { title: "评价与推广", text: "优点必须有依据，局限要具体，推广说明需要改变什么。" },
      ] },
      { type: "callout", tone: "warning", title: "摘要不是目录", text: "避免“本文首先……然后……”的过程叙述。读者应能从摘要直接知道用了什么、得到什么、结果是否可靠。" },
    ],
  },
  {
    slug: "ai-modeling-workflow",
    title: "AI 辅助建模：把一个万能提示词拆成六道核验门",
    summary: "让 AI 分阶段协助理解、选模、编程、检验和写作，但不替你制造数据与引用。",
    category: "AI 辅助建模",
    stage: "建模",
    difficulty: "入门",
    minutes: 13,
    tags: ["AI", "提示词", "学术规范"],
    sourceNote: "根据资料库中的求解、写作、预处理、检验与润色提示词重新拆分。",
    body: [
      { type: "steps", items: [
        { title: "题意核对", text: "让 AI 列目标、输入、约束和歧义；逐条回到题面确认。" },
        { title: "候选模型", text: "要求比较前提、数据需求、优缺点和验证方式，不直接要唯一答案。" },
        { title: "代码审查", text: "提供数据字典和预期输入输出，让 AI 检查逻辑、边界和复现步骤。" },
        { title: "结果质疑", text: "让 AI 寻找违反常识、量纲、约束和统计假设的地方。" },
        { title: "论文编辑", text: "只基于已有事实改善结构与表达，禁止补造结果。" },
        { title: "最终核验", text: "人工核对每个数值、图表、引用和赛事规则。" },
      ] },
      { type: "callout", tone: "warning", title: "四条红线", text: "不让 AI 编造数据，不接受无法运行的代码，不引用未查到原文的文献，不把生成文本当成自己的独立论证。" },
      { type: "checklist", items: ["记录关键提示词和人工修改", "数值从代码输出回填", "引用逐条访问原始来源", "公式符号与正文一致", "遵守当届赛事关于生成式 AI 的规定"] },
    ],
  },
];

export const methods: Method[] = [
  {
    slug: "evaluation",
    name: "综合评价",
    english: "Evaluation",
    summary: "将多个指标汇总为得分、等级或排序。",
    useWhen: "目标是比较方案、地区或对象的综合表现，而且指标含义与方向可以明确。",
    inputs: ["评价对象 × 指标矩阵", "指标正负方向", "权重依据"],
    outputs: ["综合得分", "排序或等级", "权重与稳定性说明"],
    recommendedModels: ["TOPSIS", "AHP", "熵权法", "主成分分析", "模糊综合评价"],
    validation: ["权重敏感性", "排名稳定性", "替代方法对比"],
    pitfalls: ["把客观赋权误写成客观重要性", "未处理量纲与指标方向", "只给排名不解释差异"],
    guideSlug: "evaluation-classification-clustering",
  },
  {
    slug: "classification-clustering",
    name: "分类与聚类",
    english: "Classification & Clustering",
    summary: "预测已知标签，或从数据中发现潜在分组。",
    useWhen: "样本需要被分到类别，或希望探索对象之间的自然结构。",
    inputs: ["样本特征", "分类任务需要可靠标签", "距离或相似度定义"],
    outputs: ["类别预测", "簇标签与中心", "特征重要性或群体画像"],
    recommendedModels: ["逻辑回归", "决策树", "随机森林", "SVM", "K-means", "层次聚类"],
    validation: ["混淆矩阵", "交叉验证", "轮廓系数", "簇稳定性"],
    pitfalls: ["随机切分破坏时间结构", "类别不平衡只看准确率", "聚类标签被当作真实类别"],
    guideSlug: "evaluation-classification-clustering",
  },
  {
    slug: "forecasting",
    name: "预测",
    english: "Forecasting",
    summary: "估计未来数值、状态或事件概率。",
    useWhen: "问题明确要求未来结果，且历史数据包含可延续的模式。",
    inputs: ["历史目标值", "时间戳", "可用解释变量"],
    outputs: ["点预测", "置信或预测区间", "误差诊断"],
    recommendedModels: ["线性回归", "ARIMA", "指数平滑", "灰色预测", "随机森林", "神经网络"],
    validation: ["滚动验证", "MAE/RMSE", "基线比较", "残差诊断"],
    pitfalls: ["时间泄漏", "用复杂模型掩盖数据不足", "只报告训练误差"],
    guideSlug: "forecasting-models",
  },
  {
    slug: "optimization",
    name: "优化",
    english: "Optimization",
    summary: "在资源与规则约束下寻找更优决策。",
    useWhen: "存在可控决策变量、明确目标和能够数学表达的限制。",
    inputs: ["决策变量", "目标函数", "约束与参数"],
    outputs: ["可行方案", "目标值", "约束占用与敏感性"],
    recommendedModels: ["线性规划", "整数规划", "非线性规划", "动态规划", "遗传算法", "模拟退火"],
    validation: ["可行性检查", "下界/上界比较", "启发式基线", "参数敏感性"],
    pitfalls: ["目标函数偏离现实目标", "漏写约束", "只报最优值不报方案"],
    guideSlug: "optimization-mechanism",
  },
  {
    slug: "mechanism",
    name: "机理模型",
    english: "Mechanism",
    summary: "用守恒、因果或动态关系解释系统如何变化。",
    useWhen: "问题关心过程与原因，而且存在可解释的物理、生物、经济或传播规律。",
    inputs: ["状态变量", "作用关系", "初始与边界条件"],
    outputs: ["系统演化", "参数解释", "情景模拟"],
    recommendedModels: ["微分方程", "差分方程", "马尔可夫链", "系统动力学", "网络模型"],
    validation: ["量纲检查", "参数估计", "极端情况", "真实数据拟合"],
    pitfalls: ["方程复杂但参数不可辨识", "忽略边界条件", "相关关系被写成因果"],
    guideSlug: "optimization-mechanism",
  },
  {
    slug: "hybrid",
    name: "组合建模",
    english: "Hybrid Workflow",
    summary: "为多子问题连接预测、优化和评价等不同模型。",
    useWhen: "题目包含连续任务，前一步输出会成为后一步输入。",
    inputs: ["子问题依赖图", "各模型输入输出", "误差传递关系"],
    outputs: ["端到端方案", "接口数据", "整体误差与风险"],
    recommendedModels: ["预测 + 优化", "聚类 + 分类", "机理 + 参数优化", "评价 + 稳健性分析"],
    validation: ["分模块验证", "端到端回测", "误差传播", "消融实验"],
    pitfalls: ["模型堆砌", "接口变量不一致", "前序误差未进入后序分析"],
    guideSlug: "problem-types",
  },
];

const annualCollections: ResourceRecord[] = Array.from({ length: 34 }, (_, index) => {
  const year = 1992 + index;
  return {
    id: `cumcm-${year}`,
    title: `${year} 年全国大学生数学建模竞赛资料集`,
    category: year === 1992 ? "优秀论文" : "历年赛题",
    competition: "全国大学生数学建模竞赛",
    year,
    problemType: "综合",
    format: "合集",
    summary: year === 1992 ? "优秀论文索引；不提供原文下载。" : "赛题与优秀论文的去重索引；不提供原文下载。",
    collection: "1992—2025 数学建模国赛优秀论文汇总",
    availability: "仅索引",
  } satisfies ResourceRecord;
});

const selectedPapers = [
  [2022, "A001"], [2022, "A171"], [2022, "B035"], [2022, "B086"], [2022, "C229"], [2022, "E014"],
  [2025, "A066"], [2025, "A196"], [2025, "B060"], [2025, "C023"], [2025, "C132"], [2025, "D037"], [2025, "E030"],
] as const;

const selectedPaperRecords: ResourceRecord[] = selectedPapers.map(([year, code]) => ({
  id: `paper-${year}-${code.toLowerCase()}`,
  title: `${year} 年国赛优秀论文 ${code}`,
  category: "优秀论文",
  competition: "全国大学生数学建模竞赛",
  year,
  problem: code.slice(0, 1),
  problemType: "综合",
  format: "PDF",
  summary: "已确认存在的优秀论文条目，用于后续原创拆解与方法索引。",
  collection: "国赛优秀论文精选",
  availability: "仅索引",
}));

export const resources: ResourceRecord[] = [
  ...annualCollections,
  ...selectedPaperRecords,
  {
    id: "zero-to-competition-course",
    title: "数学建模·国赛零基础速成课讲义",
    category: "课程讲义",
    competition: "通用",
    year: 2026,
    problemType: "综合",
    format: "PDF",
    summary: "覆盖竞赛流程、六类模型、论文写作与提交检查的 81 页讲义。",
    collection: "2026 数学建模国赛零基础速成课",
    availability: "原创摘要",
  },
  {
    id: "algorithm-matching-table",
    title: "数学建模黄金算法匹配表",
    category: "工具与代码",
    competition: "通用",
    problemType: "综合",
    format: "PDF",
    summary: "题型、数据条件与候选算法的快速对照资料。",
    collection: "2026 电工杯竞赛助攻资料",
    availability: "原创摘要",
  },
  {
    id: "paper-template-2025",
    title: "2025 数学建模国赛论文模板",
    category: "论文模板",
    competition: "全国大学生数学建模竞赛",
    year: 2025,
    problemType: "写作",
    format: "DOCX",
    summary: "摘要、假设、符号、模型、检验和附录的论文结构参考。",
    collection: "2025 国赛论文写作模板",
    availability: "原创摘要",
  },
  {
    id: "latex-template",
    title: "数学建模国赛 LaTeX 模板资料",
    category: "论文模板",
    competition: "全国大学生数学建模竞赛",
    problemType: "写作",
    format: "合集",
    summary: "用于排版结构检查的 LaTeX 模板索引，第一版不提供文件下载。",
    collection: "国赛 LaTeX 模板",
    availability: "仅索引",
  },
  {
    id: "ai-solving-prompts",
    title: "数学建模问题求解 AI 提示词",
    category: "AI 提示词",
    competition: "通用",
    problemType: "综合",
    format: "DOCX",
    summary: "从题意分析到模型选择的提示框架；网站版本已拆分并增加人工核验。",
    collection: "AI 提示词解决四大类数学建模题型教程",
    availability: "原创摘要",
  },
  {
    id: "ai-writing-prompts",
    title: "数学建模论文撰写 AI 提示词",
    category: "AI 提示词",
    competition: "通用",
    problemType: "写作",
    format: "DOCX",
    summary: "面向论文结构与语言编辑的提示框架，不用于生成虚构结果或引用。",
    collection: "AI 提示词解决四大类数学建模题型教程",
    availability: "原创摘要",
  },
  {
    id: "problem-classification-2021-2025",
    title: "2021—2025 国赛本科组赛题分类表",
    category: "历年赛题",
    competition: "全国大学生数学建模竞赛",
    year: 2025,
    problemType: "综合",
    format: "DOCX",
    summary: "近五年赛题的题型分类索引，用于训练选题和模型识别。",
    collection: "AI 提示词解决四大类数学建模题型教程",
    availability: "原创摘要",
  },
  {
    id: "pdms-emissivity-data",
    title: "PDMS 厚度—发射率案例数据",
    category: "工具与代码",
    competition: "其他赛事",
    problemType: "机理",
    format: "XLSX",
    summary: "包含波长及多组厚度发射率结果，可用于数据可视化与参数分析案例。",
    collection: "AI 一键生成数模国奖级绘图",
    availability: "仅索引",
  },
  {
    id: "plotting-matlab-examples",
    title: "数学建模绘图 MATLAB 示例",
    category: "工具与代码",
    competition: "通用",
    problemType: "综合",
    format: "MATLAB",
    summary: "包含图表脚本与示例数据的索引，公开前需逐项完成代码和授权审核。",
    collection: "AI 一键生成数模国奖级绘图",
    availability: "仅索引",
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}

export function getMethod(slug: string) {
  return methods.find((method) => method.slug === slug);
}
