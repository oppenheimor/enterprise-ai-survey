/**
 * AI驱动的功能健康检测引擎
 * 检测功能完整性、合理性、可用性
 */

/**
 * 检测维度定义
 */
const FUNCTION_CHECK_DIMENSIONS = {
  COMPLETENESS: 'completeness',    // 功能完整性
  RATIONALITY: 'rationality',      // 功能合理性
  USABILITY: 'usability'           // 可用性
};

/**
 * 功能健康检测引擎
 */
class FunctionHealthChecker {
  constructor(options = {}) {
    this.options = options;
    this.results = {};
  }

  /**
   * 执行功能健康检测
   * @param {object} functionInfo - 功能信息
   * @returns {Promise<object>} 检测报告
   */
  async checkAll(functionInfo) {
    console.log('\n🔍 启动功能健康检测');
    console.log('='.repeat(50));

    const results = {
      functionName: functionInfo.name || '未命名功能',
      checkTime: new Date().toISOString(),
      dimensions: {},
      summary: {
        overallScore: 0,
        healthLevel: '',
        totalChecks: 0,
        passedChecks: 0,
        warningChecks: 0,
        failedChecks: 0
      },
      issues: [],
      recommendations: []
    };

    // 1. 功能完整性检测
    console.log('\n📋 检测维度: 功能完整性');
    results.dimensions.completeness = this.checkCompleteness(functionInfo);

    // 2. 功能合理性检测
    console.log('\n📋 检测维度: 功能合理性');
    results.dimensions.rationality = this.checkRationality(functionInfo);

    // 3. 可用性检测
    console.log('\n📋 检测维度: 可用性');
    results.dimensions.usability = this.checkUsability(functionInfo);

    // 计算汇总
    this.calculateSummary(results);

    console.log('\n' + '='.repeat(50));
    console.log(`✅ 检测完成，功能健康分数: ${results.summary.overallScore}/100`);

    return results;
  }

  /**
   * 功能完整性检测
   */
  checkCompleteness(functionInfo) {
    const checks = [];
    const issues = [];
    const recommendations = [];
    const completeness = functionInfo.completeness || {};

    // === 核心功能完整性 ===
    checks.push({
      category: '核心功能',
      item: '核心功能完整性',
      status: completeness.hasCoreFunctions ? 'passed' : 'failed',
      description: completeness.hasCoreFunctions ? '核心功能已实现' : '核心功能缺失',
      impact: 'High',
      details: completeness.coreFunctions || []
    });

    checks.push({
      category: '核心功能',
      item: '主流程完整性',
      status: completeness.hasMainFlow ? 'passed' : 'failed',
      description: completeness.hasMainFlow ? '主流程完整' : '主流程不完整',
      impact: 'High'
    });

    checks.push({
      category: '核心功能',
      item: '功能闭环',
      status: completeness.hasFunctionLoop ? 'passed' : 'warning',
      description: completeness.hasFunctionLoop ? '功能形成闭环' : '功能未形成闭环',
      impact: 'Medium'
    });

    // === 边界场景覆盖 ===
    checks.push({
      category: '边界场景',
      item: '空数据处理',
      status: completeness.hasEmptyState ? 'passed' : 'warning',
      description: completeness.hasEmptyState ? '空状态已处理' : '空状态未处理',
      impact: 'Medium'
    });

    checks.push({
      category: '边界场景',
      item: '异常输入处理',
      status: completeness.hasInvalidInput ? 'passed' : 'warning',
      description: completeness.hasInvalidInput ? '异常输入已处理' : '异常输入未处理',
      impact: 'High'
    });

    checks.push({
      category: '边界场景',
      item: '网络异常处理',
      status: completeness.hasNetworkError ? 'passed' : 'warning',
      description: completeness.hasNetworkError ? '网络异常已处理' : '网络异常未处理',
      impact: 'High'
    });

    checks.push({
      category: '边界场景',
      item: '权限不足处理',
      status: completeness.hasPermissionError ? 'passed' : 'warning',
      description: completeness.hasPermissionError ? '权限不足已处理' : '权限不足未处理',
      impact: 'Medium'
    });

    checks.push({
      category: '边界场景',
      item: '数据边界处理',
      status: completeness.hasDataBoundary ? 'passed' : 'warning',
      description: completeness.hasDataBoundary ? '数据边界已处理' : '数据边界未处理（如超长文本、超大数值）',
      impact: 'Medium'
    });

    checks.push({
      category: '边界场景',
      item: '并发场景处理',
      status: completeness.hasConcurrency ? 'passed' : 'warning',
      description: completeness.hasConcurrency ? '并发场景已处理' : '并发场景未处理',
      impact: 'Medium'
    });

    // === 功能依赖 ===
    checks.push({
      category: '功能依赖',
      item: '前置条件检查',
      status: completeness.hasPrecondition ? 'passed' : 'warning',
      description: completeness.hasPrecondition ? '前置条件已检查' : '前置条件未检查',
      impact: 'Medium'
    });

    checks.push({
      category: '功能依赖',
      item: '依赖服务可用性',
      status: completeness.hasDependencyCheck ? 'passed' : 'warning',
      description: completeness.hasDependencyCheck ? '依赖服务已检查' : '依赖服务未检查',
      impact: 'High'
    });

    // 收集问题
    checks.filter(c => c.status !== 'passed').forEach(c => {
      issues.push({
        category: c.category,
        item: c.item,
        severity: c.status === 'failed' ? 'High' : 'Medium',
        description: c.description,
        impact: c.impact
      });
    });

    // 生成建议
    if (!completeness.hasEmptyState) {
      recommendations.push({
        category: '边界场景',
        priority: 'Medium',
        action: '添加空状态处理',
        description: '为列表、搜索结果等场景添加空状态提示和引导'
      });
    }
    if (!completeness.hasInvalidInput) {
      recommendations.push({
        category: '边界场景',
        priority: 'High',
        action: '添加输入验证',
        description: '对用户输入进行格式验证和边界检查'
      });
    }

    const score = this.calculateDimensionScore(checks);

    return { checks, issues, recommendations, score };
  }

  /**
   * 功能合理性检测
   */
  checkRationality(functionInfo) {
    const checks = [];
    const issues = [];
    const recommendations = [];
    const rationality = functionInfo.rationality || {};

    // === 用户流程合理性 ===
    checks.push({
      category: '用户流程',
      item: '流程步骤数量',
      status: (rationality.stepCount || 5) <= 5 ? 'passed' : (rationality.stepCount || 5) <= 7 ? 'warning' : 'failed',
      description: `完成核心任务需要${rationality.stepCount || 5}步`,
      impact: 'High',
      value: rationality.stepCount || 5
    });

    checks.push({
      category: '用户流程',
      item: '流程逻辑清晰',
      status: rationality.hasClearLogic ? 'passed' : 'warning',
      description: rationality.hasClearLogic ? '流程逻辑清晰' : '流程逻辑不够清晰',
      impact: 'High'
    });

    checks.push({
      category: '用户流程',
      item: '流程可回退',
      status: rationality.hasBackNavigation ? 'passed' : 'warning',
      description: rationality.hasBackNavigation ? '支持流程回退' : '不支持流程回退',
      impact: 'Medium'
    });

    checks.push({
      category: '用户流程',
      item: '流程可中断恢复',
      status: rationality.hasResume ? 'passed' : 'warning',
      description: rationality.hasResume ? '支持中断后恢复' : '不支持中断后恢复',
      impact: 'Medium'
    });

    checks.push({
      category: '用户流程',
      item: '流程分支处理',
      status: rationality.hasBranchHandling ? 'passed' : 'warning',
      description: rationality.hasBranchHandling ? '分支流程已处理' : '分支流程未处理',
      impact: 'Medium'
    });

    // === 交互设计规范 ===
    checks.push({
      category: '交互设计',
      item: '按钮位置一致',
      status: rationality.hasConsistentButtons ? 'passed' : 'warning',
      description: rationality.hasConsistentButtons ? '按钮位置一致' : '按钮位置不一致',
      impact: 'Medium'
    });

    checks.push({
      category: '交互设计',
      item: '操作反馈及时',
      status: rationality.hasTimelyFeedback ? 'passed' : 'warning',
      description: rationality.hasTimelyFeedback ? '操作有及时反馈' : '操作反馈不及时',
      impact: 'High'
    });

    checks.push({
      category: '交互设计',
      item: '加载状态提示',
      status: rationality.hasLoadingState ? 'passed' : 'warning',
      description: rationality.hasLoadingState ? '有加载状态提示' : '缺少加载状态提示',
      impact: 'Medium'
    });

    checks.push({
      category: '交互设计',
      item: '操作确认机制',
      status: rationality.hasConfirmation ? 'passed' : 'warning',
      description: rationality.hasConfirmation ? '重要操作有确认' : '重要操作缺少确认',
      impact: 'High'
    });

    checks.push({
      category: '交互设计',
      item: '撤销/重做支持',
      status: rationality.hasUndoRedo ? 'passed' : 'warning',
      description: rationality.hasUndoRedo ? '支持撤销/重做' : '不支持撤销/重做',
      impact: 'Low'
    });

    // === 信息架构 ===
    checks.push({
      category: '信息架构',
      item: '导航结构清晰',
      status: rationality.hasClearNavigation ? 'passed' : 'warning',
      description: rationality.hasClearNavigation ? '导航结构清晰' : '导航结构不够清晰',
      impact: 'High'
    });

    checks.push({
      category: '信息架构',
      item: '信息层级分明',
      status: rationality.hasClearHierarchy ? 'passed' : 'warning',
      description: rationality.hasClearHierarchy ? '信息层级分明' : '信息层级不够分明',
      impact: 'Medium'
    });

    checks.push({
      category: '信息架构',
      item: '标签命名准确',
      status: rationality.hasAccurateLabels ? 'passed' : 'warning',
      description: rationality.hasAccurateLabels ? '标签命名准确易懂' : '标签命名不够准确',
      impact: 'Medium'
    });

    checks.push({
      category: '信息架构',
      item: '搜索功能完善',
      status: rationality.hasSearchFunction ? 'passed' : 'warning',
      description: rationality.hasSearchFunction ? '搜索功能完善' : '搜索功能不完善',
      impact: 'Medium'
    });

    // 收集问题
    checks.filter(c => c.status !== 'passed').forEach(c => {
      issues.push({
        category: c.category,
        item: c.item,
        severity: c.status === 'failed' ? 'High' : 'Medium',
        description: c.description,
        impact: c.impact
      });
    });

    // 生成建议
    if ((rationality.stepCount || 5) > 5) {
      recommendations.push({
        category: '用户流程',
        priority: 'High',
        action: '简化操作流程',
        description: `当前需要${rationality.stepCount || 5}步，建议优化到5步以内`
      });
    }
    if (!rationality.hasTimelyFeedback) {
      recommendations.push({
        category: '交互设计',
        priority: 'High',
        action: '添加操作反馈',
        description: '为用户操作添加即时反馈，如按钮点击效果、加载动画等'
      });
    }

    const score = this.calculateDimensionScore(checks);

    return { checks, issues, recommendations, score };
  }

  /**
   * 可用性检测
   */
  checkUsability(functionInfo) {
    const checks = [];
    const issues = [];
    const recommendations = [];
    const usability = functionInfo.usability || {};

    // === 操作路径 ===
    checks.push({
      category: '操作路径',
      item: '核心功能可达性',
      status: (usability.coreFunctionClicks || 3) <= 3 ? 'passed' : (usability.coreFunctionClicks || 3) <= 5 ? 'warning' : 'failed',
      description: `核心功能需要${usability.coreFunctionClicks || 3}次点击到达`,
      impact: 'High',
      value: usability.coreFunctionClicks || 3
    });

    checks.push({
      category: '操作路径',
      item: '常用功能快捷入口',
      status: usability.hasShortcuts ? 'passed' : 'warning',
      description: usability.hasShortcuts ? '常用功能有快捷入口' : '常用功能缺少快捷入口',
      impact: 'Medium'
    });

    checks.push({
      category: '操作路径',
      item: '历史记录/最近使用',
      status: usability.hasRecentHistory ? 'passed' : 'warning',
      description: usability.hasRecentHistory ? '有历史记录功能' : '缺少历史记录功能',
      impact: 'Low'
    });

    // === 错误提示 ===
    checks.push({
      category: '错误提示',
      item: '错误信息明确',
      status: usability.hasClearError ? 'passed' : 'warning',
      description: usability.hasClearError ? '错误信息明确易懂' : '错误信息不够明确',
      impact: 'High'
    });

    checks.push({
      category: '错误提示',
      item: '错误原因说明',
      status: usability.hasErrorReason ? 'passed' : 'warning',
      description: usability.hasErrorReason ? '错误有原因说明' : '错误缺少原因说明',
      impact: 'High'
    });

    checks.push({
      category: '错误提示',
      item: '解决方案引导',
      status: usability.hasErrorSolution ? 'passed' : 'warning',
      description: usability.hasErrorSolution ? '错误有解决方案引导' : '错误缺少解决方案引导',
      impact: 'High'
    });

    checks.push({
      category: '错误提示',
      item: '错误位置定位',
      status: usability.hasErrorLocation ? 'passed' : 'warning',
      description: usability.hasErrorLocation ? '错误有位置定位' : '错误缺少位置定位',
      impact: 'Medium'
    });

    // === 空状态处理 ===
    checks.push({
      category: '空状态',
      item: '空列表状态',
      status: usability.hasEmptyList ? 'passed' : 'warning',
      description: usability.hasEmptyList ? '空列表有友好提示' : '空列表缺少友好提示',
      impact: 'Medium'
    });

    checks.push({
      category: '空状态',
      item: '空搜索结果',
      status: usability.hasEmptySearch ? 'passed' : 'warning',
      description: usability.hasEmptySearch ? '空搜索结果有提示' : '空搜索结果缺少提示',
      impact: 'Medium'
    });

    checks.push({
      category: '空状态',
      item: '空状态引导操作',
      status: usability.hasEmptyAction ? 'passed' : 'warning',
      description: usability.hasEmptyAction ? '空状态有引导操作' : '空状态缺少引导操作',
      impact: 'Medium'
    });

    // === 响应时间 ===
    checks.push({
      category: '响应时间',
      item: '页面加载时间',
      status: (usability.pageLoadTime || 2000) <= 2000 ? 'passed' : (usability.pageLoadTime || 2000) <= 3000 ? 'warning' : 'failed',
      description: `页面加载时间: ${usability.pageLoadTime || 2000}ms`,
      impact: 'High',
      value: usability.pageLoadTime || 2000
    });

    checks.push({
      category: '响应时间',
      item: '接口响应时间',
      status: (usability.apiResponseTime || 500) <= 500 ? 'passed' : (usability.apiResponseTime || 500) <= 1000 ? 'warning' : 'failed',
      description: `接口响应时间: ${usability.apiResponseTime || 500}ms`,
      impact: 'High',
      value: usability.apiResponseTime || 500
    });

    checks.push({
      category: '响应时间',
      item: '交互反馈时间',
      status: (usability.interactionTime || 100) <= 100 ? 'passed' : 'warning',
      description: `交互反馈时间: ${usability.interactionTime || 100}ms`,
      impact: 'Medium',
      value: usability.interactionTime || 100
    });

    // === 可访问性 ===
    checks.push({
      category: '可访问性',
      item: '键盘操作支持',
      status: usability.hasKeyboardSupport ? 'passed' : 'warning',
      description: usability.hasKeyboardSupport ? '支持键盘操作' : '不支持键盘操作',
      impact: 'Medium'
    });

    checks.push({
      category: '可访问性',
      item: '屏幕阅读器支持',
      status: usability.hasScreenReader ? 'passed' : 'warning',
      description: usability.hasScreenReader ? '支持屏幕阅读器' : '不支持屏幕阅读器',
      impact: 'Low'
    });

    checks.push({
      category: '可访问性',
      item: '色彩对比度',
      status: usability.hasColorContrast ? 'passed' : 'warning',
      description: usability.hasColorContrast ? '色彩对比度符合标准' : '色彩对比度可能不足',
      impact: 'Medium'
    });

    // 收集问题
    checks.filter(c => c.status !== 'passed').forEach(c => {
      issues.push({
        category: c.category,
        item: c.item,
        severity: c.status === 'failed' ? 'High' : 'Medium',
        description: c.description,
        impact: c.impact
      });
    });

    // 生成建议
    if ((usability.coreFunctionClicks || 3) > 3) {
      recommendations.push({
        category: '操作路径',
        priority: 'High',
        action: '优化功能入口',
        description: `核心功能需要${usability.coreFunctionClicks || 3}次点击，建议优化到3次以内`
      });
    }
    if (!usability.hasClearError) {
      recommendations.push({
        category: '错误提示',
        priority: 'High',
        action: '优化错误提示',
        description: '错误提示应包含：错误原因、解决方案、错误位置'
      });
    }
    if ((usability.pageLoadTime || 2000) > 2000) {
      recommendations.push({
        category: '响应时间',
        priority: 'High',
        action: '优化页面性能',
        description: `页面加载时间${usability.pageLoadTime || 2000}ms，建议优化到2秒以内`
      });
    }

    const score = this.calculateDimensionScore(checks);

    return { checks, issues, recommendations, score };
  }

  /**
   * 计算维度分数
   */
  calculateDimensionScore(checks) {
    if (!checks || checks.length === 0) return 0;
    const passed = checks.filter(c => c.status === 'passed').length;
    const warning = checks.filter(c => c.status === 'warning').length;
    return Math.round((passed + warning * 0.5) / checks.length * 100);
  }

  /**
   * 计算汇总
   */
  calculateSummary(results) {
    const dimensions = Object.values(results.dimensions);
    
    results.summary.totalChecks = dimensions.reduce((sum, d) => sum + d.checks.length, 0);
    results.summary.passedChecks = dimensions.reduce((sum, d) => sum + d.checks.filter(c => c.status === 'passed').length, 0);
    results.summary.warningChecks = dimensions.reduce((sum, d) => sum + d.checks.filter(c => c.status === 'warning').length, 0);
    results.summary.failedChecks = dimensions.reduce((sum, d) => sum + d.checks.filter(c => c.status === 'failed').length, 0);

    results.summary.overallScore = Math.round(
      dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length
    );

    results.summary.healthLevel = this.getHealthLevel(results.summary.overallScore);

    // 汇总问题和建议
    results.issues = dimensions.flatMap(d => d.issues);
    results.recommendations = dimensions.flatMap(d => d.recommendations);
  }

  /**
   * 获取健康等级
   */
  getHealthLevel(score) {
    if (score >= 90) return '优秀';
    if (score >= 75) return '良好';
    if (score >= 60) return '一般';
    if (score >= 40) return '较差';
    return '危险';
  }

  /**
   * 生成检测报告
   */
  generateReport(results) {
    return {
      summary: {
        functionName: results.functionName,
        checkTime: results.checkTime,
        overallScore: results.summary.overallScore,
        healthLevel: results.summary.healthLevel,
        totalChecks: results.summary.totalChecks,
        passedChecks: results.summary.passedChecks,
        warningChecks: results.summary.warningChecks,
        failedChecks: results.summary.failedChecks
      },
      dimensions: {
        completeness: {
          score: results.dimensions.completeness.score,
          checks: results.dimensions.completeness.checks,
          issues: results.dimensions.completeness.issues.length
        },
        rationality: {
          score: results.dimensions.rationality.score,
          checks: results.dimensions.rationality.checks,
          issues: results.dimensions.rationality.issues.length
        },
        usability: {
          score: results.dimensions.usability.score,
          checks: results.dimensions.usability.checks,
          issues: results.dimensions.usability.issues.length
        }
      },
      issues: results.issues,
      recommendations: results.recommendations,
      actionPlan: this.generateActionPlan(results)
    };
  }

  /**
   * 生成行动计划
   */
  generateActionPlan(results) {
    const highPriority = results.issues.filter(i => i.severity === 'High');
    const mediumPriority = results.issues.filter(i => i.severity === 'Medium');

    return {
      immediate: highPriority.slice(0, 5).map(i => ({
        action: `修复${i.item}`,
        category: i.category,
        description: i.description
      })),
      shortTerm: mediumPriority.slice(0, 5).map(i => ({
        action: `优化${i.item}`,
        category: i.category,
        description: i.description
      })),
      recommendations: results.recommendations.slice(0, 5)
    };
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FunctionHealthChecker, FUNCTION_CHECK_DIMENSIONS };
}

// 使用示例
async function runExample() {
  const checker = new FunctionHealthChecker();
  
  const functionInfo = {
    name: '用户登录功能',
    completeness: {
      hasCoreFunctions: true,
      hasMainFlow: true,
      hasEmptyState: false,
      hasInvalidInput: true,
      hasNetworkError: true,
      hasPermissionError: false
    },
    rationality: {
      stepCount: 3,
      hasClearLogic: true,
      hasBackNavigation: true,
      hasTimelyFeedback: true,
      hasConfirmation: false,
      hasClearNavigation: true
    },
    usability: {
      coreFunctionClicks: 2,
      hasClearError: true,
      hasErrorReason: false,
      hasErrorSolution: false,
      hasEmptyList: false,
      pageLoadTime: 1500,
      apiResponseTime: 300
    }
  };
  
  const results = await checker.checkAll(functionInfo);
  const report = checker.generateReport(results);
  
  console.log(JSON.stringify(report, null, 2));
}

// 如果直接运行
if (require.main === module) {
  const args = process.argv.slice(2);
  const inputJson = args[0] || '{}';
  
  try {
    const functionInfo = JSON.parse(inputJson);
    const checker = new FunctionHealthChecker();
    checker.checkAll(functionInfo).then(results => {
      const report = checker.generateReport(results);
      console.log(JSON.stringify(report, null, 2));
    });
  } catch (e) {
    console.error('用法: node function-checker.js <功能信息JSON>');
    console.error('示例: node function-checker.js \'{"name":"登录功能","completeness":{"hasCoreFunctions":true}}\'');
  }
}