import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardSummary } from "@/lib/survey/repository";
import { cn } from "@/lib/utils";

type DashboardPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function matchesFilter(current: string, expected?: string) {
  return !expected || current === expected;
}

async function loadDashboardData() {
  try {
    return await getDashboardSummary();
  } catch {
    return null;
  }
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = (await searchParams) ?? {};
  const scoreRating = typeof params.scoreRating === "string" ? params.scoreRating : undefined;
  const topScene = typeof params.topScene === "string" ? params.topScene : undefined;
  const leadPriority = typeof params.leadPriority === "string" ? params.leadPriority : undefined;
  const summary = await loadDashboardData();

  if (summary) {
    type LatestSubmission = (typeof summary.latestSubmissions)[number];
    const filteredSubmissions = summary.latestSubmissions.filter(
      (item: LatestSubmission) =>
        matchesFilter(item.scoreRating, scoreRating) &&
        matchesFilter(item.topScene, topScene) &&
        matchesFilter(item.leadPriority, leadPriority),
    );

    return (
      <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="bento-badge">最小运营看板</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">流量、结果与线索都放在一张桌子上看</h1>
          </div>
          <Link className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950" href="/">
            返回问卷首页
          </Link>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="bento-panel">
            <CardHeader>
              <CardTitle className="text-white">累计提交</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold text-white">{summary.totals.submissionCount}</p>
            </CardContent>
          </Card>
          <Card className="bento-panel">
            <CardHeader>
              <CardTitle className="text-white">平均分</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold text-white">{summary.totals.averageScore}</p>
            </CardContent>
          </Card>
          <Card className="bento-panel">
            <CardHeader>
              <CardTitle className="text-white">高优先级线索</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold text-white">{summary.totals.highPriorityCount}</p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="bento-panel">
            <CardHeader>
              <CardTitle className="text-white">分布概览</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-3">
                <p className="text-sm font-semibold text-white">评分分布</p>
                {summary.byRating.map((item: { label: string; count: number }) => (
                  <div key={item.label} className="bento-tile">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-white">{item.label}</span>
                      <span className="text-sm text-[var(--muted-ink)]">{item.count}</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[var(--brand)]"
                        style={{
                          width: `${summary.totals.submissionCount ? (item.count / summary.totals.submissionCount) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid gap-3">
                <p className="text-sm font-semibold text-white">主推荐场景分布</p>
                {summary.byScene.map((item: { label: string; count: number }) => (
                  <div key={item.label} className="bento-tile">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-white">{item.label}</span>
                      <span className="text-sm text-[var(--muted-ink)]">{item.count}</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-sky-400"
                        style={{
                          width: `${summary.totals.submissionCount ? (item.count / summary.totals.submissionCount) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bento-panel">
            <CardHeader>
              <CardTitle className="text-white">线索列表</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid gap-2">
                <div className="grid gap-2 md:grid-cols-4">
                  {["优秀", "良好", "一般", "待提升"].map((value) => (
                    <Link
                      key={value}
                      className={cn(
                        "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm transition",
                        scoreRating === value
                          ? "border-transparent bg-white text-slate-950"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10",
                      )}
                      href={`/dashboard?scoreRating=${encodeURIComponent(value)}${
                        topScene ? `&topScene=${encodeURIComponent(topScene)}` : ""
                      }${leadPriority ? `&leadPriority=${encodeURIComponent(leadPriority)}` : ""}`}
                    >
                      {value}
                    </Link>
                  ))}
                </div>
                <div className="grid gap-2 md:grid-cols-3">
                  {summary.byScene.map((item: { label: string; count: number }) => (
                    <Link
                      key={item.label}
                      className={cn(
                        "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm transition",
                        topScene === item.label
                          ? "border-transparent bg-white text-slate-950"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10",
                      )}
                      href={`/dashboard?topScene=${encodeURIComponent(item.label)}${
                        scoreRating ? `&scoreRating=${encodeURIComponent(scoreRating)}` : ""
                      }${leadPriority ? `&leadPriority=${encodeURIComponent(leadPriority)}` : ""}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="grid gap-2 md:grid-cols-4">
                  {summary.byPriority.map((item: { label: string; count: number }) => (
                    <Link
                      key={item.label}
                      className={cn(
                        "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm transition",
                        leadPriority === item.label
                          ? "border-transparent bg-white text-slate-950"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10",
                      )}
                      href={`/dashboard?leadPriority=${encodeURIComponent(item.label)}${
                        scoreRating ? `&scoreRating=${encodeURIComponent(scoreRating)}` : ""
                      }${topScene ? `&topScene=${encodeURIComponent(topScene)}` : ""}`}
                    >
                      {item.label} 级
                    </Link>
                  ))}
                </div>
                <Link
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                  href="/dashboard"
                >
                  清空筛选
                </Link>
              </div>
              <div className="grid gap-3">
                {filteredSubmissions.length === 0 ? (
                  <div className="bento-tile text-sm text-[var(--muted-ink)]">当前筛选条件下暂无线索。</div>
                ) : (
                  filteredSubmissions.map((item: {
                    id: string;
                    companyName: string;
                    leadName: string;
                    leadPhone: string;
                    scoreTotal: number;
                    scoreRating: string;
                    topScene: string;
                    leadPriority: string;
                  }) => (
                    <div key={item.id} className="bento-tile">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-white">{item.companyName}</p>
                          <p className="mt-1 text-sm text-[var(--muted-ink)]">
                            {item.leadName} · {item.leadPhone}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white">
                            {item.scoreRating} · {item.scoreTotal} 分
                          </p>
                          <p className="mt-1 text-sm text-[var(--muted-ink)]">
                            {item.topScene} · {item.leadPriority} 级线索
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <Card className="bento-panel">
        <CardHeader>
          <CardTitle className="text-white">运营看板暂不可用</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm leading-7 text-[var(--muted-ink)]">
            当前数据库还没有准备好，或者 Prisma migration 尚未执行。前台问卷仍可继续开发，但要看到真实看板数据，需要先启动
            PostgreSQL 并执行迁移。
          </p>
          <div>
            <Link className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950" href="/">
              返回问卷首页
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
