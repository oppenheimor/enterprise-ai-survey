import type { SurveyAnswersInput } from "@/lib/validations/survey";

export type SurveyFieldKey = keyof SurveyAnswersInput;

export type SurveyOption = {
  value: string;
  label: string;
};

export type SurveyQuestion = {
  id: SurveyFieldKey;
  shortId: `Q${number}`;
  group: "企业情况" | "当前痛点" | "基础与条件" | "决策偏好";
  title: string;
  description?: string;
  options: SurveyOption[];
};

export const landingValuePoints = [
  "判断现在值不值得启动 AI 转型",
  "识别先从哪个业务环节切入最稳",
  "给出可解释、可跟进的初步诊断依据",
] as const;

export const landingAudience = [
  "10-200 人传统行业企业主",
  "5-50 人服务型公司负责人",
  "想做 AI，但还没找到第一步的人",
] as const;

export const unlockBenefits = [
  "完整结构化诊断与优先切入方向",
  "核心问题证据链与当前阻力说明",
  "适合企业负责人的分阶段推进建议",
] as const;

export const scoreRatingBands = [
  { min: 90, max: 100, label: "优秀" as const },
  { min: 70, max: 89, label: "良好" as const },
  { min: 50, max: 69, label: "一般" as const },
  { min: 0, max: 49, label: "待提升" as const },
];

export const topSceneMap: Record<string, string> = {
  "growth-efficiency": "增长效率",
  "customer-service": "客服效率",
  delivery: "交付效率",
  content: "内容效率",
  operations: "内部协同",
  other: "流程优化",
};

export const surveyQuestions: SurveyQuestion[] = [
  {
    id: "q1Industry",
    shortId: "Q1",
    group: "企业情况",
    title: "你所在的行业是？",
    options: [
      { value: "manufacturing", label: "制造业" },
      { value: "service", label: "服务业" },
      { value: "retail", label: "零售业" },
      { value: "other", label: "其他" },
    ],
  },
  {
    id: "q2CompanySize",
    shortId: "Q2",
    group: "企业情况",
    title: "你的企业目前大约有多少人？",
    options: [
      { value: "1-10", label: "1-10 人" },
      { value: "11-50", label: "11-50 人" },
      { value: "51-200", label: "51-200 人" },
      { value: "201+", label: "201 人以上" },
    ],
  },
  {
    id: "q3BusinessType",
    shortId: "Q3",
    group: "企业情况",
    title: "你的企业主营业务更接近哪一类？",
    options: [
      { value: "supply-chain", label: "生产加工或供应链相关业务" },
      { value: "professional-service", label: "咨询、培训、设计等专业服务" },
      { value: "retail-operation", label: "门店、电商、零售运营" },
      { value: "project-service", label: "项目制交付或代运营服务" },
    ],
  },
  {
    id: "q4RevenueModel",
    shortId: "Q4",
    group: "企业情况",
    title: "你的企业主要依靠哪一类方式赚钱？",
    options: [
      { value: "product", label: "销售标准化产品" },
      { value: "custom-service", label: "提供定制化服务" },
      { value: "channel", label: "运营门店或渠道" },
      { value: "project", label: "项目制交付" },
    ],
  },
  {
    id: "q5MainProcess",
    shortId: "Q5",
    group: "当前痛点",
    title: "目前最占时间和人力的环节是？",
    options: [
      { value: "growth-efficiency", label: "获客 / 营销" },
      { value: "customer-service", label: "客户咨询 / 客服" },
      { value: "delivery", label: "交付 / 项目执行" },
      { value: "content", label: "内容产出" },
      { value: "operations", label: "行政 / 内部管理" },
      { value: "other", label: "其他" },
    ],
  },
  {
    id: "q6RepeatedWork",
    shortId: "Q6",
    group: "当前痛点",
    title: "这个环节里是否存在大量重复性工作？",
    options: [
      { value: "very-high", label: "非常多，已经明显影响效率" },
      { value: "high", label: "有一些，偶尔会拖慢进度" },
      { value: "medium", label: "不算多，但还有优化空间" },
      { value: "low", label: "基本没有" },
    ],
  },
  {
    id: "q7CoreProblem",
    shortId: "Q7",
    group: "当前痛点",
    title: "这个环节现在最困扰你的问题是什么？",
    options: [
      { value: "cost", label: "人工成本高" },
      { value: "speed", label: "响应速度慢" },
      { value: "quality", label: "质量不稳定" },
      { value: "process", label: "流程不规范" },
    ],
  },
  {
    id: "q8ImpactLevel",
    shortId: "Q8",
    group: "当前痛点",
    title: "如果这个问题短期不解决，对业务影响有多大？",
    options: [
      { value: "critical", label: "很大，已经影响收入或利润" },
      { value: "high", label: "比较大，明显拖慢业务" },
      { value: "medium", label: "一般，还能维持" },
      { value: "low", label: "暂时不大" },
    ],
  },
  {
    id: "q9AiUsage",
    shortId: "Q9",
    group: "基础与条件",
    title: "你们目前是否已经在使用 AI 或数字化工具？",
    options: [
      { value: "multi", label: "已经在多个环节使用" },
      { value: "trial", label: "正在少量尝试" },
      { value: "heard", label: "听说过，但还没正式用" },
      { value: "none", label: "几乎没接触过" },
    ],
  },
  {
    id: "q10ToolingLevel",
    shortId: "Q10",
    group: "基础与条件",
    title: "你们当前最常用的工具组合更接近哪种情况？",
    options: [
      { value: "complete", label: "已经有比较完整的软件系统" },
      { value: "scattered", label: "有一些工具，但比较分散" },
      { value: "manual", label: "主要靠微信、表格、人工协作" },
      { value: "none", label: "基本没有系统化工具" },
    ],
  },
  {
    id: "q11TeamAdoption",
    shortId: "Q11",
    group: "基础与条件",
    title: "团队对新工具或新流程的接受度如何？",
    options: [
      { value: "high", label: "接受度高，愿意尝试" },
      { value: "guided", label: "还可以，需要有人带着落地" },
      { value: "watching", label: "一般，容易观望" },
      { value: "low", label: "较低，推进阻力大" },
    ],
  },
  {
    id: "q12Budget",
    shortId: "Q12",
    group: "基础与条件",
    title: "如果验证有效，你每月大概能接受多少 AI 相关投入？",
    options: [
      { value: "lt-1000", label: "1000 元以内" },
      { value: "1000-5000", label: "1000-5000 元" },
      { value: "5000-10000", label: "5000-10000 元" },
      { value: "10000+", label: "10000 元以上" },
    ],
  },
  {
    id: "q13Timeline",
    shortId: "Q13",
    group: "基础与条件",
    title: "你希望多久能看到一些实际变化？",
    options: [
      { value: "1-month", label: "1 个月内" },
      { value: "1-3-months", label: "1-3 个月" },
      { value: "3-6-months", label: "3-6 个月" },
      { value: "unknown", label: "暂时没有明确时间计划" },
    ],
  },
  {
    id: "q14Owner",
    shortId: "Q14",
    group: "基础与条件",
    title: "当前谁最可能推动这件事往前走？",
    options: [
      { value: "self", label: "我自己就能推动" },
      { value: "management", label: "需要管理层一起决策" },
      { value: "business-owner", label: "需要业务负责人配合" },
      { value: "unknown", label: "目前还没有明确负责人" },
    ],
  },
  {
    id: "q15Attitude",
    shortId: "Q15",
    group: "决策偏好",
    title: "你对 AI 转型的态度更接近下面哪一种？",
    options: [
      { value: "start-now", label: "愿意马上试，先小范围跑起来" },
      { value: "guided-trial", label: "愿意尝试，但希望有人带着做" },
      { value: "watch-first", label: "先看看别人怎么做" },
      { value: "careful", label: "暂时还比较谨慎" },
    ],
  },
  {
    id: "q16ExpectedResult",
    shortId: "Q16",
    group: "决策偏好",
    title: "你最希望从本次结果里得到什么？",
    options: [
      { value: "worth-it", label: "判断值不值得做" },
      { value: "where-to-start", label: "判断先从哪里做" },
      { value: "what-effect", label: "判断大概能带来什么效果" },
      { value: "how-to-push", label: "判断怎么推动更稳" },
    ],
  },
];

export const questionMap = Object.fromEntries(
  surveyQuestions.map((question) => [question.id, question]),
) as Record<SurveyFieldKey, SurveyQuestion>;

export function getOptionLabel(questionId: SurveyFieldKey, value: string) {
  return questionMap[questionId].options.find((option) => option.value === value)?.label ?? value;
}

export function getQuestionIndex(questionId: SurveyFieldKey) {
  return surveyQuestions.findIndex((question) => question.id === questionId);
}
