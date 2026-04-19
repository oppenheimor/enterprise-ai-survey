# 企业 AI 转型评估 H5 腾讯云部署全流程实战记录

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档名称 | 企业 AI 转型评估 H5 腾讯云部署全流程实战记录 |
| 创建日期 | 2026-04-19 |
| 适用项目 | 企业 AI 转型评估 H5 |
| 部署目标 | 将当前 Next.js 全栈项目部署到腾讯云 Ubuntu 实例，并通过 `/enterprise-ai-survey` 子路径访问 |
| 当前线上入口 | `http://43.137.38.67/enterprise-ai-survey` |

---

## 1. 文档目标

本文档记录一次完整的真实部署过程，从服务器已购买后的初始化开始，到项目成功运行在腾讯云实例上，并完成子路径部署。

本文档重点不是只列命令，而是解释每一步背后的原因，尤其是以下容易误解的地方：

1. 为什么需要 Nginx，而不是直接暴露 Next.js 端口。
2. 为什么需要 PM2，而不是直接在终端里运行 `pnpm start`。
3. 为什么 PostgreSQL 线上用 `5432`，本地 Docker 可能用 `5433`。
4. 为什么子路径部署不能只靠 Nginx 改写。
5. 为什么 `Next.js basePath` 必须在构建时确定。
6. 为什么域名解析还没指向服务器时，IP 已成功不等于域名已成功。

---

## 2. 最终线上状态

### 2.1 服务器信息

| 项目 | 内容 |
|------|------|
| 云厂商 | 腾讯云 |
| 地域 | 南京 |
| 公网 IP | `43.137.38.67` |
| 登录用户 | `ubuntu` |
| 操作系统 | `Ubuntu Server 22.04 LTS 64位` |
| SSH 端口 | `22` |

### 2.2 软件版本

当前服务器已安装：

1. `Node.js v22.22.2`
2. `pnpm v10.19.0`
3. `PM2 v6.0.14`
4. `nginx`
5. `PostgreSQL 14`

### 2.3 项目运行信息

| 项目 | 内容 |
|------|------|
| 项目目录 | `/home/ubuntu/enterprise-ai-survey` |
| PM2 进程名 | `enterprise-ai-survey` |
| 应用监听地址 | `127.0.0.1:3000` |
| 数据库名 | `enterprise_ai_survey` |
| 数据库用户 | `survey_user` |
| 正式访问路径 | `/enterprise-ai-survey` |

### 2.4 当前可访问入口

1. 首页：`http://43.137.38.67/enterprise-ai-survey`
2. 看板页：`http://43.137.38.67/enterprise-ai-survey/dashboard`
3. 分析接口：`http://43.137.38.67/enterprise-ai-survey/api/survey/analysis`
4. 根路径：`http://43.137.38.67/` 当前返回 `404`

根路径返回 `404` 是当前设计结果，不是故障。当前项目被明确挂载在 `/enterprise-ai-survey` 子路径下。

---

## 3. 整体部署架构

当前部署链路如下：

```text
用户浏览器
  |
  | HTTP 80
  v
Nginx
  |
  | 反向代理 /enterprise-ai-survey
  v
Next.js 应用
  |
  | 127.0.0.1:3000
  v
PM2 托管的 pnpm start
  |
  | DATABASE_URL
  v
PostgreSQL 本机数据库
```

### 3.1 为什么需要 Nginx

Next.js 应用本身可以监听端口，例如 `3000`。但正式部署时，不建议直接把 `3000` 暴露给公网。

更推荐让 Nginx 做公网入口，原因如下：

1. Nginx 适合作为统一入口，监听标准端口 `80` 和 `443`。
2. Nginx 可以做反向代理，把公网请求转发给本机内部端口。
3. Nginx 后续可以统一处理 HTTPS、证书、重定向、压缩和访问控制。
4. 应用端口 `3000` 不需要暴露公网，安全边界更清楚。

简单说：

```text
公网只看见 Nginx
Nginx 再把请求交给 Next.js
```

这比“直接访问 `http://服务器IP:3000`”更适合生产部署。

### 3.2 为什么需要 PM2

如果直接运行：

```bash
pnpm start
```

只要 SSH 断开、终端关闭或进程崩溃，应用就可能停止。

PM2 的作用是：

1. 后台运行 Node.js 应用。
2. 应用异常退出后自动拉起。
3. 提供日志查看能力。
4. 配合 systemd 实现服务器重启后自动恢复。

本项目最终使用：

```bash
pm2 start "pnpm start" --name enterprise-ai-survey
pm2 save
```

并通过 `pm2-ubuntu.service` 交给 systemd 托管。

### 3.3 为什么 PostgreSQL 放在本机

首发阶段采用本机 PostgreSQL，原因是：

1. 项目还在早期验证阶段。
2. 单机部署故障边界更少。
3. 成本和复杂度更低。
4. 后续有真实访问量后，再迁移到托管数据库也来得及。

注意：

1. PostgreSQL 只允许本机访问。
2. 不要开放 `5432` 到公网。
3. 应用通过 `127.0.0.1:5432` 连接数据库。

---

## 4. 服务器初始化

### 4.1 登录服务器

```bash
ssh ubuntu@43.137.38.67
```

首次登录后建议更新系统：

```bash
sudo apt update
sudo apt upgrade -y
sudo timedatectl set-timezone Asia/Shanghai
```

### 4.2 配置 SSH 公钥

本次已将本机 SSH 公钥写入服务器：

```bash
~/.ssh/authorized_keys
```

这样后续可以免密登录服务器。

解释：

1. 密码登录适合首次初始化。
2. 公钥登录更适合长期维护。
3. 后续若要提升安全性，可以进一步禁用密码登录。

---

## 5. 安装运行环境

### 5.1 安装基础软件

```bash
sudo apt update
sudo apt install -y git curl unzip build-essential nginx postgresql postgresql-contrib
```

这些软件分别负责：

1. `git`：拉取代码。
2. `curl`：下载安装脚本和测试 HTTP 请求。
3. `build-essential`：编译部分 Node 依赖。
4. `nginx`：公网入口和反向代理。
5. `postgresql`：本机数据库。

### 5.2 安装 Node.js、pnpm、PM2

本次安装结果为：

1. `Node.js v22.22.2`
2. `pnpm v10.19.0`
3. `PM2 v6.0.14`

参考命令：

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo corepack enable
sudo corepack prepare pnpm@latest --activate
sudo npm install -g pm2
```

验证：

```bash
node -v
pnpm -v
pm2 -v
nginx -v
psql --version
```

解释：

当前项目使用 `Next.js 16.2.4`，它要求较新的 Node.js 版本。线上选择 Node.js 22，比压线使用 Node.js 20 更稳。

---

## 6. 配置 PostgreSQL

### 6.1 创建数据库用户和数据库

进入 PostgreSQL：

```bash
sudo -u postgres psql
```

创建用户和数据库：

```sql
CREATE USER survey_user WITH ENCRYPTED PASSWORD '你的强密码';
CREATE DATABASE enterprise_ai_survey OWNER survey_user;
\q
```

本次线上最终使用：

1. 数据库用户：`survey_user`
2. 数据库名：`enterprise_ai_survey`

### 6.2 数据库连接串

线上 `.env` 中最终配置为：

```env
DATABASE_URL="postgresql://survey_user:<数据库密码>@127.0.0.1:5432/enterprise_ai_survey?schema=public"
```

注意：

1. 本地 Docker 开发环境可能使用 `5433`。
2. 线上系统安装的 PostgreSQL 默认使用 `5432`。
3. 数据库密码中如果包含 `/` 等特殊字符，需要 URL 编码。

本次真实踩坑：

数据库密码中包含 `/`，因此连接串中需要写成 `%2F`，否则 Prisma 解析连接串时可能失败。

---

## 7. 获取项目代码

### 7.1 首次部署时的临时方式

本次最初为了快速上线，曾采用 `rsync` 从本机同步代码到服务器。

这种方式适合首发抢通链路，但不建议作为长期部署方式。

原因：

1. 线上代码不容易追溯到具体 Git commit。
2. 本地未提交文件也可能被同步到服务器，导致线上状态和仓库历史不一致。
3. 回滚依赖手工备份，不如 Git 版本清晰。
4. `rsync --delete` 如果目标目录选错，可能误删服务器文件。

因此后续部署流程应升级为：

```text
本地 commit/push -> GitHub -> 服务器 git pull -> 服务器构建并重启 PM2
```

### 7.2 推荐的长期方式：服务器从 GitHub 拉取代码

当前项目仓库：

```text
git@github.com:oppenheimor/enterprise-ai-survey.git
```

推荐在服务器上使用 GitHub deploy key 授权，只给服务器当前仓库的只读拉取权限。

首次配置详见：

```text
docs/deployment/GitHub拉取式部署指南.md
```

核心流程如下。

第一步，在服务器生成 deploy key：

```bash
ssh-keygen -t ed25519 \
  -C "enterprise-ai-survey-deploy@43.137.38.67" \
  -f ~/.ssh/enterprise_ai_survey_deploy \
  -N ""
```

第二步，把公钥添加到 GitHub 仓库：

```text
Settings -> Deploy keys -> Add deploy key
```

建议不勾选 `Allow write access`，让服务器只能拉代码，不能推代码。

第三步，在服务器配置 SSH Host 别名：

```sshconfig
Host github.com-enterprise-ai-survey
  HostName github.com
  User git
  IdentityFile ~/.ssh/enterprise_ai_survey_deploy
  IdentitiesOnly yes
```

第四步，备份旧目录后重新 clone：

```bash
cd /home/ubuntu
timestamp="$(date +%Y%m%d%H%M%S)"
cp -a enterprise-ai-survey "enterprise-ai-survey-backup-${timestamp}"
mv enterprise-ai-survey "enterprise-ai-survey-rsync-old-${timestamp}"

git clone git@github.com-enterprise-ai-survey:oppenheimor/enterprise-ai-survey.git enterprise-ai-survey
cp "/home/ubuntu/enterprise-ai-survey-rsync-old-${timestamp}/.env" /home/ubuntu/enterprise-ai-survey/.env
chmod 600 /home/ubuntu/enterprise-ai-survey/.env
```

第五步，在新目录中构建并重启：

```bash
cd /home/ubuntu/enterprise-ai-survey
pnpm install --frozen-lockfile
pnpm prisma:deploy
pnpm build
pm2 restart enterprise-ai-survey --update-env
pm2 save
```

### 7.3 后续常规发布命令

本地开发机先提交并推送：

```bash
git status
pnpm check
git add 需要发布的文件
git commit -m "描述本次发布"
git push origin main
```

服务器再拉取并发布：

```bash
cd /home/ubuntu/enterprise-ai-survey
git fetch origin main
git pull --ff-only origin main
pnpm install --frozen-lockfile
pnpm prisma:deploy
pnpm build
pm2 restart enterprise-ai-survey --update-env
pm2 save
```

关键解释：

1. 服务器只能拉取已经 push 到 GitHub 的代码。
2. `.env` 留在服务器，不进入 Git。
3. 使用 `git pull --ff-only`，是为了避免服务器部署目录出现隐式 merge。
4. 如果服务器目录被手工改过，发布应该失败并提示处理，而不是悄悄覆盖。
5. `git reset --hard origin/main` 只能在明确备份、确认服务器目录没有重要本地改动时使用。

### 7.4 当前已升级为 GitHub Actions 自动部署

本项目现在已经把第 7.3 节的常规发布命令封装进 GitHub Actions。

当前日常发布流程变为：

```bash
git status
pnpm check
git add 需要发布的文件
git commit -m "描述本次发布"
git push origin main
```

push 到 `main` 后，GitHub Actions 会自动：

1. 在 GitHub runner 上执行 `pnpm check`。
2. 通过专用 SSH key 登录 `ubuntu@43.137.38.67`。
3. 在 `/home/ubuntu/enterprise-ai-survey` 执行 `git pull --ff-only origin main`。
4. 执行 `pnpm install --frozen-lockfile`。
5. 执行 `pnpm prisma:deploy`。
6. 执行 `NEXT_PUBLIC_BASE_PATH="/enterprise-ai-survey" pnpm build`。
7. 执行 `pm2 restart enterprise-ai-survey --update-env` 和 `pm2 save`。
8. 验收 PM2、systemd、Nginx、本机端口和公网入口。

查看部署进度：

```text
GitHub 仓库 -> Actions -> Deploy Production
```

详细说明见：

```text
docs/deployment/GitHub Actions 自动部署指南.md
```

---

## 8. 配置线上环境变量

服务器上的环境变量文件位于：

```bash
/home/ubuntu/enterprise-ai-survey/.env
```

当前核心配置如下：

```env
DATABASE_URL="postgresql://survey_user:<数据库密码>@127.0.0.1:5432/enterprise_ai_survey?schema=public"
OPENAI_API_KEY="你的模型密钥"
OPENAI_BASE_URL="https://api.xiaomimimo.com/v1"
OPENAI_MODEL="mimo-v2-pro"
LLM_PROVIDER="mimo"
LLM_BASE_URL="https://api.xiaomimimo.com/v1"
LLM_API_KEY="你的模型密钥"
LLM_MODEL="mimo-v2-pro"
NEXT_PUBLIC_BASE_PATH="/enterprise-ai-survey"
```

### 8.1 为什么要配置 `NEXT_PUBLIC_BASE_PATH`

本项目最终部署在：

```text
/enterprise-ai-survey
```

Next.js 需要在构建时知道这个前缀，才能生成正确的静态资源路径、页面链接和 API 前缀。

因此需要：

```env
NEXT_PUBLIC_BASE_PATH="/enterprise-ai-survey"
```

注意：

`basePath` 是构建期配置。改了这个值之后，必须重新执行：

```bash
pnpm build
```

只重启 PM2 不够。

### 8.2 本次 `.env` 踩坑

本次曾出现过一个问题：

```env
MODEL="mimo-v2-pro"NEXT_PUBLIC_BASE_PATH="/enterprise-ai-survey"
```

原因是 `.env` 文件最后一行没有正常换行，追加新变量时被拼在同一行。

经验：

1. 修改 `.env` 后一定要 `cat .env` 或 `nl -ba .env` 检查。
2. 每个环境变量必须独占一行。
3. 不要把本地 `.env.example` 当成线上 `.env` 直接使用。

---

## 9. 安装依赖、生成 Prisma Client、执行迁移

进入项目目录：

```bash
cd /home/ubuntu/enterprise-ai-survey
```

安装依赖：

```bash
pnpm install --frozen-lockfile
```

生成 Prisma Client：

```bash
pnpm prisma:generate
```

执行线上迁移：

```bash
pnpm prisma:deploy
```

本次已经成功应用迁移：

1. `20260416181743_init`
2. `20260417093000_build_ai_survey_h5`
3. `20260417143000_upgrade_ai_health_report`

验证数据库表：

```bash
sudo -u postgres psql -d enterprise_ai_survey -c '\dt'
```

预期至少看到：

1. `SurveySubmission`
2. `_prisma_migrations`

---

## 10. 构建 Next.js 项目

执行：

```bash
pnpm build
```

本次构建成功，但出现过以下警告：

```text
Unsupported metadata viewport is configured...
```

解释：

这是 Next.js 对 `metadata.viewport` 的提示，建议后续把 viewport 拆到专门的 `viewport` export。它不是本次部署阻塞问题，不影响页面成功上线。

---

## 11. 用 PM2 托管应用

### 11.1 启动应用

```bash
cd /home/ubuntu/enterprise-ai-survey
pm2 start "pnpm start" --name enterprise-ai-survey
```

查看状态：

```bash
pm2 status
```

查看日志：

```bash
pm2 logs enterprise-ai-survey --lines 50
```

### 11.2 保存 PM2 进程列表

```bash
pm2 save
```

解释：

`pm2 save` 会把当前正在运行的进程列表保存下来，后续系统重启时可以恢复这些进程。

### 11.3 配置开机自启

执行：

```bash
pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

然后按 PM2 输出的提示执行 `sudo env ...` 那条命令。

最后：

```bash
pm2 save
```

### 11.4 本次 PM2/systemd 踩坑

本次遇到过：

```text
pm2-ubuntu.service enabled
但 status 是 failed
```

日志里出现：

```text
New main PID ... does not belong to service
Can't open PID file ... pm2.pid
```

原因：

先手工启动了 PM2 daemon，然后再让 systemd 接管，导致 systemd 认错主进程。

修复方式：

```bash
sudo -u ubuntu pm2 save
sudo -u ubuntu pm2 kill
sudo systemctl reset-failed pm2-ubuntu
sudo systemctl start pm2-ubuntu
systemctl status pm2-ubuntu --no-pager
sudo -u ubuntu pm2 status
```

经验：

1. `systemctl is-enabled pm2-ubuntu` 只是说明“设置了开机自启”。
2. 真正要看 `systemctl status pm2-ubuntu` 是否是 `active`。
3. “enabled 但 failed” 是假自启，不算完成。

---

## 12. 配置 Nginx

Nginx 站点文件：

```bash
/etc/nginx/sites-available/enterprise-ai-survey
```

启用软链接：

```bash
/etc/nginx/sites-enabled/enterprise-ai-survey
```

### 12.1 第一阶段：根路径反向代理

最初为了先验证应用可用，曾配置根路径代理：

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
}
```

此时访问：

```text
http://43.137.38.67
```

可以打开项目首页。

### 12.2 第二阶段：迁移到 `/enterprise-ai-survey`

后续用户明确要求项目入口为：

```text
http://43.137.38.67/enterprise-ai-survey
```

因此最终 Nginx 配置改为：

```nginx
server {
    listen 80;
    server_name 43.137.38.67 www.oppenheimor.tech oppenheimor.tech;

    location = / {
        return 404;
    }

    location = /enterprise-ai-survey {
        proxy_pass http://127.0.0.1:3000/enterprise-ai-survey;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location ^~ /enterprise-ai-survey/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
    }
}
```

检查配置：

```bash
sudo nginx -t
```

重载：

```bash
sudo systemctl reload nginx
```

### 12.3 Nginx 配置中的几个难点解释

#### `location = /enterprise-ai-survey`

这个规则专门处理没有尾部斜杠的路径：

```text
/enterprise-ai-survey
```

它把请求转发给：

```text
http://127.0.0.1:3000/enterprise-ai-survey
```

这样 Next.js 能按 `basePath` 正确识别首页。

#### `location ^~ /enterprise-ai-survey/`

这个规则处理子路径下面的所有请求，例如：

1. `/enterprise-ai-survey/dashboard`
2. `/enterprise-ai-survey/api/survey/analysis`
3. `/enterprise-ai-survey/_next/static/...`

`^~` 的含义是：只要前缀匹配这个路径，就优先使用这个 location，不再继续尝试正则匹配。

#### `proxy_set_header Host $host`

这行用于把原始请求 Host 传给 Next.js。

注意：

如果通过 shell 写 Nginx 配置，必须避免 `$host`、`$remote_addr` 等变量被 shell 提前展开。本次就踩过这个坑，导致 Nginx 报：

```text
invalid number of arguments in "proxy_set_header" directive
```

解决方式是在 heredoc 中正确转义，或使用不会展开变量的写法。

---

## 13. 为什么子路径部署不能只靠 Nginx

曾讨论过一种方案：

```text
/enterprise-ai-survey -> http://127.0.0.1:3000
/enterprise-ai-survey/dashboard -> http://127.0.0.1:3000/dashboard
```

表面看这很简单，但对 Next.js 应用不够可靠。

原因是 Next.js 页面里可能生成这些路径：

1. `/_next/static/...`
2. `/dashboard`
3. `/api/survey/analysis`
4. `/fonts/...`
5. `/favicon.ico`

如果只靠 Nginx 把一部分路径转发过去，应用内部仍然可能认为自己运行在根路径 `/`。

这样会出现：

1. 首页能打开，但静态资源 404。
2. 页面跳转跳回根路径。
3. API 请求打到错误位置。
4. 本地测试和线上路径语义不一致。

因此最终采用：

```js
// next.config.mjs
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/enterprise-ai-survey",
};

export default nextConfig;
```

### 13.1 `basePath` 的关键规则

1. `basePath` 必须在构建时确定。
2. 修改 `basePath` 后必须重新 `pnpm build`。
3. `next/link` 会自动处理 `basePath`。
4. 客户端 `fetch("/api/...")` 不会自动处理，需要手动加前缀。
5. `revalidatePath("/dashboard")` 按路由文件路径工作，不应该拼 `basePath`。

本项目新增了：

```ts
withBasePath("/api/survey/analysis")
```

用于处理客户端裸 `fetch` 场景。

### 13.2 字体资源的处理

原先 CSS 中如果直接写：

```css
url("/fonts/xxx.woff2")
```

子路径部署时可能变成根路径资源请求。

本次改为使用 `next/font/local`，让 Next.js 统一生成带 `/enterprise-ai-survey/_next/static/...` 前缀的字体资源。

---

## 14. 验收流程

### 14.1 本地服务器内验证

```bash
curl -I http://127.0.0.1:3000/enterprise-ai-survey
curl -I http://127.0.0.1:3000/enterprise-ai-survey/dashboard
curl -I http://127.0.0.1:3000/
```

预期：

1. `/enterprise-ai-survey` 返回 `200`
2. `/enterprise-ai-survey/dashboard` 返回 `200`
3. `/` 返回 `404`

### 14.2 公网验证

```bash
curl -I http://43.137.38.67/enterprise-ai-survey
curl -I http://43.137.38.67/enterprise-ai-survey/dashboard
curl -I http://43.137.38.67/enterprise-ai-survey/api/survey/analysis
curl -I http://43.137.38.67/
```

本次实际结果：

1. 首页返回 `200 OK`
2. 看板页返回 `200 OK`
3. 分析接口返回 `405 Method Not Allowed`
4. 根路径返回 `404 Not Found`

解释：

分析接口使用 `HEAD` 请求返回 `405` 是符合预期的，因为该接口不是为 `HEAD` 请求设计的。它能返回 `405`，说明请求已经命中了正确的 Next.js Route Handler。

### 14.3 进程验证

```bash
pm2 status
systemctl status pm2-ubuntu --no-pager
sudo systemctl status nginx --no-pager
```

预期：

1. `enterprise-ai-survey` 为 `online`
2. `pm2-ubuntu.service` 为 `active`
3. `nginx` 为 `active`

### 14.4 数据库验证

```bash
sudo -u postgres psql -d enterprise_ai_survey -c '\dt'
```

预期看到：

1. `SurveySubmission`
2. `_prisma_migrations`

---

## 15. 域名现状

当前 IP 部署已经完成，但域名入口尚未切换完成。

本次检查发现：

```text
www.oppenheimor.tech -> 104.21.62.232 / 172.67.139.237
oppenheimor.tech -> 104.21.62.232 / 172.67.139.237
```

这些是 Cloudflare IP，不是腾讯云服务器：

```text
43.137.38.67
```

这意味着：

1. 当前访问域名时，请求没有直接打到这台腾讯云服务器。
2. 即使 IP 部署成功，域名也不会自动生效。
3. 后续需要在 DNS 或 Cloudflare 中把域名指向 `43.137.38.67`。

### 15.1 内地服务器与备案

当前实例地域是南京，属于中国内地。

如果后续要正式通过域名对外提供服务，需要考虑：

1. 域名实名。
2. ICP 备案。
3. HTTPS 证书。
4. Cloudflare 或腾讯云 DNS 的解析策略。

---

## 16. 本次关键踩坑总结

### 16.1 Nginx 默认站点没有移除

现象：

访问公网 IP 时看到 Ubuntu/Nginx 默认欢迎页。

原因：

`/etc/nginx/sites-enabled/default` 仍然存在并生效。

解决：

```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sfn /etc/nginx/sites-available/enterprise-ai-survey /etc/nginx/sites-enabled/enterprise-ai-survey
sudo nginx -t
sudo systemctl reload nginx
```

经验：

看到 Nginx 欢迎页，不等于应用没启动，优先查 Nginx 站点配置。

### 16.2 PM2 看似自启，实际 failed

现象：

```bash
systemctl is-enabled pm2-ubuntu
```

显示：

```text
enabled
```

但：

```bash
systemctl status pm2-ubuntu
```

显示 failed。

原因：

手工启动的 PM2 daemon 与 systemd 接管发生 PID 冲突。

解决：

```bash
sudo -u ubuntu pm2 save
sudo -u ubuntu pm2 kill
sudo systemctl reset-failed pm2-ubuntu
sudo systemctl start pm2-ubuntu
```

经验：

`enabled` 只代表配置了开机启动，不代表现在真的能正常恢复。

### 16.3 `.env` 换行错误

现象：

```env
MODEL="mimo-v2-pro"NEXT_PUBLIC_BASE_PATH="/enterprise-ai-survey"
```

原因：

追加环境变量时，原文件末尾没有换行。

解决：

重写 `.env`，保证每个变量独占一行。

经验：

修改 `.env` 后执行：

```bash
nl -ba .env
```

比只 `cat .env` 更容易发现行级问题。

### 16.4 Nginx 变量被 shell 提前展开

现象：

```text
invalid number of arguments in "proxy_set_header" directive
```

原因：

写入 Nginx 配置时，`$host`、`$remote_addr` 等变量被 shell 提前处理掉。

解决：

在 heredoc 中正确转义这些变量，或使用不会展开变量的写法。

经验：

只要通过 shell 写 Nginx 配置，就要特别小心 `$`。

### 16.5 子路径部署不能偷懒

现象：

只想通过 Nginx 把 `/enterprise-ai-survey` 转发到 `/`。

风险：

1. 静态资源路径错。
2. API 请求路径错。
3. 页面跳转路径错。
4. 测试环境和线上环境行为不一致。

正确做法：

1. Next.js 配 `basePath`
2. Nginx 代理子路径
3. 重新构建
4. 全链路验证

---

## 17. 后续建议

### 17.1 短期建议

1. 创建腾讯云实例快照。
2. 配置数据库备份脚本。
3. 补一次真实表单提交流程 smoke test。
4. 修复 Next.js viewport metadata 警告。
5. 优化首屏 hydration，改善首次点击按钮响应延迟。

### 17.2 域名上线建议

如果要用 `www.oppenheimor.tech`：

1. 先确认备案状态。
2. 在 Cloudflare 或 DNS 中把域名指向 `43.137.38.67`。
3. 再配置 HTTPS。
4. 验证 `https://www.oppenheimor.tech/enterprise-ai-survey`。

### 17.3 后续新项目部署建议

用户已经明确后续新项目更倾向于新建实例，而不是都塞到一台服务器里。

这个判断是合理的，原因：

1. 应用隔离更清楚。
2. 环境变量不容易互相污染。
3. Nginx 配置更简单。
4. 故障不会互相拖累。
5. 后续迁移和下线更干净。

---

## 18. 常用运维命令速查

### 登录服务器

```bash
ssh ubuntu@43.137.38.67
```

### 查看应用状态

```bash
pm2 status
pm2 logs enterprise-ai-survey --lines 50
```

### 重启应用

```bash
cd /home/ubuntu/enterprise-ai-survey
pm2 restart enterprise-ai-survey --update-env
```

### 重新构建

```bash
cd /home/ubuntu/enterprise-ai-survey
pnpm build
pm2 restart enterprise-ai-survey --update-env
```

### 检查 Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl status nginx --no-pager
```

### 查看 Nginx 当前站点配置

```bash
sudo cat /etc/nginx/sites-available/enterprise-ai-survey
ls -l /etc/nginx/sites-enabled
```

### 检查 PM2 systemd 自启

```bash
systemctl is-enabled pm2-ubuntu
systemctl status pm2-ubuntu --no-pager
```

### 检查数据库

```bash
sudo -u postgres psql -d enterprise_ai_survey -c '\dt'
```

### 检查公网入口

```bash
curl -I http://43.137.38.67/enterprise-ai-survey
curl -I http://43.137.38.67/enterprise-ai-survey/dashboard
curl -I http://43.137.38.67/
```

---

## 19. 最终结论

本次部署已经完成以下闭环：

1. 服务器基础环境安装完成。
2. PostgreSQL 本机数据库可用。
3. Prisma migration 已执行。
4. Next.js 项目已构建成功。
5. PM2 已托管应用。
6. PM2 systemd 自启已修复并验证。
7. Nginx 已完成反向代理。
8. 项目已从根路径迁移到 `/enterprise-ai-survey` 子路径。
9. IP 访问链路已验证。
10. 部署经验和踩坑点已沉淀。

当前还未完成的是域名正式入口、HTTPS 和备案相关工作。这些属于上线入口治理，不是当前应用部署失败。
