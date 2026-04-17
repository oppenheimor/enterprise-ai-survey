const { marked } = require('marked');

/**
 * 产品需求分析脚本 v2.0
 * 增强版：支持更多分析类型和更智能的解析
 * @param {string} requirement - 需求描述
 * @param {string} analysisType - 分析类型 (requirement|user-story|prd|competitive|okr|roadmap|priority)
 * @param {Object} options - 可选配置
 * @returns {Promise<Object>} 分析结果
 */
async function analyzeRequirement(requirement, analysisType = 'requirement', options = {}) {
  try {
    if (!requirement || typeof requirement !== 'string') {
      throw new Error('请提供有效的需求描述');
    }

    let result = {};

    switch (analysisType) {
      case 'requirement':
        result = analyzeRequirementDetail(requirement, options);
        break;
      case 'user-story':
        result = generateUserStories(requirement, options);
        break;
      case 'prd':
        result = generatePRD(requirement, options);
        break;
      case 'competitive':
        result = analyzeCompetitive(requirement, options);
        break;
      case 'okr':
        result = generateOKR(requirement, options);
        break;
      case 'roadmap':
        result = generateRoadmap(requirement, options);
        break;
      case 'priority':
        result = analyzePriority(requirement, options);
        break;
      case 'impact':
        result = analyzeImpact(requirement, options);
        break;
      default:
        result = analyzeRequirementDetail(requirement, options);
    }

    return {
      success: true,
      analysisType,
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      ...result
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * 需求详细分析（增强版）
 */
function analyzeRequirementDetail(requirement, options) {
  const keywords = extractKeywords(requirement);
  const userGroups = identifyUserGroups(requirement);
  const painPoints = extractPainPoints(requirement);
  const priority = assessPriority(requirement, options);
  const complexity = assessComplexity(requirement);
  const risks = identifyRisks(requirement);
  const dependencies = identifyDependencies(requirement);

  return {
    summary: generateSummary(requirement),
    keywords,
    userGroups,
    painPoints,
    priority,
    complexity,
    risks,
    dependencies,
    suggestions: generateSuggestions(requirement, painPoints),
    metrics: suggestMetrics(requirement),
    nextSteps: suggestNextSteps(requirement)
  };
}

/**
 * 生成用户故事（增强版）
 */
function generateUserStories(requirement, options) {
  const stories = [];
  const epicName = extractEpicName(requirement);
  const features = extractFeatures(requirement);

  features.forEach((feature, index) => {
    const story = {
      id: `US-${String(index + 1).padStart(3, '0')}`,
      epic: epicName,
      title: feature.title,
      story: `作为一个${feature.user}，我希望${feature.action}，以便${feature.benefit}`,
      acceptanceCriteria: generateAC(feature),
      storyPoints: estimateStoryPoints(feature),
      priority: feature.priority || 'Medium',
      labels: generateLabels(feature),
      tasks: generateTasks(feature)
    };
    stories.push(story);
  });

  const groupedByPriority = groupByPriority(stories);

  return {
    epic: epicName,
    totalStories: stories.length,
    totalPoints: stories.reduce((sum, s) => sum + s.storyPoints, 0),
    priorityDistribution: groupedByPriority,
    estimatedSprints: Math.ceil(stories.reduce((sum, s) => sum + s.storyPoints, 0) / 10),
    stories
  };
}

/**
 * 生成PRD文档结构（增强版）
 */
function generatePRD(requirement, options) {
  const features = extractFeatures(requirement);
  
  return {
    documentInfo: {
      title: extractFeatureName(requirement),
      version: '1.0.0',
      author: options.author || 'Product Manager',
      date: new Date().toISOString().split('T')[0],
      status: 'Draft',
      reviewers: options.reviewers || []
    },
    executiveSummary: {
      problem: extractProblem(requirement),
      solution: extractSolution(requirement),
      value: extractValue(requirement)
    },
    background: {
      problem: extractProblem(requirement),
      opportunity: extractOpportunity(requirement),
      goals: extractGoals(requirement),
      successCriteria: extractSuccessCriteria(requirement)
    },
    targetUsers: identifyUserGroups(requirement),
    userScenarios: generateUserScenarios(requirement),
    functionalRequirements: features.map((f, i) => ({
      id: `FR-${String(i + 1).padStart(3, '0')}`,
      name: f.title,
      description: f.description || f.action,
      priority: f.priority || 'P1',
      category: f.category || 'Core',
      userStory: `作为一个${f.user}，我希望${f.action}，以便${f.benefit}`,
      acceptanceCriteria: generateAC(f)
    })),
    nonFunctionalRequirements: [
      { id: 'NFR-001', name: '性能', description: '页面加载时间 < 2秒，API响应时间 < 500ms', priority: 'P1' },
      { id: 'NFR-002', name: '可用性', description: '系统可用性 > 99.9%', priority: 'P1' },
      { id: 'NFR-003', name: '安全性', description: '数据传输加密，敏感信息脱敏，权限控制', priority: 'P1' },
      { id: 'NFR-004', name: '兼容性', description: '支持主流浏览器最新两个版本', priority: 'P2' }
    ],
    dataRequirements: generateDataRequirements(requirement),
    successMetrics: suggestMetrics(requirement),
    risks: identifyRisks(requirement),
    timeline: suggestTimeline(requirement),
    resources: estimateResources(features),
    glossary: generateGlossary(requirement)
  };
}

/**
 * 竞品分析（增强版）
 */
function analyzeCompetitive(requirement, options) {
  const competitors = options.competitors || [];
  
  return {
    marketOverview: {
      size: options.marketSize || '待调研',
      growth: options.marketGrowth || '待调研',
      trends: ['AI驱动', '用户体验优先', '数据安全', '移动优先', '个性化'],
      userSegments: identifyUserGroups(requirement)
    },
    competitors: competitors.length > 0 ? competitors.map(c => ({
      name: c.name || '竞品',
      strengths: c.strengths || [],
      weaknesses: c.weaknesses || [],
      features: c.features || [],
      pricing: c.pricing || '未知',
      marketShare: c.marketShare || '未知',
      userReviews: c.userReviews || []
    })) : generateDefaultCompetitors(requirement),
    featureComparison: generateFeatureComparison(requirement, competitors),
    differentiation: generateDifferentiation(requirement),
    swot: generateSWOT(requirement, competitors),
    recommendations: generateCompetitiveRecommendations(requirement),
    actionPlan: generateActionPlan(requirement)
  };
}

/**
 * 生成OKR
 */
function generateOKR(requirement, options) {
  const goals = extractGoals(requirement);
  const features = extractFeatures(requirement);
  
  return {
    objective: {
      title: extractFeatureName(requirement) + '产品目标',
      description: extractProblem(requirement) + '，' + extractOpportunity(requirement)
    },
    keyResults: [
      {
        id: 'KR-1',
        title: '用户增长',
        description: '提升产品用户规模',
        target: options.dauTarget || 'DAU增长50%',
        measurement: '日活跃用户数',
        progress: 0
      },
      {
        id: 'KR-2',
        title: '用户留存',
        description: '提升用户粘性和留存率',
        target: options.retentionTarget || '次日留存率 > 40%',
        measurement: '次日/7日/30日留存率',
        progress: 0
      },
      {
        id: 'KR-3',
        title: '用户满意度',
        description: '提升用户体验和满意度',
        target: options.npsTarget || 'NPS > 30',
        measurement: '净推荐值',
        progress: 0
      },
      {
        id: 'KR-4',
        title: '业务转化',
        description: '提升核心业务转化',
        target: options.conversionTarget || '转化率提升20%',
        measurement: '核心转化漏斗各环节转化率',
        progress: 0
      }
    ],
    initiatives: features.slice(0, 5).map((f, i) => ({
      id: `INI-${i + 1}`,
      title: f.title,
      relatedKRs: ['KR-1', 'KR-2', 'KR-3'],
      status: 'Planned',
      owner: '待分配'
    })),
    checkInSchedule: {
      frequency: '每周',
      nextCheckIn: getNextCheckInDate()
    }
  };
}

/**
 * 生成路线图
 */
function generateRoadmap(requirement, options) {
  const features = extractFeatures(requirement);
  const priorityGroups = groupByPriority(features);
  
  return {
    productName: extractFeatureName(requirement),
    vision: extractValue(requirement),
    timeline: {
      q1: {
        theme: 'MVP版本',
        features: priorityGroups.High?.slice(0, 3) || [],
        goals: ['核心功能上线', '种子用户获取']
      },
      q2: {
        theme: '体验优化',
        features: priorityGroups.Medium?.slice(0, 3) || [],
        goals: ['用户留存提升', '性能优化']
      },
      q3: {
        theme: '功能扩展',
        features: priorityGroups.Medium?.slice(3, 6) || [],
        goals: ['功能完善', '用户增长']
      },
      q4: {
        theme: '规模化',
        features: priorityGroups.Low?.slice(0, 3) || [],
        goals: ['商业化探索', '生态建设']
      }
    },
    milestones: generateMilestones(features),
    dependencies: identifyDependencies(requirement),
    risks: identifyRisks(requirement)
  };
}

/**
 * 优先级分析
 */
function analyzePriority(requirement, options) {
  const features = extractFeatures(requirement);
  
  const prioritizedFeatures = features.map(f => {
    const score = calculatePriorityScore(f, requirement);
    return {
      ...f,
      priorityScore: score,
      rationale: generatePriorityRationale(f, score)
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  return {
    method: 'RICE评分法',
    features: prioritizedFeatures,
    matrix: generatePriorityMatrix(prioritizedFeatures),
    recommendations: generatePriorityRecommendations(prioritizedFeatures)
  };
}

/**
 * 影响分析
 */
function analyzeImpact(requirement, options) {
  const features = extractFeatures(requirement);
  
  return {
    userImpact: assessUserImpact(requirement),
    businessImpact: assessBusinessImpact(requirement),
    technicalImpact: assessTechnicalImpact(requirement),
    riskAssessment: identifyRisks(requirement),
    mitigationStrategies: generateMitigationStrategies(requirement),
    stakeholders: identifyStakeholders(requirement),
    communicationPlan: generateCommunicationPlan(requirement)
  };
}

// ==================== 辅助函数 ====================

function extractKeywords(text) {
  const keywordPatterns = [
    '用户', '功能', '系统', '数据', '管理', '分析', '展示', '搜索', 
    '通知', '权限', '登录', '注册', '支付', '订单', '商品', '消息',
    '报表', '统计', '导出', '导入', '配置', '设置', '审核', '流程'
  ];
  return keywordPatterns.filter(p => text.includes(p));
}

function identifyUserGroups(text) {
  const groups = [];
  const userPatterns = [
    { pattern: '管理员', name: '管理员', description: '系统管理用户，拥有最高权限' },
    { pattern: '运营', name: '运营人员', description: '内容运营和活动运营用户' },
    { pattern: '客服', name: '客服人员', description: '客户服务支持人员' },
    { pattern: '商家', name: '商家用户', description: '入驻商家或供应商' },
    { pattern: 'VIP', name: 'VIP用户', description: '付费会员用户' },
    { pattern: '用户', name: '普通用户', description: '终端用户，使用核心功能' }
  ];
  
  userPatterns.forEach(p => {
    if (text.includes(p.pattern)) {
      groups.push({ name: p.name, description: p.description });
    }
  });
  
  if (groups.length === 0) {
    groups.push({ name: '用户', description: '目标用户群体' });
  }
  
  return groups;
}

function extractPainPoints(text) {
  const points = [];
  const painPatterns = [
    { patterns: ['效率', '慢', '耗时', '繁琐'], point: '效率问题', solution: '优化流程，提升操作效率' },
    { patterns: ['复杂', '难用', '不直观', '困惑'], point: '易用性问题', solution: '简化交互，优化用户体验' },
    { patterns: ['不准确', '错误', '异常', 'bug'], point: '准确性问题', solution: '修复问题，提升系统稳定性' },
    { patterns: ['找不到', '缺失', '没有'], point: '功能缺失', solution: '补充必要功能' },
    { patterns: ['不安全', '泄露', '风险'], point: '安全问题', solution: '加强安全防护措施' }
  ];
  
  painPatterns.forEach(p => {
    if (p.patterns.some(pattern => text.includes(pattern))) {
      points.push({ point: p.point, solution: p.solution });
    }
  });
  
  if (points.length === 0) {
    points.push({ point: '待进一步调研确认', solution: '建议进行用户访谈' });
  }
  
  return points;
}

function assessPriority(text, options) {
  let score = 50;
  const boosters = ['核心', '重要', '关键', '必须', '紧急', '尽快', '优先'];
  const reducers = ['优化', '改进', '增强', '可选', '后续', '未来'];
  
  boosters.forEach(b => { if (text.includes(b)) score += 10; });
  reducers.forEach(r => { if (text.includes(r)) score -= 5; });
  
  return {
    score: Math.min(100, Math.max(0, score)),
    level: score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low',
    factors: {
      boosters: boosters.filter(b => text.includes(b)),
      reducers: reducers.filter(r => text.includes(r))
    }
  };
}

function assessComplexity(text) {
  const complexityIndicators = {
    high: ['集成', '对接', '迁移', '重构', '架构', '分布式', '微服务'],
    medium: ['权限', '流程', '审批', '配置', '规则', '计算'],
    low: ['展示', '查询', '列表', '详情', '表单']
  };
  
  let level = 'Low';
  let score = 1;
  
  if (complexityIndicators.high.some(i => text.includes(i))) {
    level = 'High';
    score = 3;
  } else if (complexityIndicators.medium.some(i => text.includes(i))) {
    level = 'Medium';
    score = 2;
  }
  
  return {
    level,
    score,
    factors: complexityIndicators[level.toLowerCase()]?.filter(i => text.includes(i)) || []
  };
}

function identifyRisks(text) {
  const risks = [];
  const riskPatterns = [
    { pattern: '集成', risk: '第三方集成风险', impact: 'High', mitigation: '提前进行技术调研和POC验证' },
    { pattern: '数据迁移', risk: '数据迁移风险', impact: 'High', mitigation: '制定详细迁移方案和回滚计划' },
    { pattern: '性能', risk: '性能风险', impact: 'Medium', mitigation: '进行性能测试和优化' },
    { pattern: '安全', risk: '安全风险', impact: 'High', mitigation: '安全评审和渗透测试' },
    { pattern: '用户习惯', risk: '用户接受度风险', impact: 'Medium', mitigation: '用户测试和灰度发布' }
  ];
  
  riskPatterns.forEach(r => {
    if (text.includes(r.pattern)) {
      risks.push({
        risk: r.risk,
        impact: r.impact,
        mitigation: r.mitigation
      });
    }
  });
  
  if (risks.length === 0) {
    risks.push(
      { risk: '技术风险', impact: 'Medium', mitigation: '技术预研和代码评审' },
      { risk: '用户接受度', impact: 'High', mitigation: '用户测试和灰度发布' },
      { risk: '资源风险', impact: 'Medium', mitigation: '资源预留和进度监控' }
    );
  }
  
  return risks;
}

function identifyDependencies(text) {
  const dependencies = [];
  const depPatterns = [
    { pattern: 'API', dep: '第三方API依赖', type: 'external' },
    { pattern: '数据库', dep: '数据库依赖', type: 'internal' },
    { pattern: '支付', dep: '支付系统依赖', type: 'external' },
    { pattern: '消息', dep: '消息系统依赖', type: 'internal' },
    { pattern: '认证', dep: '认证系统依赖', type: 'internal' }
  ];
  
  depPatterns.forEach(d => {
    if (text.includes(d.pattern)) {
      dependencies.push({
        name: d.dep,
        type: d.type,
        status: '待确认'
      });
    }
  });
  
  return dependencies;
}

function generateSummary(text) {
  const sentences = text.split(/[。！？\n]/).filter(s => s.trim().length > 0);
  if (sentences.length <= 2) return text;
  return sentences.slice(0, 2).join('。') + '。';
}

function generateSuggestions(text, painPoints) {
  const suggestions = [
    '建议进行用户访谈，深入了解真实需求',
    '建议分析竞品功能，寻找差异化机会',
    '建议设计MVP版本，快速验证核心假设'
  ];
  
  painPoints.forEach(p => {
    if (p.solution) {
      suggestions.push(`针对${p.point}：${p.solution}`);
    }
  });
  
  return suggestions;
}

function suggestMetrics(text) {
  const baseMetrics = [
    { name: 'DAU', description: '日活跃用户数', target: '待定', category: '增长' },
    { name: 'MAU', description: '月活跃用户数', target: '待定', category: '增长' },
    { name: '留存率', description: '次日/7日/30日留存率', target: '待定', category: '留存' },
    { name: '转化率', description: '关键转化率', target: '待定', category: '转化' },
    { name: 'NPS', description: '净推荐值', target: '> 30', category: '满意度' }
  ];
  
  if (text.includes('支付') || text.includes('订单')) {
    baseMetrics.push({ name: 'GMV', description: '商品交易总额', target: '待定', category: '营收' });
    baseMetrics.push({ name: 'ARPU', description: '每用户平均收入', target: '待定', category: '营收' });
  }
  
  return baseMetrics;
}

function suggestNextSteps(text) {
  return [
    { step: '需求评审', description: '组织需求评审会议，确认需求范围', owner: '产品经理' },
    { step: '技术评估', description: '技术团队评估实现方案和工期', owner: '技术负责人' },
    { step: '设计评审', description: 'UI/UX设计并评审', owner: '设计师' },
    { step: '开发排期', description: '确定开发排期和资源分配', owner: '项目经理' }
  ];
}

function extractEpicName(text) {
  const match = text.match(/(.{2,10})(功能|系统|模块|平台)/);
  return match ? match[0] : '功能开发';
}

function extractFeatures(text) {
  const features = [];
  const sentences = text.split(/[，。！？\n]/);
  
  sentences.forEach((s, i) => {
    const actionMatch = s.match(/(.*)可以(.*)|(.*)能够(.*)|(.*)支持(.*)|提供(.*)功能/);
    if (actionMatch) {
      const action = actionMatch.filter(m => m).pop() || s;
      features.push({
        id: `F-${String(i + 1).padStart(3, '0')}`,
        title: `功能${features.length + 1}`,
        user: '用户',
        action: action.trim(),
        benefit: '提升工作效率',
        priority: 'Medium',
        description: s,
        category: 'Core'
      });
    }
  });

  if (features.length === 0) {
    features.push({
      id: 'F-001',
      title: '核心功能',
      user: '用户',
      action: '完成主要操作',
      benefit: '满足核心需求',
      priority: 'High',
      description: text.substring(0, 50),
      category: 'Core'
    });
  }

  return features;
}

function generateAC(feature) {
  return [
    { given: '用户进入功能页面', when: '用户查看页面内容', then: '系统正确展示功能入口' },
    { given: '用户在功能页面', when: `用户执行${feature.action}`, then: '系统正确响应并展示结果' },
    { given: '用户完成操作', when: '操作成功', then: '系统显示成功提示' }
  ];
}

function estimateStoryPoints(feature) {
  const complexity = (feature.action || '').length;
  if (complexity > 50) return 5;
  if (complexity > 20) return 3;
  return 2;
}

function generateLabels(feature) {
  const labels = ['feature'];
  if (feature.priority === 'High') labels.push('priority');
  if (feature.category === 'Core') labels.push('core');
  return labels;
}

function generateTasks(feature) {
  return [
    { task: '需求细化', estimate: '0.5d' },
    { task: '设计评审', estimate: '0.5d' },
    { task: '开发实现', estimate: '2d' },
    { task: '测试验证', estimate: '1d' }
  ];
}

function groupByPriority(items) {
  return items.reduce((acc, item) => {
    const priority = item.priority || 'Medium';
    if (!acc[priority]) acc[priority] = [];
    acc[priority].push(item);
    return acc;
  }, {});
}

function extractFeatureName(text) {
  return extractEpicName(text);
}

function extractProblem(text) {
  const match = text.match(/(.{10,50})(问题|痛点|困难|挑战)/);
  return match ? match[0] : '当前存在效率低下、用户体验不佳等问题';
}

function extractSolution(text) {
  return '通过数字化手段提升效率，改善用户体验';
}

function extractValue(text) {
  return '提升用户满意度，提高操作效率，降低运营成本';
}

function extractOpportunity(text) {
  return '通过数字化手段提升效率，改善用户体验';
}

function extractGoals(text) {
  const goals = [];
  if (text.includes('效率')) goals.push('提升操作效率');
  if (text.includes('体验')) goals.push('改善用户体验');
  if (text.includes('增长')) goals.push('促进用户增长');
  if (text.includes('转化')) goals.push('提升转化率');
  if (goals.length === 0) goals.push('提升用户满意度', '提高操作效率', '降低运营成本');
  return goals;
}

function extractSuccessCriteria(text) {
  return [
    { criteria: '功能上线', measurement: '按时交付' },
    { criteria: '用户满意度', measurement: 'NPS > 30' },
    { criteria: '系统稳定性', measurement: '可用性 > 99.9%' }
  ];
}

function generateUserScenarios(requirement) {
  return [
    {
      scenario: '场景1',
      user: '普通用户',
      goal: '完成核心操作',
      steps: ['进入系统', '执行操作', '查看结果']
    }
  ];
}

function generateDataRequirements(requirement) {
  return [
    { name: '用户数据', description: '用户基本信息和行为数据', sensitivity: 'Medium' },
    { name: '业务数据', description: '核心业务数据', sensitivity: 'High' }
  ];
}

function estimateResources(features) {
  const totalPoints = features.reduce((sum, f) => sum + estimateStoryPoints(f), 0);
  return {
    frontend: Math.ceil(totalPoints / 8),
    backend: Math.ceil(totalPoints / 6),
    qa: Math.ceil(totalPoints / 10),
    design: Math.ceil(features.length / 5),
    totalManDays: totalPoints * 1.5
  };
}

function generateGlossary(requirement) {
  return [
    { term: 'MVP', definition: '最小可行产品' },
    { term: 'PRD', definition: '产品需求文档' },
    { term: 'KPI', definition: '关键绩效指标' }
  ];
}

function generateDefaultCompetitors(requirement) {
  return [
    { name: '竞品A', strengths: ['市场占有率高', '品牌知名度高'], weaknesses: ['价格较高', '功能复杂'], features: [], pricing: '付费' },
    { name: '竞品B', strengths: ['用户体验好', '功能创新'], weaknesses: ['市场覆盖有限'], features: [], pricing: '免费+付费' },
    { name: '竞品C', strengths: ['价格优势', '本地化服务'], weaknesses: ['功能较少'], features: [], pricing: '免费' }
  ];
}

function generateFeatureComparison(requirement, competitors) {
  return {
    features: ['核心功能1', '核心功能2', '核心功能3'],
    comparison: competitors.length > 0 ? competitors.map(c => ({
      name: c.name,
      support: ['✅', '✅', '❌']
    })) : []
  };
}

function generateSWOT(requirement, competitors) {
  return {
    strengths: ['技术优势', '团队经验', '本地化服务'],
    weaknesses: ['品牌知名度', '市场覆盖', '资源有限'],
    opportunities: ['市场增长', '政策支持', '技术趋势'],
    threats: ['竞争加剧', '用户习惯', '技术变革']
  };
}

function generateDifferentiation(text) {
  return [
    '更简洁的用户界面',
    '更智能的操作体验',
    '更完善的数据分析',
    '更灵活的配置能力'
  ];
}

function generateCompetitiveRecommendations(text) {
  return [
    '聚焦核心用户场景，打造差异化体验',
    '建立数据壁垒，提升产品粘性',
    '持续迭代优化，快速响应市场变化',
    '加强品牌建设，提升市场认知'
  ];
}

function generateActionPlan(requirement) {
  return [
    { phase: '短期(1-3月)', actions: ['完善核心功能', '获取种子用户'] },
    { phase: '中期(3-6月)', actions: ['功能扩展', '用户增长'] },
    { phase: '长期(6-12月)', actions: ['生态建设', '商业化'] }
  ];
}

function getNextCheckInDate() {
  const today = new Date();
  today.setDate(today.getDate() + 7);
  return today.toISOString().split('T')[0];
}

function generateMilestones(features) {
  return [
    { milestone: 'M1', date: 'T+2周', deliverable: '需求评审完成' },
    { milestone: 'M2', date: 'T+4周', deliverable: '设计完成' },
    { milestone: 'M3', date: 'T+8周', deliverable: '开发完成' },
    { milestone: 'M4', date: 'T+10周', deliverable: '测试完成' },
    { milestone: 'M5', date: 'T+12周', deliverable: '正式上线' }
  ];
}

function calculatePriorityScore(feature, requirement) {
  let score = 50;
  if (feature.priority === 'High') score += 30;
  if (feature.priority === 'Medium') score += 10;
  if (requirement.includes('核心') && feature.category === 'Core') score += 20;
  return Math.min(100, score);
}

function generatePriorityRationale(feature, score) {
  if (score >= 80) return '核心功能，用户价值高，建议优先开发';
  if (score >= 60) return '重要功能，对用户体验有显著提升';
  return '优化功能，可根据资源情况安排';
}

function generatePriorityMatrix(features) {
  return {
    highValueHighEffort: features.filter(f => f.priorityScore >= 70 && estimateStoryPoints(f) >= 3),
    highValueLowEffort: features.filter(f => f.priorityScore >= 70 && estimateStoryPoints(f) < 3),
    lowValueHighEffort: features.filter(f => f.priorityScore < 70 && estimateStoryPoints(f) >= 3),
    lowValueLowEffort: features.filter(f => f.priorityScore < 70 && estimateStoryPoints(f) < 3)
  };
}

function generatePriorityRecommendations(features) {
  return [
    '优先开发高价值低投入的功能',
    '高价值高投入的功能需要详细评估ROI',
    '低价值功能可考虑延后或取消'
  ];
}

function assessUserImpact(requirement) {
  return {
    level: 'High',
    description: '影响所有目标用户的核心使用场景',
    affectedUsers: '全部用户',
    changeType: '功能新增'
  };
}

function assessBusinessImpact(requirement) {
  return {
    level: 'High',
    description: '对核心业务指标有显著影响',
    metrics: ['DAU', '转化率', 'GMV'],
    expectedChange: '正向提升'
  };
}

function assessTechnicalImpact(requirement) {
  return {
    level: 'Medium',
    description: '需要新增功能模块，不涉及架构调整',
    components: ['前端', '后端', '数据库'],
    complexity: '中等'
  };
}

function generateMitigationStrategies(requirement) {
  return [
    { risk: '技术风险', strategy: '技术预研和POC验证' },
    { risk: '用户接受度', strategy: '灰度发布和用户反馈收集' },
    { risk: '性能问题', strategy: '性能测试和优化' }
  ];
}

function identifyStakeholders(requirement) {
  return [
    { role: '产品负责人', responsibility: '需求确认和优先级决策' },
    { role: '技术负责人', responsibility: '技术方案和资源评估' },
    { role: '业务方', responsibility: '业务需求和使用反馈' }
  ];
}

function generateCommunicationPlan(requirement) {
  return [
    { audience: '管理层', frequency: '每周', content: '项目进度和风险' },
    { audience: '业务方', frequency: '双周', content: '功能进展和演示' },
    { audience: '用户', frequency: '版本发布', content: '更新公告和使用指南' }
  ];
}

// 如果直接运行脚本
if (require.main === module) {
  const args = process.argv.slice(2);
  const analysisType = args[0] || 'requirement';
  const requirement = args[1] || '';

  if (!requirement) {
    console.error('用法: node analyze.js <分析类型> <需求描述>');
    console.error('分析类型: requirement | user-story | prd | competitive | okr | roadmap | priority | impact');
    process.exit(1);
  }

  analyzeRequirement(requirement, analysisType).then(result => {
    console.log(JSON.stringify(result, null, 2));
  });
}

module.exports = { analyzeRequirement };