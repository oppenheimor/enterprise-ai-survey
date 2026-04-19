import { getOptionLabel, topSceneMap } from "@/lib/survey/config";
import type { ScoringResult, SurveyAnswersInput } from "@/lib/validations/survey";

type ScoreRuleMap = Record<string, number>;

const transformationBase: Record<"q1Industry" | "q3BusinessType" | "q4RevenueModel" | "q5MainProcess", ScoreRuleMap> =
  {
    q1Industry: {
      service: 7,
      manufacturing: 6,
      retail: 5,
      other: 4,
    },
    q3BusinessType: {
      "professional-service": 7,
      "project-service": 6,
      "retail-operation": 5,
      "supply-chain": 5,
    },
    q4RevenueModel: {
      "custom-service": 7,
      project: 6,
      product: 5,
      channel: 5,
    },
    q5MainProcess: {
      "growth-efficiency": 5,
      "customer-service": 7,
      delivery: 6,
      content: 6,
      operations: 5,
      other: 4,
    },
  };

const companySizeScores: ScoreRuleMap = {
  "1-10": 4,
  "11-50": 6,
  "51-200": 7,
  "201+": 5,
};

const repeatedWorkScores: Record<string, { transformation: number; pain: number }> = {
  "very-high": { transformation: 15, pain: 10 },
  high: { transformation: 10, pain: 7 },
  medium: { transformation: 6, pain: 4 },
  low: { transformation: 2, pain: 1 },
};

const coreProblemScores: Record<string, { pain: number; sceneWeight: string }> = {
  cost: { pain: 10, sceneWeight: "降本优化" },
  speed: { pain: 8, sceneWeight: "效率优化" },
  quality: { pain: 7, sceneWeight: "质量标准化" },
  process: { pain: 6, sceneWeight: "流程标准化" },
};

const impactScores: ScoreRuleMap = {
  critical: 10,
  high: 8,
  medium: 4,
  low: 1,
};

const feasibilityScores: Record<
  "q9AiUsage" | "q10ToolingLevel" | "q11TeamAdoption" | "q13Timeline" | "q15Attitude",
  ScoreRuleMap
> = {
  q9AiUsage: {
    multi: 10,
    trial: 8,
    heard: 5,
    none: 2,
  },
  q10ToolingLevel: {
    complete: 10,
    scattered: 8,
    manual: 5,
    none: 2,
  },
  q11TeamAdoption: {
    high: 10,
    guided: 8,
    watching: 5,
    low: 2,
  },
  q13Timeline: {
    "1-month": 10,
    "1-3-months": 8,
    "3-6-months": 5,
    unknown: 2,
  },
  q15Attitude: {
    "start-now": 10,
    "guided-trial": 8,
    "watch-first": 5,
    careful: 2,
  },
};

const budgetScores: ScoreRuleMap = {
  "lt-1000": 3,
  "1000-5000": 6,
  "5000-10000": 8,
  "10000+": 10,
};

const ownerScores: ScoreRuleMap = {
  self: 10,
  management: 7,
  "business-owner": 6,
  unknown: 2,
};

function normalize(raw: number, min: number, max: number, targetMax: number) {
  const safe = Math.max(min, Math.min(max, raw));
  const ratio = (safe - min) / (max - min);
  return Math.round(ratio * targetMax);
}

function getRating(scoreTotal: number): ScoringResult["scoreRating"] {
  if (scoreTotal >= 90) return "优秀";
  if (scoreTotal >= 70) return "良好";
  if (scoreTotal >= 50) return "一般";
  return "待提升";
}

export function calculateScoring(answers: SurveyAnswersInput): ScoringResult & {
  topSceneReason: string;
  profileLabels: Record<keyof SurveyAnswersInput, string>;
} {
  const transformationRaw =
    transformationBase.q1Industry[answers.q1Industry] +
    companySizeScores[answers.q2CompanySize] +
    transformationBase.q3BusinessType[answers.q3BusinessType] +
    transformationBase.q4RevenueModel[answers.q4RevenueModel] +
    transformationBase.q5MainProcess[answers.q5MainProcess] +
    repeatedWorkScores[answers.q6RepeatedWork].transformation;

  const painRaw =
    repeatedWorkScores[answers.q6RepeatedWork].pain +
    coreProblemScores[answers.q7CoreProblem].pain +
    impactScores[answers.q8ImpactLevel] +
    feasibilityScores.q13Timeline[answers.q13Timeline];

  const feasibilityRaw =
    companySizeScores[answers.q2CompanySize] +
    feasibilityScores.q9AiUsage[answers.q9AiUsage] +
    feasibilityScores.q10ToolingLevel[answers.q10ToolingLevel] +
    feasibilityScores.q11TeamAdoption[answers.q11TeamAdoption] +
    budgetScores[answers.q12Budget] +
    ownerScores[answers.q14Owner] +
    feasibilityScores.q15Attitude[answers.q15Attitude];

  const transformationPotential = normalize(transformationRaw, 24, 52, 40);
  const painUrgency = normalize(painRaw, 6, 38, 30);
  const executionFeasibility = normalize(feasibilityRaw, 18, 67, 30);
  const scoreTotal = transformationPotential + painUrgency + executionFeasibility;
  const scoreRating = getRating(scoreTotal);

  const baseTopScene = topSceneMap[answers.q5MainProcess] ?? "流程优化";
  const topSceneReason =
    answers.q7CoreProblem === "process"
      ? "当前核心阻力偏向流程标准化不足，建议在结果解释中抬高流程梳理权重。"
      : coreProblemScores[answers.q7CoreProblem].sceneWeight;

  const leadPriority: ScoringResult["leadPriority"] =
    scoreTotal >= 80 && answers.q15Attitude === "start-now"
      ? "A"
      : scoreTotal >= 65 && ["start-now", "guided-trial"].includes(answers.q15Attitude)
        ? "B"
        : scoreTotal >= 50 && ["guided-trial", "watch-first"].includes(answers.q15Attitude)
          ? "C"
          : "D";

  const profileLabels = Object.fromEntries(
    Object.entries(answers).map(([key, value]) => [key, getOptionLabel(key as keyof SurveyAnswersInput, value)]),
  ) as Record<keyof SurveyAnswersInput, string>;

  return {
    scoreTotal,
    scoreRating,
    scoreDimensions: {
      transformationPotential,
      painUrgency,
      executionFeasibility,
    },
    topScene: baseTopScene,
    leadPriority,
    topSceneReason,
    profileLabels,
  };
}
