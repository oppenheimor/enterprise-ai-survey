## Why

当前结果预览页已经完成本地评估重构，但用户在看到角色化预览后，还缺少一个能体现应用 AI 能力的“解锁深度分析”路径。需要在不打断当前 H5 单页流程的前提下，引入留资弹窗、AI 详情分析页和流式输出体验，让用户既完成线索提交，也能直观看到模型正在进行全面分析。

## What Changes

- 在结果预览页新增 `AI 全面分析` 按钮，作为详情分析入口。
- 点击按钮后弹出留资弹窗，复用现有留资字段与校验逻辑。
- 留资成功后进入单页 `detailAnalysis` 状态，而不是跳独立路由或恢复旧成功页。
- 详情分析页新增机器人头部区、图表区和流式 AI 文本分析区。
- 新增流式分析接口，用于边生成边展示详情分析内容。
- 升级模型 prompt，显式传入 16 题问题列表、用户答案、本地评估结果和分析约束。
- 保留结构化诊断结果，用于图表和最终详情展示，但将流式 narrative 与最终结构化结果分层处理。

## Capabilities

### New Capabilities
- `streaming-ai-detail-analysis`: 留资后进入 AI 详情分析页，并以流式方式展示模型分析内容。
- `lead-capture-unlock-modal`: 通过预览页弹窗完成留资并解锁 AI 详情分析。

### Modified Capabilities
- `persona-preview-presentation`: 预览页新增 `AI 全面分析` 解锁入口。
- `survey-h5-experience`: 主流程从“本地预览结束”扩展为“本地预览 -> 留资弹窗 -> AI 详情分析”。

## Impact

- 影响代码：`components/survey/survey-app.tsx`、`components/survey/result-preview.tsx`、`app/actions.ts`、`lib/survey/diagnosis.ts`、`lib/validations/survey.ts`、新增流式 route handler 与详情页组件。
- 影响前台用户行为：预览页 CTA、留资方式、详情分析呈现方式和模型调用时机。
- 不改数据库 schema，继续复用现有留资和 `diagnosis` 持久化结构。
