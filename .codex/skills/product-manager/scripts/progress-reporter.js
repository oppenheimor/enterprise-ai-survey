/**
 * 产品经理技能 - 进度报告器
 * 遵循Claude Code的进度反馈模式
 */

const { ToolProgress, ToolProgressTypes } = require('./types');

/**
 * 进度报告器
 */
class ProgressReporter {
  constructor(options = {}) {
    this.progresses = new Map();
    this.listeners = new Set();
    this.verbose = options.verbose !== false;
  }

  /**
   * 开始进度
   */
  start(id, type, message = '') {
    const progress = new ToolProgress(type, {
      status: 'running',
      message
    });
    this.progresses.set(id, progress);
    this._notify(progress);
    
    if (this.verbose) {
      console.log(`\n⏳ [${type}] ${message}`);
    }
    
    return progress;
  }

  /**
   * 更新进度
   */
  update(id, percentage, message, details = {}) {
    const progress = this.progresses.get(id);
    if (!progress) return null;

    progress.update(percentage, message, details);
    this._notify(progress);
    
    if (this.verbose) {
      const bar = this._renderBar(percentage);
      console.log(`\r${bar} ${percentage}% - ${message}`);
    }
    
    return progress;
  }

  /**
   * 完成进度
   */
  complete(id, message, details = {}) {
    const progress = this.progresses.get(id);
    if (!progress) return null;

    progress.complete(message, details);
    this._notify(progress);
    
    if (this.verbose) {
      console.log(`\n✅ [${progress.type}] ${message}`);
    }
    
    return progress;
  }

  /**
   * 失败进度
   */
  fail(id, error, details = {}) {
    const progress = this.progresses.get(id);
    if (!progress) return null;

    progress.fail(error, details);
    this._notify(progress);
    
    if (this.verbose) {
      console.log(`\n❌ [${progress.type}] ${error}`);
    }
    
    return progress;
  }

  /**
   * 获取进度
   */
  get(id) {
    return this.progresses.get(id);
  }

  /**
   * 获取所有进度
   */
  getAll() {
    return Array.from(this.progresses.values());
  }

  /**
   * 订阅进度变化
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * 通知监听器
   */
  _notify(progress) {
    this.listeners.forEach(listener => {
      try {
        listener(progress);
      } catch (error) {
        console.error('Progress listener error:', error);
      }
    });
  }

  /**
   * 渲染进度条
   */
  _renderBar(percentage) {
    const filled = Math.floor(percentage / 5);
    const empty = 20 - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
  }

  /**
   * 生成进度报告
   */
  generateReport() {
    const all = this.getAll();
    
    return {
      total: all.length,
      running: all.filter(p => p.status === 'running').length,
      completed: all.filter(p => p.status === 'completed').length,
      failed: all.filter(p => p.status === 'failed').length,
      details: all.map(p => ({
        type: p.type,
        status: p.status,
        percentage: p.percentage,
        message: p.message,
        duration: p.endTime ? p.endTime - p.startTime : Date.now() - p.startTime
      }))
    };
  }
}

/**
 * 工作流进度追踪器
 */
class WorkflowProgressTracker {
  constructor(reporter, workflowType) {
    this.reporter = reporter;
    this.workflowType = workflowType;
    this.stepIndex = 0;
    this.totalSteps = 0;
    this.id = `workflow_${Date.now()}`;
  }

  /**
   * 设置总步骤数
   */
  setTotalSteps(total) {
    this.totalSteps = total;
    return this;
  }

  /**
   * 开始工作流
   */
  start(message = '工作流开始') {
    this.reporter.start(this.id, ToolProgressTypes.REQUIREMENT_ANALYSIS, message);
    return this;
  }

  /**
   * 开始步骤
   */
  startStep(stepName) {
    this.stepIndex++;
    const percentage = Math.round((this.stepIndex / this.totalSteps) * 100);
    this.reporter.update(this.id, percentage, `执行: ${stepName}`, { step: stepName });
    return this;
  }

  /**
   * 完成步骤
   */
  completeStep(stepName, output = null) {
    this.reporter.update(this.id, Math.round((this.stepIndex / this.totalSteps) * 100), `完成: ${stepName}`, { step: stepName, output });
    return this;
  }

  /**
   * 完成工作流
   */
  complete(message = '工作流完成') {
    this.reporter.complete(this.id, message);
    return this;
  }

  /**
   * 失败工作流
   */
  fail(error) {
    this.reporter.fail(this.id, error);
    return this;
  }
}

const progressReporter = new ProgressReporter();

module.exports = {
  ProgressReporter,
  WorkflowProgressTracker,
  progressReporter
};