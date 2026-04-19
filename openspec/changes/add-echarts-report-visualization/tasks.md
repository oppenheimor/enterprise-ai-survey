## 1. 依赖与组件

- [x] 1.1 安装 `echarts` 依赖并更新锁文件。
- [x] 1.2 新增 `components/survey/report-charts.tsx`，封装雷达图和优先级气泡图。
- [x] 1.3 确保图表组件处理初始化、resize 和 dispose，不在服务端访问 DOM。

## 2. 报告页接入

- [x] 2.1 在结果预览页接入雷达图和优先级气泡图。
- [x] 2.2 在完整报告页复用雷达图和优先级气泡图。
- [x] 2.3 保留文字解释、路线图和工具推荐，不引入行业硬数据或 ROI 精算。

## 3. 验证

- [x] 3.1 运行 `pnpm typecheck` 和相关单测。
- [x] 3.2 运行 `pnpm check`。
- [x] 3.3 运行 `openspec validate add-echarts-report-visualization --strict`。
