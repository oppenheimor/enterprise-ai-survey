---
name: product-manager
description: 产品经理智能助手，支持需求分析、用户故事拆解、功能优先级评估、PRD文档生成、竞品分析、OKR规划、路线图设计等产品全流程工作。当用户提到需求分析、PRD、用户故事、产品规划、竞品分析、功能设计、OKR、路线图时必须使用此技能。
dependency:
  npm:
    - marked@^9.0.0
id: product-manager
---

# 产品经理智能助手技能

## 功能概述
本技能为产品经理提供全流程智能化支持，从需求收集到产品上线，覆盖产品管理的各个关键环节。

## 核心能力

### 1. 需求分析
- 用户需求挖掘与整理
- 需求优先级评估（Kano模型、MoSCoW法则）
- 需求可行性分析
- 需求变更影响评估

### 2. 用户故事编写
- 标准用户故事格式生成
- 验收标准（AC）定义
- 故事点估算建议
- 史诗（Epic）拆分为用户故事

### 3. PRD文档生成
- 产品背景与目标
- 功能详细说明
- 交互流程设计
- 数据指标定义
- 风险评估与应对

### 4. 竞品分析
- 竞品功能对比矩阵
- 差异化策略建议
- 市场定位分析
- SWOT分析

### 5. 产品规划
- 版本迭代规划
- 功能路线图设计
- 资源评估与排期
- OKR目标拆解

## 使用场景
- 新功能需求分析与设计
- 产品迭代规划会议准备
- 竞品调研与分析报告
- 用户故事梳理与估算
- PRD文档快速生成

## 操作步骤

### 1. 需求输入
- 用户提供产品需求描述
- 可选：提供用户调研数据、竞品信息

### 2. 分析处理
- 调用 `scripts/analyze.js` 进行需求分析
- 使用结构化框架输出分析结果

### 3. 文档输出
- 生成标准化的产品文档
- 支持Markdown格式导出

## 资源索引

### 脚本工具
- **[scripts/llm-analyze.js](scripts/llm-analyze.js)** ⭐ 推荐
  - 用途: LLM增强的产品分析脚本，结合大模型进行深度智能分析
  - 触发时机: 需要高质量、深度分析时，**优先调用此脚本**
  - 支持LLM: OpenAI、Anthropic、DeepSeek、通义千问
  - 分析类型: requirement、user-story、prd、competitive、okr、roadmap、priority、user-insight、clarification
  - 环境变量: `LLM_API_KEY`、`LLM_PROVIDER`

- **[scripts/analyze.js](scripts/analyze.js)**
  - 用途: 本地规则引擎分析脚本（无需LLM API）
  - 触发时机: 无LLM API时使用，或需要快速分析时
  - 输入参数: 需求描述、分析类型(requirement|user-story|prd|competitive|okr|roadmap|priority|impact)
  - 输出格式: JSON对象包含分析结果

- **[scripts/collect.js](scripts/collect.js)**
  - 用途: 交互式需求收集脚本
  - 触发时机: 当用户需要系统化收集需求时调用
  - 支持模式: interactive(交互式)、analyze(快速分析)、check(完整性检查)

### 模板资源
- **[templates/prd-template.md](templates/prd-template.md)**
  - 内容: PRD文档标准模板
  - 使用时机: 生成PRD文档时参考

- **[templates/user-story-template.md](templates/user-story-template.md)**
  - 内容: 用户故事标准模板
  - 使用时机: 编写用户故事时参考

- **[templates/competitive-analysis-template.md](templates/competitive-analysis-template.md)**
  - 内容: 竞品分析报告模板
  - 使用时机: 进行竞品分析时参考

- **[templates/roadmap-template.md](templates/roadmap-template.md)**
  - 内容: 产品路线图模板
  - 使用时机: 制定产品规划时参考

- **[templates/review-checklist.md](templates/review-checklist.md)**
  - 内容: 需求评审检查清单
  - 使用时机: 需求评审会议前使用

- **[templates/metrics-dictionary.md](templates/metrics-dictionary.md)**
  - 内容: 数据指标字典
  - 使用时机: 定义和规范产品指标时参考

- **[templates/dashboard-design-guide.md](templates/dashboard-design-guide.md)**
  - 内容: 数据看板设计指南
  - 使用时机: 设计数据看板、BI报表、监控大屏时参考

- **[templates/launch-checklist.md](templates/launch-checklist.md)**
  - 内容: 产品上线检查清单
  - 使用时机: 产品上线前验收检查

- **[templates/iteration-review.md](templates/iteration-review.md)**
  - 内容: 产品迭代复盘模板
  - 使用时机: 迭代结束后复盘总结

### 参考文档
- **[references/requirement-framework.md](references/requirement-framework.md)**
  - 内容: 需求分析方法论与框架
  - 使用时机: 进行深度需求分析时，**必须先读取此文档**

- **[references/user-research-methodology.md](references/user-research-methodology.md)**
  - 内容: 用户调研方法论
  - 使用时机: 进行用户访谈、问卷调查、可用性测试时参考

- **[references/priority-model.md](references/priority-model.md)**
  - 内容: 产品需求优先级评估模型
  - 使用时机: 需求优先级评估、功能排序时参考

- **[references/ai-workflow-guide.md](references/ai-workflow-guide.md)**
  - 内容: AI产品经理工作流使用指南
  - 使用时机: 了解如何使用AI工作流自动执行产品管理任务

## 产品思维框架

### 需求分析五步法
1. **场景还原** - 用户在什么场景下遇到问题
2. **痛点挖掘** - 问题的根本原因是什么
3. **价值评估** - 解决这个问题的价值有多大
4. **方案设计** - 有哪些可行的解决方案
5. **优先排序** - 应该先做哪个方案

### 用户故事拆解原则
- INVEST原则（Independent, Negotiable, Valuable, Estimable, Small, Testable）
- 单个故事不超过3个故事点
- 每个故事必须有明确的验收标准

### 功能优先级评估维度
| 维度 | 权重 | 说明 |
|------|------|------|
| 用户价值 | 40% | 对用户的核心价值 |
| 业务价值 | 30% | 对业务的贡献度 |
| 实现成本 | 20% | 开发难度与资源消耗 |
| 风险程度 | 10% | 技术与市场风险 |

## 分析类型说明

| 分析类型 | 说明 | 输出内容 |
|----------|------|----------|
| requirement | 需求详细分析 | 关键词、用户群体、痛点、优先级、复杂度、风险 |
| user-story | 用户故事生成 | 用户故事列表、验收标准、故事点估算 |
| prd | PRD文档结构 | 完整PRD文档框架 |
| competitive | 竞品分析 | 市场概览、竞品对比、SWOT分析 |
| okr | OKR规划 | 目标与关键结果 |
| roadmap | 路线图 | 版本规划、里程碑 |
| priority | 优先级分析 | RICE评分、优先级矩阵 |
| impact | 影响分析 | 用户/业务/技术影响评估 |
| user-insight | 用户洞察 | 用户画像、用户旅程、待办任务 |
| clarification | 需求澄清 | 模糊点识别、澄清问题 |

## LLM增强分析

### 支持的LLM提供商
| 提供商 | 环境变量 | 默认模型 |
|--------|----------|----------|
| OpenAI | `LLM_API_KEY` | gpt-4 |
| Anthropic | `LLM_API_KEY` + `LLM_PROVIDER=anthropic` | claude-3-opus |
| DeepSeek | `LLM_API_KEY` + `LLM_PROVIDER=deepseek` | deepseek-chat |
| 通义千问 | `LLM_API_KEY` + `LLM_PROVIDER=qwen` | qwen-max |

### 使用方式

**命令行调用**:
```bash
# 设置环境变量
export LLM_API_KEY="your-api-key"
export LLM_PROVIDER="openai"  # 可选

# 执行分析
node scripts/llm-analyze.js requirement "用户需要一个任务管理系统"
node scripts/llm-analyze.js user-story "支持任务的创建、分配和跟踪"
node scripts/llm-analyze.js prd "构建一个高效的团队协作工具"
```

**模块导入**:
```javascript
const { createLLMAnalyzer } = require('./scripts/llm-analyze.js');

const analyzer = createLLMAnalyzer({
  provider: 'openai',
  apiKey: process.env.LLM_API_KEY
});

// 深度需求分析
const result = await analyzer.analyzeRequirement('需求描述');

// 生成用户故事
const stories = await analyzer.generateUserStories('需求描述');

// 生成PRD
const prd = await analyzer.generatePRD('需求描述');
```

### LLM分析优势
- **深度理解**: 理解需求背后的用户意图和业务价值
- **智能推理**: 基于上下文进行逻辑推理和关联分析
- **创意生成**: 生成创新的产品方案和差异化策略
- **自然语言**: 输出更自然、更易理解的分析结果

## AI驱动工作流

### 工作流引擎
- **[scripts/ai-workflow.js](scripts/ai-workflow.js)**
  - 用途: AI驱动的产品管理全流程自动化引擎
  - 触发时机: 需要AI自动执行完整产品工作流时调用
  - 支持工作流类型:
    - `requirement-analysis` - 需求分析工作流（7步自动完成）
    - `user-research` - 用户调研工作流（6步自动完成）
    - `competitive-analysis` - 竞品分析工作流（5步自动完成）
    - `prd-generation` - PRD生成工作流（8步自动完成）
    - `user-story` - 用户故事工作流（5步自动完成）
    - `roadmap` - 路线图工作流（6步自动完成）
    - `launch-check` - 上线检查工作流（6步自动完成）
    - `iteration-review` - 迭代复盘工作流（6步自动完成）
    - `project-health-check` - 项目健康检测工作流（9步自动完成）

- **[scripts/project-checker.js](scripts/project-checker.js)**
  - 用途: AI驱动的项目全盘检测引擎
  - 触发时机: 需要检测项目整体健康状态时调用
  - 检测维度: 需求、设计、开发、质量、性能、安全、文档、运维

- **[scripts/function-checker.js](scripts/function-checker.js)**
  - 用途: AI驱动的功能健康检测引擎
  - 触发时机: 需要检测功能完整性、合理性、可用性时调用
  - 检测维度: 功能完整性（核心功能、边界场景）、功能合理性（用户流程、交互设计、信息架构）、可用性（操作路径、错误提示、空状态、响应时间）

### 工作流使用示例

```javascript
// 执行需求分析工作流
const workflow = new AIProductWorkflow();
const result = await workflow.execute('requirement-analysis', {
  requirement: '用户需要一个任务管理系统，支持创建、分配、跟踪任务'
});

// 执行PRD生成工作流
const prdResult = await workflow.execute('prd-generation', {
  requirement: '用户需要一个高效的协作工具'
});
```

### AI工作流特点
- **全流程自动化**: 从输入到输出，AI自动完成所有步骤
- **结构化输出**: 每个工作流输出标准化JSON结果
- **可追溯**: 记录每个步骤的执行状态和耗时
- **可扩展**: 支持自定义工作流和步骤

## 核心架构模块

### 工具系统 (scripts/types.js)
遵循Claude Code的统一工具接口设计：
- **BaseTool**: 所有工具的基类，定义统一接口
- **ToolRegistry**: 工具注册中心，支持模块化扩展
- **PermissionManager**: 三级权限控制 (alwaysAllow/alwaysDeny/alwaysAsk)
- **ToolExecutor**: 工具执行器，处理权限检查和进度追踪
- **ToolProgress**: 进度反馈类型，支持长时间操作

### 状态管理 (scripts/state.js)
遵循Claude Code的不可变状态更新模式：
- **AppStateStore**: 全局状态存储，支持撤销/重做
- **selectors**: 状态选择器，高效获取状态切片
- **actions**: 状态更新动作，封装业务逻辑
- 支持状态订阅和历史记录

### 成本追踪 (scripts/cost-tracker.js)
遵循Claude Code的成本统计模式：
- **CostTracker**: 成本追踪器，记录LLM调用成本
- **CostRecord**: 成本记录，包含Token统计
- 支持预算设置和超预算警告
- 生成详细的成本报告

### 进度报告 (scripts/progress-reporter.js)
遵循Claude Code的进度反馈模式：
- **ProgressReporter**: 进度报告器，实时反馈执行状态
- **WorkflowProgressTracker**: 工作流进度追踪
- 支持进度条可视化和监听器订阅

## 注意事项
- **AI工作流优先**: 需要完整分析时，**优先调用** scripts/ai-workflow.js 执行自动化工作流
- **脚本调用规则**: 单点分析时，调用 scripts/analyze.js 脚本
- **模板使用规则**: 生成文档时，**必须参考** templates 目录下的标准模板
- **需求收集规则**: 需要系统化收集需求时，使用 scripts/collect.js 交互式收集
- **成本控制**: 使用 scripts/cost-tracker.js 追踪LLM调用成本
- **进度反馈**: 使用 scripts/progress-reporter.js 提供实时进度反馈
- **可视化展示**: 使用 scripts/visualizer.js 启动Web仪表盘
- **HTML报告**: 使用 scripts/html-reporter.js 生成美观的HTML报告
- **命令行美化**: 使用 scripts/cli-visualizer.js 增强终端输出
- **Markdown增强**: 使用 scripts/markdown-reporter.js 生成带图表的报告
- 保持用户视角，避免技术导向思维
- 注重数据驱动，用指标验证假设
- 关注MVP原则，避免过度设计

## 可视化模块

### Web仪表盘 (scripts/visualizer.js)
实时可视化仪表盘，展示分析结果和统计数据：
- **Visualizer**: 启动Web服务器，提供交互式仪表盘
- 支持项目健康度、功能健康度、成本统计等可视化
- 自动生成Chart.js图表
- 支持静态HTML文件导出

```javascript
const { Visualizer } = require('./scripts/visualizer.js');

const viz = new Visualizer({ port: 3456 });
viz.setProjectHealthData(healthReport)
   .setFunctionHealthData(functionReport)
   .setCostData(costSummary)
   .start();  // 启动Web服务器

// 或生成静态文件
viz.generateStaticFile('./reports/dashboard.html');
```

### HTML报告生成 (scripts/html-reporter.js)
生成美观的HTML格式报告：
- **HTMLReporter**: 生成专业排版的HTML报告
- 支持需求分析、项目健康、功能健康、PRD、竞品分析等报告类型
- 包含Chart.js图表和响应式设计
- 支持打印和PDF导出

```javascript
const { HTMLReporter } = require('./scripts/html-reporter.js');

const reporter = new HTMLReporter();
const html = reporter.generateProjectHealthReport(healthData);
reporter.saveToFile(html, './reports/health-report.html');
```

### 命令行可视化 (scripts/cli-visualizer.js)
增强终端输出效果：
- **CLIVisualizer**: 提供进度条、表格、分数卡片等可视化组件
- 支持彩色输出和Unicode图标
- 适合在终端中直接查看分析结果

```javascript
const { cli } = require('./scripts/cli-visualizer.js');

cli.title('项目健康检测报告')
   .scoreCard('总体健康度', 85)
   .dimensions('维度详情', [
     { name: '需求完整性', score: 90 },
     { name: '开发进度', score: 75 }
   ])
   .issues(issuesList)
   .recommendations(recommendationsList);
```

### Markdown报告增强 (scripts/markdown-reporter.js)
生成带Mermaid图表的Markdown报告：
- **MarkdownReporter**: 生成丰富的Markdown格式报告
- 支持Mermaid图表（饼图、流程图、时间线、思维导图等）
- 支持徽章、进度条、折叠区域等增强元素
- 适合在GitHub、GitLab等平台展示

```javascript
const { MarkdownReporter } = require('./scripts/markdown-reporter.js');

const md = new MarkdownReporter();
md.heading('项目健康报告', 1)
  .healthDashboard(85, dimensions)
  .issues(issuesList)
  .saveToFile('./reports/health.md');
```