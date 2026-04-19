import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText } from "ai";

import { runAssessment } from "@/lib/survey/assessment/engine";
import { buildPreviewResult } from "@/lib/survey/assessment/preview";
import type { AssessmentResult } from "@/lib/survey/assessment/types";
import { buildStreamingAnalysisMessages } from "@/lib/survey/analysis-prompt";
import { generateDeterministicDiagnosis } from "@/lib/survey/diagnosis";
import { calculateScoring } from "@/lib/survey/scoring";
import type { PreviewTransport } from "@/lib/validations/detail-analysis";
import type { DiagnosisResult, SurveyAnswersInput } from "@/lib/validations/survey";

export type DetailAnalysisBundle = {
  assessment: AssessmentResult;
  preview: PreviewTransport;
  diagnosis: DiagnosisResult;
  scoring: ReturnType<typeof calculateScoring>;
};

function getModelConfig() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY || process.env.API_KEY;
  const provider = process.env.LLM_PROVIDER?.toLowerCase();
  const baseURL = process.env.OPENAI_BASE_URL || process.env.LLM_BASE_URL || process.env.BASE_URL;

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

function toPreviewTransport(preview: ReturnType<typeof buildPreviewResult>): PreviewTransport {
  return {
    persona: {
      code: preview.persona.code,
      name: preview.persona.name,
      description: preview.persona.description,
      image: typeof preview.persona.image === "string" ? preview.persona.image : preview.persona.image.src,
    },
    stage: preview.stage,
    readinessScore: preview.readinessScore,
    summary: preview.summary,
    dimensions: preview.dimensions,
    insights: preview.insights,
  };
}

export async function buildDetailAnalysisBundle(answers: SurveyAnswersInput): Promise<DetailAnalysisBundle> {
  const assessment = runAssessment(answers);
  const preview = toPreviewTransport(buildPreviewResult(assessment));
  const scoring = calculateScoring(answers);
  const diagnosis = generateDeterministicDiagnosis({
    answers,
    scoring,
    labels: scoring.profileLabels,
    topSceneReason: scoring.topSceneReason,
  });

  return {
    assessment,
    preview,
    diagnosis,
    scoring,
  };
}

export function streamDetailedAnalysisNarrative(input: {
  answers: SurveyAnswersInput;
  preview: PreviewTransport;
  diagnosis: DiagnosisResult;
}) {
  const config = getModelConfig();

  if (!config) {
    throw new Error("AI analysis model is not configured.");
  }

  const messages = buildStreamingAnalysisMessages(input);

  const provider = createOpenAICompatible({
    name: "openai-compatible",
    apiKey: config.apiKey,
    baseURL: config.baseURL,
  });

  return streamText({
    model: provider(config.model),
    temperature: 0.6,
    maxOutputTokens: 1800,
    messages: [
      {
        role: "system",
        content: messages.system,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: messages.user,
          },
        ],
      },
    ],
  });
}
