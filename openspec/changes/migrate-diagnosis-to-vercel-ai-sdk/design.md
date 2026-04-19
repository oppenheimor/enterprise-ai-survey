## Context

评测提交后会把 16 道问卷答案、规则评分和场景解释交给 `generateDiagnosis`，生成结构化诊断结果。当前实现用 `openai` 包调用 chat completions，并通过 JSON schema 要求模型输出指定字段；模型失败时回退到确定性诊断。

用户明确要求技术侧不要继续使用 `openai` 库，而是迁移到 Vercel AI SDK，方便以后替换其他模型供应商。

## Goals / Non-Goals

**Goals:**
- 用 Vercel AI SDK 承接诊断模型调用。
- 保持现有 `generateDiagnosis` 入参、出参和 fallback 行为稳定。
- 兼容当前 OpenAI-compatible 与小米 MiMo 配置方式。
- 删除 `openai` 依赖，避免业务代码直接绑定 OpenAI SDK。

**Non-Goals:**
- 不引入流式 UI、聊天 UI 或工具调用展示。
- 不调整问卷题目、评分、数据库结构或报告视觉。
- 不改变模型提示词的业务边界。

## Decisions

- 使用 `generateObject` 而不是 `generateText`：诊断结果已经有 Zod schema，`generateObject` 能把结构化输出和校验放在同一层，减少手写 JSON parse 的脆弱性。
- 使用 `@ai-sdk/openai-compatible` 作为 provider：当前 MiMo endpoint 是 OpenAI-compatible 形态，保留 `baseURL` 和 `apiKey` 配置后，后续替换其他兼容供应商只需要改环境变量。
- 保留 fallback：外部模型不可用时，用户仍能拿到规则生成的初步诊断，避免核心提交路径被模型供应商故障阻断。
- 保留 `OPENAI_*` 兼容变量：已有配置不应因为 SDK 迁移而失效；同时继续推荐通用 `LLM_*` 变量承接非 OpenAI 供应商。

## Risks / Trade-offs

- Vercel AI SDK 的 provider 参数名与 OpenAI SDK 不完全一致 -> 通过类型检查和诊断基准测试约束。
- 某些 OpenAI-compatible endpoint 对结构化输出支持不完整 -> 继续保留 fallback，且最终结果仍过 `diagnosisSchema` 校验。
- 依赖迁移可能影响锁文件 -> 使用包管理器更新依赖并跑验证。
