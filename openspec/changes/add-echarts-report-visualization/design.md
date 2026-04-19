## Context

当前报告页已经重排为图表总览、业务场景拆解、转型路线图、实用工具推荐四块，但“图表总览”仍主要依赖卡片、进度条和文字矩阵。为了让移动端 H5 更有冲击力，需要引入真实可视化图表，同时保持现有报告数据边界：只使用当前 `diagnosisSchema` 已提供的评分、雷达和优先级矩阵数据。

Next.js App Router 要求浏览器 API 和交互式图表逻辑放在客户端组件中。ECharts 需要访问 DOM 初始化实例，因此必须封装在 `'use client'` 文件中，并在组件卸载时释放实例。

## Goals / Non-Goals

**Goals:**

- 用 ECharts 雷达图展示三项诊断维度。
- 用 ECharts 气泡散点图展示场景优先级矩阵。
- 在预览页和完整报告页复用同一套图表组件。
- 保持移动端 H5 的视觉张力，同时提供文字和数值辅助信息。
- 不扩展 LLM 输出 schema，不新增数据库字段。

**Non-Goals:**

- 不做行业规模趋势、行业 benchmark、CR10、ROI 精算或节省金额预测。
- 不引入复杂图表状态管理或通用图表 DSL。
- 不把路线图强行做成复杂甘特图，当前仍保留移动端可读的卡片式路线图。

## Decisions

1. 使用 `echarts` 而不是 `echarts-for-react`
   - 原因：直接使用 ECharts 核心 API 可以减少额外包装依赖，也便于控制实例生命周期。
   - 备选：使用 `echarts-for-react`。拒绝原因是多引入一个封装依赖，对当前两个图表场景收益有限。

2. 新增 `components/survey/report-charts.tsx`
   - 原因：图表组件需要 `useEffect`、DOM ref、resize 监听和 dispose。单独封装可以让主问卷组件只负责布局。
   - 该文件作为客户端组件叶子节点，接收已序列化的数组数据，不接收函数。

3. 首期只做两个 ECharts 图表
   - `AIHealthRadarChart`：对应 `dimensionReports` 或 `visualAnalysis.radar`。
   - `PriorityMatrixChart`：对应 `visualAnalysis.priorityMatrix`。
   - 原因：这两张图直接对应当前产品最重要的问题：“当前健康度如何”和“先做哪个场景”。

4. 保留文字卡片作为图表解释层
   - 原因：ECharts 提升吸引力，但企业负责人仍需要明确解释、风险边界和下一步动作。

## Risks / Trade-offs

- ECharts 增加客户端包体 → 通过拆分独立组件降低主组件复杂度，后续如包体压力明显再考虑动态加载。
- 图表在极小屏幕可读性下降 → 图表高度固定在移动端可读范围，并保留数值卡片作为替代解释。
- 颜色过度炫技影响可信度 → 采用当前品牌橙色和冷色辅助，不引入过多无意义渐变。
