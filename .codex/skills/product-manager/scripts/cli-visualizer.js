/**
 * 产品经理技能 - 命令行可视化
 * 在终端中使用进度条、表格、颜色等增强输出效果
 */

/**
 * ANSI颜色代码
 */
const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  
  // 前景色
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // 背景色
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

/**
 * 图标
 */
const ICONS = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  arrow: '→',
  bullet: '•',
  check: '✓',
  cross: '✗',
  star: '★',
  diamond: '◆',
  circle: '●',
  square: '■',
  progress: '█',
  progressEmpty: '░'
};

/**
 * 命令行可视化工具
 */
class CLIVisualizer {
  constructor() {
    this.terminalWidth = process.stdout.columns || 80;
  }

  /**
   * 清屏
   */
  clear() {
    console.log('\x1b[2J\x1b[H');
    return this;
  }

  /**
   * 打印标题
   */
  title(text, color = 'cyan') {
    const line = '═'.repeat(this.terminalWidth - 4);
    console.log(`\n${COLORS[color]}╔${line}╗${COLORS.reset}`);
    console.log(`${COLORS[color]}║${COLORS.bold}  ${text.padEnd(this.terminalWidth - 6)}  ${COLORS.reset}${COLORS[color]}║${COLORS.reset}`);
    console.log(`${COLORS[color]}╚${line}╝${COLORS.reset}\n`);
    return this;
  }

  /**
   * 打印副标题
   */
  subtitle(text, color = 'blue') {
    const line = '─'.repeat(text.length + 4);
    console.log(`\n${COLORS[color]}${line}${COLORS.reset}`);
    console.log(`${COLORS[color]}  ${text}  ${COLORS.reset}`);
    console.log(`${COLORS[color]}${line}${COLORS.reset}\n`);
    return this;
  }

  /**
   * 打印成功消息
   */
  success(text) {
    console.log(`${COLORS.green}${ICONS.success} ${text}${COLORS.reset}`);
    return this;
  }

  /**
   * 打印错误消息
   */
  error(text) {
    console.log(`${COLORS.red}${ICONS.error} ${text}${COLORS.reset}`);
    return this;
  }

  /**
   * 打印警告消息
   */
  warning(text) {
    console.log(`${COLORS.yellow}${ICONS.warning} ${text}${COLORS.reset}`);
    return this;
  }

  /**
   * 打印信息消息
   */
  info(text) {
    console.log(`${COLORS.blue}${ICONS.info} ${text}${COLORS.reset}`);
    return this;
  }

  /**
   * 打印列表项
   */
  item(text, indent = 0) {
    const spaces = '  '.repeat(indent);
    console.log(`${spaces}${COLORS.cyan}${ICONS.bullet}${COLORS.reset} ${text}`);
    return this;
  }

  /**
   * 打印键值对
   */
  keyValue(key, value, keyColor = 'cyan', valueColor = 'white') {
    console.log(`  ${COLORS[keyColor]}${key}:${COLORS.reset} ${COLORS[valueColor]}${value}${COLORS.reset}`);
    return this;
  }

  /**
   * 打印进度条
   */
  progressBar(percentage, label = '', width = 40) {
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    
    let color = COLORS.green;
    if (percentage < 60) color = COLORS.red;
    else if (percentage < 80) color = COLORS.yellow;
    
    const bar = `${color}${ICONS.progress.repeat(filled)}${COLORS.dim}${ICONS.progressEmpty.repeat(empty)}${COLORS.reset}`;
    const percentText = `${percentage}%`.padStart(4);
    
    process.stdout.write(`\r  ${label.padEnd(20)} [${bar}] ${COLORS.bold}${percentText}${COLORS.reset}`);
    return this;
  }

  /**
   * 打印进度条并换行
   */
  progressBarEnd() {
    console.log();
    return this;
  }

  /**
   * 打印分数卡片
   */
  scoreCard(title, score, maxScore = 100) {
    const percentage = Math.round((score / maxScore) * 100);
    let color = COLORS.green;
    let level = '优秀';
    
    if (percentage < 60) {
      color = COLORS.red;
      level = '危险';
    } else if (percentage < 75) {
      color = COLORS.yellow;
      level = '一般';
    } else if (percentage < 90) {
      color = COLORS.blue;
      level = '良好';
    }
    
    const boxWidth = 30;
    const line = '─'.repeat(boxWidth);
    
    console.log(`\n${color}┌${line}┐${COLORS.reset}`);
    console.log(`${color}│${COLORS.reset}  ${title.padEnd(boxWidth - 2)}${color}│${COLORS.reset}`);
    console.log(`${color}│${COLORS.reset}${' '.repeat(boxWidth)}${color}│${COLORS.reset}`);
    console.log(`${color}│${COLORS.reset}  ${COLORS.bold}${String(score).padStart(5)}/${maxScore}${COLORS.reset}  ${level.padEnd(8)}  ${color}│${COLORS.reset}`);
    console.log(`${color}│${COLORS.reset}${' '.repeat(boxWidth)}${color}│${COLORS.reset}`);
    
    // 迷你进度条
    const barWidth = boxWidth - 4;
    const filled = Math.round((percentage / 100) * barWidth);
    const bar = `${color}${'█'.repeat(filled)}${COLORS.dim}${'░'.repeat(barWidth - filled)}${COLORS.reset}`;
    console.log(`${color}│${COLORS.reset}  ${bar}  ${color}│${COLORS.reset}`);
    console.log(`${color}└${line}┘${COLORS.reset}\n`);
    
    return this;
  }

  /**
   * 打印表格
   */
  table(headers, rows, options = {}) {
    const colWidths = headers.map((h, i) => {
      const maxRowWidth = Math.max(...rows.map(r => String(r[i] || '').length));
      return Math.max(h.length, maxRowWidth);
    });
    
    const totalWidth = colWidths.reduce((a, b) => a + b, 0) + (colWidths.length * 3) + 1;
    const separator = '─'.repeat(totalWidth);
    
    // 表头
    console.log(`\n${COLORS.cyan}┌${separator}┐${COLORS.reset}`);
    
    const headerRow = headers.map((h, i) => {
      const width = colWidths[i];
      return ` ${COLORS.bold}${h.padEnd(width)}${COLORS.reset} `;
    }).join(`${COLORS.cyan}│${COLORS.reset}`);
    
    console.log(`${COLORS.cyan}│${COLORS.reset}${headerRow}${COLORS.cyan}│${COLORS.reset}`);
    console.log(`${COLORS.cyan}├${separator}┤${COLORS.reset}`);
    
    // 数据行
    rows.forEach((row, rowIndex) => {
      const dataRow = row.map((cell, i) => {
        const width = colWidths[i];
        const content = String(cell || '-');
        return ` ${content.padEnd(width)} `;
      }).join(`${COLORS.cyan}│${COLORS.reset}`);
      
      console.log(`${COLORS.cyan}│${COLORS.reset}${dataRow}${COLORS.cyan}│${COLORS.reset}`);
    });
    
    console.log(`${COLORS.cyan}└${separator}┘${COLORS.reset}\n`);
    
    return this;
  }

  /**
   * 打印维度分析
   */
  dimensions(title, items) {
    this.subtitle(title, 'magenta');
    
    items.forEach(item => {
      const score = item.score || 0;
      const status = item.status || this._getStatusFromScore(score);
      const statusIcon = this._getStatusIcon(status);
      const statusColor = this._getStatusColor(status);
      
      console.log(`  ${statusColor}${statusIcon}${COLORS.reset} ${item.name.padEnd(15)} ${COLORS.dim}|${COLORS.reset} ${statusColor}${score}分${COLORS.reset}`);
      
      if (item.description) {
        console.log(`    ${COLORS.dim}${item.description}${COLORS.reset}`);
      }
    });
    
    return this;
  }

  /**
   * 打印问题列表
   */
  issues(issues, maxDisplay = 10) {
    this.subtitle('问题列表', 'yellow');
    
    const displayIssues = issues.slice(0, maxDisplay);
    
    displayIssues.forEach((issue, i) => {
      const severity = issue.severity || 'Medium';
      const icon = severity === 'High' ? ICONS.cross : ICONS.warning;
      const color = severity === 'High' ? COLORS.red : COLORS.yellow;
      
      console.log(`\n  ${color}${icon} [${severity}]${COLORS.reset} ${issue.item || issue.description}`);
      if (issue.description && issue.item) {
        console.log(`    ${COLORS.dim}${issue.description}${COLORS.reset}`);
      }
    });
    
    if (issues.length > maxDisplay) {
      console.log(`\n  ${COLORS.dim}... 还有 ${issues.length - maxDisplay} 个问题${COLORS.reset}`);
    }
    
    return this;
  }

  /**
   * 打印建议列表
   */
  recommendations(recommendations, maxDisplay = 5) {
    this.subtitle('改进建议', 'green');
    
    recommendations.slice(0, maxDisplay).forEach((rec, i) => {
      const priority = rec.priority || 'Medium';
      const color = priority === 'High' ? COLORS.red : priority === 'Medium' ? COLORS.yellow : COLORS.blue;
      
      console.log(`\n  ${COLORS.green}${ICONS.arrow}${COLORS.reset} ${rec.action || rec.suggestion}`);
      if (rec.description) {
        console.log(`    ${COLORS.dim}${rec.description}${COLORS.reset}`);
      }
    });
    
    return this;
  }

  /**
   * 打印工作流步骤
   */
  workflowStep(stepName, status, output = null) {
    const icons = {
      pending: `${COLORS.dim}○${COLORS.reset}`,
      running: `${COLORS.yellow}◐${COLORS.reset}`,
      completed: `${COLORS.green}●${COLORS.reset}`,
      failed: `${COLORS.red}●${COLORS.reset}`
    };
    
    const icon = icons[status] || icons.pending;
    console.log(`  ${icon} ${stepName}`);
    
    if (output && status === 'completed') {
      console.log(`    ${COLORS.dim}└─ ${JSON.stringify(output).substring(0, 60)}...${COLORS.reset}`);
    }
    
    return this;
  }

  /**
   * 打印分隔线
   */
  divider(char = '─', color = 'dim') {
    console.log(`${COLORS[color]}${char.repeat(this.terminalWidth)}${COLORS.reset}`);
    return this;
  }

  /**
   * 打印空行
   */
  blank(count = 1) {
    for (let i = 0; i < count; i++) {
      console.log();
    }
    return this;
  }

  /**
   * 打印统计摘要
   */
  summary(data) {
    this.subtitle('统计摘要', 'cyan');
    
    Object.entries(data).forEach(([key, value]) => {
      this.keyValue(key, value);
    });
    
    return this;
  }

  /**
   * 从分数获取状态
   */
  _getStatusFromScore(score) {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'warning';
    return 'danger';
  }

  /**
   * 获取状态图标
   */
  _getStatusIcon(status) {
    const icons = {
      excellent: ICONS.star,
      good: ICONS.check,
      warning: ICONS.warning,
      danger: ICONS.cross,
      passed: ICONS.check,
      failed: ICONS.cross
    };
    return icons[status] || ICONS.bullet;
  }

  /**
   * 获取状态颜色
   */
  _getStatusColor(status) {
    const colors = {
      excellent: COLORS.green,
      good: COLORS.blue,
      warning: COLORS.yellow,
      danger: COLORS.red,
      passed: COLORS.green,
      failed: COLORS.red
    };
    return colors[status] || COLORS.white;
  }
}

// 创建全局实例
const cli = new CLIVisualizer();

module.exports = { CLIVisualizer, cli, COLORS, ICONS };