-- DropTable
DROP TABLE IF EXISTS "SurveyLead";

-- CreateTable
CREATE TABLE "SurveySubmission" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'direct',
    "campaign" TEXT NOT NULL DEFAULT 'organic',
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    "q1Industry" TEXT NOT NULL,
    "q2CompanySize" TEXT NOT NULL,
    "q3BusinessType" TEXT NOT NULL,
    "q4RevenueModel" TEXT NOT NULL,
    "q5MainProcess" TEXT NOT NULL,
    "q6RepeatedWork" TEXT NOT NULL,
    "q7CoreProblem" TEXT NOT NULL,
    "q8ImpactLevel" TEXT NOT NULL,
    "q9AiUsage" TEXT NOT NULL,
    "q10ToolingLevel" TEXT NOT NULL,
    "q11TeamAdoption" TEXT NOT NULL,
    "q12Budget" TEXT NOT NULL,
    "q13Timeline" TEXT NOT NULL,
    "q14Owner" TEXT NOT NULL,
    "q15Attitude" TEXT NOT NULL,
    "q16ExpectedResult" TEXT NOT NULL,
    "scoreTotal" INTEGER NOT NULL,
    "scoreRating" TEXT NOT NULL,
    "transformationPotential" INTEGER NOT NULL,
    "painUrgency" INTEGER NOT NULL,
    "executionFeasibility" INTEGER NOT NULL,
    "topScene" TEXT NOT NULL,
    "leadPriority" TEXT NOT NULL,
    "overallJudgement" TEXT NOT NULL,
    "coreProblemSummary" TEXT NOT NULL,
    "recommendedStartPoint" TEXT NOT NULL,
    "reasoningEvidence" JSONB NOT NULL,
    "currentBiggestBlocker" TEXT NOT NULL,
    "nextStepPlan" JSONB NOT NULL,
    "riskNotice" TEXT NOT NULL,
    "confidenceNote" TEXT NOT NULL,
    "strictBoundaryNote" TEXT NOT NULL,
    "leadName" TEXT NOT NULL,
    "leadPhone" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "backupContact" TEXT,
    "leadFocus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurveySubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SurveySubmission_createdAt_idx" ON "SurveySubmission"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "SurveySubmission_leadPriority_scoreRating_idx" ON "SurveySubmission"("leadPriority", "scoreRating");

-- CreateIndex
CREATE INDEX "SurveySubmission_topScene_idx" ON "SurveySubmission"("topScene");
