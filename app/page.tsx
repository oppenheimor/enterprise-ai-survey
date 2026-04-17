import { SurveyIntakeForm } from "@/components/survey/survey-intake-form";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-20">
      <section className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/45 p-10 shadow-2xl shadow-slate-950/40 backdrop-blur">
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
            Enterprise AI Survey
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            企业 AI 转型问卷基础环境已经就绪
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            这一步完成了 TypeScript、Tailwind CSS v4、shadcn/ui、Zod、Prisma、
            PostgreSQL Docker、本地单测与 E2E 测试的工程底座。
          </p>
          <div className="mt-8 grid gap-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              Type-safe 表单校验：React Hook Form + Zod
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              数据层：PostgreSQL 16 + Prisma 7
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              测试链路：Vitest + Playwright
            </div>
          </div>
        </div>

        <SurveyIntakeForm />
      </section>
    </main>
  );
}
