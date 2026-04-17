## 项目描述

AI 企业转型问卷的 H5 移动端网页项目，旨在通过一系列调查问句帮助想要转型 AI 的企业老板进行全面的分析评估。

## 技术栈

NextJS 全栈项目

技术栈：NextJS + TypeScript + TailwindCSS + Shadcn + React Hook Form + Zod + PostgreSQL + Prisma

部署：本地开发用 Docker，正式部署待定


mark：需求澄清、UI 风格确定

## 流程

根据需求文档先做整体规划，再拆分边界清晰、依赖明确的子需求。只有当子需求之间的文件边界、接口边界和交付顺序足够清楚时，才使用并行开发；并行场景优先采用 Agent Teams + git worktree，避免相互污染和高冲突合并。若边界不清晰，优先串行推进，先收敛方案，再拆并行。

凡是会改变用户行为、调研流程、评分/分析逻辑、数据模型、接口结构、外部集成或非简单 UI 行为的任务，编码前必须先走 OpenSpec：先用 `/opsx:propose` 明确目标、范围、非目标、验收标准和验证方式，再用 `/opsx:apply` 按当前 change 实现；验证通过、产物一致后，最后再执行 `/opsx:archive`。纯文案调整、孤立小 bug 修复且不改变预期行为时，可以不新建 change，但仍要说明验证方式。

开始实现前，先定义验证方案，再按风险补齐必要的测试，而不是机械要求所有任务一开始就写全所有单测和 e2e。默认要求是：重要行为改动必须有对应验证，优先补最能约束风险的测试；涉及跨页面核心流程、表单提交流程或关键回归风险时，再补 e2e。

每个子模块完成后，先调用 `/code-review-expert` 做 review，并优先清零 blocker 级问题；非阻塞建议要么当轮处理，要么明确记录暂不处理的原因，避免把风格分歧无限升级为阻塞项。完成 review 后执行验证：默认基线为 `pnpm check`；若该任务影响真实用户流程或关键页面，再补跑对应 e2e、手工 smoke test 或任务说明中要求的专项检查。

所有并行子任务完成后再合并主分支。合并后必须站在集成结果而不是子分支局部视角，重新做一轮整体 review，并再次执行完整验证；只有当基线检查通过、相关专项验证通过、OpenSpec 产物与实现一致时，任务才算完成。


## NextJS 官方规范

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
