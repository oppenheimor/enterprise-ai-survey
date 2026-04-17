/**
 * 产品经理技能 - 可视化仪表盘
 * 提供Web界面展示分析结果、项目健康度、成本统计等
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

/**
 * 图表配置
 */
const CHART_COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#8B5CF6',
  gray: '#6B7280'
};

/**
 * 可视化仪表盘
 */
class Visualizer {
  constructor(options = {}) {
    this.port = options.port || 3456;
    this.server = null;
    this.data = {
      analysis: null,
      projectHealth: null,
      functionHealth: null,
      costSummary: null,
      workflowHistory: []
    };
  }

  /**
   * 设置分析数据
   */
  setAnalysisData(data) {
    this.data.analysis = data;
    return this;
  }

  /**
   * 设置项目健康数据
   */
  setProjectHealthData(data) {
    this.data.projectHealth = data;
    return this;
  }

  /**
   * 设置功能健康数据
   */
  setFunctionHealthData(data) {
    this.data.functionHealth = data;
    return this;
  }

  /**
   * 设置成本数据
   */
  setCostData(data) {
    this.data.costSummary = data;
    return this;
  }

  /**
   * 添加工作流历史
   */
  addWorkflowHistory(workflow) {
    this.data.workflowHistory.push({
      ...workflow,
      timestamp: Date.now()
    });
    return this;
  }

  /**
   * 生成仪表盘HTML
   */
  generateDashboardHTML() {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>产品经理智能助手 - 可视化仪表盘</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      color: #e2e8f0;
    }
    .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
    .header { 
      text-align: center; 
      padding: 30px 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      margin-bottom: 30px;
    }
    .header h1 { 
      font-size: 2.5rem;
      background: linear-gradient(90deg, #3B82F6, #8B5CF6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .header p { color: #94a3b8; margin-top: 10px; }
    
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; }
    
    .card {
      background: rgba(255,255,255,0.05);
      border-radius: 16px;
      padding: 24px;
      border: 1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }
    .card-title { 
      font-size: 1.1rem; 
      color: #94a3b8; 
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card-title::before {
      content: '';
      width: 4px;
      height: 20px;
      background: linear-gradient(180deg, #3B82F6, #8B5CF6);
      border-radius: 2px;
    }
    
    .score-display {
      text-align: center;
      padding: 20px 0;
    }
    .score-value {
      font-size: 4rem;
      font-weight: bold;
      background: linear-gradient(90deg, #10B981, #3B82F6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .score-label { color: #94a3b8; margin-top: 8px; }
    
    .progress-bar {
      height: 8px;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
      overflow: hidden;
      margin: 10px 0;
    }
    .progress-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.5s ease;
    }
    
    .dimension-list { margin-top: 16px; }
    .dimension-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .dimension-item:last-child { border-bottom: none; }
    .dimension-name { color: #e2e8f0; }
    .dimension-score {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
    }
    .score-excellent { background: rgba(16,185,129,0.2); color: #10B981; }
    .score-good { background: rgba(59,130,246,0.2); color: #3B82F6; }
    .score-warning { background: rgba(245,158,11,0.2); color: #F59E0B; }
    .score-danger { background: rgba(239,68,68,0.2); color: #EF4444; }
    
    .chart-container { 
      position: relative; 
      height: 250px;
      margin-top: 16px;
    }
    
    .issue-list { max-height: 300px; overflow-y: auto; }
    .issue-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px;
      background: rgba(255,255,255,0.02);
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .issue-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      flex-shrink: 0;
    }
    .issue-high { background: rgba(239,68,68,0.2); color: #EF4444; }
    .issue-medium { background: rgba(245,158,11,0.2); color: #F59E0B; }
    .issue-low { background: rgba(59,130,246,0.2); color: #3B82F6; }
    .issue-content { flex: 1; }
    .issue-title { color: #e2e8f0; font-weight: 500; }
    .issue-desc { color: #94a3b8; font-size: 0.875rem; margin-top: 4px; }
    
    .cost-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .cost-item {
      text-align: center;
      padding: 16px;
      background: rgba(255,255,255,0.02);
      border-radius: 12px;
    }
    .cost-value { font-size: 1.5rem; font-weight: bold; color: #3B82F6; }
    .cost-label { color: #94a3b8; font-size: 0.875rem; margin-top: 4px; }
    
    .workflow-timeline { margin-top: 16px; }
    .workflow-item {
      display: flex;
      gap: 16px;
      padding: 16px 0;
      border-left: 2px solid rgba(255,255,255,0.1);
      padding-left: 20px;
      position: relative;
    }
    .workflow-item::before {
      content: '';
      position: absolute;
      left: -6px;
      top: 20px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #3B82F6;
    }
    .workflow-item.success::before { background: #10B981; }
    .workflow-item.failed::before { background: #EF4444; }
    .workflow-time { color: #94a3b8; font-size: 0.875rem; }
    .workflow-name { color: #e2e8f0; font-weight: 500; margin-top: 4px; }
    
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge-success { background: rgba(16,185,129,0.2); color: #10B981; }
    .badge-warning { background: rgba(245,158,11,0.2); color: #F59E0B; }
    .badge-danger { background: rgba(239,68,68,0.2); color: #EF4444; }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .loading { animation: pulse 1.5s infinite; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 产品经理智能助手</h1>
      <p>实时监控 · 智能分析 · 数据驱动</p>
    </div>
    
    <div class="grid">
      <!-- 项目健康度 -->
      <div class="card">
        <div class="card-title">项目健康度</div>
        <div class="score-display">
          <div class="score-value" id="projectScore">${this.data.projectHealth?.summary?.healthScore || '--'}</div>
          <div class="score-label">${this.data.projectHealth?.summary?.healthLevel || '等待检测'}</div>
        </div>
        <div class="dimension-list" id="projectDimensions">
          ${this.renderProjectDimensions()}
        </div>
      </div>
      
      <!-- 功能健康度 -->
      <div class="card">
        <div class="card-title">功能健康度</div>
        <div class="score-display">
          <div class="score-value" id="functionScore">${this.data.functionHealth?.summary?.overallScore || '--'}</div>
          <div class="score-label">${this.data.functionHealth?.summary?.healthLevel || '等待检测'}</div>
        </div>
        <div class="chart-container">
          <canvas id="functionChart"></canvas>
        </div>
      </div>
      
      <!-- 成本统计 -->
      <div class="card">
        <div class="card-title">成本统计</div>
        <div class="cost-grid">
          <div class="cost-item">
            <div class="cost-value">$${(this.data.costSummary?.totalCost || 0).toFixed(4)}</div>
            <div class="cost-label">总成本</div>
          </div>
          <div class="cost-item">
            <div class="cost-value">${this.data.costSummary?.totalTokens || 0}</div>
            <div class="cost-label">总Token</div>
          </div>
          <div class="cost-item">
            <div class="cost-value">${this.data.costSummary?.totalRecords || 0}</div>
            <div class="cost-label">调用次数</div>
          </div>
        </div>
        <div class="chart-container">
          <canvas id="costChart"></canvas>
        </div>
      </div>
      
      <!-- 问题列表 -->
      <div class="card">
        <div class="card-title">待处理问题</div>
        <div class="issue-list" id="issueList">
          ${this.renderIssues()}
        </div>
      </div>
      
      <!-- 工作流历史 -->
      <div class="card">
        <div class="card-title">工作流历史</div>
        <div class="workflow-timeline" id="workflowTimeline">
          ${this.renderWorkflowHistory()}
        </div>
      </div>
      
      <!-- 分析结果 -->
      <div class="card">
        <div class="card-title">需求分析结果</div>
        <div id="analysisResult">
          ${this.renderAnalysisResult()}
        </div>
      </div>
    </div>
  </div>
  
  <script>
    // 功能健康度雷达图
    const functionCtx = document.getElementById('functionChart');
    if (functionCtx) {
      new Chart(functionCtx, {
        type: 'radar',
        data: {
          labels: ['完整性', '合理性', '可用性'],
          datasets: [{
            label: '健康度',
            data: [
              ${this.data.functionHealth?.dimensions?.completeness?.score || 0},
              ${this.data.functionHealth?.dimensions?.rationality?.score || 0},
              ${this.data.functionHealth?.dimensions?.usability?.score || 0}
            ],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3B82F6',
            pointBackgroundColor: '#3B82F6'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: { color: '#94a3b8' },
              grid: { color: 'rgba(255,255,255,0.1)' },
              pointLabels: { color: '#e2e8f0' }
            }
          }
        }
      });
    }
    
    // 成本分布图
    const costCtx = document.getElementById('costChart');
    if (costCtx) {
      new Chart(costCtx, {
        type: 'doughnut',
        data: {
          labels: ['LLM调用', '工作流', '分析', 'API'],
          datasets: [{
            data: [
              ${this.data.costSummary?.byType?.llm_call?.cost || 0},
              ${this.data.costSummary?.byType?.workflow?.cost || 0},
              ${this.data.costSummary?.byType?.analysis?.cost || 0},
              ${this.data.costSummary?.byType?.api_call?.cost || 0}
            ],
            backgroundColor: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#94a3b8' }
            }
          }
        }
      });
    }
  </script>
</body>
</html>`;
  }

  /**
   * 渲染项目维度
   */
  renderProjectDimensions() {
    const dimensions = this.data.projectHealth?.dimensions || {};
    const html = Object.entries(dimensions).map(([key, value]) => {
      const score = value?.score || 0;
      const scoreClass = score >= 90 ? 'score-excellent' : score >= 75 ? 'score-good' : score >= 60 ? 'score-warning' : 'score-danger';
      const names = {
        requirement: '需求完整性',
        design: '设计完整性',
        development: '开发进度',
        quality: '质量状态',
        performance: '性能状态',
        security: '安全状态',
        documentation: '文档完整性',
        operations: '运维准备'
      };
      return `
        <div class="dimension-item">
          <span class="dimension-name">${names[key] || key}</span>
          <span class="dimension-score ${scoreClass}">${score}分</span>
        </div>`;
    }).join('');
    return html || '<div class="loading">等待数据...</div>';
  }

  /**
   * 渲染问题列表
   */
  renderIssues() {
    const issues = [
      ...(this.data.projectHealth?.issues || []),
      ...(this.data.functionHealth?.issues || [])
    ].slice(0, 10);

    if (issues.length === 0) {
      return '<div style="text-align:center;color:#94a3b8;padding:40px;">暂无问题 🎉</div>';
    }

    return issues.map(issue => `
      <div class="issue-item">
        <div class="issue-icon issue-${issue.severity?.toLowerCase() || 'low'}">
          ${issue.severity === 'High' ? '!' : issue.severity === 'Medium' ? '?' : 'i'}
        </div>
        <div class="issue-content">
          <div class="issue-title">${issue.item || issue.description}</div>
          <div class="issue-desc">${issue.description || ''}</div>
        </div>
      </div>
    `).join('');
  }

  /**
   * 渲染工作流历史
   */
  renderWorkflowHistory() {
    const history = this.data.workflowHistory.slice(-5).reverse();
    if (history.length === 0) {
      return '<div style="text-align:center;color:#94a3b8;padding:20px;">暂无工作流记录</div>';
    }

    return history.map(w => `
      <div class="workflow-item ${w.success ? 'success' : 'failed'}">
        <div>
          <div class="workflow-time">${new Date(w.timestamp).toLocaleString()}</div>
          <div class="workflow-name">${w.type || '工作流'}</div>
          <span class="badge ${w.success ? 'badge-success' : 'badge-danger'}">${w.success ? '成功' : '失败'}</span>
        </div>
      </div>
    `).join('');
  }

  /**
   * 渲染分析结果
   */
  renderAnalysisResult() {
    const analysis = this.data.analysis;
    if (!analysis) {
      return '<div style="text-align:center;color:#94a3b8;padding:40px;">等待分析...</div>';
    }

    return `
      <div class="dimension-item">
        <span class="dimension-name">核心问题</span>
        <span style="color:#e2e8f0">${analysis.coreProblem || '-'}</span>
      </div>
      <div class="dimension-item">
        <span class="dimension-name">用户价值</span>
        <span style="color:#10B981">${analysis.userValue?.primary || '-'}</span>
      </div>
      <div class="dimension-item">
        <span class="dimension-name">业务影响</span>
        <span style="color:#3B82F6">${analysis.businessValue?.expectedImpact || '-'}</span>
      </div>
      <div class="dimension-item">
        <span class="dimension-name">风险数量</span>
        <span class="badge badge-warning">${analysis.risks?.length || 0}个</span>
      </div>
      <div class="dimension-item">
        <span class="dimension-name">MVP功能</span>
        <span style="color:#8B5CF6">${analysis.mvp?.coreFeatures?.length || 0}个</span>
      </div>
    `;
  }

  /**
   * 启动服务器
   */
  start() {
    this.server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(this.generateDashboardHTML());
    });

    this.server.listen(this.port);
    console.log(`\n📊 可视化仪表盘已启动: http://localhost:${this.port}`);
    return this;
  }

  /**
   * 停止服务器
   */
  stop() {
    if (this.server) {
      this.server.close();
      console.log('📊 可视化仪表盘已停止');
    }
    return this;
  }

  /**
   * 生成静态HTML文件
   */
  generateStaticFile(outputPath) {
    const html = this.generateDashboardHTML();
    fs.writeFileSync(outputPath, html, 'utf-8');
    console.log(`📄 静态报告已生成: ${outputPath}`);
    return this;
  }
}

module.exports = { Visualizer, CHART_COLORS };