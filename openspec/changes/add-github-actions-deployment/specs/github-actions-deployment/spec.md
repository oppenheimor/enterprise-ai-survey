## ADDED Requirements

### Requirement: Main branch push shall trigger production deployment

系统 SHALL 在 `main` 分支收到 push 后自动启动生产部署流水线，并允许维护者在 GitHub Actions 页面手动触发同一部署流程。

#### Scenario: Push to main starts deployment
- **WHEN** 代码被 push 到 `main` 分支
- **THEN** GitHub Actions 必须启动生产部署 workflow

#### Scenario: Manual dispatch starts deployment
- **WHEN** 维护者在 GitHub Actions 页面手动运行该 workflow
- **THEN** 系统必须执行与 `main` push 相同的部署步骤

### Requirement: Deployment shall run through server-side SSH orchestration

系统 SHALL 通过 GitHub Secrets 中的 SSH 凭据登录腾讯云服务器，并在服务器项目目录中完成代码拉取、依赖安装、数据库迁移、构建和 PM2 重启。

#### Scenario: Server-side deployment succeeds
- **WHEN** workflow 连接到服务器并开始部署
- **THEN** 服务器必须在 `/home/ubuntu/enterprise-ai-survey` 中拉取 `origin/main`、安装依赖、执行 Prisma 迁移、构建 Next.js、重启并保存 `enterprise-ai-survey` PM2 进程

#### Scenario: Dirty server worktree stops deployment
- **WHEN** 服务器项目目录存在未提交或未跟踪变更
- **THEN** workflow 必须失败并输出工作树状态，而不是强制覆盖服务器文件

### Requirement: Deployment logs shall expose staged progress

系统 SHALL 在 GitHub Actions 日志中展示清晰的部署阶段，并在 job summary 中记录目标提交、服务器提交和验收结果。

#### Scenario: Maintainer views deployment progress
- **WHEN** 维护者打开 GitHub Actions run
- **THEN** 日志必须按检查、SSH 准备、远程部署、远程验收、公网验收等阶段输出进度

#### Scenario: Maintainer views deployment summary
- **WHEN** workflow 完成
- **THEN** job summary 必须展示部署提交、服务器提交和主要访问入口

### Requirement: Production secrets shall stay outside the repository

系统 SHALL 使用 GitHub Secrets 保存 CI/CD 连接凭据，但业务 `.env` 与模型密钥不得写入 Git 仓库或 workflow 日志。

#### Scenario: Workflow uses SSH secret
- **WHEN** workflow 需要登录服务器
- **THEN** 它必须从 GitHub Secrets 读取 SSH 私钥、主机、端口和用户信息

#### Scenario: Server environment file remains server-local
- **WHEN** workflow 执行生产部署
- **THEN** 它只允许检查服务器 `.env` 是否存在，不得把 `.env` 内容上传到 GitHub 或打印到 Actions 日志

### Requirement: Deployment shall perform layered validation

系统 SHALL 在部署后执行分层验收，覆盖 PM2、systemd、Nginx、本机应用端口和公网子路径入口。

#### Scenario: Runtime validation succeeds
- **WHEN** 远程部署完成
- **THEN** workflow 必须验证 PM2 进程在线、`pm2-ubuntu` systemd 服务 active、Nginx 配置合法、本机 `/enterprise-ai-survey` 返回成功、公网首页和看板页返回成功

#### Scenario: Validation failure stops workflow
- **WHEN** 任一验收步骤失败
- **THEN** workflow 必须以失败状态结束，使 GitHub Actions 页面显示部署失败
