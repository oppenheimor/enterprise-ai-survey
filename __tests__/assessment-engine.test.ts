import { describe, expect, it } from "vitest";

import { runAssessment } from "@/lib/survey/assessment/engine";
import { buildPreviewResult } from "@/lib/survey/assessment/preview";
import { surveyAnswersSchema } from "@/lib/validations/survey";

describe("assessment engine", () => {
  it("builds a stable six-dimension result and persona for a trial-ready company", () => {
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

    const result = runAssessment(answers);

    expect(result.dimensions).toHaveLength(6);
    expect(result.readinessScore).toBeGreaterThan(0);
    expect(result.stage).toBe("试跑期");
    expect(result.persona.name).toBe("试跑派");
    expect(result.triggeredRules[0]?.rule).toBe("candidate-pool-ranking");
  });

  it("promotes bu ke sheng when digital base and resource are both weak", () => {
    const answers = surveyAnswersSchema.parse({
      q1Industry: "other",
      q2CompanySize: "1-10",
      q3BusinessType: "supply-chain",
      q4RevenueModel: "project",
      q5MainProcess: "operations",
      q6RepeatedWork: "medium",
      q7CoreProblem: "process",
      q8ImpactLevel: "low",
      q9AiUsage: "none",
      q10ToolingLevel: "none",
      q11TeamAdoption: "watching",
      q12Budget: "lt-1000",
      q13Timeline: "unknown",
      q14Owner: "unknown",
      q15Attitude: "careful",
      q16ExpectedResult: "worth-it",
    });

    const result = runAssessment(answers);

    expect(result.stage).toBe("启蒙期");
    expect(result.persona.name).toBe("补课生");
    expect(result.triggeredRules[0]?.rule).toBe("weak-base-low-resource");
  });

  it("projects assessment result to preview shape", () => {
    const answers = surveyAnswersSchema.parse({
      q1Industry: "retail",
      q2CompanySize: "11-50",
      q3BusinessType: "retail-operation",
      q4RevenueModel: "channel",
      q5MainProcess: "growth-efficiency",
      q6RepeatedWork: "high",
      q7CoreProblem: "cost",
      q8ImpactLevel: "high",
      q9AiUsage: "multi",
      q10ToolingLevel: "complete",
      q11TeamAdoption: "high",
      q12Budget: "10000+",
      q13Timeline: "1-3-months",
      q14Owner: "management",
      q15Attitude: "start-now",
      q16ExpectedResult: "what-effect",
    });

    const preview = buildPreviewResult(runAssessment(answers));

    expect(preview.persona.name).toBeTruthy();
    expect(preview.dimensions).toHaveLength(6);
    expect(preview.insights.strengths.length).toBeGreaterThan(0);
  });
});
