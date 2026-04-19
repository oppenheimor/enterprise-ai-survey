"use server";

import { revalidatePath } from "next/cache";

import { buildDetailAnalysisBundle } from "@/lib/survey/detail-analysis";
import { generateDiagnosis } from "@/lib/survey/diagnosis";
import { runAssessment } from "@/lib/survey/assessment/engine";
import { buildPreviewResult } from "@/lib/survey/assessment/preview";
import { createSurveySubmission } from "@/lib/survey/repository";
import { unlockDetailedAnalysisSchema } from "@/lib/validations/detail-analysis";
import { submissionPayloadSchema, surveyAnswersSchema } from "@/lib/validations/survey";

export async function runLocalAssessmentPreview(rawAnswers: unknown) {
  const answers = surveyAnswersSchema.parse(rawAnswers);
  const assessment = runAssessment(answers);
  const preview = buildPreviewResult(assessment);

  return {
    answers,
    assessment,
    preview,
  };
}

// 未来详细分析继续复用模型逻辑；当前主流程不调用它。
export async function generateDetailedDiagnosis(rawAnswers: unknown) {
  const answers = surveyAnswersSchema.parse(rawAnswers);
  const { calculateScoring } = await import("@/lib/survey/scoring");
  const scoring = calculateScoring(answers);

  return generateDiagnosis({
    answers,
    scoring,
    labels: scoring.profileLabels,
    topSceneReason: scoring.topSceneReason,
  });
}

export async function submitSurveyLead(rawInput: unknown) {
  const payload = submissionPayloadSchema.parse(rawInput);

  const submission = await createSurveySubmission(payload);

  revalidatePath("/dashboard");

  return {
    id: submission.id,
    companyName: submission.companyName,
  };
}

export async function unlockDetailedAnalysis(rawInput: unknown) {
  const payload = unlockDetailedAnalysisSchema.parse(rawInput);
  const detail = await buildDetailAnalysisBundle(payload.answers);

  const submission = await createSurveySubmission({
    answers: payload.answers,
    scoring: detail.scoring,
    diagnosis: detail.diagnosis,
    lead: payload.lead,
    tracking: payload.tracking,
  });

  revalidatePath("/dashboard");

  return {
    submissionId: submission.id,
    companyName: submission.companyName,
    preview: detail.preview,
    diagnosis: detail.diagnosis,
  };
}
