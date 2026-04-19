## ADDED Requirements

### Requirement: 预览页留资弹窗解锁
系统 SHALL 在结果预览页通过弹窗完成留资并解锁 AI 详情分析，而不是跳转到独立留资页。

#### Scenario: 用户点击 AI 全面分析
- **WHEN** 用户在结果预览页点击 `AI 全面分析`
- **THEN** 系统 MUST 弹出留资弹窗
- **AND** 弹窗中 MUST 展示姓名、手机号、企业名称、备用联系方式和最关注问题字段

#### Scenario: 留资校验失败
- **WHEN** 用户在弹窗中提交无效留资信息
- **THEN** 系统 MUST 在弹窗内展示校验错误
- **AND** 系统 MUST NOT 进入详情分析页

#### Scenario: 留资成功
- **WHEN** 用户在弹窗中提交有效留资信息
- **THEN** 系统 MUST 保存留资数据
- **AND** 系统 MUST 继续进入 AI 详情分析页
