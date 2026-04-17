import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { stylePresets, surveySample } from "@/lib/style-wall";

export function StyleWallGallery() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {stylePresets.map((preset) => (
        <article
          key={preset.slug}
          aria-label={`${preset.label} style sample`}
          className={cn("relative overflow-hidden rounded-[34px]", preset.frameClassName)}
        >
          <div
            className={cn(
              "relative flex h-full min-h-[460px] flex-col overflow-hidden px-6 py-6 md:px-7",
              preset.cardClassName,
            )}
          >
            <div className={cn("absolute inset-0", preset.textureClassName)} />
            <div className="pointer-events-none absolute inset-x-6 top-20 h-px bg-current/10" />
            <div className="pointer-events-none absolute right-6 top-6 flex items-center gap-2 opacity-50">
              <span className={cn("h-2.5 w-2.5 rounded-full", preset.accentClassName)} />
              <span className="text-[10px] uppercase tracking-[0.22em]">preview</span>
            </div>

            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] opacity-65">Style</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight">{preset.label}</h2>
                </div>
                <p className="max-w-28 text-right text-[11px] leading-5 opacity-55">{preset.mood}</p>
              </div>

              <div className="mt-8">
                <span
                  className={cn(
                    "inline-flex rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.18em] uppercase",
                    preset.badgeClassName,
                  )}
                >
                  {surveySample.badge}
                </span>
                <h3 className={cn("mt-5 text-[30px] leading-[1.04]", preset.titleClassName)}>
                  {surveySample.title}
                </h3>
                <p className={cn("mt-4 text-sm leading-6", preset.bodyClassName)}>
                  {surveySample.summary}
                </p>
              </div>

              <ul className="mt-6 grid gap-3">
                {surveySample.valuePoints.map((point) => (
                  <li
                    key={point}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-3 py-2 text-sm",
                      preset.bulletClassName,
                    )}
                  >
                    <span>{point}</span>
                    <CheckCircle2 className="h-4 w-4 opacity-70" />
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <div
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-3 text-sm font-medium",
                    preset.buttonClassName,
                  )}
                >
                  <span>{surveySample.cta}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <p className={cn("mt-4 text-xs leading-5", preset.noteClassName)}>
                  {surveySample.audience}
                </p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
