/**
 * 产品经理技能 - Markdown报告增强模块
 * 生成更丰富的Markdown报告，包含Mermaid图表
 */

/**
 * Markdown报告生成器
 */
class MarkdownReporter {
  constructor() {
    this.content = [];
  }

  /**
   * 添加标题
   */
  heading(text, level = 1) {
    this.content.push(`${'#'.repeat(level)} ${text}\n`);
    return this;
  }

  /**
   * 添加段落
   */
  paragraph(text) {
    this.content.push(`${text}\n`);
    return this;
  }

  /**
   * 添加列表
   */
  list(items, ordered = false) {
    items.forEach((item, i) => {
      const prefix = ordered ? `${i + 1}.` : '-';
      this.content.push(`${prefix} ${item}\n`);
    });
    this.content.push('\n');
    return this;
  }

  /**
   * 添加表格
   */
  table(headers, rows) {
    const headerRow = `| ${headers.join(' | ')} |`;
    const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
    const dataRows = rows.map(row => `| ${row.join(' | ')} |`);
    
    this.content.push(headerRow);
    this.content.push(separatorRow);
    dataRows.forEach(row => this.content.push(row));
    this.content.push('\n');
    
    return this;
  }

  /**
   * 添加徽章
   */
  badge(text, type = 'info') {
    const colors = {
      success: 'brightgreen',
      warning: 'yellow',
      danger: 'red',
      info: 'blue',
      purple: 'purple'
    };
    const color = colors[type] || colors.info;
    this.content.push(`![${text}](https://img.shields.io/badge/${text}-${color}) `);
    return this;
  }

  /**
   * 添加引用块
   */
  quote(text) {
    this.content.push(`> ${text}\n\n`);
    return this;
  }

  /**
   * 添加代码块
   */
  code(code, language = '') {
    this.content.push(`\`\`\`${language}\n${code}\n\`\`\`\n`);
    return this;
  }

  /**
   * 添加分隔线
   */
  divider() {
    this.content.push('\n---\n\n');
    return this;
  }

  /**
   * 添加Mermaid图表 - 饼图
   */
  pieChart(title, data) {
    const chart = `\`\`\`mermaid
pie title ${title}
${data.map(d => `  "${d.label}" : ${d.value}`).join('\n')}
\`\`\`\n`;
    this.content.push(chart);
    return this;
  }

  /**
   * 添加Mermaid图表 - 雷达图（用条形图模拟）
   */
  radarChart(title, dimensions) {
    const chart = `\`\`\`mermaid
graph TD
  subgraph ${title}
${dimensions.map((d, i) => `    D${i}["${d.name}: ${d.value}分"]`).join('\n')}
  end
\`\`\`\n`;
    this.content.push(chart);
    return this;
  }

  /**
   * 添加Mermaid图表 - 进度条
   */
  progressBar(label, percentage, color = 'green') {
    const filled = Math.round(percentage / 10);
    const empty = 10 - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    this.content.push(`**${label}** \`${bar}\` **${percentage}%**\n`);
    return this;
  }

  /**
   * 添加Mermaid图表 - 流程图
   */
  flowchart(title, steps) {
    const chart = `\`\`\`mermaid
graph LR
${steps.map((step, i) => {
  const nextStep = steps[i + 1];
  if (nextStep) {
    return `  ${this._sanitizeId(step)}["${step}"] --> ${this._sanitizeId(nextStep)}["${nextStep}"]`;
  }
  return '';
}).filter(Boolean).join('\n')}
\`\`\`\n`;
    this.content.push(chart);
    return this;
  }

  /**
   * 添加Mermaid图表 - 时间线
   */
  timeline(title, events) {
    const chart = `\`\`\`mermaid
gantt
  title ${title}
  dateFormat  YYYY-MM-DD
${events.map((e, i) => {
  const date = e.date || `2024-01-${String(i + 1).padStart(2, '0')}`;
  return `  section ${e.section || 'Phase'}
  ${e.name} :${e.status || 'active'}, ${date}, ${e.duration || '1d'}`;
}).join('\n')}
\`\`\`\n`;
    this.content.push(chart);
    return this;
  }

  /**
   * 添加Mermaid图表 - 思维导图
   */
  mindmap(title, branches) {
    const chart = `\`\`\`mermaid
mindmap
  root((${title}))
${branches.map(b => this._renderMindmapBranch(b, 2)).join('\n')}
\`\`\`\n`;
    this.content.push(chart);
    return this;
  }

  /**
   * 渲染思维导图分支
   */
  _renderMindmapBranch(branch, indent) {
    const spaces = '  '.repeat(indent);
    let result = `${spaces}${branch.name}`;
    
    if (branch.children && branch.children.length > 0) {
      result += '\n' + branch.children.map(c => 
        this._renderMindmapBranch(c, indent + 1)
      ).join('\n');
    }
    
    return result;
  }

  /**
   * 添加Mermaid图表 - 状态图
   */
  stateDiagram(title, states) {
    const chart = `\`\`\`mermaid
stateDiagram-v2
  [*] --> ${states[0]?.name || 'Start'}
${states.map((s, i) => {
  const next = states[i + 1];
  if (next) {
    return `  ${s.name} --> ${next.name} : ${s.transition || ''}`;
  }
  return `  ${s.name} --> [*]`;
}).join('\n')}
\`\`\`\n`;
    this.content.push(chart);
    return this;
  }

  /**
   * 添加SWOT分析图
   */
  swotDiagram(strengths, weaknesses, opportunities, threats) {
    this.content.push(`
| 优势 Strengths | 劣势 Weaknesses |
|:---|:---|
| ${strengths.map(s => `✅ ${s}`).join('<br>')} | ${weaknesses.map(w => `❌ ${w}`).join('<br>')} |

| 机会 Opportunities | 威胁 Threats |
|:---|:---|
| ${opportunities.map(o => `🚀 ${o}`).join('<br>')} | ${threats.map(t => `⚠️ ${t}`).join('<br>')} |

`);
    return this;
  }

  /**
   * 添加健康度仪表盘
   */
  healthDashboard(score, dimensions) {
    this.heading('📊 健康度仪表盘', 2);
    
    // 总分
    const color = score >= 90 ? 'brightgreen' : score >= 75 ? 'green' : score >= 60 ? 'yellow' : 'red';
    this.content.push(`\n### 总体评分\n\n![Score](https://img.shields.io/badge/健康度-${score}分-${color}?style=for-the-badge)\n\n`);
    
    // 维度进度条
    this.content.push('### 维度详情\n\n');
    dimensions.forEach(d => {
      this.progressBar(d.name, d.score);
    });
    
    return this;
  }

  /**
   * 添加问题卡片
   */
  issueCard(issue) {
    const severityEmoji = issue.severity === 'High' ? '🔴' : issue.severity === 'Medium' ? '🟡' : '🔵';
    this.content.push(`
<details>
<summary>${severityEmoji} ${issue.item || issue.description}</summary>

**严重程度**: ${issue.severity}  
**维度**: ${issue.dimension || issue.category}  
**描述**: ${issue.description}

</details>
`);
    return this;
  }

  /**
   * 添加折叠区域
   */
  collapsible(title, content) {
    this.content.push(`
<details>
<summary>${title}</summary>

${content}

</details>
`);
    return this;
  }

  /**
   * 生成需求分析报告
   */
  generateRequirementReport(data) {
    this.heading('📋 需求分析报告', 1)
      .divider()
      .heading('需求本质', 2)
      .paragraph(data.coreProblem || '待分析')
      .heading('用户价值', 2);
    
    if (data.userValue?.primary) {
      this.paragraph(`**主要价值**: ${data.userValue.primary}`);
    }
    if (data.userValue?.secondary?.length) {
      this.list(data.userValue.secondary);
    }
    
    if (data.risks?.length) {
      this.heading('风险评估', 2)
        .table(['风险', '概率', '应对措施'], 
          data.risks.map(r => [r.risk, r.probability, r.mitigation]));
    }
    
    if (data.mvp) {
      this.heading('MVP范围', 2)
        .paragraph('**核心功能**:')
        .list(data.mvp.coreFeatures || [])
        .paragraph('**可延后**:')
        .list(data.mvp.canDefer || []);
    }
    
    return this.build();
  }

  /**
   * 生成项目健康报告
   */
  generateProjectHealthReport(data) {
    const dimensions = Object.entries(data.dimensions || {}).map(([key, value]) => ({
      name: this._getDimensionName(key),
      score: value?.score || 0
    }));
    
    this.heading('🏥 项目健康检测报告', 1)
      .divider()
      .healthDashboard(data.summary?.healthScore || 0, dimensions);
    
    if (data.issues?.length) {
      this.heading('⚠️ 问题列表', 2);
      data.issues.slice(0, 10).forEach(issue => this.issueCard(issue));
    }
    
    if (data.recommendations?.length) {
      this.heading('💡 改进建议', 2)
        .list(data.recommendations.slice(0, 5).map(r => r.action));
    }
    
    return this.build();
  }

  /**
   * 构建最终Markdown
   */
  build() {
    return this.content.join('');
  }

  /**
   * 清空内容
   */
  reset() {
    this.content = [];
    return this;
  }

  /**
   * 保存到文件
   */
  saveToFile(outputPath) {
    const fs = require('fs');
    fs.writeFileSync(outputPath, this.build(), 'utf-8');
    console.log(`📄 Markdown报告已生成: ${outputPath}`);
    return this;
  }

  /**
   * 辅助方法
   */
  _sanitizeId(text) {
    return text.replace(/[^a-zA-Z0-9]/g, '_');
  }

  _getDimensionName(key) {
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
    return names[key] || key;
  }
}

module.exports = { MarkdownReporter };