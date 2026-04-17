/**
 * 产品经理技能 - 工具系统类型定义
 * 遵循Claude Code的统一接口设计模式
 */

/**
 * 工具接口定义
 * 所有工具必须实现此接口
 */
const ToolInterface = {
  name: '',           // 工具名称
  description: '',    // 工具描述
  inputSchema: {},    // 输入参数Schema (Zod格式)
  execute: null,      // 执行函数
  progress: null      // 进度回调
};

/**
 * 工具上下文
 */
class ToolContext {
  constructor(options = {}) {
    this.sessionId = options.sessionId || this.generateId();
    this.userId = options.userId;
    this.permissions = options.permissions || {};
    this.config = options.config || {};
    this.state = options.state || {};
    this.logger = options.logger || console;
  }

  generateId() {
    return `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * 工具进度类型
 */
const ToolProgressTypes = {
  REQUIREMENT_ANALYSIS: 'requirement-analysis',
  USER_STORY_GENERATION: 'user-story-generation',
  PRD_GENERATION: 'prd-generation',
  COMPETITIVE_ANALYSIS: 'competitive-analysis',
  PROJECT_CHECK: 'project-check',
  FUNCTION_CHECK: 'function-check',
  LLM_ANALYSIS: 'llm-analysis'
};

/**
 * 工具进度
 */
class ToolProgress {
  constructor(type, data = {}) {
    this.type = type;
    this.status = data.status || 'pending';  // pending/running/completed/failed
    this.percentage = data.percentage || 0;
    this.message = data.message || '';
    this.details = data.details || {};
    this.startTime = data.startTime || Date.now();
    this.endTime = data.endTime;
  }

  update(percentage, message, details = {}) {
    this.percentage = percentage;
    this.message = message;
    this.details = { ...this.details, ...details };
    return this;
  }

  complete(message, details = {}) {
    this.status = 'completed';
    this.percentage = 100;
    this.message = message;
    this.details = { ...this.details, ...details };
    this.endTime = Date.now();
    return this;
  }

  fail(error, details = {}) {
    this.status = 'failed';
    this.message = error;
    this.details = { ...this.details, ...details, error };
    this.endTime = Date.now();
    return this;
  }
}

/**
 * 工具结果
 */
class ToolResult {
  constructor(success, data = {}, metadata = {}) {
    this.success = success;
    this.data = data;
    this.error = metadata.error || null;
    this.duration = metadata.duration || 0;
    this.timestamp = new Date().toISOString();
    this.metadata = metadata;
  }

  static success(data, metadata = {}) {
    return new ToolResult(true, data, metadata);
  }

  static failure(error, metadata = {}) {
    return new ToolResult(false, {}, { ...metadata, error });
  }
}

/**
 * 工具基类
 * 所有工具继承此类
 */
class BaseTool {
  constructor(config = {}) {
    this.name = config.name || this.constructor.name;
    this.description = config.description || '';
    this.inputSchema = config.inputSchema || {};
    this.config = config;
  }

  /**
   * 执行工具
   * @param {object} input - 输入参数
   * @param {ToolContext} context - 工具上下文
   * @param {function} progressCallback - 进度回调
   * @returns {Promise<ToolResult>}
   */
  async execute(input, context, progressCallback) {
    throw new Error('execute() must be implemented by subclass');
  }

  /**
   * 验证输入
   */
  validateInput(input) {
    // 基础验证，子类可覆盖
    if (!input || typeof input !== 'object') {
      return { valid: false, error: 'Input must be an object' };
    }
    return { valid: true };
  }

  /**
   * 创建进度对象
   */
  createProgress(type, data = {}) {
    return new ToolProgress(type, data);
  }

  /**
   * 创建成功结果
   */
  createSuccess(data, metadata = {}) {
    return ToolResult.success(data, metadata);
  }

  /**
   * 创建失败结果
   */
  createFailure(error, metadata = {}) {
    return ToolResult.failure(error, metadata);
  }
}

/**
 * 工具注册中心
 * 遵循Claude Code的统一注册机制
 */
class ToolRegistry {
  constructor() {
    this.tools = new Map();
    this.categories = new Map();
  }

  /**
   * 注册工具
   */
  register(tool) {
    if (!(tool instanceof BaseTool)) {
      throw new Error('Tool must extend BaseTool');
    }
    this.tools.set(tool.name, tool);
    return this;
  }

  /**
   * 批量注册工具
   */
  registerAll(tools) {
    tools.forEach(tool => this.register(tool));
    return this;
  }

  /**
   * 获取工具
   */
  get(name) {
    return this.tools.get(name);
  }

  /**
   * 获取所有工具
   */
  getAll() {
    return Array.from(this.tools.values());
  }

  /**
   * 按类别获取工具
   */
  getByCategory(category) {
    return this.getAll().filter(tool => tool.config.category === category);
  }

  /**
   * 检查工具是否存在
   */
  has(name) {
    return this.tools.has(name);
  }

  /**
   * 获取工具数量
   */
  size() {
    return this.tools.size;
  }
}

// 创建全局工具注册中心
const toolRegistry = new ToolRegistry();

/**
 * 权限级别
 * 遵循Claude Code的三级权限规则
 */
const PermissionLevel = {
  ALWAYS_ALLOW: 'alwaysAllow',   // 始终允许
  ALWAYS_DENY: 'alwaysDeny',     // 始终拒绝
  ALWAYS_ASK: 'alwaysAsk'        // 始终询问
};

/**
 * 权限模式
 */
const PermissionMode = {
  DEFAULT: 'default',
  AUTO: 'auto',
  PLAN: 'plan',
  INTERACTIVE: 'interactive'
};

/**
 * 权限管理器
 */
class PermissionManager {
  constructor() {
    this.rules = new Map();
    this.mode = PermissionMode.DEFAULT;
  }

  /**
   * 设置权限规则
   */
  setRule(toolName, level, source = 'user') {
    this.rules.set(toolName, { level, source, timestamp: Date.now() });
    return this;
  }

  /**
   * 获取权限规则
   */
  getRule(toolName) {
    return this.rules.get(toolName);
  }

  /**
   * 检查权限
   */
  check(toolName, context) {
    const rule = this.rules.get(toolName);
    
    if (!rule) {
      return { allowed: true, reason: 'No rule defined, default allow' };
    }

    switch (rule.level) {
      case PermissionLevel.ALWAYS_ALLOW:
        return { allowed: true, reason: 'Always allowed' };
      case PermissionLevel.ALWAYS_DENY:
        return { allowed: false, reason: 'Always denied' };
      case PermissionLevel.ALWAYS_ASK:
        return { allowed: false, reason: 'Requires user confirmation', askUser: true };
      default:
        return { allowed: true, reason: 'Default allow' };
    }
  }

  /**
   * 设置权限模式
   */
  setMode(mode) {
    this.mode = mode;
    return this;
  }

  /**
   * 获取所有规则
   */
  getAllRules() {
    return Array.from(this.rules.entries()).map(([name, rule]) => ({
      toolName: name,
      ...rule
    }));
  }
}

// 创建全局权限管理器
const permissionManager = new PermissionManager();

/**
 * 工具执行器
 * 负责工具的执行、权限检查、进度追踪
 */
class ToolExecutor {
  constructor(registry, permissions) {
    this.registry = registry;
    this.permissions = permissions;
    this.executionHistory = [];
  }

  /**
   * 执行工具
   */
  async execute(toolName, input, context, progressCallback) {
    const startTime = Date.now();
    
    // 获取工具
    const tool = this.registry.get(toolName);
    if (!tool) {
      return ToolResult.failure(`Tool not found: ${toolName}`);
    }

    // 检查权限
    const permissionCheck = this.permissions.check(toolName, context);
    if (!permissionCheck.allowed) {
      return ToolResult.failure(`Permission denied: ${permissionCheck.reason}`);
    }

    // 验证输入
    const validation = tool.validateInput(input);
    if (!validation.valid) {
      return ToolResult.failure(`Invalid input: ${validation.error}`);
    }

    try {
      // 执行工具
      const result = await tool.execute(input, context, progressCallback);
      
      // 记录执行历史
      this.executionHistory.push({
        toolName,
        input,
        result,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });

      return result;
    } catch (error) {
      return ToolResult.failure(error.message, { duration: Date.now() - startTime });
    }
  }

  /**
   * 获取执行历史
   */
  getHistory(limit = 100) {
    return this.executionHistory.slice(-limit);
  }

  /**
   * 清除历史
   */
  clearHistory() {
    this.executionHistory = [];
    return this;
  }
}

// 创建全局工具执行器
const toolExecutor = new ToolExecutor(toolRegistry, permissionManager);

module.exports = {
  ToolInterface,
  ToolContext,
  ToolProgress,
  ToolProgressTypes,
  ToolResult,
  BaseTool,
  ToolRegistry,
  toolRegistry,
  PermissionLevel,
  PermissionMode,
  PermissionManager,
  permissionManager,
  ToolExecutor,
  toolExecutor
};