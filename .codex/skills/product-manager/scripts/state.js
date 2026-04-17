/**
 * 产品经理技能 - 状态管理
 * 遵循Claude Code的不可变状态更新模式
 */

/**
 * 应用状态定义
 */
const initialAppState = {
  // 当前工作流
  currentWorkflow: {
    type: null,
    status: 'idle',  // idle/running/completed/failed
    startTime: null,
    endTime: null,
    steps: []
  },

  // 分析结果缓存
  analysisCache: {
    requirements: {},
    userStories: {},
    prds: {},
    competitiveAnalysis: {}
  },

  // 项目健康状态
  projectHealth: {
    lastCheck: null,
    score: 0,
    dimensions: {}
  },

  // 功能健康状态
  functionHealth: {
    lastCheck: null,
    score: 0,
    dimensions: {}
  },

  // LLM配置
  llmConfig: {
    provider: 'openai',
    model: null,
    temperature: 0.7,
    maxTokens: 4096
  },

  // 工具使用统计
  toolUsage: {},

  // 执行历史
  executionHistory: [],

  // 错误记录
  errors: [],

  // 用户偏好
  preferences: {
    defaultAnalysisType: 'requirement',
    outputFormat: 'json',
    language: 'zh-CN'
  }
};

/**
 * 状态存储
 * 实现不可变状态更新
 */
class AppStateStore {
  constructor(initialState) {
    this._state = { ...initialState };
    this._listeners = new Set();
    this._history = [];
    this._maxHistoryLength = 50;
  }

  /**
   * 获取当前状态
   */
  getState() {
    return { ...this._state };
  }

  /**
   * 获取状态的某个字段
   */
  getStateField(field) {
    return this._state[field];
  }

  /**
   * 设置状态（不可变更新）
   * @param {function} updater - (prev: AppState) => AppState
   */
  setState(updater) {
    const prevState = this.getState();
    const nextState = updater(prevState);
    
    // 验证返回值
    if (!nextState || typeof nextState !== 'object') {
      throw new Error('setState updater must return an object');
    }

    // 保存历史
    this._history.push({
      prevState,
      nextState,
      timestamp: Date.now()
    });

    // 限制历史长度
    if (this._history.length > this._maxHistoryLength) {
      this._history.shift();
    }

    // 更新状态
    this._state = nextState;

    // 通知监听器
    this._notifyListeners(nextState);

    return nextState;
  }

  /**
   * 批量更新状态
   */
  batchUpdate(updates) {
    return this.setState(prev => ({
      ...prev,
      ...updates
    }));
  }

  /**
   * 重置状态
   */
  reset() {
    this._state = { ...initialAppState };
    this._notifyListeners(this._state);
    return this._state;
  }

  /**
   * 撤销到上一个状态
   */
  undo() {
    if (this._history.length === 0) {
      return null;
    }

    const lastEntry = this._history.pop();
    this._state = lastEntry.prevState;
    this._notifyListeners(this._state);
    return this._state;
  }

  /**
   * 获取历史记录
   */
  getHistory() {
    return [...this._history];
  }

  /**
   * 订阅状态变化
   */
  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  /**
   * 通知监听器
   */
  _notifyListeners(state) {
    this._listeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }
}

// 创建全局状态存储
const appStateStore = new AppStateStore(initialAppState);

/**
 * 状态选择器
 */
const selectors = {
  // 获取当前工作流状态
  getCurrentWorkflow: (state) => state.currentWorkflow,

  // 获取分析缓存
  getAnalysisCache: (state) => state.analysisCache,

  // 获取特定需求的分析结果
  getRequirementAnalysis: (state, id) => state.analysisCache.requirements[id],

  // 获取项目健康分数
  getProjectHealthScore: (state) => state.projectHealth.score,

  // 获取功能健康分数
  getFunctionHealthScore: (state) => state.functionHealth.score,

  // 获取工具使用统计
  getToolUsage: (state) => state.toolUsage,

  // 获取执行历史
  getExecutionHistory: (state) => state.executionHistory,

  // 获取最近的错误
  getRecentErrors: (state, limit = 10) => state.errors.slice(-limit),

  // 获取用户偏好
  getPreferences: (state) => state.preferences
};

/**
 * 状态更新动作
 */
const actions = {
  // 开始工作流
  startWorkflow: (type) => {
    return appStateStore.setState(prev => ({
      ...prev,
      currentWorkflow: {
        type,
        status: 'running',
        startTime: Date.now(),
        endTime: null,
        steps: []
      }
    }));
  },

  // 更新工作流步骤
  updateWorkflowStep: (stepName, status, output) => {
    return appStateStore.setState(prev => {
      const steps = [...prev.currentWorkflow.steps];
      const existingIndex = steps.findIndex(s => s.name === stepName);
      
      const step = {
        name: stepName,
        status,
        output,
        timestamp: Date.now()
      };

      if (existingIndex >= 0) {
        steps[existingIndex] = step;
      } else {
        steps.push(step);
      }

      return {
        ...prev,
        currentWorkflow: {
          ...prev.currentWorkflow,
          steps
        }
      };
    });
  },

  // 完成工作流
  completeWorkflow: (success) => {
    return appStateStore.setState(prev => ({
      ...prev,
      currentWorkflow: {
        ...prev.currentWorkflow,
        status: success ? 'completed' : 'failed',
        endTime: Date.now()
      }
    }));
  },

  // 缓存分析结果
  cacheAnalysis: (type, id, result) => {
    return appStateStore.setState(prev => ({
      ...prev,
      analysisCache: {
        ...prev.analysisCache,
        [type]: {
          ...prev.analysisCache[type],
          [id]: {
            result,
            timestamp: Date.now()
          }
        }
      }
    }));
  },

  // 更新项目健康状态
  updateProjectHealth: (score, dimensions) => {
    return appStateStore.setState(prev => ({
      ...prev,
      projectHealth: {
        lastCheck: Date.now(),
        score,
        dimensions
      }
    }));
  },

  // 更新功能健康状态
  updateFunctionHealth: (score, dimensions) => {
    return appStateStore.setState(prev => ({
      ...prev,
      functionHealth: {
        lastCheck: Date.now(),
        score,
        dimensions
      }
    }));
  },

  // 记录工具使用
  recordToolUsage: (toolName) => {
    return appStateStore.setState(prev => ({
      ...prev,
      toolUsage: {
        ...prev.toolUsage,
        [toolName]: (prev.toolUsage[toolName] || 0) + 1
      }
    }));
  },

  // 添加执行历史
  addExecutionHistory: (entry) => {
    return appStateStore.setState(prev => ({
      ...prev,
      executionHistory: [
        ...prev.executionHistory.slice(-99),  // 保留最近100条
        {
          ...entry,
          timestamp: Date.now()
        }
      ]
    }));
  },

  // 记录错误
  recordError: (error, context = {}) => {
    return appStateStore.setState(prev => ({
      ...prev,
      errors: [
        ...prev.errors.slice(-99),  // 保留最近100条
        {
          error: error.message || error,
          context,
          timestamp: Date.now()
        }
      ]
    }));
  },

  // 更新用户偏好
  updatePreferences: (updates) => {
    return appStateStore.setState(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...updates
      }
    }));
  },

  // 更新LLM配置
  updateLLMConfig: (config) => {
    return appStateStore.setState(prev => ({
      ...prev,
      llmConfig: {
        ...prev.llmConfig,
        ...config
      }
    }));
  }
};

/**
 * 状态Hooks（用于订阅）
 */
function useAppState(selector) {
  const state = appStateStore.getState();
  return selector ? selector(state) : state;
}

function useAppStateSelector(selector) {
  const state = appStateStore.getState();
  return selector(state);
}

function useAppStateSubscription(callback) {
  return appStateStore.subscribe(callback);
}

module.exports = {
  initialAppState,
  AppStateStore,
  appStateStore,
  selectors,
  actions,
  useAppState,
  useAppStateSelector,
  useAppStateSubscription
};