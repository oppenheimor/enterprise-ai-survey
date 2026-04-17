/**
 * 产品经理技能 - 成本追踪模块
 * 遵循Claude Code的成本统计模式
 */

/**
 * 成本类型定义
 */
const CostType = {
  LLM_CALL: 'llm_call',
  WORKFLOW: 'workflow',
  ANALYSIS: 'analysis',
  API_CALL: 'api_call'
};

/**
 * 成本记录
 */
class CostRecord {
  constructor(type, data = {}) {
    this.id = `cost_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.type = type;
    this.timestamp = Date.now();
    this.inputTokens = data.inputTokens || 0;
    this.outputTokens = data.outputTokens || 0;
    this.totalTokens = this.inputTokens + this.outputTokens;
    this.estimatedCost = this.calculateCost(data);
    this.metadata = data.metadata || {};
  }

  calculateCost(data) {
    const pricing = {
      llm_call: { input: 0.00001, output: 0.00003 },
      workflow: { input: 0.000005, output: 0.000015 },
      analysis: { input: 0, output: 0 },
      api_call: { input: 0, output: 0 }
    };

    const rate = pricing[this.type] || { input: 0, output: 0 };
    return (this.inputTokens * rate.input) + (this.outputTokens * rate.output);
  }
}

/**
 * 成本追踪器
 */
class CostTracker {
  constructor() {
    this.records = [];
    this.sessionStart = Date.now();
    this.budget = null;
  }

  /**
   * 设置预算
   */
  setBudget(budget) {
    this.budget = budget;
    return this;
  }

  /**
   * 记录成本
   */
  record(type, data = {}) {
    const record = new CostRecord(type, data);
    this.records.push(record);

    if (this.budget && this.getTotalCost() > this.budget) {
      console.warn(`⚠️ 成本已超过预算: $${this.getTotalCost().toFixed(4)} > $${this.budget}`);
    }

    return record;
  }

  /**
   * 记录LLM调用
   */
  recordLLMCall(inputTokens, outputTokens, metadata = {}) {
    return this.record(CostType.LLM_CALL, {
      inputTokens,
      outputTokens,
      metadata
    });
  }

  /**
   * 记录工作流执行
   */
  recordWorkflow(workflowType, steps, metadata = {}) {
    return this.record(CostType.WORKFLOW, {
      inputTokens: 0,
      outputTokens: 0,
      metadata: { workflowType, steps, ...metadata }
    });
  }

  /**
   * 获取总成本
   */
  getTotalCost() {
    return this.records.reduce((sum, r) => sum + r.estimatedCost, 0);
  }

  /**
   * 获取总Token数
   */
  getTotalTokens() {
    return this.records.reduce((sum, r) => sum + r.totalTokens, 0);
  }

  /**
   * 按类型获取成本
   */
  getCostByType(type) {
    return this.records
      .filter(r => r.type === type)
      .reduce((sum, r) => sum + r.estimatedCost, 0);
  }

  /**
   * 获取统计摘要
   */
  getSummary() {
    const byType = {};
    Object.values(CostType).forEach(type => {
      const typeRecords = this.records.filter(r => r.type === type);
      byType[type] = {
        count: typeRecords.length,
        cost: this.getCostByType(type),
        tokens: typeRecords.reduce((sum, r) => sum + r.totalTokens, 0)
      };
    });

    return {
      sessionDuration: Date.now() - this.sessionStart,
      totalRecords: this.records.length,
      totalCost: this.getTotalCost(),
      totalTokens: this.getTotalTokens(),
      budget: this.budget,
      budgetUsed: this.budget ? (this.getTotalCost() / this.budget * 100) : null,
      byType
    };
  }

  /**
   * 生成成本报告
   */
  generateReport() {
    const summary = this.getSummary();
    
    return {
      reportType: '成本统计报告',
      generatedAt: new Date().toISOString(),
      session: {
        duration: `${Math.round(summary.sessionDuration / 1000)}秒`,
        totalOperations: summary.totalRecords
      },
      costs: {
        total: `$${summary.totalCost.toFixed(4)}`,
        byType: Object.entries(summary.byType).map(([type, data]) => ({
          type,
          count: data.count,
          cost: `$${data.cost.toFixed(4)}`,
          tokens: data.tokens
        }))
      },
      tokens: {
        total: summary.totalTokens,
        breakdown: Object.entries(summary.byType).map(([type, data]) => ({
          type,
          tokens: data.tokens
        }))
      },
      budget: summary.budget ? {
        limit: `$${summary.budget}`,
        used: `${summary.budgetUsed.toFixed(1)}%`,
        remaining: `$${Math.max(0, summary.budget - summary.totalCost).toFixed(4)}`
      } : null
    };
  }

  /**
   * 重置追踪器
   */
  reset() {
    this.records = [];
    this.sessionStart = Date.now();
    return this;
  }
}

const costTracker = new CostTracker();

module.exports = {
  CostType,
  CostRecord,
  CostTracker,
  costTracker
};