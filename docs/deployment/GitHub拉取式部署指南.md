# GitHub 拉取式部署指南

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档名称 | GitHub 拉取式部署指南 |
| 创建日期 | 2026-04-19 |
| 适用项目 | 企业 AI 转型评估 H5 |
| 目标 | 将部署方式从“本地直接上传代码”升级为“服务器从 GitHub 拉取代码后构建发布” |
| 当前仓库 | `git@github.com:oppenheimor/enterprise-ai-survey.git` |
| 当前服务器目录 | `/home/ubuntu/enterprise-ai-survey` |
| 当前线上入口 | `http://43.137.38.67/enterprise-ai-survey` |

---

## 1. 为什么要改成 GitHub 拉取式部署

之前的部署方式是从本机用 `rsync` 把代码直接同步到服务器。它适合第一次快速上线，但不适合作为长期发布流程。

直接上传代码的问题：

1. 服务器上的代码来源不清楚，无法快速回答“线上跑的是哪个 commit”。
2. 本地未提交文件也可能被同步上去，线上状态容易和 Git 历史脱节。
3. 多台电脑或多人协作时，很难统一发布入口。
4. 回滚困难，只能靠备份目录或重新上传。
5. `--delete` 用错目标目录时，可能误删服务器上的文件。

GitHub 拉取式部署的目标：

1. GitHub 是唯一代码源。
2. 服务器只从指定分支或指定 commit 拉取代码。
3. 每次发布都可以追溯到 Git commit。
4. 线上 `.env`、数据库和 PM2/Nginx 配置继续留在服务器，不进入 Git。
5. 后续可以平滑升级到 GitHub Actions 自动发布。

一句话总结：

```text
本地负责 commit 和 push，服务器负责 pull、install、migrate、build、restart。
```

---

## 2. 推荐方案

当前阶段推荐使用：

```text
GitHub 私有仓库
  -> 服务器 deploy key 只读拉取
  -> 服务器本地构建
  -> PM2 重启 Next.js
  -> Nginx 继续代理 /enterprise-ai-survey
```

不建议当前就上复杂 CI/CD 的原因：

1. 当前只有一台服务器和一个应用实例。
2. 部署链路还在沉淀阶段。
3. 手动拉取式部署足够可追溯，也足够简单。
4. 等发布频率变高后，再把同一套命令封装进 GitHub Actions 即可。

---

## 3. 难点解释

### 3.1 什么是 deploy key

deploy key 是放在服务器上的一对 SSH 密钥。

它的作用是让服务器可以访问某一个 GitHub 仓库，而不是把你的个人 GitHub 私钥放到服务器上。

推荐使用 deploy key 的原因：

1. 权限更小，只授权当前仓库。
2. 服务器被攻破时，不会直接暴露你的个人 GitHub 账号 SSH 私钥。
3. 默认可以配置成只读，服务器只能拉代码，不能向仓库推代码。

注意：

1. 不要把 deploy key 的私钥提交到 Git。
2. 不要给当前服务器 deploy key 开写权限，除非你明确需要服务器 push 代码。
3. 一个 deploy key 不能同时复用到多个 GitHub 仓库。多个仓库应分别创建 key。

### 3.2 为什么 `.env` 不进 Git

`.env` 里有数据库密码、模型 API Key 等敏感信息。

正确做法是：

1. Git 里只保留 `.env.example`。
2. 服务器上单独维护真实 `.env`。
3. 重新 clone 项目时，从旧目录或备份目录复制 `.env`。

### 3.3 为什么服务器不能拉到未提交代码

服务器只能从 GitHub 拉取已经 push 到远端仓库的内容。

如果本地还有未提交或未 push 的改动，服务器看不到这些文件。

因此每次发布前，本地必须先完成：

```bash
git status
git add 需要发布的文件
git commit -m "描述本次发布"
git push origin main
```

然后服务器才能拉到对应版本。

---

## 4. 首次配置 GitHub 拉取权限

以下命令在服务器执行：

```bash
ssh ubuntu@43.137.38.67
```

### 4.1 生成服务器专用 deploy key

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh

ssh-keygen -t ed25519 \
  -C "enterprise-ai-survey-deploy@43.137.38.67" \
  -f ~/.ssh/enterprise_ai_survey_deploy \
  -N ""

chmod 600 ~/.ssh/enterprise_ai_survey_deploy
chmod 644 ~/.ssh/enterprise_ai_survey_deploy.pub
```

查看公钥：

```bash
cat ~/.ssh/enterprise_ai_survey_deploy.pub
```

把输出的整行公钥复制到 GitHub。

### 4.2 在 GitHub 仓库添加 deploy key

进入 GitHub 仓库：

```text
oppenheimor/enterprise-ai-survey
```

操作路径：

```text
Settings -> Deploy keys -> Add deploy key
```

建议填写：

```text
Title: enterprise-ai-survey tencent cloud deploy key
Key: 粘贴服务器上的 enterprise_ai_survey_deploy.pub
Allow write access: 不勾选
```

不勾选写权限的含义是：服务器只能 `git clone`、`git fetch`、`git pull`，不能 `git push`。

### 4.3 配置 SSH Host 别名

在服务器执行：

```bash
nano ~/.ssh/config
```

写入：

```sshconfig
Host github.com-enterprise-ai-survey
  HostName github.com
  User git
  IdentityFile ~/.ssh/enterprise_ai_survey_deploy
  IdentitiesOnly yes
```

设置权限：

```bash
chmod 600 ~/.ssh/config
```

测试连通性：

```bash
ssh -T git@github.com-enterprise-ai-survey
```

如果看到类似认证成功或仓库识别成功的提示，说明 deploy key 已经生效。GitHub 的 SSH 测试通常不会提供 shell 登录能力，所以看到“已认证但不能 shell 登录”也属于正常现象。

如果提示 `Permission denied (publickey)`，通常说明公钥没有加到仓库、SSH Host 别名没有生效，或私钥权限不正确。

---

## 5. 首次把服务器目录切换为 Git 管理

当前服务器上的 `/home/ubuntu/enterprise-ai-survey` 是直接上传代码形成的目录，不一定是 Git 仓库。

安全切换方式是：先备份旧目录，再重新 clone。

### 5.1 备份旧目录

在服务器执行：

```bash
cd /home/ubuntu

timestamp="$(date +%Y%m%d%H%M%S)"
cp -a enterprise-ai-survey "enterprise-ai-survey-backup-${timestamp}"
```

确认备份存在：

```bash
ls -ld /home/ubuntu/enterprise-ai-survey-backup-*
```

### 5.2 停止当前应用

```bash
pm2 stop enterprise-ai-survey
```

停止应用不是删除应用。这样可以避免切换目录时，PM2 还在使用旧构建产物。

### 5.3 临时移走旧目录并 clone

```bash
cd /home/ubuntu

timestamp="$(ls -td enterprise-ai-survey-backup-* | head -1 | sed 's/^enterprise-ai-survey-backup-//')"
mv enterprise-ai-survey "enterprise-ai-survey-rsync-old-${timestamp}"

git clone git@github.com-enterprise-ai-survey:oppenheimor/enterprise-ai-survey.git enterprise-ai-survey
cd enterprise-ai-survey
```

检查当前分支和 commit：

```bash
git branch --show-current
git log -1 --oneline
```

### 5.4 恢复服务器 `.env`

```bash
cp "/home/ubuntu/enterprise-ai-survey-rsync-old-${timestamp}/.env" /home/ubuntu/enterprise-ai-survey/.env
chmod 600 /home/ubuntu/enterprise-ai-survey/.env
```

检查 `.env` 是否存在：

```bash
ls -l /home/ubuntu/enterprise-ai-survey/.env
```

不要把 `.env` 加进 Git。

---

## 6. 首次用 GitHub 代码重新部署

在服务器执行：

```bash
cd /home/ubuntu/enterprise-ai-survey
pnpm install --frozen-lockfile
pnpm prisma:deploy
pnpm build
```

如果构建成功，重新启动 PM2：

```bash
pm2 delete enterprise-ai-survey
pm2 start "HOSTNAME=127.0.0.1 PORT=3000 pnpm start" --name enterprise-ai-survey
pm2 save
```

如果不想删除已有 PM2 进程，也可以：

```bash
pm2 restart enterprise-ai-survey --update-env
pm2 save
```

两种方式的区别：

1. `pm2 delete && pm2 start` 更适合首次切换部署目录。
2. `pm2 restart` 更适合后续常规发布。

---

## 7. 后续常规发布流程

### 7.1 本地发布前

在本地开发机执行：

```bash
git status
pnpm check
git add 需要发布的文件
git commit -m "描述本次发布"
git push origin main
```

关键原则：

1. 只发布已经 commit 的内容。
2. 只发布已经 push 到 GitHub 的内容。
3. 不要依赖本地未提交文件完成线上部署。

### 7.2 服务器拉取并发布

在服务器执行：

```bash
ssh ubuntu@43.137.38.67

cd /home/ubuntu/enterprise-ai-survey

git fetch origin main
git status
git log --oneline -5
git pull --ff-only origin main

pnpm install --frozen-lockfile
pnpm prisma:deploy
pnpm build

pm2 restart enterprise-ai-survey --update-env
pm2 save
```

为什么使用 `git pull --ff-only`：

1. 服务器部署目录不应该手工改代码。
2. 如果服务器上出现本地提交或冲突，`--ff-only` 会直接失败，提醒你先处理状态。
3. 它比无脑 `git reset --hard` 更安全。

如果服务器目录确实只作为部署目录，并且已经确认没有任何服务器侧代码改动，才可以在明确备份后使用强制对齐：

```bash
git fetch origin main
git reset --hard origin/main
```

这条命令会丢弃服务器目录里的本地改动，不能随手执行。

---

## 8. 发布后验收

服务器执行：

```bash
pm2 status
systemctl status pm2-ubuntu --no-pager
sudo nginx -t
```

从任意机器执行：

```bash
curl -I http://43.137.38.67/enterprise-ai-survey
curl -I http://43.137.38.67/enterprise-ai-survey/dashboard
curl -I http://43.137.38.67/enterprise-ai-survey/api/survey/analysis
curl -I http://43.137.38.67/
```

预期：

1. `/enterprise-ai-survey` 返回 `200` 或正常重定向后可访问。
2. `/enterprise-ai-survey/dashboard` 返回可访问响应。
3. `/enterprise-ai-survey/api/survey/analysis` 至少能打到应用。`GET` 若返回 `405`，通常说明路由存在但方法不匹配，不等于 Nginx 入口失败。
4. `/` 返回 `404`，这是当前子路径部署设计，不是故障。

还应完成一次真实业务验收：

1. 打开首页。
2. 点击“立即开始评测”。
3. 完成问卷提交。
4. 检查结果页和详细分析入口。
5. 确认数据库有新增记录。

---

## 9. 回滚方式

### 9.1 Git 回滚到上一个 commit

先查看最近 commit：

```bash
git log --oneline -10
```

切换到目标 commit：

```bash
git checkout <commit_sha>
pnpm install --frozen-lockfile
pnpm prisma:deploy
pnpm build
pm2 restart enterprise-ai-survey --update-env
```

注意：

1. 这种方式会让服务器处于 detached HEAD 状态。
2. 临时止血可以接受，长期应在 GitHub 上通过 revert commit 修正主分支。

### 9.2 回滚到备份目录

如果首次切换 Git 部署失败，可以临时回滚旧目录。下面的 `<timestamp>` 应替换为前面实际生成的备份时间戳：

```bash
cd /home/ubuntu
pm2 stop enterprise-ai-survey

mv enterprise-ai-survey "enterprise-ai-survey-git-failed-$(date +%Y%m%d%H%M%S)"
mv "enterprise-ai-survey-rsync-old-<timestamp>" enterprise-ai-survey

cd /home/ubuntu/enterprise-ai-survey
pm2 restart enterprise-ai-survey --update-env
```

这只是应急手段。长期仍应修复 Git 拉取式部署链路。

---

## 10. GitHub Actions 自动发布

当前项目已经在手动 GitHub 拉取式部署之上，新增了 GitHub Actions 自动部署：

```text
push main
  -> GitHub Actions
  -> SSH 登录服务器
  -> 执行本文第 7.2 节同一套 pull/build/restart 命令
  -> 分层验收并输出部署进度
```

对应 workflow：

```bash
.github/workflows/deploy.yml
```

自动部署没有改变本文的核心原则：

1. GitHub 仍然是唯一代码源。
2. 服务器仍然从 GitHub 拉取代码。
3. 服务器 `.env` 仍然留在服务器，不进入 GitHub。
4. 部署仍然使用 `git pull --ff-only`，不会强制覆盖服务器工作树。
5. PM2、systemd、Nginx、本机端口和公网入口仍然要分层验收。

更多细节见：

```text
docs/deployment/GitHub Actions 自动部署指南.md
```

---

## 11. 后续可升级方向

当前方案是 GitHub Actions 触发的单机 SSH 自动部署。

后续可以继续升级为：

```text
GitHub Actions
  -> 构建 release 目录
  -> 迁移前数据库备份
  -> symlink 原子切换
  -> 支持快速回滚到上一版 release
```

但当前阶段不急着引入 release 目录或蓝绿部署。原因是只有一台服务器和一个应用实例，先把“可追溯、可自动触发、可分层验收”的闭环跑稳定更重要。

---

## 12. 本项目当前迁移检查清单

在真正切换服务器前，需要确认：

1. 本地当前要发布的代码已经全部 commit。
2. 本地当前要发布的代码已经 push 到 `origin/main`。
3. GitHub 仓库 `oppenheimor/enterprise-ai-survey` 能看到最新 commit。
4. 服务器已创建 deploy key。
5. GitHub 仓库已添加 deploy key，且不勾选写权限。
6. 服务器 `ssh -T git@github.com-enterprise-ai-survey` 成功。
7. 旧目录已备份。
8. `.env` 已从旧目录复制到新 clone 目录。
9. `pnpm build` 成功。
10. PM2、Nginx、HTTP 入口和业务流程验收通过。

如果第 1、2、3 条没完成，服务器无论怎么配置都拉不到最新代码。

---

## 13. 参考资料

本指南结合了以下资料：

1. GitHub 官方文档：`Managing deploy keys`
   - 用于确认 deploy key 是仓库级 SSH key、默认只读、可选写权限、单个 deploy key 不应复用到多个仓库，以及多仓库场景可用 SSH Host 别名。
   - 地址：`https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys`
2. 本地 Wiki：`~/wiki-global/wiki/patterns/nginx-pm2-nextjs-single-host-deployment.md`
   - 用于复用当前项目的 Nginx + PM2 + Next.js 单机部署模式。
3. 本地 Wiki：`~/wiki-global/wiki/patterns/nextjs-subpath-deployment.md`
   - 用于确认当前项目继续保留 `/enterprise-ai-survey` 子路径部署语义。
4. 本地 Wiki：`~/wiki-global/wiki/patterns/pm2-systemd-handoff.md`
   - 用于延续 PM2 与 systemd 接管的验收要求。
5. 本地 Wiki：`~/wiki-global/wiki/patterns/deployment-entry-layer-validation.md`
   - 用于保留按应用、本机端口、Nginx、公网入口和业务流程分层验收的思路。
