"use client";

import {
  ArrowLeft,
  ArrowRight,
  BadgeAlert,
  Blocks,
  BriefcaseBusiness,
  ChevronRight,
  Clock3,
  Coins,
  Factory,
  Flag,
  LoaderCircle,
  Radar,
  Repeat,
  Sparkles,
  Target,
  Timer,
  TrendingDown,
  UserCheck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

import { runLocalAssessmentPreview, unlockDetailedAnalysis } from "@/app/actions";
import { DetailAnalysisView } from "@/components/survey/detail-analysis-view";
import { LeadCaptureModal } from "@/components/survey/lead-capture-modal";
import type { PreviewResult } from "@/lib/survey/assessment/types";
import { ResultPreview } from "@/components/survey/result-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { surveyQuestions, type SurveyFieldKey } from "@/lib/survey/config";
import { withBasePath } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import type { PreviewTransport } from "@/lib/validations/detail-analysis";
import { leadFormSchema, surveyAnswersSchema, type DiagnosisResult, type LeadFormInput, type SurveyAnswersInput } from "@/lib/validations/survey";

type SurveyAppProps = {
  source: string;
  campaign: string;
};

type PreviewPayload = {
  answers: SurveyAnswersInput;
  preview: PreviewResult;
};

type DetailPayload = {
  submissionId?: string;
  preview: PreviewTransport;
  diagnosis: DiagnosisResult;
};

const questionIconMap: Record<SurveyFieldKey, LucideIcon> = {
  q1Industry: Factory,
  q2CompanySize: Users,
  q3BusinessType: BriefcaseBusiness,
  q4RevenueModel: Wallet,
  q5MainProcess: Clock3,
  q6RepeatedWork: Repeat,
  q7CoreProblem: BadgeAlert,
  q8ImpactLevel: TrendingDown,
  q9AiUsage: Sparkles,
  q10ToolingLevel: Blocks,
  q11TeamAdoption: UserCheck,
  q12Budget: Coins,
  q13Timeline: Timer,
  q14Owner: Flag,
  q15Attitude: Radar,
  q16ExpectedResult: Target,
};

export function SurveyApp({ source, campaign }: SurveyAppProps) {
  const [stage, setStage] = useState<"landing" | "question" | "resultPreview" | "detailAnalysis">("landing");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<SurveyAnswersInput>>({});
  const [previewPayload, setPreviewPayload] = useState<PreviewPayload | null>(null);
  const [detailPayload, setDetailPayload] = useState<DetailPayload | null>(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [analysisStreaming, setAnalysisStreaming] = useState(false);
  const [analysisHasFirstChunk, setAnalysisHasFirstChunk] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [analysisText, setAnalysisText] = useState("");
  const [pending, startWork] = useTransition();
  const analysisRequestRef = useRef<AbortController | null>(null);
  const startedAtRef = useRef<number>(Date.now());

  const currentQuestion = surveyQuestions[questionIndex];
  const currentAnswer = answers[currentQuestion.id];
  const CurrentQuestionIcon = questionIconMap[currentQuestion.id];
  const progress = ((questionIndex + 1) / surveyQuestions.length) * 100;
  const isLanding = stage === "landing";

  function resetSurvey() {
    analysisRequestRef.current?.abort();
    setStage("landing");
    setQuestionIndex(0);
    setAnswers({});
    setPreviewPayload(null);
    setDetailPayload(null);
    setSubmitMessage("");
    setLeadModalOpen(false);
    setAnalysisStreaming(false);
    setAnalysisHasFirstChunk(false);
    setAnalysisError("");
    setAnalysisText("");
    startedAtRef.current = Date.now();
  }

  function handleStart() {
    setStage("question");
    setQuestionIndex(0);
    setSubmitMessage("");
    startedAtRef.current = Date.now();
  }

  function handleSelect(value: string) {
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: value,
    }));
  }

  function handleNext() {
    if (!currentAnswer) {
      return;
    }

    if (questionIndex < surveyQuestions.length - 1) {
      setQuestionIndex((current) => current + 1);
      return;
    }

    startWork(async () => {
      try {
        const parsedAnswers = surveyAnswersSchema.parse({
          ...answers,
          [currentQuestion.id]: currentAnswer,
        });
        const result = await runLocalAssessmentPreview(parsedAnswers);

        setPreviewPayload({
          answers: result.answers,
          preview: result.preview,
        });
        setSubmitMessage("");
        setStage("resultPreview");
      } catch {
        setSubmitMessage("结果预览生成失败，请稍后重试。");
      }
    });
  }

  async function startStreamingAnalysis(payload: DetailPayload, answerSet: SurveyAnswersInput) {
    analysisRequestRef.current?.abort();
    const controller = new AbortController();
    analysisRequestRef.current = controller;
    setAnalysisText("");
    setAnalysisError("");
    setAnalysisHasFirstChunk(false);
    setAnalysisStreaming(true);

    try {
      const response = await fetch(withBasePath("/api/survey/analysis"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: answerSet,
          preview: payload.preview,
          diagnosis: payload.diagnosis,
          submissionId: payload.submissionId,
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const result = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(result?.message ?? "AI 详情分析暂时生成失败。");
      }

      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      let finalText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        finalText += value;
        if (finalText.length > 0) {
          setAnalysisHasFirstChunk(true);
        }
        setAnalysisText(finalText);
      }
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      setAnalysisError(error instanceof Error ? error.message : "AI 详情分析暂时生成失败。");
    } finally {
      if (analysisRequestRef.current === controller) {
        analysisRequestRef.current = null;
      }
      setAnalysisStreaming(false);
    }
  }

  async function handleUnlockAnalysis(lead: LeadFormInput) {
    if (!previewPayload) {
      throw new Error("结果预览尚未生成，暂时无法解锁详情分析。");
    }

    const parsedLead = leadFormSchema.parse(lead);
    const durationSeconds = Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000));
    const result = await unlockDetailedAnalysis({
      answers: previewPayload.answers,
      preview: {
        persona: {
          code: previewPayload.preview.persona.code,
          name: previewPayload.preview.persona.name,
          description: previewPayload.preview.persona.description,
          image:
            typeof previewPayload.preview.persona.image === "string"
              ? previewPayload.preview.persona.image
              : previewPayload.preview.persona.image.src,
        },
        stage: previewPayload.preview.stage,
        readinessScore: previewPayload.preview.readinessScore,
        summary: previewPayload.preview.summary,
        dimensions: previewPayload.preview.dimensions,
        insights: previewPayload.preview.insights,
      },
      lead: parsedLead,
      tracking: {
        source,
        campaign,
        durationSeconds,
      },
    });

    const nextDetailPayload: DetailPayload = {
      submissionId: result.submissionId,
      preview: result.preview,
      diagnosis: result.diagnosis,
    };

    setLeadModalOpen(false);
    setDetailPayload(nextDetailPayload);
    setStage("detailAnalysis");
    void startStreamingAnalysis(nextDetailPayload, previewPayload.answers);
  }

  useEffect(() => {
    return () => {
      analysisRequestRef.current?.abort();
    };
  }, []);

  return (
    <main
      className={cn(
        "safe-top safe-bottom safe-x mx-auto min-h-full w-full px-4 py-4 sm:px-5 sm:py-5 lg:px-8",
        isLanding ? "grid max-w-xl place-items-center" : "max-w-6xl",
      )}
      style={{
        background: 'radial-gradient(circle at 0 0, #f59e0b3d, #0000 24%), radial-gradient(circle at 100% 0, #0ea5e92e, #0000 26%), linear-gradient(#111827 0%, #0f172a 48%, #0b1120 100%)'
      }}
    >
      <div className={cn("grid w-full gap-4", !isLanding && "lg:grid-cols-[minmax(0,1fr)]")}>
        <section className={cn("grid min-h-[calc(100vh-2rem)] place-items-center", !isLanding && "hidden")}>
          <div className="grid w-full gap-8 text-center">
            <div className="mx-auto h-1.5 w-16 rounded-full bg-[var(--brand)] shadow-[0_0_36px_rgba(245,158,11,.55)]" />
            <div className="grid gap-5">
              <h1 className="hero-title text-[2.7rem] leading-[54px] font-black tracking-[-0.08em] text-white sm:text-[4.6rem]">
                别急着做 <span className="hero-ai-mark italic pr-2">AI</span>，
                <br />
                先测清楚
                <br />
                值不值得做。
              </h1>
              <p className="mx-auto max-w-sm text-sm leading-6 text-[var(--muted-ink)]">
                16 道题，先判断你的企业 AI 转型该不该启动、从哪一刀切进去。
              </p>
            </div>
            <Button
              className="mx-auto h-14 w-full max-w-xs rounded-full text-base font-semibold shadow-[0_18px_42px_rgba(249,115,22,.28)]"
              onClick={handleStart}
            >
              立即开始评测
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </section>

        {!isLanding ? (
          <aside className="w-full lg:sticky lg:top-6 lg:self-start">
            {stage === "question" ? (
              <Card className="bento-panel min-h-[26rem] lg:min-h-[42rem] lg:max-w-xl">
                <CardHeader className="gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (questionIndex === 0) {
                          setStage("landing");
                          return;
                        }
                        setQuestionIndex((current) => Math.max(0, current - 1));
                      }}
                    >
                      <ArrowLeft className="size-4" />
                      上一题
                    </Button>
                    <span className="text-sm text-[var(--muted-ink)]">
                      {questionIndex + 1} / {surveyQuestions.length}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[var(--brand)] transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="grid gap-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--brand)]">{currentQuestion.group}</p>
                    <div className="flex items-center gap-3">
                      <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-amber-300/20 bg-amber-300/10 text-[var(--brand)] shadow-[0_10px_28px_rgba(245,158,11,.14)]">
                        <CurrentQuestionIcon aria-hidden="true" className="size-5" />
                      </div>
                      <div aria-level={2} className="text-2xl leading-tight text-white" role="heading">
                        {currentQuestion.title}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {currentQuestion.options.map((option) => {
                    const active = currentAnswer === option.value;
                    return (
                      <button
                        key={option.value}
                        className={cn(
                          "bento-option text-left",
                          active &&
                            "border-[var(--brand)] bg-[rgba(255,255,255,.12)] text-white shadow-[0_0_0_1px_rgba(249,115,22,.2)]",
                        )}
                        onClick={() => handleSelect(option.value)}
                        type="button"
                      >
                        <span className="text-sm font-medium">{option.label}</span>
                      </button>
                    );
                  })}
                  <Button className="mt-3 h-12 rounded-full text-sm font-semibold" disabled={!currentAnswer || pending} onClick={handleNext}>
                    {pending ? (
                      <>
                        <LoaderCircle className="size-4 animate-spin" />
                        正在生成结果预览
                      </>
                    ) : questionIndex === surveyQuestions.length - 1 ? (
                      <>
                        查看结果预览
                        <ChevronRight className="size-4" />
                      </>
                    ) : (
                      <>
                        下一题
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                  {submitMessage ? <p className="text-sm text-[var(--warning)]">{submitMessage}</p> : null}
                </CardContent>
              </Card>
            ) : null}

            {stage === "resultPreview" && previewPayload ? (
              <ResultPreview
                preview={previewPayload.preview}
                onRestart={() => {
                  resetSurvey();
                }}
                onUnlockAnalysis={() => {
                  setLeadModalOpen(true);
                }}
              />
            ) : null}

            {stage === "detailAnalysis" && detailPayload ? (
              <DetailAnalysisView
                diagnosis={detailPayload.diagnosis}
              error={analysisError}
              hasFirstChunk={analysisHasFirstChunk}
              onBack={() => {
                analysisRequestRef.current?.abort();
                setStage("resultPreview");
                setAnalysisStreaming(false);
                }}
                onRestart={() => {
                  resetSurvey();
                }}
                preview={detailPayload.preview}
                streamedText={analysisText}
                streaming={analysisStreaming}
              />
            ) : null}
          </aside>
        ) : null}
      </div>

      <LeadCaptureModal
        onClose={() => {
          if (!pending) {
            setLeadModalOpen(false);
          }
        }}
        onSubmit={handleUnlockAnalysis}
        open={leadModalOpen}
      />
    </main>
  );
}
