import type { AssessmentResult, PreviewResult } from "@/lib/survey/assessment/types";

export function buildPreviewResult(assessment: AssessmentResult): PreviewResult {
  return {
    persona: {
      code: assessment.persona.code,
      name: assessment.persona.name,
      image: assessment.persona.image,
      description: assessment.persona.shortDescription,
    },
    stage: assessment.stage,
    readinessScore: assessment.readinessScore,
    summary: assessment.summary,
    dimensions: assessment.dimensions,
    insights: {
      strengths: assessment.strengths,
      blockers: assessment.blockers,
      nextActions: assessment.nextActions,
    },
  };
}
