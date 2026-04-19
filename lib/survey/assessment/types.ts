import type { StaticImageData } from "next/image";

import type { SurveyAnswersInput } from "@/lib/validations/survey";

export type AssessmentDimensionKey =
  | "urgency"
  | "digitalBase"
  | "execution"
  | "resource"
  | "maturity"
  | "fit";

export type AssessmentLevel = "high" | "medium" | "low";

export type AssessmentStage = "启蒙期" | "观察期" | "试跑期" | "推进期" | "阻滞期";

export type PersonaCode =
  | "xianxingzhe"
  | "shipaopai"
  | "pojuzhe"
  | "shiganpai"
  | "bujuzhe"
  | "guanchayuan"
  | "guanwangpai"
  | "kadianpai"
  | "guyongzhe"
  | "shenglipai"
  | "bukesheng"
  | "dianhuozhe"
  | "wenduoshou"
  | "genpaozhe"
  | "zengzhangpai"
  | "chonggouzhe";

export type AssessmentDimension = {
  key: AssessmentDimensionKey;
  label: string;
  score: number;
  level: AssessmentLevel;
  summary: string;
};

export type AssessmentRuleHit = {
  rule: string;
  reason: string;
};

export type PersonaMeta = {
  code: PersonaCode;
  slug: string;
  name: string;
  image: StaticImageData;
  shortDescription: string;
  defaultStrengths: string[];
  defaultBlockers: string[];
  defaultActions: string[];
};

export type AssessmentResult = {
  answers: SurveyAnswersInput;
  readinessScore: number;
  stage: AssessmentStage;
  persona: PersonaMeta;
  dimensions: AssessmentDimension[];
  strengths: string[];
  blockers: string[];
  nextActions: string[];
  summary: string;
  dimensionEvidence: string[];
  stageReason: string;
  personaReason: string;
  triggeredRules: AssessmentRuleHit[];
};

export type PreviewResult = {
  persona: {
    code: PersonaCode;
    name: string;
    image: StaticImageData;
    description: string;
  };
  stage: AssessmentStage;
  readinessScore: number;
  summary: string;
  dimensions: AssessmentDimension[];
  insights: {
    strengths: string[];
    blockers: string[];
    nextActions: string[];
  };
};
