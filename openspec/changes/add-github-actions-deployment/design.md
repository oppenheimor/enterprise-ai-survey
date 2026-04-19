## Context

当前生产环境运行在腾讯云 Ubuntu Server 22.04，应用目录为 `/home/ubuntu/enterprise-ai-survey`，PM2 进程名为 `enterprise-ai-survey`，应用监听 `127.0.0.1:3000`，Nginx 对外暴露 `/enterprise-ai-survey` 子路径。服务器目录已经是 Git worktree，并通过服务器上的 GitHub SSH deploy key 从 `main` 拉取代码。

本次目标是把人工部署步骤固化进 GitHub Actions。GitHub Actions 只保存“登录服务器”的最小凭据，业务环境变量继续留在服务器 `.env` 文件中，避免把生产 `.env` 上传到 GitHub 或写进 Actions 日志。

Wiki 命中采用 `>10` 命中爆炸档，由 Explore Agent 隔离筛选后确认最相关的知识为：

- `/Users/paulchess/wiki-global/wiki/patterns/nginx-pm2-nextjs-single-host-deployment.md`
- `/Users/paulchess/wiki-global/wiki/patterns/pm2-systemd-handoff.md`
- `/Users/paulchess/wiki-global/wiki/patterns/deployment-entry-layer-validation.md`

GitHub Actions 专项知识在 Wiki 中暂缺，已用 GitHub 官方文档补齐 workflow 触发、concurrency 和 secrets 用法。

## Goals / Non-Goals

**Goals:**

- push 到 `main` 后自动执行生产部署。
- 支持 GitHub Actions 页面手动触发部署。
- 在 GitHub Actions logs 和 job summary 中看到部署阶段、目标提交、服务器提交、PM2/Nginx/入口验收结果。
- 生产 `.env` 继续只存在服务器上。
- 部署流程失败时中断并保留可诊断日志，而不是静默失败。

**Non-Goals:**

- 不引入 Docker 镜像发布、容器编排或蓝绿部署。
- 不把数据库、模型 key、`.env` 或服务器密码迁移到 GitHub。
- 不处理 HTTPS 证书、域名备案、CDN 或多实例发布。
- 不在本次改动中实现失败自动回滚。

## Decisions

### 采用 GitHub-hosted runner + SSH 到服务器执行部署

- 决策：Actions runner 只负责检查代码和远程执行部署脚本，真正的依赖安装、Prisma 迁移、Next.js 构建和 PM2 重启都在服务器项目目录内完成。
- 原因：当前服务器已经具备可运行环境和 `.env`，服务器侧构建能最大程度复用现有部署链路，避免把生产环境变量复制到 GitHub。
- 备选方案：Actions 本地构建后 rsync 上传产物。放弃原因是需要重新设计 `.next`、依赖、Prisma 生成物和运行时环境的同步边界，复杂度高于当前阶段收益。

### 使用单独的 GitHub Actions SSH 登录密钥

- 决策：新增一对专用 SSH key，公钥加入服务器 `ubuntu` 用户 `authorized_keys`，私钥写入 GitHub repository secret `TENCENT_DEPLOY_SSH_KEY`。
- 原因：与服务器拉取 GitHub 代码用的 deploy key 分离，权限边界清楚；撤销 GitHub Actions 部署权限时只需删掉服务器授权公钥和 GitHub secret。
- 备选方案：复用用户本机 SSH key 或服务器密码。放弃原因是权限过大，且密码不适合放入自动化流水线。

### 保持 `.env` 在服务器上

- 决策：workflow 不创建、不上传、不打印 `.env`，只在远程脚本中检查 `.env` 是否存在。
- 原因：生产业务配置是运行环境状态，不应进入 Git 仓库；GitHub Secrets 只保存 CI/CD 连接凭据。
- 备选方案：把完整 `.env` 存入 GitHub Secret 并在部署时写回服务器。暂不采用，原因是当前只有一台服务器，直接保留服务器 `.env` 更简单，也减少 secret 搬运面。

### 使用 `git pull --ff-only` 而不是强制重置

- 决策：远程部署前检查工作树是否干净，然后执行 `git fetch origin main` 和 `git pull --ff-only origin main`。
- 原因：如果服务器存在未提交改动或分支发散，部署应失败并暴露问题，不应在自动化里静默覆盖。
- 备选方案：`git reset --hard origin/main`。放弃原因是破坏性强，容易抹掉服务器上的临时排障痕迹或误改。

### 分层验收而不是只看 PM2 重启

- 决策：部署后依次检查 PM2 进程、`pm2-ubuntu` systemd 状态、Nginx 配置、本机端口和公网子路径入口。
- 原因：PM2 进程在线不等于 Nginx 入口可用；分层验收可以在 Actions logs 中快速定位失败层。
- 备选方案：只执行 `curl http://43.137.38.67/enterprise-ai-survey`。放弃原因是公网失败无法区分是应用、PM2、Nginx 还是网络入口问题。

## Risks / Trade-offs

- [服务器构建期间短暂不可用] → 当前 PM2 仅在构建完成后重启，降低不可用窗口；后续如需要零停机再升级为 release 目录 + symlink。
- [并发 push 导致部署交错] → workflow 使用 concurrency group 限制生产部署同一时间只有一个有效运行。
- [服务器工作树被人工改脏导致部署失败] → 远程脚本显式检查并打印 `git status --short`，要求先清理服务器改动再部署。
- [Prisma 迁移失败导致部署中断] → 迁移失败时不会继续 build/restart，保留旧 PM2 进程继续服务。
- [GitHub Actions 私钥泄露风险] → 使用专用密钥、GitHub Secrets 注入、日志不打印密钥；必要时删除服务器授权公钥并轮换 secret。
