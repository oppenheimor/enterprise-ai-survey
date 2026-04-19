## Why

当前项目已经完成腾讯云单机部署，并已迁移为服务器从 GitHub SSH 拉取代码，但每次上线仍需要人工 SSH 到服务器执行拉取、安装、迁移、构建和 PM2 重启。用户希望后续只要 push 到 `main` 分支就自动部署，并且能在 GitHub Actions 页面看到清晰的部署进度。

## What Changes

- 新增 GitHub Actions 生产部署流水线，监听 `main` 分支 push，并支持手动触发。
- 在流水线中先执行项目基线检查，再通过 SSH 登录腾讯云服务器执行服务器侧部署命令。
- 部署命令沿用现有服务器形态：在 `/home/ubuntu/enterprise-ai-survey` 中 `git pull --ff-only`、安装依赖、执行 Prisma 迁移、构建 Next.js、重启并保存 PM2 进程。
- 在流水线中增加分层验收：PM2/systemd、Nginx 配置、本机端口、公网子路径入口。
- 配置 GitHub repository secrets 保存服务器 SSH 登录凭据和连接信息，不把 `.env`、服务器密码或业务密钥写入仓库。
- 更新部署文档，沉淀 GitHub Actions 自动部署、Secrets、服务器 `.env` 保留策略和排障方式。

## Capabilities

### New Capabilities

- `github-actions-deployment`: 支持 push 到 `main` 后自动部署到腾讯云服务器，并在 GitHub Actions 中展示部署进度和验收结果。

### Modified Capabilities

- 无。

## Impact

- 影响代码范围：新增 `.github/workflows/deploy.yml`，新增 OpenSpec 变更产物，更新 `docs/deployment` 文档。
- 影响外部系统：GitHub Actions、GitHub repository secrets、腾讯云 Ubuntu 实例 SSH 授权、服务器 PM2/Nginx/Prisma 部署链路。
- 不影响问卷流程、评分逻辑、数据库 schema 定义或 API 契约。
