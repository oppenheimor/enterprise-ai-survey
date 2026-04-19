import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import {
  extractJsonMiddleware,
  generateText,
  NoObjectGeneratedError,
  Output,
  wrapLanguageModel,
} from "ai";
import { z } from "zod";

import { diagnosisSchema, type DiagnosisResult, type ScoringResult, type SurveyAnswersInput } from "@/lib/validations/survey";

type StructuredInput = {
  answers: SurveyAnswersInput;
  scoring: ScoringResult;
  labels: Record<keyof SurveyAnswersInput, string>;
  topSceneReason: string;
};

type DimensionKey = "transformationPotential" | "painUrgency" | "executionFeasibility";

type DiagnosisReportDraft = z.input<typeof diagnosisSchema>;

type LegacyDiagnosisDraft = {
  report_title?: string;
  report_subtitle?: string;
  enterprise_overview?: {
    overall_score?: number;
    overall_rating?: DiagnosisResult["executiveSummary"]["rating"];
    summary_judgment?: string;
  };
  dimension_analysis?: Array<{
    dimension_name?: string;
    dimension_score?: number;
    dimension_rating?: DiagnosisResult["executiveSummary"]["rating"] | "中等" | "较高";
    analysis?: string;
  }>;
  scene_suggestion?: {
    primary_scene?: string;
    reason?: string;
    ai_tool_category_suggestions?: Array<{
      tool_category?: string;
      usage_method?: string;
      selection_criteria?: string;
      precautions?: string;
    }>;
  };
  action_roadmap?:
    | Record<
        string,
        {
          phase_name?: string;
          duration?: string;
          objective?: string;
          key_actions?: string[];
        }
      >
    | Array<{
        phase_name?: string;
        duration?: string;
        objective?: string;
        key_actions?: string[];
      }>;
  conclusion?: {
    final_advice?: string;
  };
};

const dimensionMeta: Record<DimensionKey, { name: string; max: number }> = {
  transformationPotential: { name: "转型潜力", max: 40 },
  painUrgency: { name: "痛点迫切度", max: 30 },
  executionFeasibility: { name: "落地可行性", max: 30 },
};

const outputSchemaName = "enterpriseAiDiagnosisReport";

const outputSchemaDescription = [
  "输出唯一允许的对象结构：企业 AI 转型体检报告。",
  "必须返回 camelCase JSON。",
  "禁止 snake_case、禁止额外字段、禁止 markdown、禁止代码块。",
  "actionRoadmap 必须是长度为 3 的数组，不能是对象。",
  "dimensionReports 必须是长度为 3 的数组，key 只能是 transformationPotential、painUrgency、executionFeasibility。",
].join("");

const outputSkeleton = JSON.stringify(
  {
    reportTitle: "企业 AI 转型体检报告",
    reportSubtitle: "一句简短副标题",
    executiveSummary: {
      verdict: "一句总判断",
      rating: "一般",
      score: 68,
      recommendedScene: "客服效率",
      keyFinding: "一句关键发现",
      currentBlocker: "一句当前阻力",
    },
    dimensionReports: [
      {
        key: "transformationPotential",
        name: "转型潜力",
        score: 70,
        level: "良好",
        summary: "一句维度总结",
        evidence: [
          { label: "证据标签", value: "证据值" },
          { label: "证据标签", value: "证据值" },
        ],
        attention: "一句注意事项",
      },
      {
        key: "painUrgency",
        name: "痛点迫切度",
        score: 74,
        level: "良好",
        summary: "一句维度总结",
        evidence: [
          { label: "证据标签", value: "证据值" },
          { label: "证据标签", value: "证据值" },
        ],
        attention: "一句注意事项",
      },
      {
        key: "executionFeasibility",
        name: "落地可行性",
        score: 62,
        level: "一般",
        summary: "一句维度总结",
        evidence: [
          { label: "证据标签", value: "证据值" },
          { label: "证据标签", value: "证据值" },
        ],
        attention: "一句注意事项",
      },
    ],
    visualAnalysis: {
      radar: [
        { label: "转型潜力", value: 70, note: "一句说明" },
        { label: "痛点迫切度", value: 74, note: "一句说明" },
        { label: "落地可行性", value: 62, note: "一句说明" },
      ],
      priorityMatrix: [
        { label: "客服效率", impact: 82, feasibility: 67, recommendation: "优先试点" },
        { label: "流程标准化", impact: 68, feasibility: 71, recommendation: "作为支撑项推进" },
      ],
    },
    sceneDiagnosis: {
      primaryScene: "客服效率",
      whyThisScene: "一句场景判断",
      notRecommendedYet: "一句暂不建议说明",
      businessValue: ["价值点一", "价值点二"],
    },
    toolRecommendations: [
      {
        category: "知识库问答助手",
        fitReason: "一句适配原因",
        firstUseCase: "一个最先使用场景",
        valueArea: "一个主要价值区域",
        caution: "一句注意事项",
      },
      {
        category: "工单归类助手",
        fitReason: "一句适配原因",
        firstUseCase: "一个最先使用场景",
        valueArea: "一个主要价值区域",
        caution: "一句注意事项",
      },
    ],
    actionRoadmap: [
      {
        phase: "0-2 周",
        goal: "一个阶段目标",
        actions: ["动作一", "动作二"],
        validationSignal: "一个验证信号",
      },
      {
        phase: "2-4 周",
        goal: "一个阶段目标",
        actions: ["动作一", "动作二"],
        validationSignal: "一个验证信号",
      },
      {
        phase: "1-3 个月",
        goal: "一个阶段目标",
        actions: ["动作一", "动作二"],
        validationSignal: "一个验证信号",
      },
    ],
    evidenceChain: ["证据链一句", "证据链二句", "证据链三句"],
    riskNotice: "一句风险提示",
    confidenceNote: "一句置信说明",
    boundaryNote: "一句边界说明",
  },
  null,
  2,
);

function getModelConfig() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY;
  const provider = process.env.LLM_PROVIDER?.toLowerCase();
  const baseURL = process.env.OPENAI_BASE_URL || process.env.LLM_BASE_URL;

  if (!apiKey) {
    return null;
  }

  if (provider && !["openai", "openai-compatible", "mimo", "xiaomi", "mimo-v2-pro"].includes(provider)) {
    return null;
  }

  return {
    apiKey,
    baseURL: baseURL ?? "https://api.xiaomimimo.com/v1",
    model:
      process.env.OPENAI_MODEL ||
      process.env.LLM_MODEL ||
      (baseURL?.includes("xiaomimimo.com") ? "mimo-v2-pro" : "gpt-4.1-mini"),
  };
}

function normalizeDimensionScore(score: number, max: number) {
  return Math.round((score / max) * 100);
}

function getLevel(score: number): DiagnosisResult["executiveSummary"]["rating"] {
  if (score >= 90) return "优秀";
  if (score >= 70) return "良好";
  if (score >= 50) return "一般";
  return "待提升";
}

function normalizeLegacyLevel(level: string | undefined, score: number): DiagnosisResult["executiveSummary"]["rating"] {
  if (level === "优秀" || level === "良好" || level === "一般" || level === "待提升") {
    return level;
  }

  if (level === "较高") {
    return "良好";
  }

  if (level === "中等") {
    return "一般";
  }

  return getLevel(score);
}

function buildSchemaRulesPrompt() {
  return [
    "你只能输出一个 JSON 对象，且字段名必须与指定 schema 完全一致。",
    "字段名必须使用 camelCase，例如 reportTitle、executiveSummary、dimensionReports、actionRoadmap。",
    "绝对禁止输出 snake_case，例如 report_title、enterprise_overview、dimension_analysis、action_roadmap。",
    "绝对禁止输出 markdown、解释文字、前后缀、代码块、注释。",
    "actionRoadmap 必须是数组，且固定 3 个阶段对象；每个阶段都必须有 phase、goal、actions、validationSignal。",
    "visualAnalysis.radar 必须正好 3 项，visualAnalysis.priorityMatrix 必须 2 到 4 项。",
    "toolRecommendations 必须 2 到 4 项；evidenceChain 必须 3 到 5 项。",
    "所有判断必须只基于输入问卷和评分，不允许编造外部事实。",
  ].join("\n");
}

function extractJsonObject(text: string) {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
    return null;
  }

  return text.slice(firstBrace, lastBrace + 1);
}

function quoteUnquotedPropertyKeys(text: string) {
  return text.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*:)/g, '$1"$2"$3');
}

function removeTrailingCommas(text: string) {
  return text.replace(/,\s*([}\]])/g, "$1");
}

function normalizeRoadmapObjectSyntax(text: string) {
  return text.replace(/},\s*\{\s*"phase_(\d+)"\s*:/g, ',"phase_$1":');
}

function sanitizeJsonText(text: string) {
  return removeTrailingCommas(quoteUnquotedPropertyKeys(normalizeRoadmapObjectSyntax(text.trim())));
}

function createDiagnosisModel(config: NonNullable<ReturnType<typeof getModelConfig>>) {
  const provider = createOpenAICompatible({
    name: "openai-compatible",
    apiKey: config.apiKey,
    baseURL: config.baseURL,
    supportsStructuredOutputs: true,
  });

  return wrapLanguageModel({
    model: provider(config.model),
    middleware: extractJsonMiddleware({
      transform: (text) => {
        const jsonText = extractJsonObject(text);
        return jsonText ? sanitizeJsonText(jsonText) : text;
      },
    }),
  });
}

function formatIssuesForRepair(error: unknown) {
  if (error instanceof z.ZodError) {
    return JSON.stringify(error.issues, null, 2);
  }

  if (NoObjectGeneratedError.isInstance(error)) {
    const cause = error.cause;
    if (cause instanceof z.ZodError) {
      return JSON.stringify(cause.issues, null, 2);
    }

    if (cause && typeof cause === "object" && "value" in cause) {
      return JSON.stringify(cause, null, 2);
    }

    if (cause instanceof Error) {
      return cause.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function extractInvalidDraft(error: unknown) {
  if (NoObjectGeneratedError.isInstance(error)) {
    const cause = error.cause;
    if (cause && typeof cause === "object" && "value" in cause) {
      return JSON.stringify(cause.value, null, 2);
    }

    if (error.text) {
      return error.text;
    }
  }

  if (error instanceof z.ZodError) {
    return JSON.stringify(error.issues, null, 2);
  }

  return null;
}

function buildStructuredPayload(input: StructuredInput) {
  return {
    enterprise_profile: {
      industry: input.labels.q1Industry,
      company_size: input.labels.q2CompanySize,
      business_type: input.labels.q3BusinessType,
      revenue_model: input.labels.q4RevenueModel,
    },
    questionnaire_answers: input.labels,
    scoring_result: {
      score_total: input.scoring.scoreTotal,
      score_rating: input.scoring.scoreRating,
      score_dimensions: input.scoring.scoreDimensions,
      top_scene: input.scoring.topScene,
      lead_priority: input.scoring.leadPriority,
    },
    generation_constraints: {
      no_external_facts: true,
      no_unverified_roi_numbers: true,
      no_industry_benchmark: true,
      no_vendor_brand_claims: true,
      keep_grounded: true,
      output_language: "zh-CN",
      report_style: "mobile_health_report",
    },
    scene_reason: input.topSceneReason,
  };
}

function buildPrimaryMessages(input: StructuredInput) {
  return [
    {
      role: "system" as const,
      content: [
        "你是企业 AI 转型体检报告分析器。",
        "你必须基于用户问卷答案、规则评分和约束条件，生成一份专业、系统、可视化友好的移动端 H5 体检报告。",
        "报告要像体检报告：先给总览判断，再解释各维度健康状况，再给出场景切入、AI 工具类型建议和阶段行动路线。",
        "你不得编造行业数据、市场数据、客户案例、ROI、收益百分比、落地周期承诺或具体商业工具品牌事实。",
        "AI 工具建议只能推荐工具类别、使用方式、选择标准和注意事项，不能假装已经验证某个品牌适合用户。",
        "所有证据必须能回溯到输入答案或评分结果。",
        buildSchemaRulesPrompt(),
      ].join("\n"),
    },
    {
      role: "user" as const,
      content: [
        "请基于以下问卷和评分直接输出最终合法 JSON。",
        "业务上下文：",
        JSON.stringify(buildStructuredPayload(input), null, 2),
        "输出骨架示例：",
        outputSkeleton,
      ].join("\n\n"),
    },
  ];
}

async function repairDiagnosisWithModel(
  model: ReturnType<typeof createDiagnosisModel>,
  input: StructuredInput,
  draft: string,
  error: unknown,
) {
  const { output } = await generateText({
    model,
    output: Output.object({
      schema: diagnosisSchema,
      name: outputSchemaName,
      description: outputSchemaDescription,
    }),
    // maxOutputTokens: 2800,
    temperature: 0,
    providerOptions: {
      openaiCompatible: {
        strictJsonSchema: true,
      },
    },
    messages: [
      {
        role: "system",
        content: [
          "你是企业 AI 转型体检报告 JSON 修复器。",
          "你会收到一份不合法的诊断草稿和对应校验错误。",
          "你的任务不是重新发散分析，而是保留草稿中合理的业务判断，并把它重写成唯一合法的 schema 对象。",
          "禁止输出解释、禁止 markdown、禁止省略字段、禁止新增 schema 之外的字段。",
          "如果草稿缺失字段，只能根据问卷上下文、评分结果、scene_reason 和草稿现有内容补齐。",
          buildSchemaRulesPrompt(),
        ].join("\n"),
      },
      {
        role: "user",
        content: [
          "问卷与评分上下文：",
          JSON.stringify(buildStructuredPayload(input), null, 2),
          "不合法草稿：",
          draft,
          "校验错误：",
          formatIssuesForRepair(error),
          "最终输出必须匹配以下骨架：",
          outputSkeleton,
        ].join("\n\n"),
      },
    ],
  });

  return diagnosisSchema.parse(output);
}

async function generateDiagnosisWithModel(input: StructuredInput): Promise<DiagnosisResult> {
  const config = getModelConfig();
  if (!config) {
    throw new Error("Diagnosis model is not configured.");
  }

  const model = createDiagnosisModel(config);

  try {
    const { output } = await generateText({
      model,
      output: Output.object({
        schema: diagnosisSchema,
        name: outputSchemaName,
        description: outputSchemaDescription,
      }),
      // maxOutputTokens: 2800,
      temperature: 0,
      providerOptions: {
        openaiCompatible: {
          strictJsonSchema: true,
        },
      },
      messages: buildPrimaryMessages(input),
    });

    return diagnosisSchema.parse(output);
  } catch (error) {
    const invalidDraft = extractInvalidDraft(error);
    if (!invalidDraft) {
      throw error;
    }

    return repairDiagnosisWithModel(model, input, invalidDraft, error);
  }
}

function buildToolRecommendations(input: StructuredInput): DiagnosisResult["toolRecommendations"] {
  const { scoring, answers } = input;
  const lightweightCaution =
    answers.q12Budget === "lt-1000" || answers.q11TeamAdoption === "low"
      ? "先用轻量试点验证，不建议一开始采购重型系统或多部门并行推进。"
      : "先限定一个业务小场景，避免工具范围失控。";

  const sceneTools: Record<string, DiagnosisResult["toolRecommendations"]> = {
    客服效率: [
      {
        category: "知识库问答 / 标准回复助手",
        fitReason: "你的高频压力集中在客户咨询或客服场景，且重复性工作明显。",
        firstUseCase: "先整理 20-50 个高频问题，让 AI 辅助生成标准回复和内部知识库答案。",
        valueArea: "减少重复解释、提升响应一致性、降低新人培训成本。",
        caution: lightweightCaution,
      },
      {
        category: "客服工单归类 / 跟进提醒",
        fitReason: "响应速度慢通常不只来自回答慢，也来自问题分流和跟进断点。",
        firstUseCase: "先把咨询按售前、售后、交付、投诉等类型归类，再设置人工跟进提醒。",
        valueArea: "让客户问题更快进入正确处理路径。",
        caution: "不要让 AI 单独处理高风险承诺，关键回复仍需人工确认。",
      },
    ],
    内容效率: [
      {
        category: "内容生成 / 改写助手",
        fitReason: "你的主要耗时环节集中在内容产出，适合先用 AI 提升初稿和改写效率。",
        firstUseCase: "把常见内容类型拆成标题、提纲、初稿、改写四步，让 AI 先承担初稿工作。",
        valueArea: "缩短内容启动时间，提升多版本输出速度。",
        caution: lightweightCaution,
      },
      {
        category: "素材整理 / 选题库助手",
        fitReason: "内容效率不只取决于写作速度，也取决于素材和选题是否可复用。",
        firstUseCase: "先把历史案例、客户问题和产品卖点整理成可检索素材库。",
        valueArea: "降低每次从零构思的成本。",
        caution: "涉及客户隐私和未公开信息时，需要先做脱敏处理。",
      },
    ],
    内部协同: [
      {
        category: "流程自动化 / 表单流转助手",
        fitReason: "你的问题更偏内部协同，适合先减少人工传递和重复录入。",
        firstUseCase: "从请假、报销、客户跟进、任务同步中选择一个高频流程做自动化试点。",
        valueArea: "减少漏传、漏填和重复确认。",
        caution: lightweightCaution,
      },
      {
        category: "会议纪要 / 任务分发助手",
        fitReason: "团队协同常见阻力是会后责任不清和任务沉淀不足。",
        firstUseCase: "先让 AI 生成会议纪要、待办和负责人清单，再由负责人确认。",
        valueArea: "提高跨角色协作透明度。",
        caution: "AI 输出任务清单后仍需要人工确认优先级。",
      },
    ],
  };

  return (
    sceneTools[scoring.topScene] ?? [
      {
        category: "流程梳理 / SOP 辅助生成",
        fitReason: "当前更需要先把业务步骤标准化，再叠加 AI 自动化。",
        firstUseCase: "选择一个最耗人力环节，把输入、处理步骤、输出和负责人写成简版 SOP。",
        valueArea: "让后续自动化有清晰边界，减少重复沟通。",
        caution: lightweightCaution,
      },
      {
        category: "数据整理 / 经营分析助手",
        fitReason: "如果基础数据分散，先用 AI 辅助整理和解释数据，比直接上复杂系统更稳。",
        firstUseCase: "先从客户咨询、订单、项目进度或售后记录中选一类数据做清洗和摘要。",
        valueArea: "帮助负责人更快看到业务瓶颈。",
        caution: "不要把不完整数据当成精确结论，只用于方向判断。",
      },
    ]
  );
}

function buildFallbackDiagnosis(input: StructuredInput): DiagnosisResult {
  const { answers, scoring, labels, topSceneReason } = input;
  const dimensions = (Object.keys(dimensionMeta) as DimensionKey[]).map((key) => {
    const rawScore = scoring.scoreDimensions[key];
    const normalized = normalizeDimensionScore(rawScore, dimensionMeta[key].max);
    const evidence =
      key === "transformationPotential"
        ? [
            { label: "业务类型", value: labels.q3BusinessType },
            { label: "重复工作", value: labels.q6RepeatedWork },
          ]
        : key === "painUrgency"
          ? [
              { label: "最困扰问题", value: labels.q7CoreProblem },
              { label: "业务影响", value: labels.q8ImpactLevel },
            ]
          : [
              { label: "工具基础", value: labels.q10ToolingLevel },
              { label: "推进负责人", value: labels.q14Owner },
            ];

    return {
      key,
      name: dimensionMeta[key].name,
      score: normalized,
      level: getLevel(normalized),
      summary:
        key === "transformationPotential"
          ? `你的 ${scoring.topScene} 场景具备一定 AI 改造空间，尤其来自重复工作和业务环节清晰度。`
          : key === "painUrgency"
            ? `当前问题已经对业务效率形成压力，优先处理能让用户更快感受到变化。`
            : `落地条件需要围绕工具基础、预算、团队接受度和负责人进一步收拢。`,
      evidence,
      attention:
        key === "executionFeasibility" && answers.q14Owner === "unknown"
          ? "负责人不明确会显著降低试点推进效率。"
          : "建议先用小范围试点验证，不要直接扩展到多场景。",
    };
  });

  const currentBlocker =
    answers.q14Owner === "unknown"
      ? "当前最大阻力是缺少明确负责人，容易让 AI 转型停留在讨论层。"
      : answers.q11TeamAdoption === "low"
        ? "当前最大阻力是团队接受度偏低，需要先降低试点复杂度。"
        : answers.q10ToolingLevel === "none" || answers.q10ToolingLevel === "manual"
          ? "当前最大阻力是工具和数据基础较弱，需要先把流程和信息入口收住。"
          : "当前最大阻力是试点边界需要收窄，否则容易目标过大。";

  return diagnosisSchema.parse({
    reportTitle: "企业 AI 转型体检报告",
    reportSubtitle: "基于 16 道问卷、规则评分与受限 AI 分析生成",
    executiveSummary: {
      verdict:
        scoring.scoreRating === "待提升"
          ? `你现在不适合直接全面启动 AI 转型，更适合先补齐 ${scoring.topScene} 的流程和工具基础。`
          : `你已经具备从 ${scoring.topScene} 做小范围 AI 试点的条件，但不建议一开始全面铺开。`,
      rating: scoring.scoreRating,
      score: scoring.scoreTotal,
      recommendedScene: scoring.topScene,
      keyFinding: `最值得优先处理的是“${labels.q5MainProcess}”中的“${labels.q7CoreProblem}”。`,
      currentBlocker,
    },
    dimensionReports: dimensions,
    visualAnalysis: {
      radar: dimensions.map((dimension) => ({
        label: dimension.name,
        value: dimension.score,
        note: dimension.summary,
      })),
      priorityMatrix: [
        {
          label: scoring.topScene,
          impact: dimensions[1].score,
          feasibility: dimensions[2].score,
          recommendation: "优先小范围试点",
        },
        {
          label: "流程基础",
          impact: answers.q7CoreProblem === "process" ? 86 : 62,
          feasibility: answers.q10ToolingLevel === "complete" ? 74 : 52,
          recommendation: answers.q7CoreProblem === "process" ? "先做标准化" : "作为支撑项推进",
        },
      ],
    },
    sceneDiagnosis: {
      primaryScene: scoring.topScene,
      whyThisScene: `你选择的最耗人力环节是“${labels.q5MainProcess}”，重复工作强度为“${labels.q6RepeatedWork}”，因此 ${scoring.topScene} 是最容易先验证价值的切口。`,
      notRecommendedYet:
        answers.q12Budget === "lt-1000" || answers.q11TeamAdoption === "low"
          ? "暂不建议一开始做跨部门大系统改造，成本和组织阻力都偏高。"
          : "暂不建议同时推进多个 AI 场景，否则很难判断哪个动作真正有效。",
      businessValue: [
        `减少“${labels.q5MainProcess}”中的重复沟通和人工整理。`,
        `让“${labels.q7CoreProblem}”从主观感受变成可验证的流程指标。`,
      ],
    },
    toolRecommendations: buildToolRecommendations(input),
    actionRoadmap: [
      {
        phase: "0-2 周",
        goal: "收窄试点边界",
        actions: [
          `只选择 ${scoring.topScene} 中一个高频子场景。`,
          "整理现有流程、常见问题、输入输出和负责人。",
        ],
        validationSignal: "能清楚说出试点覆盖什么、不覆盖什么。",
      },
      {
        phase: "2-4 周",
        goal: "完成轻量试点",
        actions: [
          "用一个 AI 工具类型辅助处理重复任务。",
          "保留人工复核，记录节省的步骤和新增问题。",
        ],
        validationSignal: "团队能稳定复用，不需要每次重新解释流程。",
      },
      {
        phase: "1-3 个月",
        goal: "决定是否扩展",
        actions: [
          "复盘试点效果、阻力和可复制条件。",
          "再决定是否扩展到相邻业务环节。",
        ],
        validationSignal: "试点有明确负责人、稳定使用方式和可观察业务变化。",
      },
    ],
    evidenceChain: [
      `行业与业务类型：${labels.q1Industry} / ${labels.q3BusinessType}。`,
      `主要痛点：${labels.q5MainProcess}，问题表现为 ${labels.q7CoreProblem}。`,
      `重复工作与影响：${labels.q6RepeatedWork}，${labels.q8ImpactLevel}。`,
      `推进条件：${labels.q10ToolingLevel}，${labels.q11TeamAdoption}，${labels.q14Owner}。`,
    ],
    riskNotice:
      answers.q12Budget === "lt-1000" || answers.q11TeamAdoption === "low"
        ? "当前预算或团队接受度偏谨慎，建议把试点做轻，不要先买复杂系统。"
        : "当前主要风险不是工具不足，而是试点目标过大导致结果不可验证。",
    confidenceNote: "本报告基于问卷答案、规则评分和受限 AI 分析生成，适合判断优先方向和下一步动作。",
    boundaryNote: `本报告是初步体检，不是完整实施方案、收益承诺或行业对标结论。${topSceneReason}`,
  });
}

export function generateDeterministicDiagnosis(input: StructuredInput): DiagnosisResult {
  return buildFallbackDiagnosis(input);
}

export async function generateDiagnosis(input: StructuredInput): Promise<DiagnosisResult> {
  return generateDiagnosisWithModel(input);
}
