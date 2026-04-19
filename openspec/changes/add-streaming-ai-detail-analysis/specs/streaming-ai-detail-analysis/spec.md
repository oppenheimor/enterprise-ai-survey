## ADDED Requirements

### Requirement: AI 详情分析单页状态
系统 SHALL 在用户完成留资后进入当前 H5 单页流程内的 AI 详情分析状态，而不是跳转独立路由或恢复旧成功页。

#### Scenario: 用户解锁 AI 全面分析
- **WHEN** 用户在结果预览页完成留资提交
- **THEN** 系统 MUST 进入 `detailAnalysis` 状态
- **AND** 当前页面上下文中的问卷答案和本地评估结果 MUST 可继续用于详情分析展示

### Requirement: 图表先显示，AI 文本流式输出
系统 SHALL 在详情分析页先展示稳定的图表和状态信息，再以流式方式逐段展示 AI 文本分析。

#### Scenario: 用户进入详情分析页
- **WHEN** 详情分析页刚刚打开
- **THEN** 页面 MUST 先展示 AI 头部区和图表区
- **AND** 页面 MUST 显示 AI 分析进行中的状态

#### Scenario: 模型分析进行中
- **WHEN** 流式分析请求已发出且模型仍在生成
- **THEN** 文本分析区 MUST 按增量逐段追加内容
- **AND** 页面 MUST NOT 在模型完成前保持空白

### Requirement: Prompt 输入包含问题与答案全量上下文
系统 SHALL 在详情分析模型输入中包含问卷问题列表、用户答案文本、本地评估结果和明确的输出边界约束。

#### Scenario: 系统构造分析 prompt
- **WHEN** 系统为详情分析构造模型输入
- **THEN** prompt MUST 包含 Q1 到 Q16 的问题原文
- **AND** prompt MUST 包含用户每题的答案文本
- **AND** prompt MUST 包含本地评估的角色、阶段、六维分数和解释结果
- **AND** prompt MUST 包含禁止编造外部事实和禁止修改本地评估数值的约束

### Requirement: AI 详情分析体现 AI 身份
系统 SHALL 在详情分析页通过显式视觉锚点表明该内容由 AI 分析生成。

#### Scenario: 用户查看详情分析页
- **WHEN** 用户进入 AI 详情分析页
- **THEN** 页面 MUST 展示机器人图标或等价 AI 视觉标识
- **AND** 页面 MUST 让用户感知 AI 正在分析而不是静态渲染完成页
