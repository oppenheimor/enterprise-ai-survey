import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { SurveyApp } from "@/components/survey/survey-app";
import { surveyQuestions } from "@/lib/survey/config";

const { runLocalAssessmentPreviewMock, unlockDetailedAnalysisMock, fetchMock } = vi.hoisted(() => ({
  runLocalAssessmentPreviewMock: vi.fn(),
  unlockDetailedAnalysisMock: vi.fn(),
  fetchMock: vi.fn(),
}));

vi.mock("@/app/actions", () => ({
  runLocalAssessmentPreview: runLocalAssessmentPreviewMock,
  unlockDetailedAnalysis: unlockDetailedAnalysisMock,
  generateDetailedDiagnosis: vi.fn(),
  submitSurveyLead: vi.fn(),
}));

const previewFixture = {
  persona: {
    code: "shipaopai",
    name: "试跑派",
    image: {
      src: "/mock-persona.png",
      height: 800,
      width: 800,
      blurDataURL: "",
    },
    description: "适合先找一个场景试点，边跑边验证。",
  },
  stage: "试跑期" as const,
  readinessScore: 72,
  summary: "你已经具备一定行动意愿和局部基础，适合先从一个高重复场景试点。",
  dimensions: [
    { key: "urgency" as const, label: "转型紧迫度", score: 78, level: "high" as const, summary: "痛点已比较明确。" },
    { key: "digitalBase" as const, label: "数字化基础", score: 62, level: "medium" as const, summary: "底座能接住第一批试点。" },
    { key: "execution" as const, label: "组织执行力", score: 80, level: "high" as const, summary: "推动链条相对清晰。" },
    { key: "resource" as const, label: "资源投入力", score: 58, level: "medium" as const, summary: "适合从 MVP 开始。" },
    { key: "maturity" as const, label: "落地成熟度", score: 67, level: "medium" as const, summary: "处在试跑边缘。" },
    { key: "fit" as const, label: "场景适配度", score: 84, level: "high" as const, summary: "业务与 AI 切口较匹配。" },
  ],
  insights: {
    strengths: ["执行力强", "痛点明确"],
    blockers: ["预算较谨慎"],
    nextActions: ["先挑一个高频客服场景试点"],
  },
};

const answersFixture = {
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
};

describe("SurveyApp detail analysis flow", () => {
  beforeEach(() => {
    runLocalAssessmentPreviewMock.mockReset();
    unlockDetailedAnalysisMock.mockReset();
    fetchMock.mockReset();
    global.fetch = fetchMock as typeof fetch;
  });

  it("shows the AI 全面分析 entry after preview generation", async () => {
    runLocalAssessmentPreviewMock.mockResolvedValue({
      answers: answersFixture,
      preview: previewFixture,
    });

    render(<SurveyApp campaign="organic" source="direct" />);

    fireEvent.click(screen.getByRole("button", { name: "立即开始评测" }));

    for (let index = 0; index < surveyQuestions.length; index += 1) {
      const optionLabel = surveyQuestions[index]?.options[0]?.label;
      if (!optionLabel) {
        throw new Error(`No option label found for question ${index + 1}`);
      }
      fireEvent.click(screen.getByRole("button", { name: optionLabel }));

      const nextButtonName = index === 15 ? "查看结果预览" : "下一题";
      fireEvent.click(screen.getByRole("button", { name: new RegExp(nextButtonName) }));
    }

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "AI 全面分析" })).toBeInTheDocument();
    });
  });
});
