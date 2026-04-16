---
name: design-kungfu
description: 智能设计推荐 Skill - 分析用户 Web 应用需求，从 130+ 设计风格中智能匹配最佳方案，提供完整设计系统和 shadcn/ui 开发指南
---

# Design Kungfu Skill 🥋

> 你的设计功夫，招式精湛，功力深厚

## 简介

Design Kungfu 是一个智能设计推荐 Skill，它能够：

1. **分析需求** - 理解你的 Web 应用类型、目标用户、品牌调性
2. **智能匹配** - 从 StyleKit 的 130+ 设计风格中找到最适合的选项
3. **多维推荐** - 提供多个设计方案供选择，每个都有评分和理由
4. **设计系统** - 选中后提供完整的设计规范和开发指南
5. **框架友好** - 默认推荐 shadcn/ui + Tailwind CSS 实现
6. **完全离线** - 所有 127 个风格数据内置，无需网络

## 触发方式

当用户说以下内容时触发：
- "帮我设计一个..."
- "给我推荐设计风格"
- "这个产品用什么设计风格好"
- "设计建议"
- "Design recommendation"
- 或用户提供任何 Web 应用需求时主动提供设计建议

## 安装方法

### 方式 1: 作为全局 Skill 安装

```bash
# 复制整个 skill 目录到全局 skills 目录
cp -r design-kungfu ~/.agents/skills/design-kungfu

# 创建符号链接以便自动加载
ln -sf ~/.agents/skills/design-kungfu ~/.claude/skills/design-kungfu
```

### 方式 2: 在项目中使用

```bash
# 将整个 skill 目录复制到项目
cp -r design-kungfu ./design-kungfu

# 在项目的 .claude/rules 中创建引用
echo "参见 design-kungfu/SKILL.md" > .claude/rules/design-kungfu.md
```

### 方式 3: 直接在当前会话使用

直接将 `SKILL.md` 内容加载到对话即可使用。

## 目录结构

```
design-kungfu/
├── SKILL.md           # 主文件（本文件）
├── database.js        # 产品类型映射数据
├── styles/            # 127 个风格的设计系统文档
│   ├── minimalist-flat.md
│   ├── apple-style.md
│   ├── neo-brutalist.md
│   ├── glassmorphism.md
│   └── ...
└── README.md          # 本说明文件
```

## 工作流程

### 第一步：需求分析

向用户询问以下关键信息（如果没有明确提供）：

```
🔍 让我了解一下你的项目：

1. 产品类型：[SaaS / 电商 / Fintech / 教育科技 / 开发者工具 / 其他]
2. 目标用户：[企业用户 / 消费者 / 开发者 / 创意人士]
3. 品牌调性：[专业 / 活泼 / 奢华 / 极简 / 大胆]
4. 主要设备：[桌面端 / 移动端 / 全平台]
5. 特殊要求：[无障碍优先 / 深色模式 / 性能优先]
```

### 第二步：风格匹配

基于用户回答，使用以下评分系统匹配风格：

| 维度 | 权重 | 评分规则 |
|------|------|----------|
| 产品类型匹配 | 30% | 检查 style keywords 与产品类型的相关性 |
| 品牌调性匹配 | 25% | 检查 style category 与 mood 的匹配度 |
| 目标受众匹配 | 20% | 检查 style 是否适合目标人群 |
| 设备适配 | 15% | 检查 style 在主设备上的表现 |
| 技术约束 | 10% | 检查 performance/a11y 优先级 |

### 第三步：推荐展示

以表格形式展示 Top 5 推荐：

```
┌─────────────────────────────────────────────────────────────────┐
│  🥋 DESIGN KUNGFU 设计推荐                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🏆 最佳匹配                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━        │
│  Style: Minimalist Flat                                         │
│  匹配度: 92/100                                                  │
│  理由: 极简风格与 SaaS 产品高度契合，清爽专业                    │
│                                                                 │
│  📊 完整评分                                                    │
│  • 产品类型: ★★★★★ (30/30)                                     │
│  • 品牌调性: ★★★★☆ (20/25)                                     │
│  • 目标受众: ★★★★★ (20/20)                                     │
│  • 设备适配: ★★★★☆ (12/15)                                     │
│  • 技术约束: ★★★★★ (10/10)                                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  🔄 其他推荐                                                    │
│                                                                 │
│  2. Corporate Clean        88/100  企业级专业选择               │
│  3. Soft UI                82/100  友好亲和                    │
│  4. Bento Grid             78/100  现代卡片布局                 │
│  5. Glassmorphism          72/100  时尚但性能稍重               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 第四步：风格详情

用户选择某个风格后，从本地 `styles/` 目录读取对应的设计系统文档：

```bash
# 所有风格都在 styles/ 目录下
# 使用相对路径读取
cat styles/[slug].md

# 例如读取 Neo-Brutalist 风格
cat styles/neo-brutalist.md
```

**每个风格的 SKILL.md 包含**：
- **设计理念** - 风格的哲学和原则
- **Design Tokens** - 精确的 Tailwind class 映射（边框、阴影、排版、间距、配色）
- **组件配方** - Button, Card, Input 等组件的参数化模板
- **禁用模式** - 必须避免的 class 和模式
- **Do's & Don'ts** - 具体的设计规则

### 第五步：开发指导

提供基于 shadcn/ui 的实现建议：

```markdown
## 开发指南

### 推荐技术栈
- **框架**: Next.js 16 (App Router)
- **组件库**: shadcn/ui
- **样式**: Tailwind CSS 4
- **动画**: Framer Motion

### 安装步骤
```bash
# 1. 创建项目
npx create-next-app@latest my-app --typescript --tailwind --app

# 2. 初始化 shadcn/ui
npx shadcn@latest init

# 3. 安装推荐组件
npx shadcn@latest add button card input dialog dropdown-menu
```

### Tailwind 配置
```js
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: { ... },
        secondary: { ... },
      },
      borderRadius: {
        lg: "var(--radius)",
      },
    },
  },
}
export default config
```

### 页面模板
```
/src
  /app
    /layout.tsx      # 全局布局
    /page.tsx        # 首页
    /globals.css     # 全局样式
  /components
    /ui              # shadcn 组件
    /features        # 业务组件
```
```

## 风格数据库

### 📚 完整风格列表（127个）

所有风格都在 `styles/` 目录下，完全离线可用：

**极简/清爽系列**
| Slug | 中文名 | 文件 |
|------|--------|-----|
| `minimalist-flat` | 极简平面 | `styles/minimalist-flat.md` |
| `soft-ui` | 柔和 UI | `styles/soft-ui.md` |
| `corporate-clean` | 企业清爽 | `styles/corporate-clean.md` |
| `swiss-style` | 瑞士风格 | `styles/swiss-style.md` |
| `apple-style` | Apple 风格 | `styles/apple-style.md` |
| `notion-style` | Notion 风格 | `styles/notion-style.md` |

**新粗野主义系列**
| Slug | 中文名 | 文件 |
|------|--------|-----|
| `neo-brutalist` | 新粗野主义 | `styles/neo-brutalist.md` |
| `neo-brutalist-playful` | 趣味粗野 | `styles/neo-brutalist-playful.md` |
| `brutalist-web` | 粗野网页 | `styles/brutalist-web.md` |

**形态系列**
| Slug | 中文名 | 文件 |
|------|--------|-----|
| `neumorphism` | 新拟态 | `styles/neumorphism.md` |
| `glassmorphism` | 玻璃拟态 | `styles/glassmorphism.md` |
| `claymorphism` | 粘土拟态 | `styles/claymorphism.md` |
| `skeuomorphism` | 拟物化 | `styles/skeuomorphism.md` |

**现代/科技系列**
| Slug | 中文名 | 文件 |
|------|--------|-----|
| `dark-mode` | 深色模式 | `styles/dark-mode.md` |
| `cyberpunk-neon` | 赛博朋克 | `styles/cyberpunk-neon.md` |
| `modern-gradient` | 现代渐变 | `styles/modern-gradient.md` |

**布局模式**
| Slug | 中文名 | 文件 |
|------|--------|-----|
| `bento-grid` | Bento 网格 | `styles/bento-grid.md` |
| `card-stack` | 卡片堆叠 | `styles/card-stack.md` |
| `dashboard-layout` | 仪表板布局 | `styles/dashboard-layout.md` |
| `split-screen` | 分屏布局 | `styles/split-screen.md` |
| `masonry-flow` | 瀑布流 | `styles/masonry-flow.md` |

> 💡 提示：运行 `ls styles/` 可查看所有 127 个风格

### 产品类型 → 推荐风格映射

| 产品类型 | 首选风格 | 备选风格 |
|----------|----------|----------|
| SaaS | Minimalist Flat, Glassmorphism | Soft UI, Corporate Clean |
| 微型 SaaS | Minimalist Flat, Playful | Bento Grid, Neo-Brutalist |
| 电商 | Corporate Clean, Minimalist | Apple Style, Soft UI |
| Fintech | Corporate Clean, Minimalist | Glassmorphism, Dark Mode |
| 医疗 | Soft UI, Minimalist | Corporate Clean, Apple Style |
| 教育科技 | Soft UI, Bento Grid | Neo-Brutalist Playful, Minimalist |
| 开发者工具 | Dark Mode, Minimalist | Neo-Brutalist, Cyberpunk |
| AI/ML 平台 | Glassmorphism, Dark Mode | Cyberpunk, Aurora |
| Web3/Crypto | Dark Mode, Cyberpunk | Glassmorphism, Neo-Brutalist |
| 游戏 | Cyberpunk, Dark Mode | Neo-Brutalist, Comic |

### 品牌调性 → 风格映射

| 调性 | 风格 | 关键词 |
|------|------|--------|
| 专业 | Corporate Clean, Editorial | 信任, 稳定, 专业 |
| 活泼 | Neo-Brutalist Playful, Bento Grid | 有趣, 色彩, 互动 |
| 奢华 | Glassmorphism, Editorial | 优雅, 精致, 留白 |
| 极简 | Minimalist Flat, Bento Grid | 简洁, 清晰, 功能 |
| 大胆 | Neo-Brutalist, Cyberpunk Neon | 强烈, 对比, 冲击 |

### 目标受众 → 风格映射

| 受众 | 推荐风格 | 考虑因素 |
|------|----------|----------|
| 开发者 | Neo-Brutalist, Minimalist, Bento Grid | 代码友好, 深色模式 |
| 创意人士 | Neo-Brutalist Playful, Glassmorphism | 视觉表现, 灵活性 |
| 企业 | Corporate Clean, Minimalist, Editorial | 专业, 可信 |
| 消费者 | Soft UI, Glassmorphism, Bento Grid | 友好, 易用 |

## 核心规则

1. **永远先问清需求** - 不做假设，确保理解产品类型、用户、调性
2. **提供多个选项** - 至少 3 个，最多 5 个推荐方案
3. **给出明确理由** - 每个推荐都要解释为什么适合
4. **评分透明** - 展示各维度的评分，让用户理解权衡
5. **优先 shadcn/ui** - 默认提供基于 shadcn/ui 的实现方案
6. **提供完整路径** - 从风格选择到代码实现的完整指导
7. **使用相对路径** - 所有风格文件通过 `styles/` 目录访问

## AI 规则

当生成设计相关代码时：

1. **精确使用 Tokens** - 不要近似或替换，使用确切的 class 名称
2. **避免禁用类** - 检查 forbidden lists，不使用被禁止的样式
3. **遵循组件配方** - 使用参数化模板，而非临时拼凑代码
4. **保持一致性** - 确保所有组件遵循同一视觉语言
5. **考虑响应式** - 设计必须在移动端、平板、桌面端保持一致体验
6. **确保可访问性** - 色彩对比度符合 WCAG 2.1 AA 标准

## 快速参考

### 推荐触发词检测

检测用户输入中是否包含：
- 设计相关词汇: "设计", "风格", "UI", "界面", "外观"
- 产品类型: "SaaS", "电商", "网站", "应用", "App"
- 评价词汇: "好看", "专业", "现代", "简洁"

### 默认假设（仅供快速场景）

如果用户只提供了产品名称，可以假设：
- **B2B/SaaS**: 专业调性, 企业用户, 桌面优先
- **消费者 App**: 活泼调性, 消费者, 移动优先
- **开发工具**: 极简调性, 开发者, 桌面优先
- **电商平台**: 专业调性, 消费者, 全平台

但始终向用户确认这些假设。

---

**Design Kungfu Skill** - 独立离线版

完整数据源: [StyleKit](https://www.stylekit.top/zh) | 130+ 设计风格

**版本**: 1.0.0-standalone
**发布日期**: 2026-04-03
**特点**: 完全离线，无需网络，127 个风格内置
