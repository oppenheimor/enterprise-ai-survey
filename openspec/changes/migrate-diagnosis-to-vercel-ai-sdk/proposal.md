## Why

当前评测诊断模块直接依赖 `openai` 客户端，后续如果替换小米 MiMo、OpenAI-compatible 或其他模型供应商，调用层会被单一厂商 SDK 绑住。

需要把诊断生成迁移到 Vercel AI SDK，让模型调用层保持 provider-agnostic，同时不改变用户问卷、评分、留资和报告输出体验。

## What Changes

- 将诊断模块的模型调用从 `openai` 客户端迁移到 Vercel AI SDK。
- 保留现有环境变量兼容方式：`OPENAI_*` 与通用 `LLM_*` 均可继续配置。
- 保留现有 Zod 诊断结果 schema 校验和失败 fallback，不改变报告字段结构。
- 移除运行时对 `openai` npm 包的直接依赖。
- 不改变问卷题目、评分规则、数据库模型、页面流程或结果展示。

## Capabilities

### New Capabilities
- `provider-agnostic-diagnosis-model`: 评测诊断模型调用通过 Vercel AI SDK 适配，支持 OpenAI-compatible endpoint 的可替换接入。

### Modified Capabilities

## Impact

- 影响代码：`lib/survey/diagnosis.ts`、依赖清单与锁文件。
- 影响配置：继续使用 `OPENAI_API_KEY` / `OPENAI_BASE_URL` / `OPENAI_MODEL` 或 `LLM_API_KEY` / `LLM_BASE_URL` / `LLM_MODEL`。
- 影响验证：需要通过类型检查、诊断基准测试和 OpenSpec 校验。
