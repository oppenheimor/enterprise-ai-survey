"use client";

import Image from "next/image";
import { Bot, RefreshCcw, Undo2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { DimensionBars } from "@/components/survey/dimension-bars";
import { AIHealthRadarChart, PriorityMatrixChart } from "@/components/survey/report-charts";
import { Button } from "@/components/ui/button";
import type { PreviewTransport } from "@/lib/validations/detail-analysis";
import type { DiagnosisResult } from "@/lib/validations/survey";

type DetailAnalysisViewProps = {
  preview: PreviewTransport;
  diagnosis: DiagnosisResult;
  streamedText: string;
  streaming: boolean;
  hasFirstChunk: boolean;
  error?: string;
  onBack: () => void;
  onRestart: () => void;
};

const stageToneMap: Record<PreviewTransport["stage"], string> = {
  启蒙期: "border-slate-300/20 bg-slate-300/10 text-slate-100",
  观察期: "border-sky-300/20 bg-sky-300/10 text-sky-100",
  试跑期: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  推进期: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  阻滞期: "border-rose-300/20 bg-rose-300/10 text-rose-100",
};

function renderNarrative(text: string) {
  if (!text.trim()) {
    return null;
  }

  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={`${paragraph.slice(0, 12)}-${index}`} className="text-sm leading-7 text-[var(--muted-ink)]">
        {paragraph}
      </p>
    ));
}

function StreamingDots() {
  const frames = useMemo(() => ["·", "··", "···"], []);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % frames.length);
    }, 420);

    return () => window.clearInterval(timer);
  }, [frames.length]);

  return <span className="inline-flex min-w-8 justify-start">{frames[index]}</span>;
}

export function DetailAnalysisView({
  preview,
  diagnosis,
  streamedText,
  streaming,
  hasFirstChunk,
  error,
  onBack,
  onRestart,
}: DetailAnalysisViewProps) {
  const showCharts = !streaming && streamedText.trim().length > 0;
  const showActions = !streaming;
  const previousStreamingRef = useRef(streaming);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const threshold = 140;
    const distanceToBottom = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
    if (distanceToBottom > threshold) {
      return;
    }

    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: hasFirstChunk ? "smooth" : "auto",
    });
  }, [hasFirstChunk, streamedText]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const justFinished = previousStreamingRef.current && !streaming && streamedText.trim().length > 0;
    previousStreamingRef.current = streaming;

    if (!justFinished) {
      return;
    }

    const timer = window.setTimeout(() => {
      window.scrollBy({
        top: 500,
        behavior: "smooth",
      });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [streaming, streamedText]);

  return (
    <div className="grid gap-4 lg:max-w-xl">
      <section className="bento-panel grid gap-5 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-2xl border border-[rgba(249,115,22,.26)] bg-[radial-gradient(circle_at_30%_25%,rgba(251,191,36,.48),rgba(249,115,22,.12)_72%)] text-white shadow-[0_18px_36px_rgba(249,115,22,.22)]">
                  <Bot className="size-4" />
                </div>
                <div>
                  <p className="text-xl uppercase tracking-[0.24em] text-[var(--brand)]">AI全面诊断</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto h-52 w-full max-w-[16rem]">
            <Image
              alt={preview.persona.name}
              className="object-contain object-center"
              fill
              priority
              sizes="256px"
              src={preview.persona.image}
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xl font-semibold text-white">{preview.persona.name}</p>
              </div>
              <div className="text-right flex justify-end items-center gap-2">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-ink)] whitespace-nowrap">就绪指数</p>
                <p className="text-2xl font-black tracking-[-0.04em] text-white">{preview.readinessScore}</p>
              </div>
            </div>
             <p className="mt-1 text-xs leading-5 text-[var(--muted-ink)]">{preview.persona.description}</p>
          </div>

          <div className="grid gap-5 border-t border-white/10 pt-5">
            <div>
              <p className="text-lg font-semibold text-white">AI 深度解读</p>
            </div>

            <div className="grid gap-4">
              {renderNarrative(streamedText)}
              {streaming && !hasFirstChunk ? (
                <div className="flex h-8 items-center text-base text-white/90">
                  <div className="text-[var(--brand)] flex justify-start items-center gap-1">
                    <span className="text-sm">思考中</span>
                    <StreamingDots />
                  </div>
                </div>
              ) : null}
              {error ? <p className="text-sm leading-6 text-rose-300">{error}</p> : null}
            </div>

            {showCharts ? (
              <div className="grid gap-6 border-t border-white/10 pt-5">
                <div>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-white">AI 转型健康雷达</p>
                    <p className="mt-1 text-xs leading-5 text-[var(--muted-ink)]">用结构化诊断展示你当前更适合先补哪里、先推哪里。</p>
                  </div>
                  <AIHealthRadarChart items={diagnosis.dimensionReports} />
                </div>

                <div>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-white">优先切入矩阵</p>
                    <p className="mt-1 text-xs leading-5 text-[var(--muted-ink)]">先看影响，再看可行性，避免一上来选了又重又难的方向。</p>
                  </div>
                  <PriorityMatrixChart items={diagnosis.visualAnalysis.priorityMatrix} />
                </div>

                <div>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-white">6 维结构图</p>
                  </div>
                  <DimensionBars dimensions={preview.dimensions} />
                </div>
              </div>
            ) : null}
          </div>
      </section>

      {showActions ? (
        <div className="safe-bottom grid gap-3 sm:grid-cols-2">
          <Button className="h-12 rounded-full text-sm font-semibold" onClick={onBack} variant="secondary">
            <Undo2 className="size-4" />
            返回结果预览
          </Button>
          <Button className="h-12 rounded-full text-sm font-semibold" onClick={onRestart}>
            <RefreshCcw className="size-4" />
            重新测试
          </Button>
        </div>
      ) : null}
    </div>
  );
}
