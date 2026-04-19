import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { DiagnosisResult, LeadFormInput, ScoringResult, SurveyAnswersInput } from "@/lib/validations/survey";

type SubmissionListItem = {
  id: string;
  companyName: string;
  leadName: string;
  leadPhone: string;
  scoreTotal: number;
  scoreRating: string;
  topScene: string;
  leadPriority: string;
  createdAt: Date;
};

const surveySubmission = (
  prisma as unknown as {
    surveySubmission: {
      create: (args: { data: Record<string, unknown> }) => Promise<{ id: string; companyName: string }>;
      count: (args?: Record<string, unknown>) => Promise<number>;
      aggregate: (args: Record<string, unknown>) => Promise<{ _avg: { scoreTotal: number | null } }>;
      findMany: (args: Record<string, unknown>) => Promise<SubmissionListItem[]>;
      groupBy: (args: Record<string, unknown>) => Promise<
        Array<{ scoreRating?: string; topScene?: string; leadPriority?: string; _count: { _all: number } }>
      >;
    };
  }
).surveySubmission;

export async function createSurveySubmission(input: {
  answers: SurveyAnswersInput;
  scoring: ScoringResult;
  diagnosis: DiagnosisResult;
  lead: LeadFormInput;
  tracking: {
    source: string;
    campaign: string;
    durationSeconds: number;
  };
}) {
  return surveySubmission.create({
    data: {
      source: input.tracking.source,
      campaign: input.tracking.campaign,
      durationSeconds: input.tracking.durationSeconds,
      q1Industry: input.answers.q1Industry,
      q2CompanySize: input.answers.q2CompanySize,
      q3BusinessType: input.answers.q3BusinessType,
      q4RevenueModel: input.answers.q4RevenueModel,
      q5MainProcess: input.answers.q5MainProcess,
      q6RepeatedWork: input.answers.q6RepeatedWork,
      q7CoreProblem: input.answers.q7CoreProblem,
      q8ImpactLevel: input.answers.q8ImpactLevel,
      q9AiUsage: input.answers.q9AiUsage,
      q10ToolingLevel: input.answers.q10ToolingLevel,
      q11TeamAdoption: input.answers.q11TeamAdoption,
      q12Budget: input.answers.q12Budget,
      q13Timeline: input.answers.q13Timeline,
      q14Owner: input.answers.q14Owner,
      q15Attitude: input.answers.q15Attitude,
      q16ExpectedResult: input.answers.q16ExpectedResult,
      scoreTotal: input.scoring.scoreTotal,
      scoreRating: input.scoring.scoreRating,
      transformationPotential: input.scoring.scoreDimensions.transformationPotential,
      painUrgency: input.scoring.scoreDimensions.painUrgency,
      executionFeasibility: input.scoring.scoreDimensions.executionFeasibility,
      topScene: input.scoring.topScene,
      leadPriority: input.scoring.leadPriority,
      diagnosis: input.diagnosis as Prisma.InputJsonValue,
      leadName: input.lead.leadName,
      leadPhone: input.lead.leadPhone,
      companyName: input.lead.companyName,
      backupContact: null,
      leadFocus: "",
    },
  });
}

export async function getDashboardSummary() {
  const [submissionCount, avgScoreResult, highPriorityCount, latestSubmissions] = await Promise.all([
    surveySubmission.count(),
    surveySubmission.aggregate({
      _avg: {
        scoreTotal: true,
      },
    }),
    surveySubmission.count({
      where: {
        leadPriority: {
          in: ["A", "B"],
        },
      },
    }),
    surveySubmission.findMany({
      take: 24,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        companyName: true,
        leadName: true,
        leadPhone: true,
        scoreTotal: true,
        scoreRating: true,
        topScene: true,
        leadPriority: true,
        createdAt: true,
      },
    }),
  ]);

  const byRating = await surveySubmission.groupBy({
    by: ["scoreRating"],
    _count: {
      _all: true,
    },
  });

  const byScene = await surveySubmission.groupBy({
    by: ["topScene"],
    _count: {
      _all: true,
    },
  });

  const byPriority = await surveySubmission.groupBy({
    by: ["leadPriority"],
    _count: {
      _all: true,
    },
  });

  return {
    totals: {
      submissionCount,
      averageScore: Math.round(avgScoreResult._avg.scoreTotal ?? 0),
      highPriorityCount,
    },
    byRating: byRating.map((item: { scoreRating?: string; _count: { _all: number } }) => ({
      label: item.scoreRating ?? "未知",
      count: item._count._all,
    })),
    byScene: byScene.map((item: { topScene?: string; _count: { _all: number } }) => ({
      label: item.topScene ?? "未知",
      count: item._count._all,
    })),
    byPriority: byPriority.map((item: { leadPriority?: string; _count: { _all: number } }) => ({
      label: item.leadPriority ?? "未知",
      count: item._count._all,
    })),
    latestSubmissions,
  };
}
