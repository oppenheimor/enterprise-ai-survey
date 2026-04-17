/**
 * AI驱动的产品经理工作流引擎
 * 支持AI自动执行完整的产品管理流程
 */

/**
 * 工作流类型定义
 */
const WORKFLOW_TYPES = {
  REQUIREMENT_ANALYSIS: 'requirement-analysis',
  USER_RESEARCH: 'user-research',
  COMPETITIVE_ANALYSIS: 'competitive-analysis',
  PRD_GENERATION: 'prd-generation',
  USER_STORY: 'user-story',
  ROADMAP: 'roadmap',
  LAUNCH_CHECK: 'launch-check',
  ITERATION_REVIEW: 'iteration-review',
  PROJECT_HEALTH_CHECK: 'project-health-check',
  FUNCTION_HEALTH_CHECK: 'function-health-check'
};

/**
 * AI工作流引擎
 */
class AIProductWorkflow {
  constructor(options = {}) {
    this.options = options;
    this.context = {};
    this.outputs = {};
  }

  /**
   * 执行完整工作流
   * @param {string} workflowType - 工作流类型
   * @param {object} input - 输入数据
   * @returns {Promise<object>} 执行结果
   */
  async execute(workflowType, input) {
    console.log(`\n🚀 启动AI工作流: ${workflowType}`);
    console.log('='.repeat(50));

    const workflow = this.getWorkflow(workflowType);
    const results = {
      workflowType,
      startTime: new Date().toISOString(),
      steps: [],
      outputs: {}
    };

    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];
      console.log(`\n📋 步骤 ${i + 1}/${workflow.steps.length}: ${step.name}`);
      
      const stepResult = await this.executeStep(step, input, results);
      results.steps.push({
        name: step.name,
        status: stepResult.success ? 'completed' : 'failed',
        output: stepResult.output,
        duration: stepResult.duration
      });

      if (!stepResult.success && step.required) {
        console.log(`❌ 必要步骤失败，工作流终止`);
        break;
      }
    }

    results.endTime = new Date().toISOString();
    results.success = results.steps.every(s => s.status === 'completed' || !s.required);
    
    console.log('\n' + '='.repeat(50));
    console.log(results.success ? '✅ 工作流执行完成' : '❌ 工作流执行失败');
    
    return results;
  }

  /**
   * 获取工作流定义
   */
  getWorkflow(type) {
    const workflows = {
      [WORKFLOW_TYPES.REQUIREMENT_ANALYSIS]: {
        name: '需求分析工作流',
        description: 'AI驱动的需求分析全流程',
        steps: [
          { name: '需求理解', action: 'understandRequirement', required: true },
          { name: '用户识别', action: 'identifyUsers', required: true },
          { name: '痛点挖掘', action: 'extractPainPoints', required: true },
          { name: '价值评估', action: 'assessValue', required: true },
          { name: '优先级排序', action: 'prioritizeFeatures', required: true },
          { name: '风险识别', action: 'identifyRisks', required: false },
          { name: '生成分析报告', action: 'generateAnalysisReport', required: true }
        ]
      },
      [WORKFLOW_TYPES.USER_RESEARCH]: {
        name: '用户调研工作流',
        description: 'AI驱动的用户调研设计与分析',
        steps: [
          { name: '调研目标定义', action: 'defineResearchGoal', required: true },
          { name: '调研方法选择', action: 'selectResearchMethod', required: true },
          { name: '访谈提纲生成', action: 'generateInterviewGuide', required: true },
          { name: '问卷设计', action: 'designQuestionnaire', required: false },
          { name: '用户画像构建', action: 'buildUserPersona', required: true },
          { name: '洞察提炼', action: 'extractInsights', required: true }
        ]
      },
      [WORKFLOW_TYPES.COMPETITIVE_ANALYSIS]: {
        name: '竞品分析工作流',
        description: 'AI驱动的竞品分析全流程',
        steps: [
          { name: '竞品识别', action: 'identifyCompetitors', required: true },
          { name: '功能对比', action: 'compareFeatures', required: true },
          { name: 'SWOT分析', action: 'analyzeSWOT', required: true },
          { name: '差异化定位', action: 'defineDifferentiation', required: true },
          { name: '策略建议', action: 'generateStrategy', required: true }
        ]
      },
      [WORKFLOW_TYPES.PRD_GENERATION]: {
        name: 'PRD生成工作流',
        description: 'AI驱动的PRD文档自动生成',
        steps: [
          { name: '背景分析', action: 'analyzeBackground', required: true },
          { name: '目标定义', action: 'defineGoals', required: true },
          { name: '用户故事拆解', action: 'breakdownUserStories', required: true },
          { name: '功能设计', action: 'designFeatures', required: true },
          { name: '验收标准定义', action: 'defineAcceptanceCriteria', required: true },
          { name: '非功能需求', action: 'defineNonFunctionalReqs', required: true },
          { name: '风险评估', action: 'assessRisks', required: false },
          { name: '生成PRD文档', action: 'generatePRDDocument', required: true }
        ]
      },
      [WORKFLOW_TYPES.USER_STORY]: {
        name: '用户故事工作流',
        description: 'AI驱动的用户故事生成与拆解',
        steps: [
          { name: 'Epic识别', action: 'identifyEpic', required: true },
          { name: '故事拆分', action: 'splitStories', required: true },
          { name: '验收标准生成', action: 'generateAC', required: true },
          { name: '故事点估算', action: 'estimateStoryPoints', required: true },
          { name: '优先级排序', action: 'prioritizeStories', required: true }
        ]
      },
      [WORKFLOW_TYPES.ROADMAP]: {
        name: '路线图工作流',
        description: 'AI驱动的产品路线图生成',
        steps: [
          { name: '愿景定义', action: 'defineVision', required: true },
          { name: 'OKR拆解', action: 'breakdownOKR', required: true },
          { name: '版本规划', action: 'planVersions', required: true },
          { name: '里程碑定义', action: 'defineMilestones', required: true },
          { name: '资源评估', action: 'estimateResources', required: false },
          { name: '生成路线图', action: 'generateRoadmap', required: true }
        ]
      },
      [WORKFLOW_TYPES.LAUNCH_CHECK]: {
        name: '上线检查工作流',
        description: 'AI驱动的上线前检查清单生成',
        steps: [
          { name: '功能验收项生成', action: 'generateFunctionChecklist', required: true },
          { name: '性能检查项生成', action: 'generatePerformanceChecklist', required: true },
          { name: '安全检查项生成', action: 'generateSecurityChecklist', required: true },
          { name: '运维检查项生成', action: 'generateOpsChecklist', required: true },
          { name: '文档检查项生成', action: 'generateDocChecklist', required: true },
          { name: '生成完整检查清单', action: 'generateFullChecklist', required: true }
        ]
      },
      [WORKFLOW_TYPES.ITERATION_REVIEW]: {
        name: '迭代复盘工作流',
        description: 'AI驱动的迭代复盘分析',
        steps: [
          { name: '目标回顾', action: 'reviewGoals', required: true },
          { name: '交付分析', action: 'analyzeDelivery', required: true },
          { name: '质量分析', action: 'analyzeQuality', required: true },
          { name: '问题归因', action: 'attributeIssues', required: true },
          { name: '经验总结', action: 'summarizeLessons', required: true },
          { name: '改进建议', action: 'suggestImprovements', required: true }
        ]
      },
      [WORKFLOW_TYPES.PROJECT_HEALTH_CHECK]: {
        name: '项目健康检测工作流',
        description: 'AI驱动的项目全盘检测',
        steps: [
          { name: '需求完整性检测', action: 'checkRequirementHealth', required: true },
          { name: '设计完整性检测', action: 'checkDesignHealth', required: true },
          { name: '开发进度检测', action: 'checkDevelopmentHealth', required: true },
          { name: '质量状态检测', action: 'checkQualityHealth', required: true },
          { name: '性能状态检测', action: 'checkPerformanceHealth', required: true },
          { name: '安全状态检测', action: 'checkSecurityHealth', required: true },
          { name: '文档完整性检测', action: 'checkDocumentationHealth', required: true },
          { name: '运维准备检测', action: 'checkOperationsHealth', required: true },
          { name: '生成健康报告', action: 'generateHealthReport', required: true }
        ]
      },
      [WORKFLOW_TYPES.FUNCTION_HEALTH_CHECK]: {
        name: '功能健康检测工作流',
        description: 'AI驱动的功能完整性、合理性、可用性检测',
        steps: [
          { name: '功能完整性检测', action: 'checkFunctionCompleteness', required: true },
          { name: '功能合理性检测', action: 'checkFunctionRationality', required: true },
          { name: '可用性检测', action: 'checkFunctionUsability', required: true },
          { name: '生成功能健康报告', action: 'generateFunctionHealthReport', required: true }
        ]
      }
    };

    return workflows[type] || workflows[WORKFLOW_TYPES.REQUIREMENT_ANALYSIS];
  }

  /**
   * 执行单个步骤
   */
  async executeStep(step, input, results) {
    const startTime = Date.now();
    
    try {
      const action = this.actions[step.action];
      if (!action) {
        throw new Error(`未找到动作: ${step.action}`);
      }

      const output = await action.call(this, input, results);
      
      return {
        success: true,
        output,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * AI动作定义
   */
  actions = {
    // ========== 需求分析 ==========
    understandRequirement(input) {
      const text = input.requirement || input.description || '';
      return {
        summary: this._extractSummary(text),
        keywords: this._extractKeywords(text),
        domain: this._identifyDomain(text),
        complexity: this._assessComplexity(text)
      };
    },

    identifyUsers(input, results) {
      const text = input.requirement || input.description || '';
      const userPatterns = [
        { patterns: ['管理员', '管理'], role: '管理员', description: '系统管理用户' },
        { patterns: ['运营', '运营人员'], role: '运营人员', description: '内容运营用户' },
        { patterns: ['客服'], role: '客服人员', description: '客户服务人员' },
        { patterns: ['商家', '供应商'], role: '商家用户', description: '入驻商家' },
        { patterns: ['用户', '普通用户', '消费者'], role: '普通用户', description: '终端用户' }
      ];

      const users = [];
      userPatterns.forEach(p => {
        if (p.patterns.some(pattern => text.includes(pattern))) {
          users.push({ role: p.role, description: p.description });
        }
      });

      if (users.length === 0) {
        users.push({ role: '用户', description: '目标用户群体' });
      }

      return { users, primaryUser: users[0] };
    },

    extractPainPoints(input, results) {
      const text = input.requirement || input.description || '';
      const painPatterns = [
        { patterns: ['效率', '慢', '耗时', '繁琐'], pain: '效率问题', impact: 'High', solution: '优化流程，提升操作效率' },
        { patterns: ['复杂', '难用', '不直观', '困惑'], pain: '易用性问题', impact: 'High', solution: '简化交互，优化用户体验' },
        { patterns: ['不准确', '错误', '异常'], pain: '准确性问题', impact: 'Medium', solution: '提升系统稳定性' },
        { patterns: ['找不到', '缺失', '没有'], pain: '功能缺失', impact: 'Medium', solution: '补充必要功能' },
        { patterns: ['不安全', '泄露', '风险'], pain: '安全问题', impact: 'High', solution: '加强安全防护' }
      ];

      const painPoints = [];
      painPatterns.forEach(p => {
        if (p.patterns.some(pattern => text.includes(pattern))) {
          painPoints.push({
            pain: p.pain,
            impact: p.impact,
            solution: p.solution,
            evidence: p.patterns.find(pattern => text.includes(pattern))
          });
        }
      });

      if (painPoints.length === 0) {
        painPoints.push({
          pain: '待进一步调研确认',
          impact: 'Unknown',
          solution: '建议进行用户访谈'
        });
      }

      return { painPoints };
    },

    assessValue(input, results) {
      const text = input.requirement || input.description || '';
      
      let userValue = 50;
      let businessValue = 50;
      
      const userValueKeywords = ['用户', '体验', '便捷', '快速', '简单'];
      const businessValueKeywords = ['收入', '转化', '增长', '效率', '成本'];
      
      userValueKeywords.forEach(k => { if (text.includes(k)) userValue += 10; });
      businessValueKeywords.forEach(k => { if (text.includes(k)) businessValue += 10; });

      return {
        userValue: Math.min(100, userValue),
        businessValue: Math.min(100, businessValue),
        totalValue: (userValue + businessValue) / 2,
        valueLevel: (userValue + businessValue) / 2 >= 70 ? 'High' : (userValue + businessValue) / 2 >= 40 ? 'Medium' : 'Low'
      };
    },

    prioritizeFeatures(input, results) {
      const features = this._extractFeatures(input.requirement || input.description || '');
      
      const prioritizedFeatures = features.map(f => {
        const score = this._calculatePriorityScore(f);
        return {
          ...f,
          priorityScore: score,
          priority: score >= 70 ? 'P0' : score >= 50 ? 'P1' : 'P2',
          rationale: this._generatePriorityRationale(f, score)
        };
      }).sort((a, b) => b.priorityScore - a.priorityScore);

      return {
        features: prioritizedFeatures,
        p0Count: prioritizedFeatures.filter(f => f.priority === 'P0').length,
        p1Count: prioritizedFeatures.filter(f => f.priority === 'P1').length,
        p2Count: prioritizedFeatures.filter(f => f.priority === 'P2').length
      };
    },

    identifyRisks(input, results) {
      const text = input.requirement || input.description || '';
      const riskPatterns = [
        { patterns: ['集成', '对接'], risk: '第三方集成风险', impact: 'High', mitigation: '提前技术调研和POC验证' },
        { patterns: ['数据迁移'], risk: '数据迁移风险', impact: 'High', mitigation: '制定详细迁移方案和回滚计划' },
        { patterns: ['性能'], risk: '性能风险', impact: 'Medium', mitigation: '进行性能测试和优化' },
        { patterns: ['安全'], risk: '安全风险', impact: 'High', mitigation: '安全评审和渗透测试' },
        { patterns: ['用户习惯'], risk: '用户接受度风险', impact: 'Medium', mitigation: '用户测试和灰度发布' }
      ];

      const risks = [];
      riskPatterns.forEach(r => {
        if (r.patterns.some(p => text.includes(p))) {
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
          { risk: '用户接受度', impact: 'High', mitigation: '用户测试和灰度发布' }
        );
      }

      return { risks };
    },

    generateAnalysisReport(input, results) {
      const steps = results.steps;
      const understandStep = steps.find(s => s.name === '需求理解');
      const usersStep = steps.find(s => s.name === '用户识别');
      const painStep = steps.find(s => s.name === '痛点挖掘');
      const valueStep = steps.find(s => s.name === '价值评估');
      const priorityStep = steps.find(s => s.name === '优先级排序');
      const riskStep = steps.find(s => s.name === '风险识别');

      return {
        reportType: '需求分析报告',
        generatedAt: new Date().toISOString(),
        summary: {
          requirement: understandStep?.output?.summary,
          domain: understandStep?.output?.domain,
          complexity: understandStep?.output?.complexity
        },
        users: usersStep?.output?.users,
        painPoints: painStep?.output?.painPoints,
        value: valueStep?.output,
        features: priorityStep?.output?.features,
        risks: riskStep?.output?.risks,
        recommendations: this._generateRecommendations(results)
      };
    },

    // ========== 用户调研 ==========
    defineResearchGoal(input) {
      const text = input.researchTopic || input.requirement || '';
      return {
        primaryGoal: `了解${this._extractMainTopic(text)}相关的用户需求和行为`,
        secondaryGoals: [
          '识别用户痛点和期望',
          '验证产品假设',
          '收集改进建议'
        ],
        researchQuestions: [
          '用户当前如何解决这个问题？',
          '用户对现有方案的满意度如何？',
          '用户期望什么样的解决方案？'
        ]
      };
    },

    selectResearchMethod(input) {
      const constraints = input.constraints || {};
      const methods = [];

      if (!constraints.noInterview) {
        methods.push({
          method: '用户访谈',
          sampleSize: '5-10人',
          duration: '45-60分钟/人',
          pros: ['深度理解', '灵活追问'],
          cons: ['样本量小', '耗时较长']
        });
      }

      if (!constraints.noSurvey) {
        methods.push({
          method: '问卷调查',
          sampleSize: '200+人',
          duration: '5-10分钟',
          pros: ['样本量大', '可量化'],
          cons: ['深度有限', '回收率不确定']
        });
      }

      methods.push({
        method: '可用性测试',
        sampleSize: '5-8人',
        duration: '30分钟/人',
        pros: ['发现易用性问题', '真实行为观察'],
        cons: ['需要原型', '环境要求']
      });

      return { recommendedMethods: methods, primaryMethod: methods[0] };
    },

    generateInterviewGuide(input, results) {
      const goalStep = results.steps.find(s => s.name === '调研目标定义');
      const topic = input.researchTopic || '产品';

      return {
        guide: {
          opening: {
            duration: '5分钟',
            script: '感谢您参与本次访谈。我们正在研究用户对' + topic + '的需求和体验。整个过程约45分钟，请畅所欲言，没有对错之分。'
          },
          background: {
            duration: '10分钟',
            questions: [
              '请简单介绍一下您自己？',
              '您平时使用过类似的产品吗？',
              '您使用这类产品的频率是怎样的？'
            ]
          },
          core: {
            duration: '25分钟',
            questions: [
              '您在使用' + topic + '时遇到过什么问题？',
              '您是如何解决这些问题的？',
              '您理想中的解决方案是什么样的？',
              '如果有一个新功能可以帮您解决这个问题，您希望它是什么样的？'
            ]
          },
          closing: {
            duration: '5分钟',
            questions: [
              '还有什么想补充的吗？',
              '如果有后续问题，方便再联系您吗？'
            ]
          }
        }
      };
    },

    designQuestionnaire(input, results) {
      const topic = input.researchTopic || '产品';

      return {
        questionnaire: {
          title: topic + '用户调研问卷',
          introduction: '感谢您参与本次调研，约需5分钟。您的反馈将帮助我们改进产品。',
          sections: [
            {
              name: '基本信息',
              questions: [
                { id: 'Q1', type: 'single', text: '您的性别是？', options: ['男', '女', '其他'] },
                { id: 'Q2', type: 'single', text: '您的年龄段是？', options: ['18岁以下', '18-25岁', '26-35岁', '36-45岁', '45岁以上'] },
                { id: 'Q3', type: 'single', text: '您使用' + topic + '的频率是？', options: ['每天', '每周几次', '每月几次', '很少使用'] }
              ]
            },
            {
              name: '使用体验',
              questions: [
                { id: 'Q4', type: 'rating', text: '您对当前' + topic + '的满意度（1-5分）' },
                { id: 'Q5', type: 'multiple', text: '您在使用中遇到过哪些问题？', options: ['功能不完善', '操作复杂', '响应慢', '其他'] },
                { id: 'Q6', type: 'open', text: '您最希望改进的是什么？' }
              ]
            }
          ]
        }
      };
    },

    buildUserPersona(input, results) {
      const text = input.requirement || input.description || '';

      return {
        persona: {
          name: '典型用户',
          demographics: {
            age: '25-35岁',
            occupation: '互联网从业者',
            techSavvy: '中高'
          },
          goals: [
            '高效完成工作任务',
            '获得良好的使用体验',
            '节省时间和精力'
          ],
          frustrations: [
            '操作流程繁琐',
            '功能不够直观',
            '响应速度慢'
          ],
          behaviors: [
            '习惯使用移动端',
            '注重效率',
            '愿意尝试新功能'
          ],
          quote: '我需要一个简单高效的工具来帮我解决问题'
        }
      };
    },

    extractInsights(input, results) {
      return {
        insights: [
          {
            insight: '用户对效率有较高要求',
            evidence: '调研中80%用户提到效率问题',
            implication: '应优先优化核心流程效率'
          },
          {
            insight: '用户期望更直观的操作方式',
            evidence: '60%用户反映操作复杂',
            implication: '需要简化交互设计'
          },
          {
            insight: '移动端使用场景增多',
            evidence: '70%用户主要使用移动端',
            implication: '移动端体验需要重点优化'
          }
        ],
        recommendations: [
          '优化核心操作流程，减少步骤',
          '简化界面设计，提升易用性',
          '优先保证移动端体验'
        ]
      };
    },

    // ========== 竞品分析 ==========
    identifyCompetitors(input) {
      const domain = input.domain || input.productDomain || '通用';
      
      return {
        competitors: [
          {
            name: '竞品A',
            type: '直接竞品',
            position: '市场领导者',
            marketShare: '30%',
            strengths: ['品牌知名度高', '功能完善', '用户基数大'],
            weaknesses: ['价格较高', '学习成本高']
          },
          {
            name: '竞品B',
            type: '直接竞品',
            position: '挑战者',
            marketShare: '20%',
            strengths: ['用户体验好', '创新功能'],
            weaknesses: ['功能覆盖不全', '市场推广弱']
          },
          {
            name: '竞品C',
            type: '间接竞品',
            position: '跟随者',
            marketShare: '10%',
            strengths: ['价格优势', '本地化服务'],
            weaknesses: ['功能较少', '品牌弱']
          }
        ]
      };
    },

    compareFeatures(input, results) {
      const competitorsStep = results.steps.find(s => s.name === '竞品识别');
      const competitors = competitorsStep?.output?.competitors || [];

      return {
        featureMatrix: {
          features: ['核心功能1', '核心功能2', '高级功能1', '高级功能2'],
          comparison: competitors.map(c => ({
            name: c.name,
            support: ['✅', '✅', '🔶', '❌']
          }))
        },
        gaps: [
          { feature: '高级功能2', competitors: ['竞品A'], opportunity: '差异化机会' }
        ]
      };
    },

    analyzeSWOT(input, results) {
      return {
        swot: {
          strengths: [
            '技术团队经验丰富',
            '产品定位清晰',
            '本地化服务优势'
          ],
          weaknesses: [
            '品牌知名度不足',
            '市场覆盖有限',
            '资源相对紧张'
          ],
          opportunities: [
            '市场持续增长',
            '用户需求升级',
            '技术趋势利好'
          ],
          threats: [
            '竞争加剧',
            '用户习惯变化',
            '技术迭代快'
          ]
        }
      };
    },

    defineDifferentiation(input, results) {
      return {
        differentiation: {
          positioning: '更简单、更智能、更高效的解决方案',
          uniqueValues: [
            '极简操作流程',
            'AI智能辅助',
            '个性化体验'
          ],
          competitiveAdvantages: [
            { advantage: '易用性', description: '3步完成核心操作' },
            { advantage: '智能化', description: 'AI驱动的智能推荐' },
            { advantage: '性价比', description: '核心功能免费使用' }
          ]
        }
      };
    },

    generateStrategy(input, results) {
      return {
        strategy: {
          shortTerm: [
            '聚焦核心功能，打造极致体验',
            '建立种子用户群体',
            '快速迭代响应用户反馈'
          ],
          midTerm: [
            '扩展功能覆盖',
            '建立品牌认知',
            '探索商业模式'
          ],
          longTerm: [
            '构建产品生态',
            '拓展市场边界',
            '建立竞争壁垒'
          ]
        }
      };
    },

    // ========== PRD生成 ==========
    analyzeBackground(input) {
      const text = input.requirement || input.description || '';
      return {
        problem: this._extractProblem(text),
        opportunity: '通过数字化手段提升效率，改善用户体验',
        context: {
          marketTrend: '数字化转型加速',
          userNeed: '对效率和体验的要求提升',
          technology: 'AI和云计算技术成熟'
        }
      };
    },

    defineGoals(input) {
      return {
        goals: [
          { goal: '提升用户满意度', metric: 'NPS', target: '> 30' },
          { goal: '提高操作效率', metric: '任务完成时间', target: '减少30%' },
          { goal: '降低运营成本', metric: '人工处理量', target: '减少50%' }
        ],
        successCriteria: [
          '核心功能按时上线',
          '用户满意度达标',
          '系统稳定性达标'
        ]
      };
    },

    breakdownUserStories(input, results) {
      const features = this._extractFeatures(input.requirement || input.description || '');
      
      return {
        epic: this._extractEpicName(input.requirement || input.description || ''),
        stories: features.map((f, i) => ({
          id: `US-${String(i + 1).padStart(3, '0')}`,
          title: f.title,
          story: `作为一个${f.user}，我希望${f.action}，以便${f.benefit}`,
          acceptanceCriteria: [
            `Given 用户进入功能页面`,
            `When 用户执行${f.action}`,
            `Then 系统正确响应并展示结果`
          ],
          storyPoints: this._estimateStoryPoints(f),
          priority: f.priority || 'P1'
        }))
      };
    },

    designFeatures(input, results) {
      const features = this._extractFeatures(input.requirement || input.description || '');
      
      return {
        features: features.map((f, i) => ({
          id: `F-${String(i + 1).padStart(3, '0')}`,
          name: f.title,
          description: f.description || f.action,
          priority: f.priority || 'P1',
          category: 'Core',
          dependencies: [],
          estimatedEffort: this._estimateEffort(f)
        }))
      };
    },

    defineAcceptanceCriteria(input, results) {
      const storiesStep = results.steps.find(s => s.name === '用户故事拆解');
      const stories = storiesStep?.output?.stories || [];

      return {
        acceptanceCriteria: stories.map(s => ({
          storyId: s.id,
          criteria: s.acceptanceCriteria,
          testCases: [
            { case: '正常流程', expected: '成功完成操作' },
            { case: '异常输入', expected: '友好提示错误' },
            { case: '边界条件', expected: '正确处理' }
          ]
        }))
      };
    },

    defineNonFunctionalReqs(input) {
      return {
        nonFunctionalRequirements: [
          { id: 'NFR-001', name: '性能', description: '页面加载时间 < 2秒，API响应 < 500ms', priority: 'P0' },
          { id: 'NFR-002', name: '可用性', description: '系统可用性 > 99.9%', priority: 'P0' },
          { id: 'NFR-003', name: '安全性', description: '数据传输加密，敏感信息脱敏', priority: 'P0' },
          { id: 'NFR-004', name: '兼容性', description: '支持主流浏览器最新两个版本', priority: 'P1' },
          { id: 'NFR-005', name: '可扩展性', description: '支持水平扩展', priority: 'P1' }
        ]
      };
    },

    assessRisks(input, results) {
      return {
        risks: [
          { risk: '技术风险', probability: 'Medium', impact: 'High', mitigation: '技术预研和POC验证' },
          { risk: '进度风险', probability: 'Medium', impact: 'Medium', mitigation: '合理排期和资源预留' },
          { risk: '用户接受度', probability: 'Low', impact: 'High', mitigation: '用户测试和灰度发布' }
        ]
      };
    },

    generatePRDDocument(input, results) {
      const steps = results.steps;
      
      return {
        document: {
          documentInfo: {
            title: this._extractFeatureName(input.requirement || input.description || ''),
            version: '1.0.0',
            status: 'Draft',
            createdAt: new Date().toISOString()
          },
          background: steps.find(s => s.name === '背景分析')?.output,
          goals: steps.find(s => s.name === '目标定义')?.output,
          userStories: steps.find(s => s.name === '用户故事拆解')?.output,
          features: steps.find(s => s.name === '功能设计')?.output,
          acceptanceCriteria: steps.find(s => s.name === '验收标准定义')?.output,
          nonFunctionalRequirements: steps.find(s => s.name === '非功能需求')?.output,
          risks: steps.find(s => s.name === '风险评估')?.output
        }
      };
    },

    // ========== 用户故事 ==========
    identifyEpic(input) {
      return {
        epic: {
          name: this._extractEpicName(input.requirement || input.description || ''),
          description: input.requirement || input.description || '',
          businessValue: '提升用户满意度和业务效率'
        }
      };
    },

    splitStories(input, results) {
      const epicStep = results.steps.find(s => s.name === 'Epic识别');
      const features = this._extractFeatures(input.requirement || input.description || '');

      return {
        stories: features.map((f, i) => ({
          id: `US-${String(i + 1).padStart(3, '0')}`,
          epic: epicStep?.output?.epic?.name,
          title: f.title,
          story: `作为一个${f.user}，我希望${f.action}，以便${f.benefit}`,
          priority: f.priority || 'P1'
        }))
      };
    },

    generateAC(input, results) {
      const storiesStep = results.steps.find(s => s.name === '故事拆分');
      const stories = storiesStep?.output?.stories || [];

      return {
        acceptanceCriteria: stories.map(s => ({
          storyId: s.id,
          criteria: [
            `Given 用户已登录且有权访问该功能`,
            `When 用户执行${s.story.match(/我希望(.+)，以便/)?.[1] || '操作'}`,
            `Then 系统正确处理并返回预期结果`
          ]
        }))
      };
    },

    estimateStoryPoints(input, results) {
      const storiesStep = results.steps.find(s => s.name === '故事拆分');
      const stories = storiesStep?.output?.stories || [];

      return {
        estimates: stories.map(s => ({
          storyId: s.id,
          points: this._estimateStoryPoints({ action: s.story }),
          complexity: s.story.length > 100 ? 'High' : s.story.length > 50 ? 'Medium' : 'Low'
        })),
        totalPoints: stories.reduce((sum, s) => sum + this._estimateStoryPoints({ action: s.story }), 0)
      };
    },

    prioritizeStories(input, results) {
      const estimatesStep = results.steps.find(s => s.name === '故事点估算');
      const estimates = estimatesStep?.output?.estimates || [];

      const prioritized = estimates.map(e => ({
        ...e,
        priority: e.points >= 5 ? 'P2' : e.points >= 3 ? 'P1' : 'P0'
      })).sort((a, b) => {
        const order = { 'P0': 0, 'P1': 1, 'P2': 2 };
        return order[a.priority] - order[b.priority];
      });

      return { prioritizedStories: prioritized };
    },

    // ========== 路线图 ==========
    defineVision(input) {
      return {
        vision: {
          statement: '成为用户首选的智能解决方案',
          timeframe: '1年',
          keyThemes: ['用户体验', '智能化', '生态建设']
        }
      };
    },

    breakdownOKR(input) {
      return {
        okr: {
          objective: '提升产品竞争力和用户满意度',
          keyResults: [
            { kr: 'DAU增长50%', metric: 'DAU', target: '+50%' },
            { kr: '用户留存率提升至40%', metric: '留存率', target: '40%' },
            { kr: 'NPS达到30', metric: 'NPS', target: '30' },
            { kr: '核心功能覆盖率100%', metric: '功能覆盖', target: '100%' }
          ]
        }
      };
    },

    planVersions(input, results) {
      return {
        versions: [
          { version: 'v1.0', quarter: 'Q1', theme: 'MVP上线', features: ['核心功能'] },
          { version: 'v1.1', quarter: 'Q2', theme: '体验优化', features: ['性能优化', '交互改进'] },
          { version: 'v1.5', quarter: 'Q3', theme: '功能扩展', features: ['高级功能', '数据分析'] },
          { version: 'v2.0', quarter: 'Q4', theme: '平台升级', features: ['开放平台', '生态建设'] }
        ]
      };
    },

    defineMilestones(input, results) {
      return {
        milestones: [
          { milestone: 'M1', date: 'T+2周', deliverable: '需求评审完成' },
          { milestone: 'M2', date: 'T+4周', deliverable: '设计完成' },
          { milestone: 'M3', date: 'T+8周', deliverable: '开发完成' },
          { milestone: 'M4', date: 'T+10周', deliverable: '测试完成' },
          { milestone: 'M5', date: 'T+12周', deliverable: '正式上线' }
        ]
      };
    },

    estimateResources(input, results) {
      return {
        resources: {
          team: [
            { role: '产品经理', count: 1 },
            { role: '前端开发', count: 2 },
            { role: '后端开发', count: 2 },
            { role: '测试工程师', count: 1 },
            { role: 'UI设计师', count: 1 }
          ],
          estimatedDuration: '12周',
          budget: '待评估'
        }
      };
    },

    generateRoadmap(input, results) {
      const steps = results.steps;
      
      return {
        roadmap: {
          vision: steps.find(s => s.name === '愿景定义')?.output?.vision,
          okr: steps.find(s => s.name === 'OKR拆解')?.output?.okr,
          versions: steps.find(s => s.name === '版本规划')?.output?.versions,
          milestones: steps.find(s => s.name === '里程碑定义')?.output?.milestones,
          resources: steps.find(s => s.name === '资源评估')?.output?.resources
        }
      };
    },

    // ========== 上线检查 ==========
    generateFunctionChecklist(input) {
      return {
        checklist: [
          { category: '核心功能', items: [
            { item: '用户登录/注册', status: 'pending' },
            { item: '核心业务流程', status: 'pending' },
            { item: '数据展示正确', status: 'pending' }
          ]},
          { category: '边界条件', items: [
            { item: '空数据处理', status: 'pending' },
            { item: '异常输入处理', status: 'pending' },
            { item: '网络异常处理', status: 'pending' }
          ]},
          { category: '兼容性', items: [
            { item: 'Chrome浏览器', status: 'pending' },
            { item: 'Safari浏览器', status: 'pending' },
            { item: '移动端适配', status: 'pending' }
          ]}
        ]
      };
    },

    generatePerformanceChecklist(input) {
      return {
        checklist: [
          { item: '首屏加载时间 < 2秒', target: '< 2s', status: 'pending' },
          { item: 'API响应时间 < 500ms', target: '< 500ms', status: 'pending' },
          { item: '页面完全加载 < 3秒', target: '< 3s', status: 'pending' },
          { item: '并发压力测试通过', target: '1000并发', status: 'pending' }
        ]
      };
    },

    generateSecurityChecklist(input) {
      return {
        checklist: [
          { item: 'SQL注入防护', status: 'pending' },
          { item: 'XSS防护', status: 'pending' },
          { item: 'CSRF防护', status: 'pending' },
          { item: '敏感数据加密', status: 'pending' },
          { item: '接口鉴权', status: 'pending' },
          { item: '权限校验', status: 'pending' }
        ]
      };
    },

    generateOpsChecklist(input) {
      return {
        checklist: [
          { item: '生产环境配置确认', status: 'pending' },
          { item: '监控告警配置', status: 'pending' },
          { item: '日志收集配置', status: 'pending' },
          { item: '备份策略确认', status: 'pending' },
          { item: '回滚方案准备', status: 'pending' },
          { item: '应急预案准备', status: 'pending' }
        ]
      };
    },

    generateDocChecklist(input) {
      return {
        checklist: [
          { item: 'PRD文档', status: 'pending' },
          { item: '接口文档', status: 'pending' },
          { item: '用户手册', status: 'pending' },
          { item: '运维手册', status: 'pending' },
          { item: '测试报告', status: 'pending' }
        ]
      };
    },

    generateFullChecklist(input, results) {
      const steps = results.steps;
      
      return {
        fullChecklist: {
          function: steps.find(s => s.name === '功能验收项生成')?.output?.checklist,
          performance: steps.find(s => s.name === '性能检查项生成')?.output?.checklist,
          security: steps.find(s => s.name === '安全检查项生成')?.output?.checklist,
          ops: steps.find(s => s.name === '运维检查项生成')?.output?.checklist,
          docs: steps.find(s => s.name === '文档检查项生成')?.output?.checklist
        },
        summary: {
          totalItems: 30,
          categories: 5,
          generatedAt: new Date().toISOString()
        }
      };
    },

    // ========== 迭代复盘 ==========
    reviewGoals(input) {
      return {
        originalGoals: input.goals || [],
        achievedGoals: input.achievedGoals || [],
        goalAchievementRate: input.goals ? (input.achievedGoals?.length / input.goals.length * 100) : 0
      };
    },

    analyzeDelivery(input) {
      return {
        plannedItems: input.plannedItems || 10,
        deliveredItems: input.deliveredItems || 8,
        deliveryRate: input.plannedItems ? (input.deliveredItems / input.plannedItems * 100) : 80,
        deferredItems: input.deferredItems || []
      };
    },

    analyzeQuality(input) {
      return {
        totalBugs: input.totalBugs || 15,
        severeBugs: input.severeBugs || 2,
        bugFixRate: input.bugFixRate || 95,
        regressionRate: input.regressionRate || 5
      };
    },

    attributeIssues(input, results) {
      return {
        issues: [
          { issue: '需求变更频繁', cause: '前期需求调研不充分', impact: 'High' },
          { issue: '开发进度延迟', cause: '技术难点预估不足', impact: 'Medium' },
          { issue: '测试时间紧张', cause: '开发延期压缩测试时间', impact: 'Medium' }
        ]
      };
    },

    summarizeLessons(input, results) {
      return {
        lessons: {
          keep: [
            '每日站会同步进度效果好',
            '代码评审提升了代码质量',
            '自动化测试减少了回归问题'
          ],
          problem: [
            '需求变更流程需要规范',
            '技术方案评审需要提前',
            '跨团队协作需要加强'
          ],
          try: [
            '引入需求变更评审机制',
            '增加技术方案预研时间',
            '建立跨团队沟通机制'
          ]
        }
      };
    },

    suggestImprovements(input, results) {
      return {
        improvements: [
          { improvement: '建立需求变更评审流程', priority: 'High', owner: '产品经理' },
          { improvement: '增加技术方案预研阶段', priority: 'High', owner: '技术负责人' },
          { improvement: '优化测试用例设计', priority: 'Medium', owner: '测试负责人' },
          { improvement: '建立知识库沉淀机制', priority: 'Low', owner: '团队全员' }
        ]
      };
    },

    // ========== 项目健康检测 ==========
    checkRequirementHealth(input) {
      const req = input.requirement || {};
      const checks = [
        { item: 'PRD文档', status: req.hasPRD ? 'passed' : 'failed', impact: 'High' },
        { item: '用户故事', status: req.hasUserStories ? 'passed' : 'warning', impact: 'Medium' },
        { item: '验收标准', status: req.hasAcceptanceCriteria ? 'passed' : 'warning', impact: 'Medium' },
        { item: '需求评审', status: req.isReviewed ? 'passed' : 'warning', impact: 'High' }
      ];
      return { dimension: 'requirement', checks, score: this._calculateDimensionScore(checks) };
    },

    checkDesignHealth(input) {
      const design = input.design || {};
      const checks = [
        { item: 'UI设计稿', status: design.hasUIDesign ? 'passed' : 'warning', impact: 'High' },
        { item: '交互设计', status: design.hasInteractionDesign ? 'passed' : 'warning', impact: 'Medium' },
        { item: '设计评审', status: design.isReviewed ? 'passed' : 'warning', impact: 'Medium' }
      ];
      return { dimension: 'design', checks, score: this._calculateDimensionScore(checks) };
    },

    checkDevelopmentHealth(input) {
      const dev = input.development || {};
      const progress = dev.progress || 0;
      const planned = dev.plannedProgress || 100;
      const checks = [
        { item: '开发进度', status: progress >= planned ? 'passed' : progress >= planned * 0.8 ? 'warning' : 'failed', impact: 'High', value: `${progress}%` },
        { item: '代码评审', status: dev.hasCodeReview ? 'passed' : 'warning', impact: 'Medium' },
        { item: '技术债务', status: dev.techDebt === 'low' ? 'passed' : dev.techDebt === 'medium' ? 'warning' : 'failed', impact: 'Medium' }
      ];
      return { dimension: 'development', checks, score: this._calculateDimensionScore(checks) };
    },

    checkQualityHealth(input) {
      const quality = input.quality || {};
      const bugs = quality.severeBugCount || 0;
      const checks = [
        { item: '严重Bug', status: bugs === 0 ? 'passed' : bugs <= 2 ? 'warning' : 'failed', impact: 'High', value: bugs },
        { item: '测试覆盖率', status: (quality.testCoverage || 0) >= 80 ? 'passed' : (quality.testCoverage || 0) >= 60 ? 'warning' : 'failed', impact: 'Medium', value: `${quality.testCoverage || 0}%` },
        { item: '自动化测试', status: quality.hasAutoTest ? 'passed' : 'warning', impact: 'Medium' }
      ];
      return { dimension: 'quality', checks, score: this._calculateDimensionScore(checks) };
    },

    checkPerformanceHealth(input) {
      const perf = input.performance || {};
      const loadTime = perf.pageLoadTime || 0;
      const apiTime = perf.apiResponseTime || 0;
      const checks = [
        { item: '页面加载', status: loadTime <= 2000 ? 'passed' : loadTime <= 3000 ? 'warning' : 'failed', impact: 'High', value: `${loadTime}ms` },
        { item: 'API响应', status: apiTime <= 500 ? 'passed' : apiTime <= 1000 ? 'warning' : 'failed', impact: 'High', value: `${apiTime}ms` },
        { item: '性能测试', status: perf.hasPerfTest ? 'passed' : 'warning', impact: 'Medium' }
      ];
      return { dimension: 'performance', checks, score: this._calculateDimensionScore(checks) };
    },

    checkSecurityHealth(input) {
      const security = input.security || {};
      const checks = [
        { item: '安全评审', status: security.hasSecurityReview ? 'passed' : 'warning', impact: 'High' },
        { item: 'SQL注入防护', status: security.hasSQLInjectionProtection ? 'passed' : 'failed', impact: 'High' },
        { item: 'XSS防护', status: security.hasXSSProtection ? 'passed' : 'failed', impact: 'High' },
        { item: '数据加密', status: security.hasEncryption ? 'passed' : 'warning', impact: 'High' },
        { item: '权限控制', status: security.hasAccessControl ? 'passed' : 'failed', impact: 'High' }
      ];
      return { dimension: 'security', checks, score: this._calculateDimensionScore(checks) };
    },

    checkDocumentationHealth(input) {
      const docs = input.documentation || {};
      const checks = [
        { item: 'PRD文档', status: docs.hasPRD ? 'passed' : 'warning', impact: 'High' },
        { item: '接口文档', status: docs.hasAPIDoc ? 'passed' : 'warning', impact: 'High' },
        { item: '用户手册', status: docs.hasUserManual ? 'passed' : 'warning', impact: 'Medium' },
        { item: '运维文档', status: docs.hasOpsDoc ? 'passed' : 'warning', impact: 'Medium' }
      ];
      return { dimension: 'documentation', checks, score: this._calculateDimensionScore(checks) };
    },

    checkOperationsHealth(input) {
      const ops = input.operations || {};
      const checks = [
        { item: '部署方案', status: ops.hasDeployPlan ? 'passed' : 'warning', impact: 'High' },
        { item: '监控告警', status: ops.hasMonitoring ? 'passed' : 'warning', impact: 'High' },
        { item: '备份策略', status: ops.hasBackup ? 'passed' : 'warning', impact: 'High' },
        { item: '回滚方案', status: ops.hasRollback ? 'passed' : 'warning', impact: 'High' },
        { item: '应急预案', status: ops.hasEmergencyPlan ? 'passed' : 'warning', impact: 'Medium' }
      ];
      return { dimension: 'operations', checks, score: this._calculateDimensionScore(checks) };
    },

    generateHealthReport(input, results) {
      const steps = results.steps;
      const dimensions = steps.filter(s => s.name.includes('检测')).map(s => s.output);

      const totalScore = dimensions.reduce((sum, d) => sum + (d?.score || 0), 0) / dimensions.length;
      const allChecks = dimensions.flatMap(d => d?.checks || []);

      return {
        healthReport: {
          overallScore: Math.round(totalScore),
          healthLevel: this._getHealthLevel(totalScore),
          dimensions: dimensions,
          summary: {
            totalChecks: allChecks.length,
            passed: allChecks.filter(c => c.status === 'passed').length,
            warning: allChecks.filter(c => c.status === 'warning').length,
            failed: allChecks.filter(c => c.status === 'failed').length
          },
          criticalIssues: allChecks.filter(c => c.status === 'failed' && c.impact === 'High'),
          recommendations: this._generateHealthRecommendations(allChecks)
        }
      };
    },

    _calculateDimensionScore(checks) {
      if (!checks || checks.length === 0) return 0;
      const passed = checks.filter(c => c.status === 'passed').length;
      const warning = checks.filter(c => c.status === 'warning').length;
      return Math.round((passed + warning * 0.5) / checks.length * 100);
    },

    _getHealthLevel(score) {
      if (score >= 90) return '优秀';
      if (score >= 75) return '良好';
      if (score >= 60) return '一般';
      if (score >= 40) return '较差';
      return '危险';
    },

    _generateHealthRecommendations(checks) {
      return checks
        .filter(c => c.status !== 'passed')
        .sort((a, b) => (a.impact === 'High' ? 0 : 1) - (b.impact === 'High' ? 0 : 1))
        .slice(0, 5)
        .map(c => ({ item: c.item, action: `需要处理${c.item}问题`, priority: c.impact }));
    },

    // ========== 功能健康检测 ==========
    checkFunctionCompleteness(input) {
      const completeness = input.completeness || {};
      const checks = [];

      // 核心功能完整性
      checks.push({
        category: '核心功能',
        item: '核心功能完整性',
        status: completeness.hasCoreFunctions ? 'passed' : 'failed',
        impact: 'High',
        description: completeness.hasCoreFunctions ? '核心功能已实现' : '核心功能缺失'
      });

      checks.push({
        category: '核心功能',
        item: '主流程完整性',
        status: completeness.hasMainFlow ? 'passed' : 'failed',
        impact: 'High',
        description: completeness.hasMainFlow ? '主流程完整' : '主流程不完整'
      });

      checks.push({
        category: '核心功能',
        item: '功能闭环',
        status: completeness.hasFunctionLoop ? 'passed' : 'warning',
        impact: 'Medium',
        description: completeness.hasFunctionLoop ? '功能形成闭环' : '功能未形成闭环'
      });

      // 边界场景覆盖
      checks.push({
        category: '边界场景',
        item: '空数据处理',
        status: completeness.hasEmptyState ? 'passed' : 'warning',
        impact: 'Medium',
        description: completeness.hasEmptyState ? '空状态已处理' : '空状态未处理'
      });

      checks.push({
        category: '边界场景',
        item: '异常输入处理',
        status: completeness.hasInvalidInput ? 'passed' : 'warning',
        impact: 'High',
        description: completeness.hasInvalidInput ? '异常输入已处理' : '异常输入未处理'
      });

      checks.push({
        category: '边界场景',
        item: '网络异常处理',
        status: completeness.hasNetworkError ? 'passed' : 'warning',
        impact: 'High',
        description: completeness.hasNetworkError ? '网络异常已处理' : '网络异常未处理'
      });

      checks.push({
        category: '边界场景',
        item: '权限不足处理',
        status: completeness.hasPermissionError ? 'passed' : 'warning',
        impact: 'Medium',
        description: completeness.hasPermissionError ? '权限不足已处理' : '权限不足未处理'
      });

      checks.push({
        category: '边界场景',
        item: '数据边界处理',
        status: completeness.hasDataBoundary ? 'passed' : 'warning',
        impact: 'Medium',
        description: completeness.hasDataBoundary ? '数据边界已处理' : '数据边界未处理'
      });

      checks.push({
        category: '边界场景',
        item: '并发场景处理',
        status: completeness.hasConcurrency ? 'passed' : 'warning',
        impact: 'Medium',
        description: completeness.hasConcurrency ? '并发场景已处理' : '并发场景未处理'
      });

      // 功能依赖
      checks.push({
        category: '功能依赖',
        item: '前置条件检查',
        status: completeness.hasPrecondition ? 'passed' : 'warning',
        impact: 'Medium',
        description: completeness.hasPrecondition ? '前置条件已检查' : '前置条件未检查'
      });

      checks.push({
        category: '功能依赖',
        item: '依赖服务可用性',
        status: completeness.hasDependencyCheck ? 'passed' : 'warning',
        impact: 'High',
        description: completeness.hasDependencyCheck ? '依赖服务已检查' : '依赖服务未检查'
      });

      return { dimension: 'completeness', checks, score: this._calculateDimensionScore(checks) };
    },

    checkFunctionRationality(input) {
      const rationality = input.rationality || {};
      const checks = [];

      // 用户流程合理性
      const stepCount = rationality.stepCount || 5;
      checks.push({
        category: '用户流程',
        item: '流程步骤数量',
        status: stepCount <= 5 ? 'passed' : stepCount <= 7 ? 'warning' : 'failed',
        impact: 'High',
        value: stepCount,
        description: `完成核心任务需要${stepCount}步`
      });

      checks.push({
        category: '用户流程',
        item: '流程逻辑清晰',
        status: rationality.hasClearLogic ? 'passed' : 'warning',
        impact: 'High',
        description: rationality.hasClearLogic ? '流程逻辑清晰' : '流程逻辑不够清晰'
      });

      checks.push({
        category: '用户流程',
        item: '流程可回退',
        status: rationality.hasBackNavigation ? 'passed' : 'warning',
        impact: 'Medium',
        description: rationality.hasBackNavigation ? '支持流程回退' : '不支持流程回退'
      });

      checks.push({
        category: '用户流程',
        item: '流程可中断恢复',
        status: rationality.hasResume ? 'passed' : 'warning',
        impact: 'Medium',
        description: rationality.hasResume ? '支持中断后恢复' : '不支持中断后恢复'
      });

      checks.push({
        category: '用户流程',
        item: '流程分支处理',
        status: rationality.hasBranchHandling ? 'passed' : 'warning',
        impact: 'Medium',
        description: rationality.hasBranchHandling ? '分支流程已处理' : '分支流程未处理'
      });

      // 交互设计规范
      checks.push({
        category: '交互设计',
        item: '按钮位置一致',
        status: rationality.hasConsistentButtons ? 'passed' : 'warning',
        impact: 'Medium',
        description: rationality.hasConsistentButtons ? '按钮位置一致' : '按钮位置不一致'
      });

      checks.push({
        category: '交互设计',
        item: '操作反馈及时',
        status: rationality.hasTimelyFeedback ? 'passed' : 'warning',
        impact: 'High',
        description: rationality.hasTimelyFeedback ? '操作有及时反馈' : '操作反馈不及时'
      });

      checks.push({
        category: '交互设计',
        item: '加载状态提示',
        status: rationality.hasLoadingState ? 'passed' : 'warning',
        impact: 'Medium',
        description: rationality.hasLoadingState ? '有加载状态提示' : '缺少加载状态提示'
      });

      checks.push({
        category: '交互设计',
        item: '操作确认机制',
        status: rationality.hasConfirmation ? 'passed' : 'warning',
        impact: 'High',
        description: rationality.hasConfirmation ? '重要操作有确认' : '重要操作缺少确认'
      });

      checks.push({
        category: '交互设计',
        item: '撤销/重做支持',
        status: rationality.hasUndoRedo ? 'passed' : 'warning',
        impact: 'Low',
        description: rationality.hasUndoRedo ? '支持撤销/重做' : '不支持撤销/重做'
      });

      // 信息架构
      checks.push({
        category: '信息架构',
        item: '导航结构清晰',
        status: rationality.hasClearNavigation ? 'passed' : 'warning',
        impact: 'High',
        description: rationality.hasClearNavigation ? '导航结构清晰' : '导航结构不够清晰'
      });

      checks.push({
        category: '信息架构',
        item: '信息层级分明',
        status: rationality.hasClearHierarchy ? 'passed' : 'warning',
        impact: 'Medium',
        description: rationality.hasClearHierarchy ? '信息层级分明' : '信息层级不够分明'
      });

      checks.push({
        category: '信息架构',
        item: '标签命名准确',
        status: rationality.hasAccurateLabels ? 'passed' : 'warning',
        impact: 'Medium',
        description: rationality.hasAccurateLabels ? '标签命名准确易懂' : '标签命名不够准确'
      });

      checks.push({
        category: '信息架构',
        item: '搜索功能完善',
        status: rationality.hasSearchFunction ? 'passed' : 'warning',
        impact: 'Medium',
        description: rationality.hasSearchFunction ? '搜索功能完善' : '搜索功能不完善'
      });

      return { dimension: 'rationality', checks, score: this._calculateDimensionScore(checks) };
    },

    checkFunctionUsability(input) {
      const usability = input.usability || {};
      const checks = [];

      // 操作路径
      const coreClicks = usability.coreFunctionClicks || 3;
      checks.push({
        category: '操作路径',
        item: '核心功能可达性',
        status: coreClicks <= 3 ? 'passed' : coreClicks <= 5 ? 'warning' : 'failed',
        impact: 'High',
        value: coreClicks,
        description: `核心功能需要${coreClicks}次点击到达`
      });

      checks.push({
        category: '操作路径',
        item: '常用功能快捷入口',
        status: usability.hasShortcuts ? 'passed' : 'warning',
        impact: 'Medium',
        description: usability.hasShortcuts ? '常用功能有快捷入口' : '常用功能缺少快捷入口'
      });

      checks.push({
        category: '操作路径',
        item: '历史记录/最近使用',
        status: usability.hasRecentHistory ? 'passed' : 'warning',
        impact: 'Low',
        description: usability.hasRecentHistory ? '有历史记录功能' : '缺少历史记录功能'
      });

      // 错误提示
      checks.push({
        category: '错误提示',
        item: '错误信息明确',
        status: usability.hasClearError ? 'passed' : 'warning',
        impact: 'High',
        description: usability.hasClearError ? '错误信息明确易懂' : '错误信息不够明确'
      });

      checks.push({
        category: '错误提示',
        item: '错误原因说明',
        status: usability.hasErrorReason ? 'passed' : 'warning',
        impact: 'High',
        description: usability.hasErrorReason ? '错误有原因说明' : '错误缺少原因说明'
      });

      checks.push({
        category: '错误提示',
        item: '解决方案引导',
        status: usability.hasErrorSolution ? 'passed' : 'warning',
        impact: 'High',
        description: usability.hasErrorSolution ? '错误有解决方案引导' : '错误缺少解决方案引导'
      });

      checks.push({
        category: '错误提示',
        item: '错误位置定位',
        status: usability.hasErrorLocation ? 'passed' : 'warning',
        impact: 'Medium',
        description: usability.hasErrorLocation ? '错误有位置定位' : '错误缺少位置定位'
      });

      // 空状态处理
      checks.push({
        category: '空状态',
        item: '空列表状态',
        status: usability.hasEmptyList ? 'passed' : 'warning',
        impact: 'Medium',
        description: usability.hasEmptyList ? '空列表有友好提示' : '空列表缺少友好提示'
      });

      checks.push({
        category: '空状态',
        item: '空搜索结果',
        status: usability.hasEmptySearch ? 'passed' : 'warning',
        impact: 'Medium',
        description: usability.hasEmptySearch ? '空搜索结果有提示' : '空搜索结果缺少提示'
      });

      checks.push({
        category: '空状态',
        item: '空状态引导操作',
        status: usability.hasEmptyAction ? 'passed' : 'warning',
        impact: 'Medium',
        description: usability.hasEmptyAction ? '空状态有引导操作' : '空状态缺少引导操作'
      });

      // 响应时间
      const pageLoadTime = usability.pageLoadTime || 2000;
      const apiResponseTime = usability.apiResponseTime || 500;
      const interactionTime = usability.interactionTime || 100;

      checks.push({
        category: '响应时间',
        item: '页面加载时间',
        status: pageLoadTime <= 2000 ? 'passed' : pageLoadTime <= 3000 ? 'warning' : 'failed',
        impact: 'High',
        value: pageLoadTime,
        description: `页面加载时间: ${pageLoadTime}ms`
      });

      checks.push({
        category: '响应时间',
        item: '接口响应时间',
        status: apiResponseTime <= 500 ? 'passed' : apiResponseTime <= 1000 ? 'warning' : 'failed',
        impact: 'High',
        value: apiResponseTime,
        description: `接口响应时间: ${apiResponseTime}ms`
      });

      checks.push({
        category: '响应时间',
        item: '交互反馈时间',
        status: interactionTime <= 100 ? 'passed' : 'warning',
        impact: 'Medium',
        value: interactionTime,
        description: `交互反馈时间: ${interactionTime}ms`
      });

      // 可访问性
      checks.push({
        category: '可访问性',
        item: '键盘操作支持',
        status: usability.hasKeyboardSupport ? 'passed' : 'warning',
        impact: 'Medium',
        description: usability.hasKeyboardSupport ? '支持键盘操作' : '不支持键盘操作'
      });

      checks.push({
        category: '可访问性',
        item: '屏幕阅读器支持',
        status: usability.hasScreenReader ? 'passed' : 'warning',
        impact: 'Low',
        description: usability.hasScreenReader ? '支持屏幕阅读器' : '不支持屏幕阅读器'
      });

      checks.push({
        category: '可访问性',
        item: '色彩对比度',
        status: usability.hasColorContrast ? 'passed' : 'warning',
        impact: 'Medium',
        description: usability.hasColorContrast ? '色彩对比度符合标准' : '色彩对比度可能不足'
      });

      return { dimension: 'usability', checks, score: this._calculateDimensionScore(checks) };
    },

    generateFunctionHealthReport(input, results) {
      const steps = results.steps;
      const completenessStep = steps.find(s => s.name === '功能完整性检测');
      const rationalityStep = steps.find(s => s.name === '功能合理性检测');
      const usabilityStep = steps.find(s => s.name === '可用性检测');

      const dimensions = [
        completenessStep?.output,
        rationalityStep?.output,
        usabilityStep?.output
      ].filter(Boolean);

      const allChecks = dimensions.flatMap(d => d?.checks || []);
      const totalScore = dimensions.reduce((sum, d) => sum + (d?.score || 0), 0) / dimensions.length;

      const issues = allChecks
        .filter(c => c.status !== 'passed')
        .map(c => ({
          dimension: c.category,
          item: c.item,
          severity: c.status === 'failed' ? 'High' : 'Medium',
          description: c.description,
          impact: c.impact
        }));

      const recommendations = issues
        .filter(i => i.impact === 'High')
        .slice(0, 5)
        .map(i => ({
          dimension: i.dimension,
          priority: 'High',
          action: `修复${i.item}问题`,
          description: i.description
        }));

      return {
        functionHealthReport: {
          functionName: input.name || '未命名功能',
          overallScore: Math.round(totalScore),
          healthLevel: this._getHealthLevel(totalScore),
          dimensions: {
            completeness: {
              score: completenessStep?.output?.score || 0,
              checks: completenessStep?.output?.checks?.length || 0,
              issues: (completenessStep?.output?.checks || []).filter(c => c.status !== 'passed').length
            },
            rationality: {
              score: rationalityStep?.output?.score || 0,
              checks: rationalityStep?.output?.checks?.length || 0,
              issues: (rationalityStep?.output?.checks || []).filter(c => c.status !== 'passed').length
            },
            usability: {
              score: usabilityStep?.output?.score || 0,
              checks: usabilityStep?.output?.checks?.length || 0,
              issues: (usabilityStep?.output?.checks || []).filter(c => c.status !== 'passed').length
            }
          },
          summary: {
            totalChecks: allChecks.length,
            passed: allChecks.filter(c => c.status === 'passed').length,
            warning: allChecks.filter(c => c.status === 'warning').length,
            failed: allChecks.filter(c => c.status === 'failed').length
          },
          issues,
          recommendations,
          actionPlan: {
            immediate: issues.filter(i => i.severity === 'High').slice(0, 5),
            shortTerm: issues.filter(i => i.severity === 'Medium').slice(0, 5)
          }
        }
      };
    }
  };

  // ========== 私有辅助方法 ==========
  _extractSummary(text) {
    const sentences = text.split(/[。！？\n]/).filter(s => s.trim().length > 0);
    if (sentences.length <= 2) return text;
    return sentences.slice(0, 2).join('。') + '。';
  }

  _extractKeywords(text) {
    const patterns = ['用户', '功能', '系统', '数据', '管理', '分析', '展示', '搜索', '通知', '权限', '登录', '注册', '支付', '订单'];
    return patterns.filter(p => text.includes(p));
  }

  _identifyDomain(text) {
    const domains = [
      { patterns: ['电商', '商品', '订单', '支付'], domain: '电商' },
      { patterns: ['内容', '文章', '视频', '评论'], domain: '内容' },
      { patterns: ['社交', '好友', '消息', '动态'], domain: '社交' },
      { patterns: ['工具', '效率', '管理'], domain: '工具' }
    ];
    
    for (const d of domains) {
      if (d.patterns.some(p => text.includes(p))) {
        return d.domain;
      }
    }
    return '通用';
  }

  _assessComplexity(text) {
    const highIndicators = ['集成', '对接', '迁移', '重构', '架构'];
    const mediumIndicators = ['权限', '流程', '审批', '配置'];
    
    if (highIndicators.some(i => text.includes(i))) return 'High';
    if (mediumIndicators.some(i => text.includes(i))) return 'Medium';
    return 'Low';
  }

  _extractFeatures(text) {
    const features = [];
    const sentences = text.split(/[，。！？\n]/);
    
    sentences.forEach((s, i) => {
      if (s.includes('可以') || s.includes('能够') || s.includes('支持')) {
        features.push({
          id: `F-${String(i + 1).padStart(3, '0')}`,
          title: `功能${features.length + 1}`,
          user: '用户',
          action: s.replace(/可以|能够|支持/g, '').trim(),
          benefit: '提升工作效率',
          priority: 'Medium',
          description: s
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
        description: text.substring(0, 50)
      });
    }

    return features;
  }

  _extractEpicName(text) {
    const match = text.match(/(.{2,10})(功能|系统|模块|平台)/);
    return match ? match[0] : '功能开发';
  }

  _extractFeatureName(text) {
    return this._extractEpicName(text);
  }

  _extractProblem(text) {
    const match = text.match(/(.{10,50})(问题|痛点|困难|挑战)/);
    return match ? match[0] : '当前存在效率低下、用户体验不佳等问题';
  }

  _extractMainTopic(text) {
    const keywords = this._extractKeywords(text);
    return keywords[0] || '产品';
  }

  _calculatePriorityScore(feature) {
    let score = 50;
    if (feature.priority === 'High') score += 30;
    if (feature.priority === 'Medium') score += 10;
    return Math.min(100, score);
  }

  _generatePriorityRationale(feature, score) {
    if (score >= 80) return '核心功能，用户价值高，建议优先开发';
    if (score >= 60) return '重要功能，对用户体验有显著提升';
    return '优化功能，可根据资源情况安排';
  }

  _estimateStoryPoints(feature) {
    const complexity = (feature.action || '').length;
    if (complexity > 50) return 5;
    if (complexity > 20) return 3;
    return 2;
  }

  _estimateEffort(feature) {
    const points = this._estimateStoryPoints(feature);
    if (points >= 5) return '2-3周';
    if (points >= 3) return '1-2周';
    return '3-5天';
  }

  _generateRecommendations(results) {
    return [
      '建议进行用户访谈，深入了解真实需求',
      '建议分析竞品功能，寻找差异化机会',
      '建议设计MVP版本，快速验证核心假设'
    ];
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AIProductWorkflow, WORKFLOW_TYPES };
}

// 使用示例
async function runExample() {
  const workflow = new AIProductWorkflow();
  
  // 执行需求分析工作流
  const result = await workflow.execute(WORKFLOW_TYPES.REQUIREMENT_ANALYSIS, {
    requirement: '用户需要一个高效的任务管理系统，可以创建任务、分配任务、跟踪进度，支持团队协作和实时通知'
  });
  
  console.log(JSON.stringify(result, null, 2));
}

// 如果直接运行
if (require.main === module) {
  const args = process.argv.slice(2);
  const workflowType = args[0] || 'requirement-analysis';
  const inputJson = args[1] || '{}';
  
  try {
    const input = JSON.parse(inputJson);
    const workflow = new AIProductWorkflow();
    workflow.execute(workflowType, input).then(result => {
      console.log(JSON.stringify(result, null, 2));
    });
  } catch (e) {
    console.error('用法: node ai-workflow.js <工作流类型> <JSON输入>');
    console.error('工作流类型:', Object.values(WORKFLOW_TYPES).join(', '));
    console.error('示例: node ai-workflow.js requirement-analysis \'{"requirement":"用户需要登录功能"}\'');
  }
}