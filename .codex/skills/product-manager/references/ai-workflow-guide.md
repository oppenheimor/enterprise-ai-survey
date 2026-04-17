# AI产品经理工作流使用指南

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档版本 | v1.0.0 |
| 更新日期 | {日期} |
| 适用范围 | AI驱动的产品管理全流程 |

---

## 一、AI工作流概述

### 1.1 设计理念

本技能的所有工具和模板均针对**AI自动执行**进行优化设计：

- **输入简化**: 最少输入即可启动完整工作流
- **流程自动化**: AI自动完成所有中间步骤
- **输出标准化**: 结构化JSON输出，便于后续处理
- **可追溯性**: 记录每步执行状态和结果

### 1.2 工作流架构

```
用户输入 → AI工作流引擎 → 多步骤自动执行 → 结构化输出
    │              │                │              │
    │              │                │              │
    ▼              ▼                ▼              ▼
 简单描述      智能解析         自动处理       标准文档
```

---

## 二、工作流类型详解

### 2.1 需求分析工作流 (requirement-analysis)

**输入**:
```json
{
  "requirement": "用户需要一个任务管理系统，支持创建、分配、跟踪任务"
}
```

**自动执行步骤**:
1. 需求理解 - 提取摘要、关键词、领域、复杂度
2. 用户识别 - 识别目标用户群体
3. 痛点挖掘 - 分析用户痛点及解决方案
4. 价值评估 - 评估用户价值和业务价值
5. 优先级排序 - 对功能进行优先级排序
6. 风险识别 - 识别潜在风险
7. 生成分析报告 - 输出完整分析报告

**输出结构**:
```json
{
  "workflowType": "requirement-analysis",
  "success": true,
  "steps": [
    { "name": "需求理解", "status": "completed", "output": {...} },
    { "name": "用户识别", "status": "completed", "output": {...} }
  ],
  "outputs": {
    "reportType": "需求分析报告",
    "summary": {...},
    "users": [...],
    "painPoints": [...],
    "features": [...],
    "risks": [...]
  }
}
```

### 2.2 用户调研工作流 (user-research)

**输入**:
```json
{
  "researchTopic": "任务管理工具使用体验",
  "constraints": {
    "noInterview": false,
    "noSurvey": false
  }
}
```

**自动执行步骤**:
1. 调研目标定义 - 明确调研目标和问题
2. 调研方法选择 - 推荐合适的调研方法
3. 访谈提纲生成 - 自动生成访谈问题
4. 问卷设计 - 自动生成问卷题目
5. 用户画像构建 - 生成典型用户画像
6. 洞察提炼 - 输出关键洞察和建议

**输出结构**:
```json
{
  "outputs": {
    "goal": { "primaryGoal": "...", "researchQuestions": [...] },
    "methods": { "recommendedMethods": [...] },
    "interviewGuide": { "guide": {...} },
    "questionnaire": { "questionnaire": {...} },
    "persona": { "persona": {...} },
    "insights": { "insights": [...], "recommendations": [...] }
  }
}
```

### 2.3 竞品分析工作流 (competitive-analysis)

**输入**:
```json
{
  "domain": "任务管理",
  "productDomain": "协作工具"
}
```

**自动执行步骤**:
1. 竞品识别 - 自动识别主要竞品
2. 功能对比 - 生成功能对比矩阵
3. SWOT分析 - 分析优势劣势机会威胁
4. 差异化定位 - 确定差异化策略
5. 策略建议 - 输出竞争策略

**输出结构**:
```json
{
  "outputs": {
    "competitors": [...],
    "featureMatrix": {...},
    "swot": {...},
    "differentiation": {...},
    "strategy": {...}
  }
}
```

### 2.4 PRD生成工作流 (prd-generation)

**输入**:
```json
{
  "requirement": "用户需要一个高效的协作工具，支持实时编辑和评论"
}
```

**自动执行步骤**:
1. 背景分析 - 分析问题背景和机会
2. 目标定义 - 定义产品目标和成功标准
3. 用户故事拆解 - 拆分为用户故事
4. 功能设计 - 设计功能模块
5. 验收标准定义 - 定义验收标准
6. 非功能需求 - 定义性能、安全等需求
7. 风险评估 - 评估项目风险
8. 生成PRD文档 - 输出完整PRD

**输出结构**:
```json
{
  "outputs": {
    "document": {
      "documentInfo": {...},
      "background": {...},
      "goals": {...},
      "userStories": {...},
      "features": {...},
      "acceptanceCriteria": {...},
      "nonFunctionalRequirements": {...},
      "risks": {...}
    }
  }
}
```

### 2.5 用户故事工作流 (user-story)

**输入**:
```json
{
  "requirement": "用户需要能够创建和管理项目任务"
}
```

**自动执行步骤**:
1. Epic识别 - 识别Epic名称
2. 故事拆分 - 拆分为用户故事
3. 验收标准生成 - 为每个故事生成AC
4. 故事点估算 - 估算故事点
5. 优先级排序 - 按优先级排序

**输出结构**:
```json
{
  "outputs": {
    "epic": {...},
    "stories": [...],
    "acceptanceCriteria": [...],
    "estimates": {...},
    "prioritizedStories": [...]
  }
}
```

### 2.6 路线图工作流 (roadmap)

**输入**:
```json
{
  "requirement": "构建一个企业级协作平台"
}
```

**自动执行步骤**:
1. 愿景定义 - 定义产品愿景
2. OKR拆解 - 拆解为关键结果
3. 版本规划 - 规划版本迭代
4. 里程碑定义 - 定义关键里程碑
5. 资源评估 - 评估所需资源
6. 生成路线图 - 输出完整路线图

**输出结构**:
```json
{
  "outputs": {
    "roadmap": {
      "vision": {...},
      "okr": {...},
      "versions": [...],
      "milestones": [...],
      "resources": {...}
    }
  }
}
```

### 2.7 上线检查工作流 (launch-check)

**输入**:
```json
{
  "productName": "协作平台",
  "version": "1.0.0"
}
```

**自动执行步骤**:
1. 功能验收项生成 - 生成功能检查清单
2. 性能检查项生成 - 生成性能检查清单
3. 安全检查项生成 - 生成安全检查清单
4. 运维检查项生成 - 生成运维检查清单
5. 文档检查项生成 - 生成文档检查清单
6. 生成完整检查清单 - 输出完整检查清单

**输出结构**:
```json
{
  "outputs": {
    "fullChecklist": {
      "function": [...],
      "performance": [...],
      "security": [...],
      "ops": [...],
      "docs": [...]
    },
    "summary": {
      "totalItems": 30,
      "categories": 5
    }
  }
}
```

### 2.8 迭代复盘工作流 (iteration-review)

**输入**:
```json
{
  "goals": ["完成登录功能", "完成任务管理"],
  "achievedGoals": ["完成登录功能"],
  "plannedItems": 10,
  "deliveredItems": 8,
  "totalBugs": 15,
  "severeBugs": 2
}
```

**自动执行步骤**:
1. 目标回顾 - 回顾目标达成情况
2. 交付分析 - 分析交付情况
3. 质量分析 - 分析质量问题
4. 问题归因 - 分析问题原因
5. 经验总结 - 总结经验教训
6. 改进建议 - 输出改进建议

**输出结构**:
```json
{
  "outputs": {
    "goalReview": {...},
    "deliveryAnalysis": {...},
    "qualityAnalysis": {...},
    "issueAttribution": {...},
    "lessons": {...},
    "improvements": [...]
  }
}
```

---

## 三、AI调用方式

### 3.1 命令行调用

```bash
# 需求分析
node scripts/ai-workflow.js requirement-analysis '{"requirement":"用户需要登录功能"}'

# PRD生成
node scripts/ai-workflow.js prd-generation '{"requirement":"用户需要任务管理功能"}'

# 竞品分析
node scripts/ai-workflow.js competitive-analysis '{"domain":"电商"}'
```

### 3.2 代码调用

```javascript
const { AIProductWorkflow, WORKFLOW_TYPES } = require('./scripts/ai-workflow.js');

const workflow = new AIProductWorkflow();

// 执行需求分析
const result = await workflow.execute(WORKFLOW_TYPES.REQUIREMENT_ANALYSIS, {
  requirement: '用户需要一个任务管理系统'
});

console.log(JSON.stringify(result, null, 2));
```

### 3.3 AI Agent调用

当AI Agent需要执行产品工作时，应：

1. **识别用户意图** - 判断用户需要哪种工作流
2. **准备输入数据** - 从对话中提取关键信息
3. **调用工作流** - 执行对应的AI工作流
4. **处理输出** - 将结果呈现给用户或进行后续处理

---

## 四、最佳实践

### 4.1 输入优化

| 场景 | 推荐输入 | 说明 |
|------|----------|------|
| 需求分析 | 完整的需求描述 | 包含用户、功能、场景 |
| 竞品分析 | 明确的产品领域 | 如"电商"、"社交" |
| PRD生成 | 详细的功能需求 | 包含核心功能点 |
| 上线检查 | 产品名称和版本 | 用于生成检查清单 |

### 4.2 输出处理

```javascript
// 处理工作流输出
const result = await workflow.execute('requirement-analysis', input);

if (result.success) {
  // 获取分析报告
  const report = result.outputs;
  
  // 获取各步骤结果
  result.steps.forEach(step => {
    console.log(`${step.name}: ${step.status}`);
  });
}
```

### 4.3 工作流组合

```javascript
// 组合多个工作流
async function fullProductAnalysis(requirement) {
  const workflow = new AIProductWorkflow();
  
  // 1. 需求分析
  const analysis = await workflow.execute('requirement-analysis', { requirement });
  
  // 2. 竞品分析
  const competitive = await workflow.execute('competitive-analysis', { 
    domain: analysis.outputs.summary.domain 
  });
  
  // 3. PRD生成
  const prd = await workflow.execute('prd-generation', { requirement });
  
  return { analysis, competitive, prd };
}
```

---

## 五、模板与工作流对应关系

| 模板 | 对应工作流 | AI自动填充 |
|------|------------|------------|
| prd-template.md | prd-generation | ✅ 全自动 |
| user-story-template.md | user-story | ✅ 全自动 |
| competitive-analysis-template.md | competitive-analysis | ✅ 全自动 |
| roadmap-template.md | roadmap | ✅ 全自动 |
| launch-checklist.md | launch-check | ✅ 全自动 |
| iteration-review.md | iteration-review | ✅ 全自动 |
| review-checklist.md | requirement-analysis | ✅ 全自动 |
| metrics-dictionary.md | prd-generation | ✅ 自动生成指标 |

---

## 六、常见问题

### Q1: 如何选择合适的工作流？

| 需求场景 | 推荐工作流 |
|----------|------------|
| 新功能需求分析 | requirement-analysis |
| 编写PRD文档 | prd-generation |
| 拆分用户故事 | user-story |
| 分析竞争对手 | competitive-analysis |
| 制定产品规划 | roadmap |
| 上线前检查 | launch-check |
| 迭代复盘 | iteration-review |

### Q2: 工作流执行失败怎么办？

检查以下几点：
1. 输入数据是否完整
2. 必要字段是否提供
3. JSON格式是否正确

### Q3: 如何自定义工作流？

可以通过扩展 `AIProductWorkflow` 类添加自定义工作流：

```javascript
class CustomWorkflow extends AIProductWorkflow {
  getWorkflow(type) {
    if (type === 'my-custom-workflow') {
      return {
        name: '自定义工作流',
        steps: [
          { name: '步骤1', action: 'customAction1', required: true }
        ]
      };
    }
    return super.getWorkflow(type);
  }
}
```

---

## 变更记录

| 版本 | 日期 | 修改人 | 修改内容 |
|------|------|--------|----------|
| v1.0.0 | {日期} | {作者} | 初始版本 |