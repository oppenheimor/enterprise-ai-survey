# GitHub Actions 自动部署指南

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档名称 | GitHub Actions 自动部署指南 |
| 创建日期 | 2026-04-19 |
| 适用项目 | 企业 AI 转型评估 H5 |
| 目标 | push 到 `main` 后自动部署到腾讯云服务器，并在 GitHub Actions 中查看部署进度 |
| Workflow | `.github/workflows/deploy.yml` |
| 线上入口 | `http://43.137.38.67/enterprise-ai-survey` |

---

## 1. 当前自动部署形态

当前部署链路已经升级为：

```text
本地 commit
  -> git push origin main
  -> GitHub Actions 自动触发
  -> Actions 先运行 pnpm check
  -> Actions SSH 登录腾讯云服务器
  -> 服务器 git pull --ff-only origin main
  -> 服务器 pnpm install / prisma migrate / next build
  -> PM2 restart
  -> PM2 + systemd + Nginx + 本机端口 + 公网入口分层验收
```

也就是说，日常发布只需要：

```bash
git status
pnpm check
git add 需要发布的文件
git commit -m "描述本次发布"
git push origin main
```

push 后打开 GitHub 仓库的 `Actions` 页面，就能看到部署进度。

---

## 2. 为什么不是把 `.env` 上传到 GitHub

线上 `.env` 继续保留在服务器：

```bash
/home/ubuntu/enterprise-ai-survey/.env
```

GitHub Actions 不负责生成、不上传、不打印这个文件。它只会检查 `.env` 文件存在且非空。

这样做的原因：

1. `.env` 里包含数据库连接串、模型 key 等敏感信息。
2. 当前只有一台生产服务器，把 `.env` 留在服务器最简单。
3. GitHub Secrets 只保存“部署连接凭据”，不保存业务运行配置。
4. 如果未来有多台服务器，再考虑用密钥管理系统或把 `.env` 作为受控 secret 下发。

当前 GitHub Secrets 保存的是：

| Secret | 用途 |
|--------|------|
| `TENCENT_DEPLOY_HOST` | 服务器公网 IP，目前是 `43.137.38.67` |
| `TENCENT_DEPLOY_PORT` | SSH 端口，目前是 `22` |
| `TENCENT_DEPLOY_USER` | SSH 登录用户，目前是 `ubuntu` |
| `TENCENT_DEPLOY_SSH_KEY` | GitHub Actions 专用 SSH 私钥 |

注意：

1. 这里的 SSH 私钥只用于 Actions 登录服务器。
2. 它不是服务器拉 GitHub 仓库用的 deploy key。
3. 服务器拉 GitHub 代码仍然使用服务器自己的只读 deploy key。

---

## 3. 两类 SSH Key 的区别

当前系统里有两类 key，容易混淆：

| Key | 放在哪里 | 用途 | 权限方向 |
|-----|----------|------|----------|
| GitHub deploy key | 私钥在服务器，公钥在 GitHub 仓库 Deploy keys | 让服务器从 GitHub 拉代码 | 服务器 -> GitHub |
| GitHub Actions deploy key | 私钥在 GitHub Secrets，公钥在服务器 `authorized_keys` | 让 Actions 登录服务器执行部署 | GitHub Actions -> 服务器 |

一句话区分：

```text
服务器拉 GitHub，用 GitHub deploy key。
GitHub Actions 登录服务器，用 Actions deploy key。
```

不要复用个人 SSH 私钥，也不要把服务器密码写进 GitHub Actions。

---

## 4. GitHub Actions 配置

当前 workflow 文件：

```bash
.github/workflows/deploy.yml
```

触发方式：

1. push 到 `main` 分支自动触发。
2. GitHub Actions 页面手动 `Run workflow` 触发。

并发策略：

```yaml
concurrency:
  group: production-enterprise-ai-survey
  cancel-in-progress: false
```

含义：

1. 同一时间只允许一个生产部署链路执行。
2. 不主动取消正在部署的任务，避免部署命令被中途打断。
3. 如果连续 push，多次部署会按 GitHub Actions 的并发规则排队或等待。

---

## 5. Workflow 做了什么

### 5.1 Check Job

`check` job 在 GitHub runner 上执行：

```bash
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/enterprise_ai_survey" pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm build
```

这些检查覆盖：

1. lint
2. typecheck
3. unit tests
4. build

这一步失败时，不会进入服务器部署。

其中 `DATABASE_URL` 是 runner 上用于 Prisma `postinstall` 和构建阶段的占位连接串，不是生产数据库连接串。生产数据库连接串仍然只读取服务器 `.env`。

说明：

当前 `openspec` CLI 在本机和服务器可用，但没有作为项目 npm 依赖被稳定安装到 GitHub runner。因此 GitHub Actions 暂不在 runner 上执行 `openspec validate`，本地提交前仍然需要执行 `pnpm spec:validate` 或 `pnpm check`。

### 5.2 Deploy Job

`deploy` job 会 SSH 到服务器执行：

```bash
cd /home/ubuntu/enterprise-ai-survey
test -f .env
test -s .env
git status --short
git fetch origin main
git pull --ff-only origin main
pnpm install --frozen-lockfile
pnpm prisma:deploy
NEXT_PUBLIC_BASE_PATH="/enterprise-ai-survey" pnpm build
pm2 restart enterprise-ai-survey --update-env
pm2 save
```

这里有几个关键点：

1. 如果服务器工作树不干净，部署会失败，不会强制覆盖。
2. 使用 `git pull --ff-only`，避免服务器产生隐式 merge。
3. Prisma 迁移失败时会中断部署，不会继续重启 PM2。
4. 构建时显式传入 `NEXT_PUBLIC_BASE_PATH="/enterprise-ai-survey"`，保证子路径语义不漂移。

### 5.3 分层验收

部署完成后会验收：

```bash
pm2 describe enterprise-ai-survey
systemctl is-active pm2-ubuntu
sudo nginx -t
等待 http://127.0.0.1:3000/enterprise-ai-survey 就绪
curl -fsSIL http://127.0.0.1:3000/enterprise-ai-survey
curl -fsSIL http://127.0.0.1:3000/enterprise-ai-survey/dashboard
curl -fsSIL http://43.137.38.67/enterprise-ai-survey
curl -fsSIL http://43.137.38.67/enterprise-ai-survey/dashboard
```

等待就绪是必要的：`pm2 restart` 成功只代表进程已经被拉起，不代表 Next.js 已经完成启动并开始监听 `3000` 端口。workflow 会最多等待 60 秒，超时后打印 PM2 日志再失败。

分析 API 会用普通 `GET` 探测：

```bash
curl http://43.137.38.67/enterprise-ai-survey/api/survey/analysis
```

如果返回 `405`，通常说明请求已经打到 Next.js 路由，只是方法不匹配。这对当前流式分析接口是可接受的入口探测结果。

---

## 6. 如何在 GitHub 上看部署进度

操作路径：

```text
GitHub 仓库 -> Actions -> Deploy Production -> 最新 run
```

你会看到两个 job：

1. `Check`
2. `Deploy To Tencent Cloud`

重点看这些 step：

1. `Run project checks`
2. `Prepare SSH`
3. `Deploy on server`
4. `Validate public entry`
5. `Deployment summary`

`Deploy on server` 里会用分段日志显示：

```text
==> 进入应用目录
==> 确认服务器环境
==> 检查服务器 .env
==> 检查 Git 工作树
==> 拉取 main 分支
==> 安装依赖
==> 执行数据库迁移
==> 构建 Next.js
==> 重启 PM2
==> 运行时状态
==> 本机入口验收
==> 记录服务器提交
```

run 成功后，GitHub Actions 的 summary 会显示：

1. GitHub commit
2. Server commit
3. App 名称
4. Public home
5. Public dashboard

---

## 7. 首次配置命令记录

本次已完成以下动作。

### 7.1 生成 Actions 专用 SSH Key

本机生成临时 key：

```bash
ssh-keygen -t ed25519 \
  -C "github-actions enterprise-ai-survey deploy 2026-04-19" \
  -f /tmp/tencent_actions_deploy \
  -N ""
```

### 7.2 把公钥加入服务器

```bash
ssh ubuntu@43.137.38.67
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
printf '%s\n' '<公钥内容>' >> ~/.ssh/authorized_keys
```

### 7.3 写入 GitHub Secrets

使用 GitHub CLI：

```bash
gh secret set TENCENT_DEPLOY_HOST --body "43.137.38.67"
gh secret set TENCENT_DEPLOY_PORT --body "22"
gh secret set TENCENT_DEPLOY_USER --body "ubuntu"
gh secret set TENCENT_DEPLOY_SSH_KEY < /tmp/tencent_actions_deploy
```

写入完成后删除本地临时私钥：

```bash
rm -f /tmp/tencent_actions_deploy /tmp/tencent_actions_deploy.pub
```

---

## 8. 常见失败与排障

### 8.1 `Missing GitHub secret`

说明仓库里缺少对应 secret。

检查：

```bash
gh secret list
```

重新写入：

```bash
gh secret set TENCENT_DEPLOY_HOST --body "43.137.38.67"
```

### 8.2 SSH 连接失败

重点检查：

1. `TENCENT_DEPLOY_HOST`、`TENCENT_DEPLOY_PORT`、`TENCENT_DEPLOY_USER` 是否正确。
2. `TENCENT_DEPLOY_SSH_KEY` 是否是私钥，不是公钥。
3. 私钥对应的公钥是否已经加入服务器 `/home/ubuntu/.ssh/authorized_keys`。
4. 腾讯云安全组是否允许 22 端口。

### 8.3 服务器工作树不干净

日志会输出：

```bash
git status --short
```

处理方式：

```bash
ssh ubuntu@43.137.38.67
cd /home/ubuntu/enterprise-ai-survey
git status --short
```

如果是临时排障文件，先移走或备份；如果是应该进入仓库的改动，回到本地提交并 push。

不要在不理解差异的情况下直接执行：

```bash
git reset --hard
```

### 8.4 `pnpm prisma:deploy` 失败

通常优先看：

1. 服务器 `.env` 中 `DATABASE_URL` 是否正确。
2. PostgreSQL 是否运行。
3. 迁移 SQL 是否和当前数据库状态冲突。

排查命令：

```bash
ssh ubuntu@43.137.38.67
systemctl status postgresql --no-pager
cd /home/ubuntu/enterprise-ai-survey
pnpm prisma:deploy
```

### 8.5 公网入口失败但 PM2 在线

按层排查：

```bash
ssh ubuntu@43.137.38.67
pm2 status
systemctl is-active pm2-ubuntu
sudo nginx -t
curl -I http://127.0.0.1:3000/enterprise-ai-survey
curl -I http://43.137.38.67/enterprise-ai-survey
```

如果本机端口通但公网不通，优先看 Nginx。

如果公网 IP 通但域名不通，优先看 DNS、CDN、备案或证书。

---

## 9. 后续可升级方向

当前自动部署仍属于“单机 SSH 发布”，适合当前阶段。

后续可以继续升级：

1. 加 GitHub Environment 审批，让生产部署需要手动批准。
2. 增加数据库备份 step，在 Prisma 迁移前自动备份。
3. 改成 release 目录 + symlink，实现更清晰的回滚。
4. 引入 HTTPS 和域名正式入口后，把公网验收从 IP 改成域名。
5. 沉淀一篇通用 Wiki：`patterns/github-actions-ssh-pm2-deployment.md`。

---

## 10. 参考资料

1. GitHub 官方文档：GitHub Actions workflow syntax
   - 用于确认 `push`、`workflow_dispatch`、`concurrency`、job、step 和 secrets 上下文的 workflow 写法。
   - 地址：`https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions`
2. GitHub 官方文档：Using secrets in GitHub Actions
   - 用于确认 GitHub Actions 可以通过 `secrets` 上下文读取仓库 secrets，且 secret 值不应直接写入日志。
   - 地址：`https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions`
3. GitHub CLI 手册：`gh secret set`
   - 用于确认通过 `gh secret set` 写入 repository secrets 的命令方式。
   - 地址：`https://cli.github.com/manual/gh_secret_set`
4. 本地 Wiki：`~/wiki-global/wiki/patterns/nginx-pm2-nextjs-single-host-deployment.md`
5. 本地 Wiki：`~/wiki-global/wiki/patterns/pm2-systemd-handoff.md`
6. 本地 Wiki：`~/wiki-global/wiki/patterns/deployment-entry-layer-validation.md`
