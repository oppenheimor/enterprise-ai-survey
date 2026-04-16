# Design Kungfu Skill - 独立离线版

> 🥋 智能设计推荐 Skill - 从 130+ 设计风格中智能匹配最佳方案

## ✨ 特性

- ✅ **完全离线** - 127 个风格数据内置，无需网络
- ✅ **智能匹配** - 基于产品类型、目标用户、品牌调性推荐
- ✅ **多维评分** - 每个推荐都有详细的评分和理由
- ✅ **设计系统** - 完整的 Design Tokens + 组件配方
- ✅ **开箱即用** - 支持 shadcn/ui + Tailwind CSS

## 📦 包内容

```
design-kungfu/
├── SKILL.md           # 主技能文件
├── database.js        # 产品类型映射数据
├── styles/            # 127 个风格的设计系统
│   ├── minimalist-flat.md
│   ├── apple-style.md
│   ├── neo-brutalist.md
│   ├── glassmorphism.md
│   └── ... (127个)
└── README.md          # 本文件
```

## 🚀 安装方法

### 方法 1: 全局安装（推荐）

```bash
# 复制到全局 skills 目录
cp -r design-kungfu ~/.agents/skills/design-kungfu

# 创建符号链接
ln -sf ~/.agents/skills/design-kungfu ~/.claude/skills/design-kungfu
```

### 方法 2: 项目内使用

```bash
# 复制到项目目录
cp -r design-kungfu ./design-kungfu

# 在 .claude/rules 中创建引用
mkdir -p .claude/rules
echo "参见 design-kungfu/SKILL.md" > .claude/rules/design-kungfu.md
```

### 方法 3: 直接使用

直接将 `SKILL.md` 的内容复制到对话中即可。

## 💡 使用示例

```
用户: 帮我设计一个 SaaS 产品的界面

AI: 🔍 让我了解一下你的项目：

1. 产品类型：[SaaS / 电商 / Fintech / 教育科技 / 开发者工具 / 其他]
2. 目标用户：[企业用户 / 消费者 / 开发者 / 创意人士]
3. 品牌调性：[专业 / 活泼 / 奢华 / 极简 / 大胆]
4. 主要设备：[桌面端 / 移动端 / 全平台]
5. 特殊要求：[无障碍优先 / 深色模式 / 性能优先]

[用户回答后]

AI: ┌─────────────────────────────────────────────────────────────┐
    │  🥋 DESIGN KUNGFU 设计推荐                                  │
    ├─────────────────────────────────────────────────────────────┤
    │  🏆 最佳匹配                                                │
    │  Style: Minimalist Flat                                     │
    │  匹配度: 92/100                                              │
    │  理由: 极简风格与 SaaS 产品高度契合，清爽专业                │
    └─────────────────────────────────────────────────────────────┘

[用户确认后，AI 会读取对应的设计系统并提供完整实现指南]
```

## 📚 支持的风格 (127个)

### 极简/清爽系列
- Minimalist Flat (极简平面)
- Soft UI (柔和 UI)
- Corporate Clean (企业清爽)
- Swiss Style (瑞士风格)
- Apple Style (Apple 风格)
- Notion Style (Notion 风格)

### 新粗野主义系列
- Neo-Brutalist (新粗野主义)
- Neo-Brutalist Playful (趣味粗野)
- Brutalist Web (粗野网页)

### 形态系列
- Neumorphism (新拟态)
- Glassmorphism (玻璃拟态)
- Claymorphism (粘土拟态)
- Skeuomorphism (拟物化)

### 现代/科技系列
- Dark Mode (深色模式)
- Cyberpunk Neon (赛博朋克)
- Modern Gradient (现代渐变)

### 布局模式
- Bento Grid (Bento 网格)
- Card Stack (卡片堆叠)
- Dashboard Layout (仪表板布局)
- Split Screen (分屏布局)
- Masonry Flow (瀑布流)

> 运行 `ls styles/` 查看所有 127 个风格

## 🎯 产品类型推荐

| 产品类型 | 推荐风格 |
|---------|---------|
| SaaS | Minimalist Flat, Glassmorphism |
| 电商 | Corporate Clean, Apple Style |
| Fintech | Corporate Clean, Minimalist |
| 医疗 | Soft UI, Minimalist |
| 教育科技 | Soft UI, Bento Grid |
| 开发工具 | Dark Mode, Minimalist |
| AI/ML | Glassmorphism, Dark Mode |
| Web3 | Dark Mode, Cyberpunk |
| 游戏 | Cyberpunk, Dark Mode |

## 🛠️ 技术栈

- **框架**: Next.js 16 (App Router)
- **组件库**: shadcn/ui
- **样式**: Tailwind CSS 4
- **动画**: Framer Motion

## 📄 许可

本 Skill 基于 StyleKit 的设计数据构建。

- StyleKit: https://www.stylekit.top/zh
- 原始数据: GitHub (AnxForever/stylekit)

## 📝 更新日志

### v1.0.0-standalone (2026-04-03)
- ✨ 首次发布独立离线版
- ✅ 内置 127 个风格数据
- ✅ 完全离线可用
- ✅ 支持相对路径访问

---

**Made with ❤️ by CoCo 🐙**
