## Context

当前项目基于 Next.js App Router，已经在腾讯云 Ubuntu 实例上以 `nginx + pm2 + next + postgresql` 方式稳定运行，但对外入口仍为站点根路径。用户要求将项目调整为真实子路径部署，并指定正式入口为：

1. `/enterprise-ai-survey`
2. `/enterprise-ai-survey/dashboard`
3. `/enterprise-ai-survey/api/survey/analysis`

当前仓库中仍存在若干根路径依赖，包括绝对 API 请求、页面回跳、看板筛选链接、`revalidatePath("/dashboard")` 和 CSS 字体路径。Next.js 官方文档明确说明，部署到子路径时应使用 `basePath`，且该值在构建期固定。

## Goals / Non-Goals

**Goals:**

1. 让应用以 `basePath="/enterprise-ai-survey"` 的方式稳定运行。
2. 保证首页、看板页、流式分析 API 和主要静态资源在子路径下工作正常。
3. 保持评分、问卷、留资、落库和 AI 分析逻辑不变。
4. 在服务器完成最小改动部署，并给出可复用的验收命令。

**Non-Goals:**

1. 不构建同机多应用模板。
2. 不调整 PM2 端口策略。
3. 不同时处理 HTTPS、域名切换、备案和新实例规范。
4. 不修改数据库 schema、评分逻辑或产品流程。

## Decisions

### 使用 `NEXT_PUBLIC_BASE_PATH` 驱动 Next.js `basePath`

- 决策：在 `next.config.mjs` 中把 `basePath` 固定到 `process.env.NEXT_PUBLIC_BASE_PATH || "/enterprise-ai-survey"`。
- 原因：符合 Next.js 官方文档，且构建与运行环境可以共享同一份路径常量。
- 备选方案：直接在 Nginx 层做 rewrite。放弃原因是无法彻底解决 API、静态资源、页面跳转和缓存路径不一致问题。

### 增加统一路径工具，显式处理非 `next/link` 场景

- 决策：新增一个轻量工具模块，统一处理 `withBasePath()`、`getBasePath()` 等能力，用于 `fetch`、`revalidatePath` 和静态资源序列化。
- 原因：`next/link` 会自动应用 `basePath`，但 `fetch("/api/...")`、CSS `url("/fonts/...")` 和服务端路径失效不会自动收口。
- 备选方案：到处手写 `/enterprise-ai-survey`。放弃原因是后续非常容易再漂移。

### 保持应用监听 `127.0.0.1:3000`

- 决策：不改 PM2 端口，继续沿用当前运行方式。
- 原因：本次目标是入口路径迁移，不是同机多应用编排；减少变量更安全。
- 备选方案：顺便改成 `3001`。放弃原因是这会引入与当前需求无关的额外部署变量。

### Nginx 只代理项目子路径

- 决策：Nginx 只接管 `/enterprise-ai-survey` 与其子路径，根路径 `/` 不再指向当前应用首页。
- 原因：与用户指定的正式入口一致，也能避免未来再把根路径误认为当前项目入口。
- 备选方案：根路径 302 跳转到子路径。放弃原因是当前用户没有要求这么做，且会让入口语义变得含糊。

## Risks / Trade-offs

- [遗漏绝对静态资源路径] → 用全文搜索覆盖字体、图片和 `fetch` 场景，并做线上 `curl` 回归。
- [看板和 API 表面能访问，但某些回跳或刷新路径仍指向根路径] → 统一通过路径工具收口，避免零散手写。
- [测试仍然验证旧入口] → 同步调整 Playwright 基线到 `/enterprise-ai-survey`。
- [部署后根路径不再承载应用，可能与旧认知不一致] → 在部署文档中明确说明当前正式入口已变更。
