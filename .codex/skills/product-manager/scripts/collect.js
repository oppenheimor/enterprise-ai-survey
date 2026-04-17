/**
 * 交互式需求收集脚本
 * 支持通过问答形式收集和整理产品需求
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * 需求收集器
 */
class RequirementCollector {
  constructor() {
    this.requirement = {
      basicInfo: {},
      userAnalysis: {},
      functionalReqs: [],
      nonFunctionalReqs: [],
      constraints: {},
      success: {}
    };
    this.currentStep = 0;
    this.steps = [
      'basicInfo',
      'userAnalysis', 
      'functionalReqs',
      'nonFunctionalReqs',
      'constraints',
      'success'
    ];
  }

  /**
   * 开始收集需求
   */
  async start() {
    console.log('\n========================================');
    console.log('   产品需求收集助手');
    console.log('========================================\n');
    console.log('我将通过一系列问题帮助您梳理产品需求。\n');

    await this.collectBasicInfo();
    await this.collectUserAnalysis();
    await this.collectFunctionalReqs();
    await this.collectNonFunctionalReqs();
    await this.collectConstraints();
    await this.collectSuccess();

    this.generateReport();
    rl.close();
  }

  /**
   * 收集基本信息
   */
  async collectBasicInfo() {
    console.log('\n📋 第一步：基本信息\n');
    
    this.requirement.basicInfo = {
      name: await this.ask('产品/功能名称：'),
      background: await this.ask('需求背景（为什么做）：'),
      goal: await this.ask('产品目标（要达成什么）：'),
      deadline: await this.ask('期望上线时间：'),
      stakeholders: await this.ask('相关方（谁关心这个需求）：')
    };
  }

  /**
   * 收集用户分析
   */
  async collectUserAnalysis() {
    console.log('\n👥 第二步：用户分析\n');
    
    this.requirement.userAnalysis = {
      targetUsers: await this.ask('目标用户是谁：'),
      userScenario: await this.ask('用户使用场景：'),
      userPain: await this.ask('用户痛点是什么：'),
      userBenefit: await this.ask('用户能获得什么价值：')
    };
  }

  /**
   * 收集功能需求
   */
  async collectFunctionalReqs() {
    console.log('\n⚙️ 第三步：功能需求\n');
    
    let addMore = true;
    while (addMore) {
      const feature = {
        name: await this.ask('功能名称：'),
        description: await this.ask('功能描述：'),
        priority: await this.ask('优先级（P0/P1/P2）：'),
        userStory: await this.ask('用户故事（作为...我希望...以便...）：')
      };
      this.requirement.functionalReqs.push(feature);
      
      const continueAdd = await this.ask('是否继续添加功能？（y/n）：');
      addMore = continueAdd.toLowerCase() === 'y';
    }
  }

  /**
   * 收集非功能需求
   */
  async collectNonFunctionalReqs() {
    console.log('\n🔧 第四步：非功能需求\n');
    
    this.requirement.nonFunctionalReqs = {
      performance: await this.ask('性能要求（如响应时间、并发量）：'),
      security: await this.ask('安全要求：'),
      compatibility: await this.ask('兼容性要求：'),
      availability: await this.ask('可用性要求：')
    };
  }

  /**
   * 收集约束条件
   */
  async collectConstraints() {
    console.log('\n🔒 第五步：约束条件\n');
    
    this.requirement.constraints = {
      resources: await this.ask('资源约束（人力、预算）：'),
      time: await this.ask('时间约束：'),
      technology: await this.ask('技术约束：'),
      dependencies: await this.ask('外部依赖：')
    };
  }

  /**
   * 收集成功标准
   */
  async collectSuccess() {
    console.log('\n🎯 第六步：成功标准\n');
    
    this.requirement.success = {
      metrics: await this.ask('成功指标（如何衡量成功）：'),
      target: await this.ask('目标值：'),
      measurement: await this.ask('如何测量：')
    };
  }

  /**
   * 提问函数
   */
  ask(question) {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * 生成需求报告
   */
  generateReport() {
    console.log('\n\n========================================');
    console.log('   需求收集完成！');
    console.log('========================================\n');
    
    const report = this.formatReport();
    console.log(report);
    
    return report;
  }

  /**
   * 格式化报告
   */
  formatReport() {
    const r = this.requirement;
    
    return `
# 产品需求文档

## 一、基本信息

| 项目 | 内容 |
|------|------|
| 产品名称 | ${r.basicInfo.name} |
| 需求背景 | ${r.basicInfo.background} |
| 产品目标 | ${r.basicInfo.goal} |
| 期望上线 | ${r.basicInfo.deadline} |
| 相关方 | ${r.basicInfo.stakeholders} |

## 二、用户分析

| 项目 | 内容 |
|------|------|
| 目标用户 | ${r.userAnalysis.targetUsers} |
| 使用场景 | ${r.userAnalysis.userScenario} |
| 用户痛点 | ${r.userAnalysis.userPain} |
| 用户价值 | ${r.userAnalysis.userBenefit} |

## 三、功能需求

${r.functionalReqs.map((f, i) => `
### ${i + 1}. ${f.name}

- **优先级**: ${f.priority}
- **描述**: ${f.description}
- **用户故事**: ${f.userStory}
`).join('\n')}

## 四、非功能需求

| 类型 | 要求 |
|------|------|
| 性能 | ${r.nonFunctionalReqs.performance} |
| 安全 | ${r.nonFunctionalReqs.security} |
| 兼容性 | ${r.nonFunctionalReqs.compatibility} |
| 可用性 | ${r.nonFunctionalReqs.availability} |

## 五、约束条件

| 类型 | 约束 |
|------|------|
| 资源 | ${r.constraints.resources} |
| 时间 | ${r.constraints.time} |
| 技术 | ${r.constraints.technology} |
| 依赖 | ${r.constraints.dependencies} |

## 六、成功标准

| 项目 | 内容 |
|------|------|
| 成功指标 | ${r.success.metrics} |
| 目标值 | ${r.success.target} |
| 测量方式 | ${r.success.measurement} |

---
*文档生成时间: ${new Date().toLocaleString()}*
`;
  }
}

/**
 * 快速需求分析
 */
function quickAnalyze(requirementText) {
  const keywords = {
    user: ['用户', '客户', '消费者', '使用者'],
    action: ['可以', '能够', '支持', '提供', '实现'],
    value: ['提升', '提高', '降低', '减少', '优化', '改善'],
    priority: ['核心', '重要', '紧急', '优先', '关键']
  };

  const analysis = {
    hasUserPerspective: keywords.user.some(k => requirementText.includes(k)),
    hasActionWords: keywords.action.some(k => requirementText.includes(k)),
    hasValueProposition: keywords.value.some(k => requirementText.includes(k)),
    hasPriorityHint: keywords.priority.some(k => requirementText.includes(k)),
    estimatedComplexity: requirementText.length > 200 ? '高' : requirementText.length > 100 ? '中' : '低',
    suggestions: []
  };

  if (!analysis.hasUserPerspective) {
    analysis.suggestions.push('建议明确目标用户群体');
  }
  if (!analysis.hasValueProposition) {
    analysis.suggestions.push('建议补充用户价值说明');
  }
  if (!analysis.hasPriorityHint) {
    analysis.suggestions.push('建议标注功能优先级');
  }

  return analysis;
}

/**
 * 需求完整性检查
 */
function checkCompleteness(requirement) {
  const checklist = [
    { field: 'basicInfo.name', name: '产品名称', required: true },
    { field: 'basicInfo.background', name: '需求背景', required: true },
    { field: 'basicInfo.goal', name: '产品目标', required: true },
    { field: 'userAnalysis.targetUsers', name: '目标用户', required: true },
    { field: 'functionalReqs', name: '功能需求', required: true, isArray: true },
    { field: 'success.metrics', name: '成功指标', required: true }
  ];

  const results = checklist.map(item => {
    const value = item.isArray 
      ? requirement[item.field.split('.')[0]]
      : item.field.split('.').reduce((obj, key) => obj?.[key], requirement);
    
    const isComplete = item.isArray 
      ? Array.isArray(value) && value.length > 0
      : value && value.trim && value.trim().length > 0;

    return {
      name: item.name,
      required: item.required,
      status: isComplete ? '✅ 完整' : '❌ 缺失'
    };
  });

  return results;
}

// 如果直接运行脚本
if (require.main === module) {
  const args = process.argv.slice(2);
  const mode = args[0] || 'interactive';

  if (mode === 'interactive') {
    const collector = new RequirementCollector();
    collector.start();
  } else if (mode === 'analyze') {
    const text = args[1] || '';
    if (!text) {
      console.error('用法: node collect.js analyze <需求文本>');
      process.exit(1);
    }
    const result = quickAnalyze(text);
    console.log(JSON.stringify(result, null, 2));
  } else if (mode === 'check') {
    const text = args[1] || '';
    if (!text) {
      console.error('用法: node collect.js check <需求JSON>');
      process.exit(1);
    }
    try {
      const requirement = JSON.parse(text);
      const result = checkCompleteness(requirement);
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      console.error('无效的JSON格式');
      process.exit(1);
    }
  }
}

module.exports = { RequirementCollector, quickAnalyze, checkCompleteness };