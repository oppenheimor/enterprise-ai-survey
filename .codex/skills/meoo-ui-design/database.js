/**
 * Design Kungfu Style Database
 *
 * 基于 StyleKit 的精简风格数据库，用于智能设计推荐
 * Data source: https://github.com/AnxForever/stylekit
 *
 * 获取完整风格 SKILL.md：
 * GET https://www.stylekit.top/api/styles/[slug]/skill-pack
 */

// ==================== 产品类型映射 ====================

const PRODUCT_TYPE_STYLES = {
  "saas": {
    primary: ["minimalist-flat", "glassmorphism", "soft-ui"],
    secondary: ["corporate-clean", "bento-grid", "apple-style"],
    reasoning: "SaaS 产品需要专业、可信赖的设计，极简风格减少认知负担"
  },
  "micro-saas": {
    primary: ["minimalist-flat", "soft-ui"],
    secondary: ["bento-grid", "neo-brutalist-playful"],
    reasoning: "微型 SaaS 需要快速传达价值，单一强调色 + 极简布局最有效"
  },
  "ecommerce": {
    primary: ["corporate-clean", "minimalist-flat"],
    secondary: ["apple-style", "soft-ui", "card-stack"],
    reasoning: "电商需要突出产品，干净的卡片布局和清晰的 CTA 最重要"
  },
  "fintech": {
    primary: ["corporate-clean", "minimalist-flat"],
    secondary: ["glassmorphism", "dark-mode"],
    reasoning: "金融科技需要传达信任和稳定，专业配色和清晰层级是关键"
  },
  "healthcare": {
    primary: ["soft-ui", "minimalist-flat"],
    secondary: ["corporate-clean", "apple-style"],
    reasoning: "医疗健康需要平易近人，柔和的圆角和镇静的配色最佳"
  },
  "edtech": {
    primary: ["soft-ui", "bento-grid"],
    secondary: ["neo-brutalist-playful", "minimalist-flat"],
    reasoning: "教育科技需要友好且结构化，适度的趣味性保持参与度"
  },
  "devtools": {
    primary: ["dark-mode", "minimalist-flat"],
    secondary: ["neo-brutalist", "cyberpunk-neon"],
    reasoning: "开发者工具偏好深色模式和代码友好的等宽字体"
  },
  "ai-ml": {
    primary: ["glassmorphism", "dark-mode"],
    secondary: ["cyberpunk-neon", "aurora-ui"],
    reasoning: "AI/ML 产品常用未来感设计，渐变和模糊效果传达科技感"
  },
  "web3": {
    primary: ["dark-mode", "cyberpunk-neon"],
    secondary: ["glassmorphism", "neo-brutalist"],
    reasoning: "Web3 常用深色主题和霓虹强调色，传达去中心化和未来感"
  },
  "gaming": {
    primary: ["cyberpunk-neon", "dark-mode"],
    secondary: ["neo-brutalist", "comic-style"],
    reasoning: "游戏产品偏好大胆对比和动态效果"
  },
  "portfolio": {
    primary: ["minimalist-flat", "editorial"],
    secondary: ["bento-grid", "art-deco"],
    reasoning: "个人作品集需要突出内容，留白和排版是关键"
  },
  "blog": {
    primary: ["editorial", "minimalist-flat"],
    secondary: ["swiss-style", "apple-style"],
    reasoning: "博客需要注重阅读体验，排版驱动的设计最佳"
  },
  "dashboard": {
    primary: ["bento-grid", "dashboard-layout"],
    secondary: ["corporate-clean", "minimalist-flat"],
    reasoning: "仪表板需要信息密度和清晰层级，网格布局最实用"
  }
};

// ==================== 品牌调性映射 ====================

const BRAND_MOOD_STYLES = {
  "professional": {
    styles: ["corporate-clean", "minimalist-flat", "editorial"],
    keywords: ["专业", "信任", "稳定", "企业"],
    colors: ["blue", "gray", "navy"]
  },
  "playful": {
    styles: ["neo-brutalist-playful", "bento-grid", "soft-ui"],
    keywords: ["活泼", "有趣", "友好", "色彩"],
    colors: ["pink", "yellow", "cyan", "orange"]
  },
  "luxury": {
    styles: ["glassmorphism", "editorial", "neumorphism"],
    keywords: ["奢华", "优雅", "精致", "高级"],
    colors: ["gold", "black", "cream", "burgundy"]
  },
  "minimal": {
    styles: ["minimalist-flat", "bento-grid", "corporate-clean"],
    keywords: ["极简", "简洁", "清晰", "功能"],
    colors: ["black", "white", "gray", "beige"]
  },
  "bold": {
    styles: ["neo-brutalist", "cyberpunk-neon", "neo-brutalist-playful"],
    keywords: ["大胆", "强烈", "对比", "冲击"],
    colors: ["neon", "high-contrast", "black", "white"]
  }
};

// ==================== 受众映射 ====================

const AUDIENCE_STYLES = {
  "enterprise": {
    styles: ["corporate-clean", "minimalist-flat", "editorial"],
    considerations: "注重专业性、可扩展性和可维护性"
  },
  "consumer": {
    styles: ["soft-ui", "glassmorphism", "bento-grid"],
    considerations: "注重易用性和视觉吸引力"
  },
  "developer": {
    styles: ["dark-mode", "neo-brutalist", "minimalist-flat", "bento-grid"],
    considerations: "偏好深色模式、代码友好、信息密度"
  },
  "creative": {
    styles: ["neo-brutalist-playful", "glassmorphism", "editorial"],
    considerations: "注重视觉表现和创意灵活性"
  }
};

module.exports = {
  PRODUCT_TYPE_STYLES,
  BRAND_MOOD_STYLES,
  AUDIENCE_STYLES
};
