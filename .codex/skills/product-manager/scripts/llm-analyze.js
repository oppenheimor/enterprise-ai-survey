/**
 * LLM增强的产品需求分析脚本
 * 结合大模型能力进行深度分析和智能生成
 * 
 * 使用方式:
 * 1. 作为独立脚本运行，通过环境变量配置API
 * 2. 作为模块导入，传入LLM客户端
 */

// LLM配置
const LLM_CONFIG = {
  // 支持多种LLM提供商
  providers: {
    openai: {
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4'
    },
    anthropic: {
      baseUrl: 'https://api.anthropic.com/v1',
      model: 'claude-3-opus-20240229'
    },
    deepseek: {
      baseUrl: 'https://api.deepseek.com/v1',
      model: 'deepseek-chat'
    },
    qwen: {
      baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
      model: 'qwen-max'
    }
  },
  defaultProvider: 'openai'
};

/**
 * Prompt模板集合
 */
const PROMPTS = {
  // 需求深度分析
  requirementAnalysis: `你是一位资深产品经理，请对以下需求进行深度分析：

## 需求描述
{requirement}

## 分析要求
请从以下维度进行分析，输出JSON格式：

1. **需求本质**：这个需求真正要解决什么问题？
2. **用户价值**：对用户的核心价值是什么？
3. **业务价值**：对业务的贡献是什么？
4. **潜在风险**：可能存在哪些风险？
5. **优化建议**：如何让这个需求更有价值？
6. **MVP范围**：最小可行产品应该包含什么？

## 输出格式
{
  "coreProblem": "需求本质描述",
  "userValue": {
    "primary": "主要用户价值",
    "secondary": ["次要价值1", "次要价值2"]
  },
  "businessValue": {
    "metrics": ["影响的业务指标1", "影响的业务指标2"],
    "expectedImpact": "预期影响"
  },
  "risks": [
    {"risk": "风险描述", "probability": "高/中/低", "mitigation": "应对措施"}
  ],
  "suggestions": [
    {"suggestion": "建议内容", "rationale": "建议理由"}
  ],
  "mvp": {
    "coreFeatures": ["核心功能1", "核心功能2"],
    "canDefer": ["可延后功能1", "可延后功能2"]
  }
}`,

  // 用户故事生成
  userStoryGeneration: `你是一位敏捷开发专家，请根据以下需求生成用户故事：

## 需求描述
{requirement}

## 生成要求
请生成完整的用户故事，输出JSON格式：

1. 每个用户故事遵循INVEST原则
2. 包含详细的验收标准（Given-When-Then格式）
3. 估算故事点（1-13）
4. 标注优先级和依赖关系

## 输出格式
{
  "epic": {
    "name": "史诗名称",
    "description": "史诗描述"
  },
  "stories": [
    {
      "id": "US-001",
      "title": "故事标题",
      "asA": "作为一个[角色]",
      "iWant": "我希望[功能]",
      "soThat": "以便[价值]",
      "acceptanceCriteria": [
        {
          "given": "给定条件",
          "when": "当执行操作",
          "then": "那么预期结果"
        }
      ],
      "storyPoints": 3,
      "priority": "High/Medium/Low",
      "dependencies": ["US-000"],
      "labels": ["frontend", "api"]
    }
  ],
  "totalPoints": 21,
  "estimatedSprints": 2
}`,

  // PRD文档生成
  prdGeneration: `你是一位资深产品经理，请根据以下需求生成PRD文档：

## 需求描述
{requirement}

## 生成要求
请生成完整的PRD文档，输出JSON格式，包含：

1. 产品背景与目标
2. 目标用户分析
3. 功能需求详细说明
4. 非功能需求
5. 数据埋点方案
6. 成功指标定义
7. 风险评估
8. 项目排期建议

## 输出格式
{
  "documentInfo": {
    "title": "产品名称",
    "version": "1.0.0",
    "status": "Draft"
  },
  "background": {
    "problem": "问题背景",
    "opportunity": "市场机会",
    "goals": ["目标1", "目标2"]
  },
  "targetUsers": [
    {
      "persona": "用户画像名称",
      "demographics": "人口统计特征",
      "behaviors": ["行为特征1", "行为特征2"],
      "painPoints": ["痛点1", "痛点2"],
      "needs": ["需求1", "需求2"]
    }
  ],
  "functionalRequirements": [
    {
      "id": "FR-001",
      "name": "功能名称",
      "description": "功能描述",
      "priority": "P0/P1/P2",
      "userStory": "用户故事",
      "acceptanceCriteria": ["验收标准1", "验收标准2"],
      "interactions": ["交互说明1", "交互说明2"]
    }
  ],
  "nonFunctionalRequirements": [
    {
      "type": "性能/安全/可用性",
      "requirement": "具体要求",
      "metric": "衡量指标"
    }
  ],
  "dataTracking": [
    {
      "event": "事件名称",
      "trigger": "触发时机",
      "properties": ["属性1", "属性2"]
    }
  ],
  "successMetrics": [
    {
      "metric": "指标名称",
      "definition": "定义",
      "target": "目标值",
      "measurement": "测量方式"
    }
  ],
  "risks": [
    {
      "risk": "风险描述",
      "impact": "影响程度",
      "probability": "发生概率",
      "mitigation": "应对措施"
    }
  ],
  "timeline": {
    "phases": [
      {"phase": "阶段名称", "duration": "时长", "deliverables": ["交付物"]}
    ],
    "totalDuration": "总时长"
  }
}`,

  // 竞品分析
  competitiveAnalysis: `你是一位产品战略专家，请进行竞品分析：

## 产品信息
{requirement}

## 竞品列表
{competitors}

## 分析要求
请进行全面的竞品分析，输出JSON格式：

1. 市场格局分析
2. 竞品功能对比
3. 差异化策略
4. SWOT分析
5. 竞争策略建议

## 输出格式
{
  "marketOverview": {
    "size": "市场规模",
    "growth": "增长率",
    "trends": ["趋势1", "趋势2"],
    "keyPlayers": ["主要玩家"]
  },
  "competitorAnalysis": [
    {
      "name": "竞品名称",
      "positioning": "市场定位",
      "targetUsers": "目标用户",
      "coreFeatures": ["核心功能1", "核心功能2"],
      "strengths": ["优势1", "优势2"],
      "weaknesses": ["劣势1", "劣势2"],
      "pricing": "定价策略",
      "userReviews": {
        "positive": ["正面评价"],
        "negative": ["负面评价"]
      }
    }
  ],
  "featureComparison": {
    "features": ["功能1", "功能2"],
    "matrix": {
      "我们的产品": ["✅", "❌"],
      "竞品A": ["✅", "✅"]
    }
  },
  "differentiation": {
    "uniqueValue": "独特价值主张",
    "competitiveAdvantages": ["竞争优势1", "竞争优势2"],
    "barriers": ["进入壁垒"]
  },
  "swot": {
    "strengths": ["优势"],
    "weaknesses": ["劣势"],
    "opportunities": ["机会"],
    "threats": ["威胁"]
  },
  "strategy": {
    "shortTerm": ["短期策略"],
    "midTerm": ["中期策略"],
    "longTerm": ["长期策略"]
  }
}`,

  // OKR生成
  okrGeneration: `你是一位OKR专家，请根据以下产品目标生成OKR：

## 产品信息
{requirement}

## 生成要求
请生成符合SMART原则的OKR，输出JSON格式：

## 输出格式
{
  "objective": {
    "title": "目标标题",
    "description": "目标描述",
    "timeframe": "Q1 2024",
    "alignment": "与公司战略的对齐说明"
  },
  "keyResults": [
    {
      "id": "KR-1",
      "title": "关键结果标题",
      "description": "详细描述",
      "target": "目标值",
      "current": "当前值",
      "unit": "单位",
      "measurement": "测量方式",
      "frequency": "更新频率",
      "owner": "负责人"
    }
  ],
  "initiatives": [
    {
      "id": "INI-1",
      "title": "项目/任务名称",
      "description": "描述",
      "relatedKRs": ["KR-1", "KR-2"],
      "timeline": "时间线",
      "resources": "所需资源",
      "status": "状态"
    }
  ],
  "checkIns": {
    "frequency": "每周/双周",
    "agenda": ["议程项1", "议程项2"],
    "nextCheckIn": "下次检查日期"
  }
}`,

  // 路线图生成
  roadmapGeneration: `你是一位产品规划专家，请根据以下需求生成产品路线图：

## 产品信息
{requirement}

## 生成要求
请生成详细的产品路线图，输出JSON格式：

## 输出格式
{
  "vision": {
    "statement": "产品愿景",
    "mission": "产品使命",
    "values": ["核心价值观"]
  },
  "timeline": {
    "year": 2024,
    "quarters": {
      "Q1": {
        "theme": "季度主题",
        "goals": ["目标1", "目标2"],
        "features": [
          {
            "name": "功能名称",
            "description": "功能描述",
            "priority": "优先级",
            "effort": "工作量",
            "status": "状态"
          }
        ],
        "milestones": [
          {"date": "日期", "milestone": "里程碑"}
        ]
      }
    }
  },
  "dependencies": [
    {
      "from": "功能A",
      "to": "功能B",
      "type": "技术/业务依赖"
    }
  ],
  "risks": [
    {
      "risk": "风险",
      "impact": "影响",
      "mitigation": "应对措施"
    }
  ],
  "resources": {
    "team": ["所需角色"],
    "budget": "预算估算",
    "tools": ["所需工具"]
  }
}`,

  // 优先级分析
  priorityAnalysis: `你是一位产品决策专家，请对以下功能进行优先级分析：

## 功能列表
{features}

## 分析要求
请使用RICE评分法进行优先级分析，输出JSON格式：

R = Reach (覆盖用户数)
I = Impact (影响程度)  
C = Confidence (信心度)
E = Effort (投入成本)

RICE Score = (R × I × C) / E

## 输出格式
{
  "methodology": "RICE评分法说明",
  "features": [
    {
      "name": "功能名称",
      "description": "功能描述",
      "reach": {
        "value": 1000,
        "unit": "用户/月",
        "rationale": "估算依据"
      },
      "impact": {
        "score": 3,
        "level": "高/中/低",
        "rationale": "影响说明"
      },
      "confidence": {
        "score": 0.8,
        "rationale": "信心度说明"
      },
      "effort": {
        "value": 2,
        "unit": "人月",
        "rationale": "工作量估算"
      },
      "riceScore": 1200,
      "priority": "P0/P1/P2/P3",
      "recommendation": "建议说明"
    }
  ],
  "ranking": ["按RICE分数排序的功能列表"],
  "recommendations": {
    "mustHave": ["必须有"],
    "shouldHave": ["应该有"],
    "couldHave": ["可以有"],
    "wontHave": ["暂不做"]
  }
}`,

  // 用户洞察
  userInsight: `你是一位用户研究专家，请分析以下用户需求：

## 需求描述
{requirement}

## 分析要求
请深入分析用户需求，输出JSON格式：

## 输出格式
{
  "userPersonas": [
    {
      "name": "用户画像名称",
      "demographics": {
        "age": "年龄段",
        "occupation": "职业",
        "techSavvy": "技术熟练度"
      },
      "goals": ["用户目标"],
      "behaviors": ["行为模式"],
      "painPoints": ["痛点"],
      "motivations": ["动机"]
    }
  ],
  "userJourney": {
    "stages": [
      {
        "stage": "阶段名称",
        "userActions": ["用户行为"],
        "touchpoints": ["触点"],
        "emotions": ["情绪"],
        "painPoints": ["痛点"],
        "opportunities": ["机会点"]
      }
    ]
  },
  "jobsToBeDone": [
    {
      "job": "待完成任务",
      "context": "使用场景",
      "outcome": "期望结果",
      "importance": "重要性"
    }
  ],
  "insights": [
    {
      "insight": "洞察内容",
      "evidence": "证据",
      "implication": "对产品的启示"
    }
  ],
  "recommendations": ["产品建议"]
}`,

  // 需求澄清
  requirementClarification: `你是一位产品经理，请对以下模糊需求进行澄清：

## 原始需求
{requirement}

## 澄清要求
请识别需求中的模糊点，并提出澄清问题，输出JSON格式：

## 输出格式
{
  "understanding": "我对需求的理解",
  "ambiguities": [
    {
      "point": "模糊点",
      "why": "为什么模糊",
      "clarifyingQuestions": [
        "澄清问题1",
        "澄清问题2"
      ],
      "possibleInterpretations": [
        {"interpretation": "可能理解1", "implication": "影响"},
        {"interpretation": "可能理解2", "implication": "影响"}
      ]
    }
  ],
  "assumptions": [
    {
      "assumption": "假设内容",
      "risk": "假设错误的风险",
      "validation": "如何验证"
    }
  ],
  "suggestedQuestions": [
    "建议向需求方确认的问题"
  ]
}`
};

/**
 * LLM客户端类
 */
class LLMClient {
  constructor(config = {}) {
    this.provider = config.provider || LLM_CONFIG.defaultProvider;
    this.apiKey = config.apiKey || process.env.LLM_API_KEY;
    this.baseUrl = config.baseUrl || LLM_CONFIG.providers[this.provider]?.baseUrl;
    this.model = config.model || LLM_CONFIG.providers[this.provider]?.model;
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 4096;
  }

  /**
   * 调用LLM API
   */
  async call(prompt, options = {}) {
    const {
      temperature = this.temperature,
      maxTokens = this.maxTokens
    } = options;

    // 如果没有配置API，返回模拟响应
    if (!this.apiKey) {
      return this.getMockResponse(prompt);
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: '你是一位资深产品经理，擅长需求分析、产品规划和用户体验设计。请用JSON格式输出分析结果。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature,
          max_tokens: maxTokens
        })
      });

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      // 尝试解析JSON
      return this.parseJSON(content);
    } catch (error) {
      console.error('LLM call failed:', error.message);
      return this.getMockResponse(prompt);
    }
  }

  /**
   * 解析JSON响应
   */
  parseJSON(content) {
    try {
      // 尝试直接解析
      return JSON.parse(content);
    } catch (e) {
      // 尝试提取JSON块
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                        content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } catch (e2) {
          console.error('Failed to parse JSON from response');
        }
      }
      // 返回原始内容
      return { rawContent: content };
    }
  }

  /**
   * 获取模拟响应（无API时使用）
   */
  getMockResponse(prompt) {
    // 根据prompt类型返回不同的模拟数据
    if (prompt.includes('需求深度分析') || prompt.includes('需求描述')) {
      return {
        coreProblem: '用户需要更高效地完成核心任务',
        userValue: {
          primary: '提升工作效率，减少操作步骤',
          secondary: ['降低学习成本', '提升满意度']
        },
        businessValue: {
          metrics: ['DAU', '留存率', '转化率'],
          expectedImpact: '预计DAU提升20%，留存率提升15%'
        },
        risks: [
          { risk: '用户习惯改变', probability: '中', mitigation: '提供引导和培训' }
        ],
        suggestions: [
          { suggestion: '优先实现核心功能', rationale: '快速验证价值' }
        ],
        mvp: {
          coreFeatures: ['核心功能1', '核心功能2'],
          canDefer: ['高级功能1', '高级功能2']
        },
        _note: '这是模拟响应，请配置LLM API获取真实分析'
      };
    }
    
    return {
      _note: '请配置LLM_API_KEY环境变量以获取真实分析结果',
      _hint: '支持OpenAI、Anthropic、DeepSeek、通义千问等LLM提供商'
    };
  }
}

/**
 * LLM增强分析器
 */
class LLMAnalyzer {
  constructor(llmClient) {
    this.llm = llmClient;
  }

  /**
   * 深度需求分析
   */
  async analyzeRequirement(requirement, options = {}) {
    const prompt = PROMPTS.requirementAnalysis.replace('{requirement}', requirement);
    const result = await this.llm.call(prompt, options);
    
    return {
      success: true,
      analysisType: 'llm-requirement',
      timestamp: new Date().toISOString(),
      ...result
    };
  }

  /**
   * 生成用户故事
   */
  async generateUserStories(requirement, options = {}) {
    const prompt = PROMPTS.userStoryGeneration.replace('{requirement}', requirement);
    const result = await this.llm.call(prompt, options);
    
    return {
      success: true,
      analysisType: 'llm-user-story',
      timestamp: new Date().toISOString(),
      ...result
    };
  }

  /**
   * 生成PRD
   */
  async generatePRD(requirement, options = {}) {
    const prompt = PROMPTS.prdGeneration.replace('{requirement}', requirement);
    const result = await this.llm.call(prompt, options);
    
    return {
      success: true,
      analysisType: 'llm-prd',
      timestamp: new Date().toISOString(),
      ...result
    };
  }

  /**
   * 竞品分析
   */
  async analyzeCompetitive(requirement, competitors = [], options = {}) {
    const prompt = PROMPTS.competitiveAnalysis
      .replace('{requirement}', requirement)
      .replace('{competitors}', JSON.stringify(competitors));
    const result = await this.llm.call(prompt, options);
    
    return {
      success: true,
      analysisType: 'llm-competitive',
      timestamp: new Date().toISOString(),
      ...result
    };
  }

  /**
   * 生成OKR
   */
  async generateOKR(requirement, options = {}) {
    const prompt = PROMPTS.okrGeneration.replace('{requirement}', requirement);
    const result = await this.llm.call(prompt, options);
    
    return {
      success: true,
      analysisType: 'llm-okr',
      timestamp: new Date().toISOString(),
      ...result
    };
  }

  /**
   * 生成路线图
   */
  async generateRoadmap(requirement, options = {}) {
    const prompt = PROMPTS.roadmapGeneration.replace('{requirement}', requirement);
    const result = await this.llm.call(prompt, options);
    
    return {
      success: true,
      analysisType: 'llm-roadmap',
      timestamp: new Date().toISOString(),
      ...result
    };
  }

  /**
   * 优先级分析
   */
  async analyzePriority(features, options = {}) {
    const prompt = PROMPTS.priorityAnalysis.replace('{features}', JSON.stringify(features));
    const result = await this.llm.call(prompt, options);
    
    return {
      success: true,
      analysisType: 'llm-priority',
      timestamp: new Date().toISOString(),
      ...result
    };
  }

  /**
   * 用户洞察分析
   */
  async analyzeUserInsight(requirement, options = {}) {
    const prompt = PROMPTS.userInsight.replace('{requirement}', requirement);
    const result = await this.llm.call(prompt, options);
    
    return {
      success: true,
      analysisType: 'llm-user-insight',
      timestamp: new Date().toISOString(),
      ...result
    };
  }

  /**
   * 需求澄清
   */
  async clarifyRequirement(requirement, options = {}) {
    const prompt = PROMPTS.requirementClarification.replace('{requirement}', requirement);
    const result = await this.llm.call(prompt, options);
    
    return {
      success: true,
      analysisType: 'llm-clarification',
      timestamp: new Date().toISOString(),
      ...result
    };
  }

  /**
   * 通用分析入口
   */
  async analyze(requirement, analysisType = 'requirement', options = {}) {
    switch (analysisType) {
      case 'requirement':
        return this.analyzeRequirement(requirement, options);
      case 'user-story':
        return this.generateUserStories(requirement, options);
      case 'prd':
        return this.generatePRD(requirement, options);
      case 'competitive':
        return this.analyzeCompetitive(requirement, options.competitors || [], options);
      case 'okr':
        return this.generateOKR(requirement, options);
      case 'roadmap':
        return this.generateRoadmap(requirement, options);
      case 'priority':
        return this.analyzePriority(options.features || [], options);
      case 'user-insight':
        return this.analyzeUserInsight(requirement, options);
      case 'clarification':
        return this.clarifyRequirement(requirement, options);
      default:
        return this.analyzeRequirement(requirement, options);
    }
  }
}

/**
 * 创建LLM分析器实例
 */
function createLLMAnalyzer(config = {}) {
  const client = new LLMClient(config);
  return new LLMAnalyzer(client);
}

// 如果直接运行脚本
if (require.main === module) {
  const args = process.argv.slice(2);
  const analysisType = args[0] || 'requirement';
  const requirement = args[1] || '';

  if (!requirement) {
    console.error('用法: node llm-analyze.js <分析类型> <需求描述>');
    console.error('分析类型: requirement | user-story | prd | competitive | okr | roadmap | priority | user-insight | clarification');
    console.error('\n环境变量:');
    console.error('  LLM_API_KEY - LLM API密钥');
    console.error('  LLM_PROVIDER - LLM提供商 (openai/anthropic/deepseek/qwen)');
    process.exit(1);
  }

  const analyzer = createLLMAnalyzer({
    provider: process.env.LLM_PROVIDER,
    apiKey: process.env.LLM_API_KEY
  });

  analyzer.analyze(requirement, analysisType).then(result => {
    console.log(JSON.stringify(result, null, 2));
  });
}

module.exports = {
  LLMClient,
  LLMAnalyzer,
  createLLMAnalyzer,
  PROMPTS
};