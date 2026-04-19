import { z } from "zod";

const phoneRegex = /^(?:\+?86)?1\d{10}$/;

export const answerValueSchema = z.string().min(1);

export const surveyAnswersSchema = z.object({
  q1Industry: answerValueSchema,
  q2CompanySize: answerValueSchema,
  q3BusinessType: answerValueSchema,
  q4RevenueModel: answerValueSchema,
  q5MainProcess: answerValueSchema,
  q6RepeatedWork: answerValueSchema,
  q7CoreProblem: answerValueSchema,
  q8ImpactLevel: answerValueSchema,
  q9AiUsage: answerValueSchema,
  q10ToolingLevel: answerValueSchema,
  q11TeamAdoption: answerValueSchema,
  q12Budget: answerValueSchema,
  q13Timeline: answerValueSchema,
  q14Owner: answerValueSchema,
  q15Attitude: answerValueSchema,
  q16ExpectedResult: answerValueSchema,
});

export const leadFormSchema = z.object({
  leadName: z.string().trim().min(2, "请输入姓名"),
  leadPhone: z.string().trim().regex(phoneRegex, "请输入有效手机号"),
  companyName: z.string().trim().min(2, "请输入企业名称"),
});

export const scoringResultSchema = z.object({
  scoreTotal: z.number().int().min(0).max(100),
  scoreRating: z.enum(["优秀", "良好", "一般", "待提升"]),
  scoreDimensions: z.object({
    transformationPotential: z.number().int().min(0).max(40),
    painUrgency: z.number().int().min(0).max(30),
    executionFeasibility: z.number().int().min(0).max(30),
  }),
  topScene: z.string().min(1),
  leadPriority: z.enum(["A", "B", "C", "D"]),
});

const reportLevelSchema = z.enum(["优秀", "良好", "一般", "待提升"]);

const reportEvidenceSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const dimensionReportSchema = z.object({
  key: z.enum(["transformationPotential", "painUrgency", "executionFeasibility"]),
  name: z.string().min(1),
  score: z.number().int().min(0).max(100),
  level: reportLevelSchema,
  summary: z.string().min(1),
  evidence: z.array(reportEvidenceSchema).min(2).max(4),
  attention: z.string().min(1),
});

const chartItemSchema = z.object({
  label: z.string().min(1),
  value: z.number().int().min(0).max(100),
  note: z.string().min(1),
});

const toolRecommendationSchema = z.object({
  category: z.string().min(1),
  fitReason: z.string().min(1),
  firstUseCase: z.string().min(1),
  valueArea: z.string().min(1),
  caution: z.string().min(1),
});

const roadmapStepSchema = z.object({
  phase: z.string().min(1),
  goal: z.string().min(1),
  actions: z.array(z.string().min(1)).min(2).max(4),
  validationSignal: z.string().min(1),
});

export const diagnosisSchema = z.object({
  reportTitle: z.string().min(1),
  reportSubtitle: z.string().min(1),
  executiveSummary: z.object({
    verdict: z.string().min(1),
    rating: reportLevelSchema,
    score: z.number().int().min(0).max(100),
    recommendedScene: z.string().min(1),
    keyFinding: z.string().min(1),
    currentBlocker: z.string().min(1),
  }),
  dimensionReports: z.array(dimensionReportSchema).length(3),
  visualAnalysis: z.object({
    radar: z.array(chartItemSchema).length(3),
    priorityMatrix: z.array(
      z.object({
        label: z.string().min(1),
        impact: z.number().int().min(0).max(100),
        feasibility: z.number().int().min(0).max(100),
        recommendation: z.string().min(1),
      }),
    ).min(2).max(4),
  }),
  sceneDiagnosis: z.object({
    primaryScene: z.string().min(1),
    whyThisScene: z.string().min(1),
    notRecommendedYet: z.string().min(1),
    businessValue: z.array(z.string().min(1)).min(2).max(4),
  }),
  toolRecommendations: z.array(toolRecommendationSchema).min(2).max(4),
  actionRoadmap: z.array(roadmapStepSchema).length(3),
  evidenceChain: z.array(z.string().min(1)).min(3).max(5),
  riskNotice: z.string().min(1),
  confidenceNote: z.string().min(1),
  boundaryNote: z.string().min(1),
});

export const submissionPayloadSchema = z.object({
  answers: surveyAnswersSchema,
  scoring: scoringResultSchema,
  diagnosis: diagnosisSchema,
  lead: leadFormSchema,
  tracking: z.object({
    source: z.string().default("direct"),
    campaign: z.string().default("organic"),
    durationSeconds: z.number().int().min(0),
  }),
});

export type SurveyAnswersInput = z.infer<typeof surveyAnswersSchema>;
export type LeadFormInput = z.infer<typeof leadFormSchema>;
export type ScoringResult = z.infer<typeof scoringResultSchema>;
export type DiagnosisResult = z.infer<typeof diagnosisSchema>;
export type SubmissionPayload = z.infer<typeof submissionPayloadSchema>;
