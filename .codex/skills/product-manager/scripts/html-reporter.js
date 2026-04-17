/**
 * 产品经理技能 - HTML报告生成器
 * 生成美观的HTML格式报告，包含图表和交互元素
 */

const fs = require('fs');

/**
 * HTML报告生成器
 */
class HTMLReporter {
  constructor() {
    this.charts = [];
  }

  /**
   * 生成需求分析报告
   */
  generateRequirementReport(data) {
    return this._buildHTML({
      title: '需求分析报告',
      type: 'requirement',
      data
    });
  }

  /**
   * 生成项目健康报告
   */
  generateProjectHealthReport(data) {
    return this._buildHTML({
      title: '项目健康检测报告',
      type: 'project-health',
      data
    });
  }

  /**
   * 生成功能健康报告
   */
  generateFunctionHealthReport(data) {
    return this._buildHTML({
      title: '功能健康检测报告',
      type: 'function-health',
      data
    });
  }

  /**
   * 生成PRD报告
   */
  generatePRDReport(data) {
    return this._buildHTML({
      title: 'PRD产品需求文档',
      type: 'prd',
      data
    });
  }

  /**
   * 生成竞品分析报告
   */
  generateCompetitiveReport(data) {
    return this._buildHTML({
      title: '竞品分析报告',
      type: 'competitive',
      data
    });
  }

  /**
   * 构建HTML
   */
  _buildHTML(config) {
    const { title, type, data } = config;
    
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    :root {
      --primary: #3B82F6;
      --success: #10B981;
      --warning: #F59E0B;
      --danger: #EF4444;
      --purple: #8B5CF6;
      --gray: #6B7280;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8fafc;
      color: #1e293b;
      line-height: 1.6;
    }
    
    .report-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    .report-header {
      text-align: center;
      padding: 40px 0;
      border-bottom: 3px solid var(--primary);
      margin-bottom: 40px;
    }
    
    .report-header h1 {
      font-size: 2.5rem;
      color: #0f172a;
      margin-bottom: 16px;
    }
    
    .report-meta {
      display: flex;
      justify-content: center;
      gap: 24px;
      color: var(--gray);
      font-size: 0.9rem;
    }
    
    .report-meta span {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .section-title {
      font-size: 1.25rem;
      color: #0f172a;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .section-title::before {
      content: '';
      width: 4px;
      height: 24px;
      background: var(--primary);
      border-radius: 2px;
    }
    
    .score-card {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 40px;
      background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
      border-radius: 16px;
      color: white;
      margin-bottom: 24px;
    }
    
    .score-value {
      font-size: 5rem;
      font-weight: bold;
      line-height: 1;
    }
    
    .score-label {
      font-size: 1.25rem;
      opacity: 0.9;
      margin-top: 8px;
    }
    
    .dimension-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    
    .dimension-card {
      background: #f8fafc;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    
    .dimension-name {
      color: var(--gray);
      font-size: 0.875rem;
      margin-bottom: 8px;
    }
    
    .dimension-score {
      font-size: 2rem;
      font-weight: bold;
    }
    
    .dimension-score.excellent { color: var(--success); }
    .dimension-score.good { color: var(--primary); }
    .dimension-score.warning { color: var(--warning); }
    .dimension-score.danger { color: var(--danger); }
    
    .progress-bar {
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 12px;
    }
    
    .progress-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.5s ease;
    }
    
    .issue-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .issue-table th,
    .issue-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .issue-table th {
      background: #f8fafc;
      font-weight: 600;
      color: #475569;
    }
    
    .issue-table tr:hover {
      background: #f8fafc;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    
    .badge-high { background: #FEE2E2; color: #DC2626; }
    .badge-medium { background: #FEF3C7; color: #D97706; }
    .badge-low { background: #DBEAFE; color: #2563EB; }
    .badge-passed { background: #D1FAE5; color: #059669; }
    .badge-warning { background: #FEF3C7; color: #D97706; }
    .badge-failed { background: #FEE2E2; color: #DC2626; }
    
    .feature-list {
      list-style: none;
    }
    
    .feature-item {
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      margin-bottom: 12px;
      border-left: 4px solid var(--primary);
    }
    
    .feature-title {
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 8px;
    }
    
    .feature-desc {
      color: var(--gray);
      font-size: 0.9rem;
    }
    
    .chart-container {
      position: relative;
      height: 300px;
      margin: 20px 0;
    }
    
    .swot-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    
    .swot-card {
      padding: 20px;
      border-radius: 12px;
    }
    
    .swot-strengths { background: #D1FAE5; }
    .swot-weaknesses { background: #FEE2E2; }
    .swot-opportunities { background: #DBEAFE; }
    .swot-threats { background: #FEF3C7; }
    
    .swot-title {
      font-weight: 600;
      margin-bottom: 12px;
    }
    
    .swot-list {
      list-style: none;
    }
    
    .swot-list li {
      padding: 6px 0;
      padding-left: 16px;
      position: relative;
    }
    
    .swot-list li::before {
      content: '•';
      position: absolute;
      left: 0;
    }
    
    .print-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      transition: transform 0.2s;
    }
    
    .print-btn:hover {
      transform: translateY(-2px);
    }
    
    @media print {
      .print-btn { display: none; }
      .section { break-inside: avoid; }
    }
    
    .footer {
      text-align: center;
      padding: 40px 0;
      color: var(--gray);
      font-size: 0.875rem;
      border-top: 1px solid #e2e8f0;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">🖨️ 打印报告</button>
  
  <div class="report-container">
    ${this._renderHeader(title, type, data)}
    ${this._renderContent(type, data)}
    
    <div class="footer">
      <p>由产品经理智能助手自动生成</p>
      <p>生成时间: ${new Date().toLocaleString()}</p>
    </div>
  </div>
  
  ${this._renderCharts(type, data)}
</body>
</html>`;
  }

  /**
   * 渲染报告头部
   */
  _renderHeader(title, type, data) {
    return `
    <div class="report-header">
      <h1>${title}</h1>
      <div class="report-meta">
        <span>📅 ${new Date().toLocaleDateString()}</span>
        <span>⏰ ${new Date().toLocaleTimeString()}</span>
        ${data.projectName ? `<span>📁 ${data.projectName}</span>` : ''}
      </div>
    </div>`;
  }

  /**
   * 渲染报告内容
   */
  _renderContent(type, data) {
    switch (type) {
      case 'project-health':
        return this._renderProjectHealthContent(data);
      case 'function-health':
        return this._renderFunctionHealthContent(data);
      case 'requirement':
        return this._renderRequirementContent(data);
      case 'prd':
        return this._renderPRDContent(data);
      case 'competitive':
        return this._renderCompetitiveContent(data);
      default:
        return '<div class="section">暂无内容</div>';
    }
  }

  /**
   * 渲染项目健康报告内容
   */
  _renderProjectHealthContent(data) {
    const summary = data.summary || {};
    const dimensions = data.dimensions || {};
    
    return `
    <div class="score-card">
      <div class="score-value">${summary.healthScore || 0}</div>
      <div class="score-label">${summary.healthLevel || '健康度评分'}</div>
    </div>
    
    <div class="section">
      <h2 class="section-title">维度详情</h2>
      <div class="dimension-grid">
        ${Object.entries(dimensions).map(([key, value]) => {
          const score = value?.score || 0;
          const scoreClass = score >= 90 ? 'excellent' : score >= 75 ? 'good' : score >= 60 ? 'warning' : 'danger';
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
          <div class="dimension-card">
            <div class="dimension-name">${names[key] || key}</div>
            <div class="dimension-score ${scoreClass}">${score}</div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${score}%; background: var(--${scoreClass === 'excellent' ? 'success' : scoreClass === 'good' ? 'primary' : scoreClass})"></div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
    
    ${this._renderIssuesSection(data.issues)}
    ${this._renderRecommendationsSection(data.recommendations)}
    `;
  }

  /**
   * 渲染功能健康报告内容
   */
  _renderFunctionHealthContent(data) {
    const summary = data.summary || {};
    const dimensions = data.dimensions || {};
    
    return `
    <div class="score-card">
      <div class="score-value">${summary.overallScore || 0}</div>
      <div class="score-label">${summary.healthLevel || '功能健康度'}</div>
    </div>
    
    <div class="section">
      <h2 class="section-title">三维度评估</h2>
      <div class="chart-container">
        <canvas id="radarChart"></canvas>
      </div>
    </div>
    
    <div class="section">
      <h2 class="section-title">维度得分</h2>
      <div class="dimension-grid">
        <div class="dimension-card">
          <div class="dimension-name">功能完整性</div>
          <div class="dimension-score ${this._getScoreClass(dimensions.completeness?.score)}">${dimensions.completeness?.score || 0}</div>
          <div style="color: var(--gray); font-size: 0.8rem; margin-top: 8px;">
            ${dimensions.completeness?.issues || 0} 个问题
          </div>
        </div>
        <div class="dimension-card">
          <div class="dimension-name">功能合理性</div>
          <div class="dimension-score ${this._getScoreClass(dimensions.rationality?.score)}">${dimensions.rationality?.score || 0}</div>
          <div style="color: var(--gray); font-size: 0.8rem; margin-top: 8px;">
            ${dimensions.rationality?.issues || 0} 个问题
          </div>
        </div>
        <div class="dimension-card">
          <div class="dimension-name">可用性</div>
          <div class="dimension-score ${this._getScoreClass(dimensions.usability?.score)}">${dimensions.usability?.score || 0}</div>
          <div style="color: var(--gray); font-size: 0.8rem; margin-top: 8px;">
            ${dimensions.usability?.issues || 0} 个问题
          </div>
        </div>
      </div>
    </div>
    
    ${this._renderIssuesSection(data.issues)}
    `;
  }

  /**
   * 渲染需求分析内容
   */
  _renderRequirementContent(data) {
    return `
    <div class="section">
      <h2 class="section-title">需求本质</h2>
      <p style="font-size: 1.1rem; color: #334155;">${data.coreProblem || '待分析'}</p>
    </div>
    
    <div class="section">
      <h2 class="section-title">用户价值</h2>
      <ul class="feature-list">
        <li class="feature-item">
          <div class="feature-title">主要价值</div>
          <div class="feature-desc">${data.userValue?.primary || '-'}</div>
        </li>
        ${(data.userValue?.secondary || []).map(v => `
        <li class="feature-item">
          <div class="feature-desc">${v}</div>
        </li>
        `).join('')}
      </ul>
    </div>
    
    <div class="section">
      <h2 class="section-title">业务价值</h2>
      <p><strong>影响指标:</strong> ${(data.businessValue?.metrics || []).join('、') || '-'}</p>
      <p style="margin-top: 8px;"><strong>预期影响:</strong> ${data.businessValue?.expectedImpact || '-'}</p>
    </div>
    
    <div class="section">
      <h2 class="section-title">风险评估</h2>
      <table class="issue-table">
        <thead>
          <tr>
            <th>风险</th>
            <th>概率</th>
            <th>应对措施</th>
          </tr>
        </thead>
        <tbody>
          ${(data.risks || []).map(r => `
          <tr>
            <td>${r.risk}</td>
            <td><span class="badge badge-${r.probability === '高' ? 'high' : r.probability === '中' ? 'medium' : 'low'}">${r.probability}</span></td>
            <td>${r.mitigation}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <div class="section">
      <h2 class="section-title">MVP范围</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <h3 style="color: var(--success); margin-bottom: 12px;">✅ 核心功能</h3>
          <ul class="feature-list">
            ${(data.mvp?.coreFeatures || []).map(f => `<li class="feature-item">${f}</li>`).join('')}
          </ul>
        </div>
        <div>
          <h3 style="color: var(--gray); margin-bottom: 12px;">⏳ 可延后</h3>
          <ul class="feature-list">
            ${(data.mvp?.canDefer || []).map(f => `<li class="feature-item">${f}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
    `;
  }

  /**
   * 渲染PRD内容
   */
  _renderPRDContent(data) {
    return `
    <div class="section">
      <h2 class="section-title">产品背景</h2>
      <p>${data.background?.problem || '-'}</p>
      <p style="margin-top: 8px; color: var(--success);"><strong>机会:</strong> ${data.background?.opportunity || '-'}</p>
    </div>
    
    <div class="section">
      <h2 class="section-title">产品目标</h2>
      <ul class="feature-list">
        ${(data.goals?.goals || []).map(g => `
        <li class="feature-item">
          <div class="feature-title">${g.goal}</div>
          <div class="feature-desc">指标: ${g.metric} | 目标: ${g.target}</div>
        </li>
        `).join('')}
      </ul>
    </div>
    
    <div class="section">
      <h2 class="section-title">功能需求</h2>
      <table class="issue-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>功能名称</th>
            <th>优先级</th>
            <th>描述</th>
          </tr>
        </thead>
        <tbody>
          ${(data.functionalRequirements || []).map(f => `
          <tr>
            <td>${f.id}</td>
            <td>${f.name}</td>
            <td><span class="badge badge-${f.priority === 'P0' ? 'high' : f.priority === 'P1' ? 'medium' : 'low'}">${f.priority}</span></td>
            <td>${f.description}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    `;
  }

  /**
   * 渲染竞品分析内容
   */
  _renderCompetitiveContent(data) {
    return `
    <div class="section">
      <h2 class="section-title">市场概览</h2>
      <p><strong>市场规模:</strong> ${data.marketOverview?.size || '-'}</p>
      <p><strong>增长率:</strong> ${data.marketOverview?.growth || '-'}</p>
      <p><strong>主要趋势:</strong> ${(data.marketOverview?.trends || []).join('、')}</p>
    </div>
    
    <div class="section">
      <h2 class="section-title">SWOT分析</h2>
      <div class="swot-grid">
        <div class="swot-card swot-strengths">
          <div class="swot-title">💪 优势 Strengths</div>
          <ul class="swot-list">
            ${(data.swot?.strengths || []).map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
        <div class="swot-card swot-weaknesses">
          <div class="swot-title">😔 劣势 Weaknesses</div>
          <ul class="swot-list">
            ${(data.swot?.weaknesses || []).map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
        <div class="swot-card swot-opportunities">
          <div class="swot-title">🚀 机会 Opportunities</div>
          <ul class="swot-list">
            ${(data.swot?.opportunities || []).map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
        <div class="swot-card swot-threats">
          <div class="swot-title">⚠️ 威胁 Threats</div>
          <ul class="swot-list">
            ${(data.swot?.threats || []).map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h2 class="section-title">差异化策略</h2>
      <div class="feature-item" style="border-left-color: var(--purple);">
        <div class="feature-title">${data.differentiation?.uniqueValue || '-'}</div>
        <div class="feature-desc">独特价值主张</div>
      </div>
      <ul class="feature-list" style="margin-top: 16px;">
        ${(data.differentiation?.competitiveAdvantages || []).map(a => `
        <li class="feature-item">${a}</li>
        `).join('')}
      </ul>
    </div>
    `;
  }

  /**
   * 渲染问题部分
   */
  _renderIssuesSection(issues) {
    if (!issues || issues.length === 0) return '';
    
    return `
    <div class="section">
      <h2 class="section-title">问题列表</h2>
      <table class="issue-table">
        <thead>
          <tr>
            <th>维度</th>
            <th>问题</th>
            <th>严重程度</th>
            <th>描述</th>
          </tr>
        </thead>
        <tbody>
          ${issues.slice(0, 20).map(issue => `
          <tr>
            <td>${issue.dimension || issue.category || '-'}</td>
            <td>${issue.item}</td>
            <td><span class="badge badge-${issue.severity === 'High' ? 'high' : 'medium'}">${issue.severity}</span></td>
            <td>${issue.description}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
  }

  /**
   * 渲染建议部分
   */
  _renderRecommendationsSection(recommendations) {
    if (!recommendations || recommendations.length === 0) return '';
    
    return `
    <div class="section">
      <h2 class="section-title">改进建议</h2>
      <ul class="feature-list">
        ${recommendations.slice(0, 10).map(r => `
        <li class="feature-item">
          <div class="feature-title">${r.action}</div>
          <div class="feature-desc">${r.description}</div>
        </li>
        `).join('')}
      </ul>
    </div>`;
  }

  /**
   * 渲染图表脚本
   */
  _renderCharts(type, data) {
    if (type === 'function-health') {
      return `
      <script>
        const ctx = document.getElementById('radarChart');
        if (ctx) {
          new Chart(ctx, {
            type: 'radar',
            data: {
              labels: ['完整性', '合理性', '可用性'],
              datasets: [{
                label: '健康度',
                data: [
                  ${data.dimensions?.completeness?.score || 0},
                  ${data.dimensions?.rationality?.score || 0},
                  ${data.dimensions?.usability?.score || 0}
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
                  max: 100
                }
              }
            }
          });
        }
      </script>`;
    }
    return '';
  }

  /**
   * 获取分数样式类
   */
  _getScoreClass(score) {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'warning';
    return 'danger';
  }

  /**
   * 保存报告到文件
   */
  saveToFile(html, outputPath) {
    fs.writeFileSync(outputPath, html, 'utf-8');
    console.log(`📄 HTML报告已生成: ${outputPath}`);
    return this;
  }
}

module.exports = { HTMLReporter };