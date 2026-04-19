import { getOptionLabel } from "@/lib/survey/config";
import { defaultStageDefinition, dimensionDefinitions, scoreToLevel, stageDefinitions } from "@/lib/survey/assessment/config";
import { personaMap } from "@/lib/survey/assessment/personas";
import type {
  AssessmentDimension,
  AssessmentDimensionKey,
  AssessmentResult,
  AssessmentRuleHit,
  AssessmentStage,
  PersonaCode,
} from "@/lib/survey/assessment/types";
import type { SurveyAnswersInput } from "@/lib/validations/survey";

function roundScore(value: number) {
  return Math.round(Math.max(0, Math.min(100, value)));
}

function getDimensionScores(answers: SurveyAnswersInput) {
  const dimensions = dimensionDefinitions.map<AssessmentDimension>((definition) => {
    const weightedScore = Object.entries(definition.weights).reduce((sum, [questionKey, weight]) => {
      const answer = answers[questionKey as keyof SurveyAnswersInput];
      const mapping = definition.mappings[questionKey as keyof SurveyAnswersInput];

      if (!weight || !mapping) {
        return sum;
      }

      return sum + (mapping[answer] ?? 0) * weight;
    }, 0);

    const score = roundScore(weightedScore);
    const level = scoreToLevel(score);

    return {
      key: definition.key,
      label: definition.label,
      score,
      level,
      summary: definition.summaries[level],
    };
  });

  return {
    dimensions,
    scoreMap: Object.fromEntries(dimensions.map((dimension) => [dimension.key, dimension.score])) as Record<
      AssessmentDimensionKey,
      number
    >,
  };
}

function getReadinessScore(scoreMap: Record<AssessmentDimensionKey, number>) {
  return roundScore(
    scoreMap.urgency * 0.2 +
      scoreMap.digitalBase * 0.2 +
      scoreMap.execution * 0.2 +
      scoreMap.resource * 0.15 +
      scoreMap.maturity * 0.15 +
      scoreMap.fit * 0.1,
  );
}

function resolveStage(scoreMap: Record<AssessmentDimensionKey, number>) {
  return stageDefinitions.find((definition) => definition.matches(scoreMap)) ?? defaultStageDefinition;
}

function axisScore(answers: SurveyAnswersInput, scoreMap: Record<AssessmentDimensionKey, number>) {
  return {
    urgencyAxis: scoreMap.urgency,
    baseAxis: scoreMap.digitalBase,
    driveAxis: scoreMap.execution,
    attitudeAxis:
      {
        "start-now": 95,
        "guided-trial": 75,
        "watch-first": 45,
        careful: 20,
      }[answers.q15Attitude] ?? 50,
  };
}

type PersonaRuleOutcome = {
  persona: PersonaCode;
  hits: AssessmentRuleHit[];
  priority: number;
};

function getStrongRuleOutcome(
  answers: SurveyAnswersInput,
  scoreMap: Record<AssessmentDimensionKey, number>,
): PersonaRuleOutcome | null {
  const hits: AssessmentRuleHit[] = [];

  if (scoreMap.urgency >= 80 && scoreMap.digitalBase >= 70 && scoreMap.execution >= 75) {
    if (scoreMap.maturity < 80) {
      return null;
    }

    hits.push({
      rule: "high-urgency-strong-base-strong-execution",
      reason: "紧迫度高、基础强、执行力强，符合先行者画像。",
    });
    return { persona: "xianxingzhe", hits, priority: 100 };
  }

  if (scoreMap.urgency >= 70 && scoreMap.digitalBase < 50 && scoreMap.execution >= 60) {
    hits.push({
      rule: "high-urgency-weak-base-strong-drive",
      reason: "问题已经很痛，但底座偏弱且推动意愿强，符合破局者画像。",
    });
    return { persona: "pojuzhe", hits, priority: 96 };
  }

  if (scoreMap.digitalBase < 40 && scoreMap.resource < 40) {
    hits.push({
      rule: "weak-base-low-resource",
      reason: "数字化基础和资源投入都偏弱，优先命中补课生。",
    });
    return { persona: "bukesheng", hits, priority: 95 };
  }

  if (scoreMap.execution < 40 && scoreMap.resource >= 60) {
    hits.push({
      rule: "low-execution-has-resource",
      reason: "资源不算少，但组织推进链条明显偏弱，符合卡点派。",
    });
    return { persona: "kadianpai", hits, priority: 94 };
  }

  if (scoreMap.execution >= 70 && scoreMap.resource < 60 && scoreMap.urgency >= 70) {
    hits.push({
      rule: "high-execution-medium-resource-high-urgency",
      reason: "执行力足够，但更适合用轻量试点快速起跑，符合试跑派。",
    });
    return { persona: "shipaopai", hits, priority: 93 };
  }

  if (scoreMap.fit >= 80 && answers.q5MainProcess === "growth-efficiency") {
    hits.push({
      rule: "high-fit-growth-scene",
      reason: "场景适配度高且主问题在获客/营销，增长派优先级上升。",
    });
    return { persona: "zengzhangpai", hits, priority: 92 };
  }

  return null;
}

function scoreCandidate(
  persona: PersonaCode,
  answers: SurveyAnswersInput,
  scoreMap: Record<AssessmentDimensionKey, number>,
) {
  const axis = axisScore(answers, scoreMap);

  const targets: Record<PersonaCode, { urgency: number; base: number; drive: number; attitude: number; bonus?: number }> = {
    xianxingzhe: { urgency: 90, base: 85, drive: 85, attitude: 90 },
    shipaopai: { urgency: 80, base: 60, drive: 75, attitude: 80, bonus: scoreMap.resource < 60 ? 6 : 0 },
    pojuzhe: { urgency: 90, base: 35, drive: 70, attitude: 85 },
    shiganpai: { urgency: 65, base: 70, drive: 80, attitude: 70 },
    bujuzhe: { urgency: 55, base: 85, drive: 75, attitude: 45, bonus: scoreMap.resource >= 70 ? 6 : 0 },
    guanchayuan: { urgency: 45, base: 55, drive: 40, attitude: 45 },
    guanwangpai: { urgency: 40, base: 35, drive: 35, attitude: 30 },
    kadianpai: { urgency: 80, base: 50, drive: 30, attitude: 55, bonus: scoreMap.resource >= 60 ? 8 : 0 },
    guyongzhe: { urgency: 70, base: 45, drive: 60, attitude: 85, bonus: answers.q14Owner === "self" ? 6 : 0 },
    shenglipai: { urgency: 70, base: 55, drive: 65, attitude: 70, bonus: scoreMap.resource < 60 ? 8 : 0 },
    bukesheng: { urgency: 45, base: 20, drive: 35, attitude: 35 },
    dianhuozhe: { urgency: 65, base: 55, drive: 65, attitude: 90 },
    wenduoshou: { urgency: 70, base: 60, drive: 35, attitude: 25 },
    genpaozhe: { urgency: 40, base: 40, drive: 40, attitude: 40 },
    zengzhangpai: { urgency: 75, base: 70, drive: 75, attitude: 85, bonus: answers.q5MainProcess === "growth-efficiency" ? 8 : 0 },
    chonggouzhe: { urgency: 75, base: 80, drive: 75, attitude: 80, bonus: scoreMap.resource >= 70 ? 6 : 0 },
  };

  const target = targets[persona];

  const closeness =
    100 -
    (Math.abs(axis.urgencyAxis - target.urgency) * 0.3 +
      Math.abs(axis.baseAxis - target.base) * 0.25 +
      Math.abs(axis.driveAxis - target.drive) * 0.25 +
      Math.abs(axis.attitudeAxis - target.attitude) * 0.2);

  return roundScore(closeness + (target.bonus ?? 0));
}

function resolvePersona(
  answers: SurveyAnswersInput,
  scoreMap: Record<AssessmentDimensionKey, number>,
  candidatePool: PersonaCode[],
) {
  const strongRule = getStrongRuleOutcome(answers, scoreMap);

  if (strongRule && candidatePool.includes(strongRule.persona)) {
    return {
      persona: strongRule.persona,
      hits: strongRule.hits,
      personaReason: strongRule.hits[0]?.reason ?? "命中角色强规则。",
    };
  }

  const ranked = candidatePool
    .map((persona) => ({
      persona,
      score: scoreCandidate(persona, answers, scoreMap),
    }))
    .sort((a, b) => b.score - a.score);

  const winner = ranked[0]!;

  return {
    persona: winner.persona,
    hits: [
      {
        rule: "candidate-pool-ranking",
        reason: `在当前阶段候选角色中，${personaMap[winner.persona].name} 与当前企业画像最接近。`,
      },
    ],
    personaReason: `当前阶段候选角色中，${personaMap[winner.persona].name} 与你的紧迫度、基础、执行力和态度组合最匹配。`,
  };
}

function buildStrengths(persona: PersonaCode, scoreMap: Record<AssessmentDimensionKey, number>) {
  const items = [...personaMap[persona].defaultStrengths];

  if (scoreMap.execution >= 70) {
    items.push("组织层面对试点推进具备较好的承接力");
  }

  if (scoreMap.fit >= 80) {
    items.push("业务场景和 AI 的切入点天然更容易对上");
  }

  return Array.from(new Set(items)).slice(0, 3);
}

function buildBlockers(persona: PersonaCode, scoreMap: Record<AssessmentDimensionKey, number>) {
  const items = [...personaMap[persona].defaultBlockers];

  if (scoreMap.digitalBase < 40) {
    items.push("底层工具和流程还比较碎，容易拖慢后续扩展");
  }

  if (scoreMap.resource < 45) {
    items.push("当前预算和时间窗口更适合轻量验证，不适合重投入");
  }

  if (scoreMap.execution < 45) {
    items.push("推动责任人和协同链条还需要先捋顺");
  }

  return Array.from(new Set(items)).slice(0, 3);
}

function buildNextActions(persona: PersonaCode, answers: SurveyAnswersInput, scoreMap: Record<AssessmentDimensionKey, number>) {
  const items = [...personaMap[persona].defaultActions];

  if (scoreMap.execution < 45) {
    items.unshift("先确定一个能真正推动试点的人，再谈方案范围。");
  }

  if (scoreMap.digitalBase < 40) {
    items.unshift("先把当前核心流程和工具底座梳理清楚，避免 AI 试点落在松散流程上。");
  }

  if (answers.q5MainProcess === "customer-service" || answers.q5MainProcess === "content") {
    items.push("优先选择高重复、低风险、能在短周期内验证效果的任务开始。");
  }

  return Array.from(new Set(items)).slice(0, 3);
}

function buildSummary(persona: PersonaCode, stage: AssessmentStage, scoreMap: Record<AssessmentDimensionKey, number>) {
  const personaName = personaMap[persona].name;
  const urgencyText = scoreMap.urgency >= 70 ? "当前问题已经比较明确" : "当前问题还在逐步收敛";
  const baseText = scoreMap.digitalBase >= 60 ? "你具备一定承接基础" : "你的底座还需要先补一补";

  return `你当前更接近${personaName}，处于${stage}。${urgencyText}，${baseText}，所以最适合先从一个边界清晰、结果可验证的场景开始。`;
}

export function runAssessment(answers: SurveyAnswersInput): AssessmentResult {
  const { dimensions, scoreMap } = getDimensionScores(answers);
  const readinessScore = getReadinessScore(scoreMap);
  const stageDefinition = resolveStage(scoreMap);
  const personaResult = resolvePersona(answers, scoreMap, stageDefinition.candidatePool);
  const persona = personaMap[personaResult.persona];

  const labels = Object.entries(answers).map(([key, value]) => getOptionLabel(key as keyof SurveyAnswersInput, value));

  return {
    answers,
    readinessScore,
    stage: stageDefinition.stage,
    persona,
    dimensions,
    strengths: buildStrengths(persona.code, scoreMap),
    blockers: buildBlockers(persona.code, scoreMap),
    nextActions: buildNextActions(persona.code, answers, scoreMap),
    summary: buildSummary(persona.code, stageDefinition.stage, scoreMap),
    dimensionEvidence: [
      `当前最耗时环节是${getOptionLabel("q5MainProcess", answers.q5MainProcess)}。`,
      `团队接受度为${getOptionLabel("q11TeamAdoption", answers.q11TeamAdoption)}。`,
      `当前 AI / 数字化使用情况是${getOptionLabel("q9AiUsage", answers.q9AiUsage)}。`,
      `最希望的结果是${getOptionLabel("q16ExpectedResult", answers.q16ExpectedResult)}。`,
      `当前答案标签覆盖 ${labels.length} 项结构化信息。`,
    ],
    stageReason: stageDefinition.reason,
    personaReason: personaResult.personaReason,
    triggeredRules: personaResult.hits,
  };
}
