/**
 * AI驱动的项目全盘检测工作流
 * 自动检测项目各个维度的健康状态
 */

/**
 * 检测维度定义
 */
const CHECK_DIMENSIONS = {
  REQUIREMENT: 'requirement',      // 需求完整性
  DESIGN: 'design',                // 设计完整性
  DEVELOPMENT: 'development',      // 开发进度
  QUALITY: 'quality',              // 质量状态
  PERFORMANCE: 'performance',      // 性能状态
  SECURITY: 'security',            // 安全状态
  DOCUMENTATION: 'documentation',  // 文档完整性
  OPERATIONS: 'operations'         // 运维准备
};

/**
 * 项目全盘检测引擎
 */
class ProjectHealthChecker {
  constructor(options = {}) {
    this.options = options;
    this.results = {};
    this.issues = [];
    this.recommendations = [];
  }

  /**
   * 执行全盘检测
   * @param {object} projectInfo - 项目信息
   * @returns {Promise<object>} 检测报告
   */
  async checkAll(projectInfo) {
    console.log('\n🔍 启动项目全盘检测');
    console.log('='.repeat(50));

    const dimensions = Object.values(CHECK_DIMENSIONS);
    const results = {
      projectName: projectInfo.name || '未命名项目',
      checkTime: new Date().toISOString(),
      dimensions: {},
      summary: {
        totalChecks: 0,
        passedChecks: 0,
        warningChecks: 0,
        failedChecks: 0,
        healthScore: 0
      },
      issues: [],
      recommendations: []
    };

    for (const dimension of dimensions) {
      console.log(`\n📋 检测维度: ${dimension}`);
      const dimensionResult = await this.checkDimension(dimension, projectInfo);
      results.dimensions[dimension] = dimensionResult;
      
      results.summary.totalChecks += dimensionResult.checks.length;
      results.summary.passedChecks += dimensionResult.checks.filter(c => c.status === 'passed').length;
      results.summary.warningChecks += dimensionResult.checks.filter(c => c.status === 'warning').length;
      results.summary.failedChecks += dimensionResult.checks.filter(c => c.status === 'failed').length;
      
      results.issues.push(...dimensionResult.issues);
      results.recommendations.push(...dimensionResult.recommendations);
    }

    // 计算健康分数
    results.summary.healthScore = this.calculateHealthScore(results.summary);

    console.log('\n' + '='.repeat(50));
    console.log(`✅ 检测完成，健康分数: ${results.summary.healthScore}/100`);

    return results;
  }

  /**
   * 检测单个维度
   */
  async checkDimension(dimension, projectInfo) {
    const checkers = {
      [CHECK_DIMENSIONS.REQUIREMENT]: this.checkRequirement.bind(this),
      [CHECK_DIMENSIONS.DESIGN]: this.checkDesign.bind(this),
      [CHECK_DIMENSIONS.DEVELOPMENT]: this.checkDevelopment.bind(this),
      [CHECK_DIMENSIONS.QUALITY]: this.checkQuality.bind(this),
      [CHECK_DIMENSIONS.PERFORMANCE]: this.checkPerformance.bind(this),
      [CHECK_DIMENSIONS.SECURITY]: this.checkSecurity.bind(this),
      [CHECK_DIMENSIONS.DOCUMENTATION]: this.checkDocumentation.bind(this),
      [CHECK_DIMENSIONS.OPERATIONS]: this.checkOperations.bind(this)
    };

    const checker = checkers[dimension];
    if (!checker) {
      return { checks: [], issues: [], recommendations: [] };
    }

    return checker(projectInfo);
  }

  /**
   * 需求完整性检测
   */
  checkRequirement(projectInfo) {
    const checks = [];
    const issues = [];
    const recommendations = [];
    const req = projectInfo.requirement || {};

    // 检测项
    checks.push({
      item: '需求文档完整性',
      status: req.hasPRD ? 'passed' : 'failed',
      description: req.hasPRD ? 'PRD文档已编写' : '缺少PRD文档',
      impact: 'High'
    });

    checks.push({
      item: '用户故事完整性',
      status: req.hasUserStories ? 'passed' : 'warning',
      description: req.hasUserStories ? '用户故事已拆分' : '用户故事未拆分',
      impact: 'Medium'
    });

    checks.push({
      item: '验收标准定义',
      status: req.hasAcceptanceCriteria ? 'passed' : 'warning',
      description: req.hasAcceptanceCriteria ? '验收标准已定义' : '验收标准未定义',
      impact: 'Medium'
    });

    checks.push({
      item: '需求评审状态',
      status: req.isReviewed ? 'passed' : 'warning',
      description: req.isReviewed ? '需求已评审' : '需求未评审',
      impact: 'High'
    });

    checks.push({
      item: '需求变更管理',
      status: req.hasChangeProcess ? 'passed' : 'warning',
      description: req.hasChangeProcess ? '变更流程已建立' : '缺少变更管理流程',
      impact: 'Medium'
    });

    // 收集问题
    checks.filter(c => c.status !== 'passed').forEach(c => {
      issues.push({
        dimension: 'requirement',
        item: c.item,
        severity: c.status === 'failed' ? 'High' : 'Medium',
        description: c.description
      });
    });

    // 生成建议
    if (!req.hasPRD) {
      recommendations.push({
        dimension: 'requirement',
        priority: 'High',
        action: '编写PRD文档',
        description: '使用prd-generation工作流自动生成PRD文档'
      });
    }
    if (!req.hasUserStories) {
      recommendations.push({
        dimension: 'requirement',
        priority: 'Medium',
        action: '拆分用户故事',
        description: '使用user-story工作流拆分用户故事'
      });
    }

    return { checks, issues, recommendations };
  }

  /**
   * 设计完整性检测
   */
  checkDesign(projectInfo) {
    const checks = [];
    const issues = [];
    const recommendations = [];
    const design = projectInfo.design || {};

    checks.push({
      item: 'UI设计稿',
      status: design.hasUIDesign ? 'passed' : 'warning',
      description: design.hasUIDesign ? 'UI设计稿已完成' : 'UI设计稿未完成',
      impact: 'High'
    });

    checks.push({
      item: '交互设计文档',
      status: design.hasInteractionDesign ? 'passed' : 'warning',
      description: design.hasInteractionDesign ? '交互设计已定义' : '交互设计未定义',
      impact: 'Medium'
    });

    checks.push({
      item: '设计评审',
      status: design.isReviewed ? 'passed' : 'warning',
      description: design.isReviewed ? '设计已评审' : '设计未评审',
      impact: 'Medium'
    });

    checks.push({
      item: '设计规范',
      status: design.hasDesignSystem ? 'passed' : 'warning',
      description: design.hasDesignSystem ? '设计规范已建立' : '缺少设计规范',
      impact: 'Low'
    });

    checks.filter(c => c.status !== 'passed').forEach(c => {
      issues.push({
        dimension: 'design',
        item: c.item,
        severity: c.status === 'failed' ? 'High' : 'Medium',
        description: c.description
      });
    });

    return { checks, issues, recommendations };
  }

  /**
   * 开发进度检测
   */
  checkDevelopment(projectInfo) {
    const checks = [];
    const issues = [];
    const recommendations = [];
    const dev = projectInfo.development || {};

    const progress = dev.progress || 0;
    const plannedProgress = dev.plannedProgress || 100;

    checks.push({
      item: '开发进度',
      status: progress >= plannedProgress ? 'passed' : progress >= plannedProgress * 0.8 ? 'warning' : 'failed',
      description: `当前进度 ${progress}%，计划进度 ${plannedProgress}%`,
      impact: 'High',
      value: progress
    });

    checks.push({
      item: '代码评审',
      status: dev.hasCodeReview ? 'passed' : 'warning',
      description: dev.hasCodeReview ? '代码评审已执行' : '代码评审未执行',
      impact: 'Medium'
    });

    checks.push({
      item: '技术债务',
      status: dev.techDebt === 'low' ? 'passed' : dev.techDebt === 'medium' ? 'warning' : 'failed',
      description: `技术债务等级: ${dev.techDebt || '未知'}`,
      impact: 'Medium'
    });

    checks.push({
      item: '分支管理',
      status: dev.hasBranchStrategy ? 'passed' : 'warning',
      description: dev.hasBranchStrategy ? '分支策略已建立' : '缺少分支管理策略',
      impact: 'Low'
    });

    checks.filter(c => c.status !== 'passed').forEach(c => {
      issues.push({
        dimension: 'development',
        item: c.item,
        severity: c.status === 'failed' ? 'High' : 'Medium',
        description: c.description
      });
    });

    if (progress < plannedProgress * 0.8) {
      recommendations.push({
        dimension: 'development',
        priority: 'High',
        action: '加快开发进度',
        description: `进度落后 ${(plannedProgress - progress).toFixed(0)}%，需要调整资源或排期`
      });
    }

    return { checks, issues, recommendations };
  }

  /**
   * 质量状态检测
   */
  checkQuality(projectInfo) {
    const checks = [];
    const issues = [];
    const recommendations = [];
    const quality = projectInfo.quality || {};

    const bugCount = quality.bugCount || 0;
    const severeBugCount = quality.severeBugCount || 0;

    checks.push({
      item: '严重Bug数量',
      status: severeBugCount === 0 ? 'passed' : severeBugCount <= 2 ? 'warning' : 'failed',
      description: `当前严重Bug: ${severeBugCount}个`,
      impact: 'High',
      value: severeBugCount
    });

    checks.push({
      item: 'Bug总数',
      status: bugCount <= 5 ? 'passed' : bugCount <= 15 ? 'warning' : 'failed',
      description: `当前Bug总数: ${bugCount}个`,
      impact: 'Medium',
      value: bugCount
    });

    checks.push({
      item: '测试覆盖率',
      status: (quality.testCoverage || 0) >= 80 ? 'passed' : (quality.testCoverage || 0) >= 60 ? 'warning' : 'failed',
      description: `测试覆盖率: ${quality.testCoverage || 0}%`,
      impact: 'Medium',
      value: quality.testCoverage
    });

    checks.push({
      item: '自动化测试',
      status: quality.hasAutoTest ? 'passed' : 'warning',
      description: quality.hasAutoTest ? '自动化测试已建立' : '缺少自动化测试',
      impact: 'Medium'
    });

    checks.filter(c => c.status !== 'passed').forEach(c => {
      issues.push({
        dimension: 'quality',
        item: c.item,
        severity: c.status === 'failed' ? 'High' : 'Medium',
        description: c.description
      });
    });

    if (severeBugCount > 0) {
      recommendations.push({
        dimension: 'quality',
        priority: 'High',
        action: '修复严重Bug',
        description: `存在${severeBugCount}个严重Bug，需要优先处理`
      });
    }

    return { checks, issues, recommendations };
  }

  /**
   * 性能状态检测
   */
  checkPerformance(projectInfo) {
    const checks = [];
    const issues = [];
    const recommendations = [];
    const perf = projectInfo.performance || {};

    const loadTime = perf.pageLoadTime || 0;
    const apiTime = perf.apiResponseTime || 0;

    checks.push({
      item: '页面加载时间',
      status: loadTime <= 2000 ? 'passed' : loadTime <= 3000 ? 'warning' : 'failed',
      description: `页面加载时间: ${loadTime}ms`,
      impact: 'High',
      value: loadTime
    });

    checks.push({
      item: 'API响应时间',
      status: apiTime <= 500 ? 'passed' : apiTime <= 1000 ? 'warning' : 'failed',
      description: `API响应时间: ${apiTime}ms`,
      impact: 'High',
      value: apiTime
    });

    checks.push({
      item: '性能测试',
      status: perf.hasPerfTest ? 'passed' : 'warning',
      description: perf.hasPerfTest ? '性能测试已执行' : '性能测试未执行',
      impact: 'Medium'
    });

    checks.push({
      item: '性能监控',
      status: perf.hasMonitoring ? 'passed' : 'warning',
      description: perf.hasMonitoring ? '性能监控已配置' : '性能监控未配置',
      impact: 'Medium'
    });

    checks.filter(c => c.status !== 'passed').forEach(c => {
      issues.push({
        dimension: 'performance',
        item: c.item,
        severity: c.status === 'failed' ? 'High' : 'Medium',
        description: c.description
      });
    });

    return { checks, issues, recommendations };
  }

  /**
   * 安全状态检测
   */
  checkSecurity(projectInfo) {
    const checks = [];
    const issues = [];
    const recommendations = [];
    const security = projectInfo.security || {};

    checks.push({
      item: '安全评审',
      status: security.hasSecurityReview ? 'passed' : 'warning',
      description: security.hasSecurityReview ? '安全评审已完成' : '安全评审未完成',
      impact: 'High'
    });

    checks.push({
      item: 'SQL注入防护',
      status: security.hasSQLInjectionProtection ? 'passed' : 'failed',
      description: security.hasSQLInjectionProtection ? 'SQL注入防护已配置' : '缺少SQL注入防护',
      impact: 'High'
    });

    checks.push({
      item: 'XSS防护',
      status: security.hasXSSProtection ? 'passed' : 'failed',
      description: security.hasXSSProtection ? 'XSS防护已配置' : '缺少XSS防护',
      impact: 'High'
    });

    checks.push({
      item: '数据加密',
      status: security.hasEncryption ? 'passed' : 'warning',
      description: security.hasEncryption ? '数据加密已配置' : '数据加密未配置',
      impact: 'High'
    });

    checks.push({
      item: '权限控制',
      status: security.hasAccessControl ? 'passed' : 'failed',
      description: security.hasAccessControl ? '权限控制已配置' : '缺少权限控制',
      impact: 'High'
    });

    checks.push({
      item: '敏感信息保护',
      status: security.hasDataMasking ? 'passed' : 'warning',
      description: security.hasDataMasking ? '敏感信息已脱敏' : '敏感信息未脱敏',
      impact: 'Medium'
    });

    checks.filter(c => c.status !== 'passed').forEach(c => {
      issues.push({
        dimension: 'security',
        item: c.item,
        severity: c.status === 'failed' ? 'High' : 'Medium',
        description: c.description
      });
    });

    if (issues.filter(i => i.severity === 'High').length > 0) {
      recommendations.push({
        dimension: 'security',
        priority: 'High',
        action: '修复安全漏洞',
        description: '存在高危安全问题，需要立即处理'
      });
    }

    return { checks, issues, recommendations };
  }

  /**
   * 文档完整性检测
   */
  checkDocumentation(projectInfo) {
    const checks = [];
    const issues = [];
    const recommendations = [];
    const docs = projectInfo.documentation || {};

    checks.push({
      item: 'PRD文档',
      status: docs.hasPRD ? 'passed' : 'warning',
      description: docs.hasPRD ? 'PRD文档已编写' : 'PRD文档未编写',
      impact: 'High'
    });

    checks.push({
      item: '接口文档',
      status: docs.hasAPIDoc ? 'passed' : 'warning',
      description: docs.hasAPIDoc ? '接口文档已编写' : '接口文档未编写',
      impact: 'High'
    });

    checks.push({
      item: '用户手册',
      status: docs.hasUserManual ? 'passed' : 'warning',
      description: docs.hasUserManual ? '用户手册已编写' : '用户手册未编写',
      impact: 'Medium'
    });

    checks.push({
      item: '运维文档',
      status: docs.hasOpsDoc ? 'passed' : 'warning',
      description: docs.hasOpsDoc ? '运维文档已编写' : '运维文档未编写',
      impact: 'Medium'
    });

    checks.push({
      item: '测试报告',
      status: docs.hasTestReport ? 'passed' : 'warning',
      description: docs.hasTestReport ? '测试报告已编写' : '测试报告未编写',
      impact: 'Medium'
    });

    checks.filter(c => c.status !== 'passed').forEach(c => {
      issues.push({
        dimension: 'documentation',
        item: c.item,
        severity: 'Medium',
        description: c.description
      });
    });

    return { checks, issues, recommendations };
  }

  /**
   * 运维准备检测
   */
  checkOperations(projectInfo) {
    const checks = [];
    const issues = [];
    const recommendations = [];
    const ops = projectInfo.operations || {};

    checks.push({
      item: '部署方案',
      status: ops.hasDeployPlan ? 'passed' : 'warning',
      description: ops.hasDeployPlan ? '部署方案已制定' : '部署方案未制定',
      impact: 'High'
    });

    checks.push({
      item: '监控告警',
      status: ops.hasMonitoring ? 'passed' : 'warning',
      description: ops.hasMonitoring ? '监控告警已配置' : '监控告警未配置',
      impact: 'High'
    });

    checks.push({
      item: '日志收集',
      status: ops.hasLogging ? 'passed' : 'warning',
      description: ops.hasLogging ? '日志收集已配置' : '日志收集未配置',
      impact: 'Medium'
    });

    checks.push({
      item: '备份策略',
      status: ops.hasBackup ? 'passed' : 'warning',
      description: ops.hasBackup ? '备份策略已制定' : '备份策略未制定',
      impact: 'High'
    });

    checks.push({
      item: '回滚方案',
      status: ops.hasRollback ? 'passed' : 'warning',
      description: ops.hasRollback ? '回滚方案已准备' : '回滚方案未准备',
      impact: 'High'
    });

    checks.push({
      item: '应急预案',
      status: ops.hasEmergencyPlan ? 'passed' : 'warning',
      description: ops.hasEmergencyPlan ? '应急预案已制定' : '应急预案未制定',
      impact: 'Medium'
    });

    checks.filter(c => c.status !== 'passed').forEach(c => {
      issues.push({
        dimension: 'operations',
        item: c.item,
        severity: c.status === 'failed' ? 'High' : 'Medium',
        description: c.description
      });
    });

    return { checks, issues, recommendations };
  }

  /**
   * 计算健康分数
   */
  calculateHealthScore(summary) {
    const { totalChecks, passedChecks, warningChecks, failedChecks } = summary;
    
    if (totalChecks === 0) return 0;
    
    const passedScore = (passedChecks / totalChecks) * 100;
    const warningPenalty = (warningChecks / totalChecks) * 15;
    const failedPenalty = (failedChecks / totalChecks) * 30;
    
    return Math.max(0, Math.round(passedScore - warningPenalty - failedPenalty));
  }

  /**
   * 生成检测报告
   */
  generateReport(results) {
    return {
      summary: {
        projectName: results.projectName,
        checkTime: results.checkTime,
        healthScore: results.summary.healthScore,
        healthLevel: this.getHealthLevel(results.summary.healthScore),
        totalChecks: results.summary.totalChecks,
        passedChecks: results.summary.passedChecks,
        warningChecks: results.summary.warningChecks,
        failedChecks: results.summary.failedChecks
      },
      dimensions: Object.entries(results.dimensions).map(([key, value]) => ({
        name: key,
        checks: value.checks,
        issues: value.issues.length,
        status: value.checks.every(c => c.status === 'passed') ? 'healthy' : 
                value.checks.some(c => c.status === 'failed') ? 'critical' : 'warning'
      })),
      issues: results.issues,
      recommendations: results.recommendations,
      actionPlan: this.generateActionPlan(results)
    };
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
   * 生成行动计划
   */
  generateActionPlan(results) {
    const highPriority = results.issues.filter(i => i.severity === 'High');
    const mediumPriority = results.issues.filter(i => i.severity === 'Medium');

    return {
      immediate: highPriority.map(i => ({
        action: `修复${i.item}`,
        dimension: i.dimension,
        description: i.description
      })),
      shortTerm: mediumPriority.slice(0, 5).map(i => ({
        action: `处理${i.item}`,
        dimension: i.dimension,
        description: i.description
      })),
      recommendations: results.recommendations.slice(0, 5)
    };
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProjectHealthChecker, CHECK_DIMENSIONS };
}

// 使用示例
async function runExample() {
  const checker = new ProjectHealthChecker();
  
  const projectInfo = {
    name: '示例项目',
    requirement: {
      hasPRD: true,
      hasUserStories: false,
      hasAcceptanceCriteria: true,
      isReviewed: false
    },
    development: {
      progress: 70,
      plannedProgress: 80,
      hasCodeReview: true,
      techDebt: 'medium'
    },
    quality: {
      bugCount: 8,
      severeBugCount: 1,
      testCoverage: 65,
      hasAutoTest: true
    },
    security: {
      hasSecurityReview: false,
      hasSQLInjectionProtection: true,
      hasXSSProtection: true,
      hasEncryption: true,
      hasAccessControl: true
    }
  };
  
  const results = await checker.checkAll(projectInfo);
  const report = checker.generateReport(results);
  
  console.log(JSON.stringify(report, null, 2));
}

// 如果直接运行
if (require.main === module) {
  const args = process.argv.slice(2);
  const inputJson = args[0] || '{}';
  
  try {
    const projectInfo = JSON.parse(inputJson);
    const checker = new ProjectHealthChecker();
    checker.checkAll(projectInfo).then(results => {
      const report = checker.generateReport(results);
      console.log(JSON.stringify(report, null, 2));
    });
  } catch (e) {
    console.error('用法: node project-checker.js <项目信息JSON>');
    console.error('示例: node project-checker.js \'{"name":"项目名","requirement":{"hasPRD":true}}\'');
  }
}