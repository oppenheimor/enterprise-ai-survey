import { describe, expect, it } from "vitest";

import { calculateScoring } from "@/lib/survey/scoring";
import { leadFormSchema, surveyAnswersSchema } from "@/lib/validations/survey";
import { runAssessment } from "@/lib/survey/assessment/engine";

describe("survey validation and scoring", () => {
  it("accepts valid survey answers", () => {
    const result = surveyAnswersSchema.safeParse({
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

    expect(result.success).toBe(true);
  });

  it("rejects invalid lead payloads", () => {
    const result = leadFormSchema.safeParse({
      leadName: "A",
      leadPhone: "123",
      companyName: "",
      backupContact: "",
      leadFocus: "不存在的选项",
    });

    expect(result.success).toBe(false);
  });

  it("keeps scoring stable for the same answers", () => {
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

    const first = calculateScoring(answers);
    const second = calculateScoring(answers);

    expect(first.scoreTotal).toBe(second.scoreTotal);
    expect(first.scoreRating).toBe("良好");
    expect(first.topScene).toBe("客服效率");
    expect(first.leadPriority).toBe("B");
  });

  it("keeps local assessment stable for the same answers", () => {
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

    const first = runAssessment(answers);
    const second = runAssessment(answers);

    expect(first.readinessScore).toBe(second.readinessScore);
    expect(first.stage).toBe(second.stage);
    expect(first.persona.code).toBe(second.persona.code);
    expect(first.dimensions.map((item) => item.score)).toEqual(second.dimensions.map((item) => item.score));
  });
});
