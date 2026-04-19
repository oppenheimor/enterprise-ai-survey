import { describe, expect, it } from "vitest";

import { buildStreamingAnalysisMessages } from "@/lib/survey/analysis-prompt";
import { generateDeterministicDiagnosis } from "@/lib/survey/diagnosis";
import { calculateScoring } from "@/lib/survey/scoring";
import { buildPreviewResult } from "@/lib/survey/assessment/preview";
import { runAssessment } from "@/lib/survey/assessment/engine";
import { surveyAnswersSchema } from "@/lib/validations/survey";

describe("analysis prompt", () => {
  it("includes the question list, answer texts, preview result and output constraints", () => {
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

    const assessment = runAssessment(answers);
    const previewResult = buildPreviewResult(assessment);
    const preview = {
      persona: {
        code: previewResult.persona.code,
        name: previewResult.persona.name,
        description: previewResult.persona.description,
        image:
          typeof previewResult.persona.image === "string"
            ? previewResult.persona.image
            : previewResult.persona.image.src,
      },
      stage: previewResult.stage,
      readinessScore: previewResult.readinessScore,
      summary: previewResult.summary,
      dimensions: previewResult.dimensions,
      insights: previewResult.insights,
    };
    const scoring = calculateScoring(answers);
    const diagnosis = generateDeterministicDiagnosis({
      answers,
      scoring,
      labels: scoring.profileLabels,
      topSceneReason: scoring.topSceneReason,
    });

    const messages = buildStreamingAnalysisMessages({
      answers,
      preview,
      diagnosis,
    });

    expect(messages.user).toContain("一、完整问题列表");
    expect(messages.user).toContain("Q1 你所在的行业是？");
    expect(messages.user).toContain("Q16 你最希望从本次结果里得到什么？");
    expect(messages.user).toContain("用户答案值：customer-service");
    expect(messages.user).toContain("用户答案文本：客户咨询 / 客服");
    expect(messages.user).toContain(`角色：${preview.persona.name}`);
    expect(messages.user).toContain(`阶段：${preview.stage}`);
    expect(messages.user).toContain("不得改写本地评估的角色、阶段、分数");
    expect(messages.user).toContain("六维解读必须覆盖");
  });
});
