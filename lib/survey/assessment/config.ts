import type { AssessmentDimensionKey, AssessmentLevel, AssessmentStage, PersonaCode } from "@/lib/survey/assessment/types";
import type { SurveyAnswersInput } from "@/lib/validations/survey";

type MappingValue = number;

export type DimensionDefinition = {
  key: AssessmentDimensionKey;
  label: string;
  weights: Partial<Record<keyof SurveyAnswersInput, number>>;
  mappings: Partial<Record<keyof SurveyAnswersInput, Record<string, MappingValue>>>;
  summaries: {
    high: string;
    medium: string;
    low: string;
  };
};

export type StageDefinition = {
  stage: AssessmentStage;
  matches: (scores: Record<AssessmentDimensionKey, number>) => boolean;
  candidatePool: PersonaCode[];
  reason: string;
};

export const dimensionDefinitions: DimensionDefinition[] = [
  {
    key: "urgency",
    label: "转型紧迫度",
    weights: {
      q8ImpactLevel: 0.35,
      q6RepeatedWork: 0.25,
      q7CoreProblem: 0.25,
      q5MainProcess: 0.15,
    },
    mappings: {
      q8ImpactLevel: { critical: 100, high: 75, medium: 45, low: 20 },
      q6RepeatedWork: { "very-high": 100, high: 75, medium: 45, low: 15 },
      q7CoreProblem: { cost: 85, speed: 80, quality: 75, process: 70 },
      q5MainProcess: {
        "customer-service": 95,
        content: 90,
        operations: 85,
        "growth-efficiency": 80,
        delivery: 70,
        other: 60,
      },
    },
    summaries: {
      high: "当前问题已经足够痛，适合把 AI 当成优先级较高的现实议题。",
      medium: "你已经感受到效率压力，但还需要更明确地收敛最先处理的问题。",
      low: "你现在还没到必须立刻启动 AI 的阶段，先明确真正的业务痛点更重要。",
    },
  },
  {
    key: "digitalBase",
    label: "数字化基础",
    weights: {
      q10ToolingLevel: 0.6,
      q9AiUsage: 0.4,
    },
    mappings: {
      q10ToolingLevel: { complete: 95, scattered: 70, manual: 35, none: 10 },
      q9AiUsage: { multi: 95, trial: 70, heard: 35, none: 10 },
    },
    summaries: {
      high: "你已经具备较好的工具底座，后续更像是在现有系统上叠加 AI 能力。",
      medium: "你有一定基础，但工具碎片化会拖慢后续扩展速度。",
      low: "你当前最大的短板不是 AI 能力，而是底层工具和协作方式还比较原始。",
    },
  },
  {
    key: "execution",
    label: "组织执行力",
    weights: {
      q14Owner: 0.4,
      q11TeamAdoption: 0.35,
      q15Attitude: 0.25,
    },
    mappings: {
      q14Owner: { self: 95, management: 75, "business-owner": 70, unknown: 20 },
      q11TeamAdoption: { high: 95, guided: 75, watching: 45, low: 20 },
      q15Attitude: { "start-now": 95, "guided-trial": 75, "watch-first": 45, careful: 20 },
    },
    summaries: {
      high: "组织层面对这件事有推进条件，关键是把试点边界和 owner 设清楚。",
      medium: "组织层面能动，但需要更清晰的推动链条和落地节奏。",
      low: "问题不在认知，而在组织推进链条和责任机制还没成形。",
    },
  },
  {
    key: "resource",
    label: "资源投入力",
    weights: {
      q12Budget: 0.6,
      q13Timeline: 0.4,
    },
    mappings: {
      q12Budget: { "10000+": 95, "5000-10000": 75, "1000-5000": 50, "lt-1000": 25 },
      q13Timeline: { "1-3-months": 90, "3-6-months": 80, "1-month": 60, unknown: 40 },
    },
    summaries: {
      high: "你具备跑出样板项目的资源条件，关键是别把第一步做得过重。",
      medium: "你有一定投入空间，更适合围绕单一场景做轻量试点。",
      low: "你对结果有期待，但当前预算和耐心窗口更适合先做低风险验证。",
    },
  },
  {
    key: "maturity",
    label: "落地成熟度",
    weights: {
      q9AiUsage: 0.25,
      q10ToolingLevel: 0.25,
      q11TeamAdoption: 0.2,
      q14Owner: 0.15,
      q15Attitude: 0.15,
    },
    mappings: {
      q9AiUsage: { multi: 95, trial: 70, heard: 35, none: 10 },
      q10ToolingLevel: { complete: 95, scattered: 70, manual: 35, none: 10 },
      q11TeamAdoption: { high: 95, guided: 75, watching: 45, low: 20 },
      q14Owner: { self: 95, management: 75, "business-owner": 70, unknown: 20 },
      q15Attitude: { "start-now": 95, "guided-trial": 75, "watch-first": 45, careful: 20 },
    },
    summaries: {
      high: "你已经接近流程化应用阶段，后续重点是把试点变成稳定机制。",
      medium: "你已经不是空白期，当前更像处于试验向落地过渡的阶段。",
      low: "你还处在启蒙或观察阶段，先把底座和推动条件补齐更重要。",
    },
  },
  {
    key: "fit",
    label: "场景适配度",
    weights: {
      q5MainProcess: 0.35,
      q3BusinessType: 0.25,
      q4RevenueModel: 0.25,
      q1Industry: 0.15,
    },
    mappings: {
      q5MainProcess: {
        "customer-service": 95,
        content: 95,
        "growth-efficiency": 90,
        operations: 80,
        delivery: 75,
        other: 60,
      },
      q3BusinessType: {
        "professional-service": 90,
        "retail-operation": 85,
        "project-service": 75,
        "supply-chain": 70,
      },
      q4RevenueModel: {
        "custom-service": 90,
        project: 80,
        channel: 85,
        product: 75,
      },
      q1Industry: {
        service: 90,
        retail: 85,
        manufacturing: 75,
        other: 65,
      },
    },
    summaries: {
      high: "你的业务天然存在适合先切入的 AI 场景，关键是先选对第一刀。",
      medium: "你的业务有一定适配空间，但需要更明确地收敛到高价值场景。",
      low: "你的业务场景不是不能做 AI，而是更需要先找到具体、可验证的切口。",
    },
  },
];

export const stageDefinitions: StageDefinition[] = [
  {
    stage: "启蒙期",
    matches: (scores) => scores.digitalBase < 40 && scores.maturity < 40,
    candidatePool: ["bukesheng", "guanwangpai", "genpaozhe"],
    reason: "数字化基础和落地成熟度都偏低，当前更像是先补底座和认知的阶段。",
  },
  {
    stage: "阻滞期",
    matches: (scores) => scores.urgency >= 70 && scores.execution < 50,
    candidatePool: ["pojuzhe", "kadianpai", "wenduoshou"],
    reason: "问题已经明显，但执行链条还不够稳，属于典型的高紧迫低推进状态。",
  },
  {
    stage: "观察期",
    matches: (scores) => scores.maturity >= 40 && scores.maturity <= 60 && scores.execution < 50,
    candidatePool: ["guanchayuan", "guanwangpai", "genpaozhe"],
    reason: "你对 AI 已经有认知，但组织推进和实际落地条件还不足以真正起跑。",
  },
  {
    stage: "试跑期",
    matches: (scores) =>
      scores.maturity >= 60 &&
      scores.maturity <= 80 &&
      scores.execution >= 50 &&
      scores.execution <= 85,
    candidatePool: ["shipaopai", "dianhuozhe", "shenglipai", "guyongzhe"],
    reason: "你已经具备一定行动条件，最适合通过一个可控试点验证结果。",
  },
  {
    stage: "推进期",
    matches: (scores) => scores.maturity > 80 && scores.execution > 70 && scores.digitalBase >= 75,
    candidatePool: ["xianxingzhe", "shiganpai", "bujuzhe", "zengzhangpai", "chonggouzhe"],
    reason: "你已经具备比较强的执行和承接条件，下一步是按明确路径推进。",
  },
];

export const defaultStageDefinition: StageDefinition = {
  stage: "观察期",
  matches: () => true,
  candidatePool: ["guanchayuan", "guanwangpai", "genpaozhe"],
  reason: "当前状态还在从认知到行动的过渡期，需要先收敛第一步。",
};

export function scoreToLevel(score: number): AssessmentLevel {
  if (score >= 70) return "high";
  if (score >= 45) return "medium";
  return "low";
}
