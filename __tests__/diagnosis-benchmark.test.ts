import { NoObjectGeneratedError } from "ai";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { generateDiagnosis } from "@/lib/survey/diagnosis";
import { calculateScoring } from "@/lib/survey/scoring";
import { getOptionLabel } from "@/lib/survey/config";
import { surveyAnswersSchema, type SurveyAnswersInput } from "@/lib/validations/survey";

const { generateTextMock } = vi.hoisted(() => ({
  generateTextMock: vi.fn(),
}));

vi.mock("ai", async () => {
  const actual = await vi.importActual<typeof import("ai")>("ai");

  return {
    ...actual,
    generateText: generateTextMock,
  };
});

function buildInput() {
  const answers = surveyAnswersSchema.parse({
    q1Industry: "service",
    q2CompanySize: "11-50",
    q3BusinessType: "professional-service",
    q4RevenueModel: "custom-service",
    q5MainProcess: "customer-service",
    q6RepeatedWork: "very-high",
    q7CoreProblem: "speed",
    q8ImpactLevel: "high",
    q9AiUsage: "trial",
    q10ToolingLevel: "scattered",
    q11TeamAdoption: "guided",
    q12Budget: "5000-10000",
    q13Timeline: "1-3-months",
    q14Owner: "self",
    q15Attitude: "guided-trial",
    q16ExpectedResult: "where-to-start",
  });

  const scoring = calculateScoring(answers);
  const labels = Object.fromEntries(
    Object.entries(answers).map(([key, value]) => [key, getOptionLabel(key as keyof SurveyAnswersInput, value)]),
  ) as Record<keyof SurveyAnswersInput, string>;

  return {
    answers,
    scoring,
    labels,
    topSceneReason: scoring.topSceneReason,
  };
}

function buildDiagnosisFixture(input: ReturnType<typeof buildInput>) {
  return {
    reportTitle: "企业 AI 转型体检报告",
    reportSubtitle: "基于问卷答案与评分结果生成",
    executiveSummary: {
      verdict: "你已经具备从客服效率场景开始试点的条件，但需要先收窄边界。",
      rating: "良好" as const,
      score: input.scoring.scoreTotal,
      recommendedScene: input.scoring.topScene,
      keyFinding: "最值得优先处理的是“客户咨询 / 客服”中的“响应速度慢”。",
      currentBlocker: "当前最大阻力是工具和流程边界还没有完全收拢。",
    },
    dimensionReports: [
      {
        key: "transformationPotential" as const,
        name: "转型潜力",
        score: 76,
        level: "良好" as const,
        summary: "重复工作强、流程清晰，适合作为第一批 AI 改造对象。",
        evidence: [
          { label: "业务类型", value: input.labels.q3BusinessType },
          { label: "重复工作", value: input.labels.q6RepeatedWork },
        ],
        attention: "先收窄为单一客服子场景，不要同时铺多个方向。",
      },
      {
        key: "painUrgency" as const,
        name: "痛点迫切度",
        score: 81,
        level: "良好" as const,
        summary: "响应速度已经直接影响业务体验，优先级较高。",
        evidence: [
          { label: "最困扰问题", value: input.labels.q7CoreProblem },
          { label: "业务影响", value: input.labels.q8ImpactLevel },
        ],
        attention: "试点指标要直接对应响应速度和服务一致性。",
      },
      {
        key: "executionFeasibility" as const,
        name: "落地可行性",
        score: 67,
        level: "一般" as const,
        summary: "具备试点基础，但仍需要更明确的负责人与执行节奏。",
        evidence: [
          { label: "工具基础", value: input.labels.q10ToolingLevel },
          { label: "推进负责人", value: input.labels.q14Owner },
        ],
        attention: "不要一开始引入过重系统，先验证工作流闭环。",
      },
    ],
    visualAnalysis: {
      radar: [
        { label: "转型潜力", value: 76, note: "适合从高频重复任务切入。" },
        { label: "痛点迫切度", value: 81, note: "客服响应速度问题已比较紧迫。" },
        { label: "落地可行性", value: 67, note: "现阶段适合做轻量试点。" },
      ],
      priorityMatrix: [
        { label: "客服效率", impact: 84, feasibility: 72, recommendation: "优先试点" },
        { label: "流程标准化", impact: 69, feasibility: 74, recommendation: "作为支撑项推进" },
      ],
    },
    sceneDiagnosis: {
      primaryScene: "客服效率",
      whyThisScene: "客户咨询 / 客服环节重复工作多，且问题反馈链路清晰，最容易先验证价值。",
      notRecommendedYet: "暂不建议同时推进跨部门大系统改造，否则很难判断试点效果。",
      businessValue: ["缩短高频问题响应时间", "提升客服回答一致性"],
    },
    toolRecommendations: [
      {
        category: "知识库问答助手",
        fitReason: "适合覆盖高频 FAQ 和标准回复场景。",
        firstUseCase: "先整理 20-50 个高频问题做辅助回复。",
        valueArea: "减少重复解释、提高新人的响应一致性。",
        caution: "先保留人工复核，不要直接自动承诺高风险事项。",
      },
      {
        category: "工单归类助手",
        fitReason: "有助于售前、售后、投诉等咨询快速分流。",
        firstUseCase: "先做问题分类和跟进提醒。",
        valueArea: "让咨询更快进入正确处理路径。",
        caution: "高风险工单不要让 AI 自动闭环。",
      },
    ],
    actionRoadmap: [
      {
        phase: "0-2 周",
        goal: "收窄试点边界",
        actions: ["选一个高频客服子场景", "整理常见问题和人工话术"],
        validationSignal: "试点边界清晰，团队知道覆盖什么和不覆盖什么。",
      },
      {
        phase: "2-4 周",
        goal: "完成轻量试点",
        actions: ["让 AI 辅助生成标准回复", "记录人工复核中暴露的新问题"],
        validationSignal: "团队可以稳定复用试点流程。",
      },
      {
        phase: "1-3 个月",
        goal: "决定是否扩展",
        actions: ["复盘效果与阻力", "再决定是否扩到相邻环节"],
        validationSignal: "能看到稳定使用方式和明确业务变化。",
      },
    ],
    evidenceChain: [
      "行业与业务类型：专业服务 / 提供定制化服务。",
      "主要痛点位于客户咨询 / 客服，问题表现为响应速度慢。",
      "重复工作强度高，且对业务影响较大。",
    ],
    riskNotice: "当前主要风险是试点目标过大，导致结果不可验证。",
    confidenceNote: "本报告适合用于判断优先场景与下一步动作。",
    boundaryNote: "本报告用于初步体检，不等于完整实施方案或收益承诺。",
  };
}

describe("diagnosis benchmark", () => {
  beforeEach(() => {
    process.env.OPENAI_API_KEY = "test-key";
    process.env.OPENAI_BASE_URL = "https://api.xiaomimimo.com/v1";
    process.env.OPENAI_MODEL = "mimo-v2-pro";
  });

  afterEach(() => {
    generateTextMock.mockReset();
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_BASE_URL;
    delete process.env.OPENAI_MODEL;
  });

  it("matches benchmark expectations for a customer service scenario", async () => {
    const input = buildInput();
    const diagnosisFixture = buildDiagnosisFixture(input);

    generateTextMock.mockResolvedValue({
      output: diagnosisFixture,
    });

    const diagnosis = await generateDiagnosis({
      ...input,
    });

    expect(["良好", "优秀"]).toContain(input.scoring.scoreRating);
    expect(input.scoring.topScene).toBe("客服效率");
    expect(diagnosis.executiveSummary.recommendedScene).toBe("客服效率");
    expect(diagnosis.executiveSummary.keyFinding).toContain("客户咨询 / 客服");
    expect(diagnosis.sceneDiagnosis.whyThisScene).toContain("重复工作");
    expect(diagnosis.actionRoadmap[0]?.goal).toContain("收窄试点边界");
    expect(diagnosis.boundaryNote).not.toContain("ROI");
    expect(diagnosis.boundaryNote).not.toContain("benchmark");
    expect(diagnosis.toolRecommendations.length).toBeGreaterThanOrEqual(2);
  });

  it("repairs invalid snake_case diagnosis text into the canonical schema", async () => {
    const input = buildInput();
    const diagnosisFixture = buildDiagnosisFixture(input);
    const invalidDraft = {
      reportTitle: "企业AI转型健康体检报告",
      executiveSummary: "当前适合从客服效率切入。",
      dimensionReports: [
        { score: 61, level: "中等" },
        { score: 72, level: "较高" },
        { score: 66, level: "良好" },
      ],
      visualAnalysis: {
        radar: [{ value: 61 }, { value: 72 }, { value: 66 }],
      },
      toolRecommendations: [{}, {}],
      evidenceChain: [{ text: "证据 1" }],
    };

    generateTextMock
      .mockRejectedValueOnce(
        new NoObjectGeneratedError({
          message: "No object generated: response did not match schema.",
          text: JSON.stringify(invalidDraft),
          cause: Object.assign(new Error("type validation failed"), {
            value: invalidDraft,
          }),
          response: {
            id: "repair-response",
            timestamp: new Date(),
            modelId: "mimo-v2-pro",
          },
          usage: {
            inputTokens: 1,
            inputTokenDetails: {
              noCacheTokens: 1,
              cacheReadTokens: 0,
              cacheWriteTokens: 0,
            },
            outputTokens: 1,
            outputTokenDetails: {
              textTokens: 1,
              reasoningTokens: 0,
            },
            totalTokens: 2,
          },
          finishReason: "stop",
        }),
      )
      .mockResolvedValueOnce({
        output: diagnosisFixture,
      });

    const diagnosis = await generateDiagnosis(input);

    expect(generateTextMock).toHaveBeenCalledTimes(2);
    expect(diagnosis.reportTitle).toBe("企业 AI 转型体检报告");
    expect(diagnosis.executiveSummary.recommendedScene).toBe("客服效率");
    expect(diagnosis.dimensionReports).toHaveLength(3);
    expect(diagnosis.actionRoadmap).toHaveLength(3);
    expect(diagnosis.actionRoadmap[0]?.goal).toContain("收窄");
    expect(diagnosis.toolRecommendations).toHaveLength(2);
  });

  it("throws when model output cannot be repaired into the canonical schema", async () => {
    const input = buildInput();

    generateTextMock.mockRejectedValueOnce(new Error("could not parse"));

    await expect(generateDiagnosis(input)).rejects.toThrow("could not parse");
  });
});
