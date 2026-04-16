export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-20">
      <section className="w-full max-w-3xl rounded-[28px] border border-white/10 bg-slate-900/70 p-10 shadow-2xl shadow-slate-950/40 backdrop-blur">
        <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
          Enterprise AI Survey
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white">
          企业 AI 转型问卷基础环境已经就绪
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
          这一步先完成 TypeScript、Tailwind CSS v4、Prisma、Vitest、
          Playwright 与 shadcn/ui 的工程基线，后续问卷页可以直接在这套骨架上展开。
        </p>
      </section>
    </main>
  );
}
