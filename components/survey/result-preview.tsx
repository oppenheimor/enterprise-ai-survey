"use client";

import Image from "next/image";
import { LockKeyhole, RefreshCcw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DimensionBars } from "@/components/survey/dimension-bars";
import type { PreviewResult } from "@/lib/survey/assessment/types";

type ResultPreviewProps = {
  preview: PreviewResult;
  onRestart: () => void;
  onUnlockAnalysis: () => void;
};

const stageToneMap: Record<PreviewResult["stage"], string> = {
  启蒙期: "border-slate-300/20 bg-slate-300/10 text-slate-100",
  观察期: "border-sky-300/20 bg-sky-300/10 text-sky-100",
  试跑期: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  推进期: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  阻滞期: "border-rose-300/20 bg-rose-300/10 text-rose-100",
};

export function ResultPreview({ preview, onRestart, onUnlockAnalysis }: ResultPreviewProps) {
  return (
    <Card className="bento-panel lg:max-w-xl">
      <CardContent className="grid gap-5 p-5 sm:p-6">
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(245,158,11,.1),rgba(255,255,255,.03))]">
          <div className="relative h-60 bg-[radial-gradient(circle_at_50%_12%,rgba(245,158,11,.28),rgba(15,23,42,.1)_48%,rgba(15,23,42,.7))]">
            <Image
              alt={preview.persona.name}
              className="object-contain object-center relative py-2"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 420px"
              src={preview.persona.image}
            />
          </div>
          <div className="grid gap-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <span className={`h5-chip border ${stageToneMap[preview.stage]}`}>{preview.stage}</span>
              <span className="text-sm text-[var(--muted-ink)]">就绪指数 <strong>{preview.readinessScore}</strong></span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-ink)]">你的企业 AI 转型角色</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-white">{preview.persona.name}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">{preview.persona.description}</p>
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="size-4 text-[var(--brand)]" />
                <p className="text-sm font-semibold">结果解读</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-ink)]">{preview.summary}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-semibold text-white">AI 转型画像</p>
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-ink)]">6 维评估</span>
          </div>
          <div className="mt-4">
            <DimensionBars dimensions={preview.dimensions} />
          </div>
        </div>

        <div className="grid gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4">
          <div>
            <p className="text-sm font-semibold text-white">优势</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--muted-ink)]">
              {preview.insights.strengths.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="border-t border-white/10 pt-4">
            <p className="text-sm font-semibold text-white">阻碍</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--muted-ink)]">
              {preview.insights.blockers.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="border-t border-white/10 pt-4">
            <p className="text-sm font-semibold text-white">建议</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--muted-ink)]">
              {preview.insights.nextActions.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <Button className="w-full h-12 rounded-full text-sm font-semibold" onClick={onUnlockAnalysis}>
            <LockKeyhole className="size-4" />
            AI 全面分析
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
