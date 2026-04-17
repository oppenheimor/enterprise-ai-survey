import Link from "next/link";

import { StyleWallGallery } from "@/components/style-wall/style-wall-gallery";
import { stylePresets } from "@/lib/style-wall";

export default function StyleWallPage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[32px] border border-white/10 bg-slate-950/60 px-6 py-8 text-white shadow-2xl shadow-slate-950/40 backdrop-blur md:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-200">
                Style Wall
              </span>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                企业 AI 转型问卷风格样品墙
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                这一页只做一件事：把同一套“企业 AI 转型问卷”内容放进 15 种不同视觉系统里，帮助你像挑样品一样快速筛掉不合适的方向。
              </p>
            </div>

            <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Cards</p>
                <p className="mt-2 text-2xl font-semibold text-white">{stylePresets.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Theme</p>
                <p className="mt-2 font-medium text-white">企业 AI 转型</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Mode</p>
                <p className="mt-2 font-medium text-white">同内容横向对比</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span>保留现有首页不变</span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span>不接真实表单逻辑</span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span>仅用于视觉筛选</span>
            <Link
              href="/"
              className="ml-auto inline-flex rounded-full border border-white/12 bg-white/5 px-4 py-2 text-slate-200 transition-colors hover:bg-white/10"
            >
              返回当前首页
            </Link>
          </div>
        </header>

        <section className="mt-8">
          <StyleWallGallery />
        </section>
      </div>
    </main>
  );
}
