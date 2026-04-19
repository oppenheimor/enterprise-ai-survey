## Why

当前报告页虽然已经按“图表总览、业务场景拆解、转型路线图、实用工具推荐”重排，但核心图表仍主要是卡片和进度条，视觉冲击力不足。用户希望引入 ECharts，让报告更像真正的移动端 H5 诊断报告，并提升首屏吸引力和结果可信感。

## What Changes

- 新增 ECharts 报告可视化能力，用真实图表替代部分伪图表表达。
- 在结果预览页展示雷达图和场景优先级气泡图。
- 在完整报告页复用同一套图表，并保留文字解释、路线图和工具推荐。
- 新增 ECharts 依赖，并以独立客户端组件封装图表初始化、 resize 和销毁逻辑。
- 不新增行业规模、行业 benchmark、精确 ROI、具体节省金额等当前输入无法支撑的内容。

## Capabilities

### New Capabilities

- `report-visualization`: 支持在 AI 转型诊断报告中展示移动端友好的 ECharts 可视化图表。

### Modified Capabilities

无。

## Impact

- 依赖：新增 `echarts`。
- 前端：新增报告图表组件，改造 `components/survey/survey-app.tsx` 的预览和完整报告展示。
- 数据：复用当前 `diagnosisSchema` 中的 `dimensionReports`、`visualAnalysis.radar` 和 `visualAnalysis.priorityMatrix`，不扩展数据库和模型输出 schema。
- 验证：需要通过 `pnpm typecheck`、相关单测、`pnpm check` 和 OpenSpec 校验。
