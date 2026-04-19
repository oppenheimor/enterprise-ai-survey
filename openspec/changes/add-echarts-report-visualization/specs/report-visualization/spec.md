## ADDED Requirements

### Requirement: 报告页展示真实可视化图表
系统 SHALL 在结果预览页和完整报告页展示基于 ECharts 的真实可视化图表，用于表达企业 AI 转型诊断维度和推荐场景优先级。

#### Scenario: 预览页展示雷达图和优先级图
- **WHEN** 用户完成问卷并进入结果预览页
- **THEN** 系统展示三维度健康雷达图和场景优先级气泡图

#### Scenario: 完整报告页复用图表
- **WHEN** 用户留资并解锁完整报告
- **THEN** 系统继续展示同一诊断数据对应的雷达图和场景优先级气泡图

### Requirement: 图表数据必须来自现有诊断结果
系统 MUST 使用当前 `diagnosis` 中已有的 `dimensionReports`、`visualAnalysis.radar` 和 `visualAnalysis.priorityMatrix` 渲染图表，不得为了图表展示编造行业数据、ROI、节省金额或外部 benchmark。

#### Scenario: 图表渲染不扩展模型输出
- **WHEN** 系统生成报告图表
- **THEN** 图表只消费当前诊断结果 schema 已包含的数据

### Requirement: 图表组件必须安全运行在 Next.js 客户端
系统 SHALL 将 ECharts 初始化、窗口 resize 和实例销毁逻辑封装在客户端组件中，避免服务端渲染访问浏览器 API。

#### Scenario: 页面构建成功
- **WHEN** 执行生产构建
- **THEN** ECharts 组件不会因服务端 DOM 访问导致构建失败
