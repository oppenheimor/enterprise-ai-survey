import { z } from "zod";

import { diagnosisSchema, leadFormSchema, surveyAnswersSchema } from "@/lib/validations/survey";

const assessmentDimensionKeySchema = z.enum(["urgency", "digitalBase", "execution", "resource", "maturity", "fit"]);
const assessmentLevelSchema = z.enum(["high", "medium", "low"]);
const assessmentStageSchema = z.enum(["启蒙期", "观察期", "试跑期", "推进期", "阻滞期"]);

const previewTransportSchema = z.object({
  persona: z.object({
    code: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    image: z.string().min(1),
  }),
  stage: assessmentStageSchema,
  readinessScore: z.number().int().min(0).max(100),
  summary: z.string().min(1),
  dimensions: z
    .array(
      z.object({
        key: assessmentDimensionKeySchema,
        label: z.string().min(1),
        score: z.number().int().min(0).max(100),
        level: assessmentLevelSchema,
        summary: z.string().min(1),
      }),
    )
    .length(6),
  insights: z.object({
    strengths: z.array(z.string().min(1)).min(1),
    blockers: z.array(z.string().min(1)).min(1),
    nextActions: z.array(z.string().min(1)).min(1),
  }),
});

export const analysisTrackingSchema = z.object({
  source: z.string().default("direct"),
  campaign: z.string().default("organic"),
  durationSeconds: z.number().int().min(0),
});

export const unlockDetailedAnalysisSchema = z.object({
  answers: surveyAnswersSchema,
  preview: previewTransportSchema,
  lead: leadFormSchema,
  tracking: analysisTrackingSchema,
});

export const analysisStreamRequestSchema = z.object({
  answers: surveyAnswersSchema,
  preview: previewTransportSchema,
  diagnosis: diagnosisSchema,
  submissionId: z.string().min(1).optional(),
});

export type PreviewTransport = z.infer<typeof previewTransportSchema>;
export type UnlockDetailedAnalysisInput = z.infer<typeof unlockDetailedAnalysisSchema>;
export type AnalysisStreamRequestInput = z.infer<typeof analysisStreamRequestSchema>;
