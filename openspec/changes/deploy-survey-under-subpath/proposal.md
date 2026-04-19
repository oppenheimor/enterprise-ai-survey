## Why

当前项目已经部署到腾讯云并可正常运行，但仍以站点根路径 `/` 对外提供服务。用户已明确要求把本项目正式入口切换为 `/enterprise-ai-survey` 子路径，并确保首页、看板页和分析 API 全部在该前缀下工作。

## What Changes

- 将当前 Next.js 应用改为通过 `basePath="/enterprise-ai-survey"` 以真实子路径方式部署。
- 修正项目中所有与根路径强绑定的页面跳转、API 请求、缓存失效路径和静态资源引用。
- 更新 Playwright 测试入口，使自动化验证覆盖新的正式访问路径。
- 更新服务器 Nginx 配置，使 `/enterprise-ai-survey` 及其子路径转发到当前运行中的 Next.js 应用。
- 补充部署文档和经验文档，记录子路径部署的真实变更点与验收方式。

## Capabilities

### New Capabilities

- `subpath-deployment`: 使当前 H5 应用能够稳定运行在 `/enterprise-ai-survey` 子路径下，而不是站点根路径。

### Modified Capabilities

- `survey-h5-experience`: 正式访问入口从根路径调整为 `/enterprise-ai-survey`，并要求页面内跳转与静态资源引用在子路径下保持正确。
- `survey-lead-ops-dashboard`: 看板访问入口调整为 `/enterprise-ai-survey/dashboard`，并要求相关刷新与回跳路径保持一致。
- `llm-diagnosis-output`: 分析流式 API 入口调整为 `/enterprise-ai-survey/api/survey/analysis`。

## Impact

- 影响代码范围：`next.config.mjs`、前端页面跳转、客户端 API 请求、Server Action 缓存失效路径、CSS 字体资源路径、E2E 配置。
- 影响部署方式：每次修改子路径前缀都必须重新构建应用。
- 影响服务器入口：Nginx 需要按项目子路径反向代理，而不再把根路径 `/` 直接转发给该应用。
