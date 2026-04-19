"use client";

import { cn } from "@/lib/utils";
import type { PreviewResult } from "@/lib/survey/assessment/types";

const barColorMap: Record<PreviewResult["dimensions"][number]["key"], string> = {
  urgency: "bg-sky-500",
  digitalBase: "bg-amber-400",
  execution: "bg-emerald-500",
  resource: "bg-violet-500",
  maturity: "bg-rose-500",
  fit: "bg-cyan-500",
};

const levelLabelMap = {
  high: "高",
  medium: "中",
  low: "低",
};

const levelToneMap = {
  high: "text-emerald-300",
  medium: "text-amber-200",
  low: "text-rose-300",
};

export function DimensionBars({ dimensions }: Pick<PreviewResult, "dimensions">) {
  return (
    <div className="grid gap-4">
      {dimensions.map((dimension) => (
        <div key={dimension.key} className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-white">{dimension.label}</p>
            <div className="flex items-center gap-3">
              <p className={cn("text-xs uppercase tracking-[0.2em]", levelToneMap[dimension.level])}>{levelLabelMap[dimension.level]}</p>
              <p className="min-w-9 text-right text-base font-semibold text-white">{dimension.score}</p>
            </div>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className={cn("h-full rounded-full transition-all", barColorMap[dimension.key])}
              style={{ width: `${dimension.score}%` }}
            />
          </div>
          <p className="text-xs leading-5 text-[var(--muted-ink)]">{dimension.summary}</p>
        </div>
      ))}
    </div>
  );
}
