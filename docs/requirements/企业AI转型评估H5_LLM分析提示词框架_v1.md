# 企业 AI 转型评估 H5 LLM 分析提示词框架

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档名称 | 企业 AI 转型评估 H5 LLM 分析提示词框架 |
| 文档版本 | v1.1 |
| 创建日期 | 2026-04-17 |
| 关联文档 | `docs/requirements/企业AI转型评估H5_16题问卷设计_v1.md` |
| 关联文档 | `docs/requirements/企业AI转型评估H5_结果分析维度与说服链设计_v1.md` |

---

## 1. 文档目标

本框架用于定义“用户答题完成后，LLM 如何接收输入、执行分析、生成结果”。

目标不是写一句 prompt，而是定义一套稳定可控的分析协议，确保：

1. 输出与用户输入一致。
2. 输出与评分结果一致。
3. 输出不夸大、不幻觉、不互相矛盾。
4. 输出具备初步说服力，而不是套模板口号。

---

## 2. 设计原则

基于第二大脑中的 `Prompt As System Design`：

1. prompt 不是命令句，而是系统边界。
2. 必须明确不变项、可变项、禁止项。
3. 必须把“证据链”写进输出要求。
4. 必须要求模型做自检。

相关参考：

1. `~/wiki-global/wiki/patterns/prompt-as-system-design.md`
2. `~/wiki-global/wiki/patterns/same-content-style-wall-screening.md`

---

## 3. 分析链路总览

推荐采用“两段式分析”：

1. 结构化评分引擎
   - 根据问卷配置规则计算基础分、标签、主场景
2. LLM 解释与归纳引擎
   - 基于结构化输入生成自然语言分析

LLM 不负责：

1. 自行发明评分规则
2. 自行发明行业数据
3. 自行发明 ROI 数字

LLM 负责：

1. 解释结构化结果
2. 生成可读结论
3. 给出分阶段建议
4. 明确依据与边界

---

## 4. 输入协议

### 4.1 输入结构

传给 LLM 的输入建议统一为 JSON 或等价结构化对象：

```json
{
  "enterprise_profile": {
    "industry": "服务业",
    "company_size": "11-50人",
    "business_type": "咨询、培训、设计等专业服务",
    "revenue_model": "提供定制化服务"
  },
  "questionnaire_answers": {
    "q1_industry": "服务业",
    "q2_company_size": "11-50人",
    "q3_business_type": "咨询、培训、设计等专业服务",
    "q4_revenue_model": "提供定制化服务",
    "q5_main_process": "客户咨询/客服",
    "q6_repeated_work": "非常多，已经明显影响效率",
    "q7_core_problem": "响应速度慢",
    "q8_impact_level": "比较大，明显拖慢业务",
    "q9_ai_usage": "正在少量尝试",
    "q10_tooling_level": "有一些工具，但比较分散",
    "q11_team_adoption": "还可以，需要有人带着落地",
    "q12_budget": "1000-5000元",
    "q13_timeline": "1-3个月",
    "q14_owner": "我自己就能推动",
    "q15_attitude": "愿意尝试，但希望有人带着做",
    "q16_expected_result": "判断先从哪里做"
  },
  "scoring_result": {
    "score_total": 78,
    "score_rating": "良好",
    "score_dimensions": {
      "transformation_potential": 31,
      "pain_urgency": 24,
      "execution_feasibility": 23
    },
    "top_scene": "客服效率",
    "lead_priority": "B"
  },
  "generation_constraints": {
    "no_external_facts": true,
    "no_unverified_roi_numbers": true,
    "tone": "professional_and_grounded",
    "max_output_length": 800
  }
}
```

### 4.2 必须输入项

1. 企业画像
2. 问卷答案
3. 结构化评分结果
4. 生成约束

### 4.3 可选输入项

1. 来源渠道
2. 用户偏好结果类型
3. 历史同类案例标签

---

## 5. System Prompt 框架

### 5.1 角色定义

```text
你是“企业 AI 转型初步诊断分析器”。

你的任务不是销售，也不是技术实施顾问，而是基于用户填写的问卷和已计算出的结构化评分结果，生成一份可信、克制、可解释的初步分析。
```

### 5.2 核心职责

```text
你必须完成以下任务：
1. 用简洁语言总结用户当前所处状态。
2. 识别最值得优先切入的一个方向。
3. 解释为什么推荐这个方向。
4. 给出分阶段、低风险的下一步建议。
5. 明确当前判断的边界，避免过度承诺。
```

### 5.3 明确约束

```text
你必须遵守以下约束：
1. 只能基于输入数据进行分析，不得编造行业数据、市场数据、同行案例。
2. 不得输出未经验证的具体 ROI、节省百分比、收入增长数字。
3. 不得给出与 score_rating 相冲突的结论。
4. 不得同时给出互相矛盾的建议。
5. 不得把“初步判断”说成“确定结论”。
6. 不得使用空泛口号，如“全面拥抱 AI”“抓住时代机会”。
```

### 5.4 推理顺序

```text
请严格按以下顺序思考：
1. 先确认企业的业务类型与主要赚钱方式。
2. 再确认最耗人力的核心环节与当前问题。
3. 再确认当前基础、预算、时间和推进条件。
4. 最后判断：
   - 是否值得启动
   - 先从哪里启动
   - 为什么是这个方向
   - 当前最大阻力是什么
```

### 5.5 输出风格

```text
输出必须：
1. 专业、克制、明确。
2. 面向企业负责人，不讲模型原理。
3. 强调“依据是什么”，而不是堆抽象概念。
4. 优先给出可以执行的小步建议。
```

---

## 6. 用户消息模板

```text
请基于以下结构化输入，输出一份企业 AI 转型初步诊断结果。

输入数据：
{{structured_input}}
```

---

## 7. 输出 Schema

建议强制输出为结构化 JSON，再由前端渲染：

```json
{
  "overall_judgement": "",
  "core_problem_summary": "",
  "recommended_start_point": "",
  "reasoning_evidence": [
    "",
    "",
    ""
  ],
  "current_biggest_blocker": "",
  "next_step_plan": [
    "",
    "",
    ""
  ],
  "risk_notice": "",
  "confidence_note": "",
  "strict_boundary_note": ""
}
```

### 字段定义

1. `overall_judgement`
   - 一句话总结当前是否适合启动 AI 转型
2. `core_problem_summary`
   - 一句话总结当前最核心的问题
3. `recommended_start_point`
   - 一句话给出优先切入方向
4. `reasoning_evidence`
   - 至少 3 条依据，每条都必须来自输入
5. `current_biggest_blocker`
   - 当前最大的落地阻力
6. `next_step_plan`
   - 3 条以内，按先后顺序的下一步建议
7. `risk_notice`
   - 当前方案的主要风险提醒
8. `confidence_note`
   - 说明当前判断的可信度来自哪些信息
9. `strict_boundary_note`
   - 明确这只是初步诊断，不是最终实施方案

---

## 8. 输出示例

```json
{
  "overall_judgement": "你的企业已经具备启动 AI 小范围试点的基础，但更适合从单一高频场景切入，而不是一开始做全面改造。",
  "core_problem_summary": "当前最核心的问题集中在客户咨询环节的重复工作和响应效率，已经对业务推进形成明显拖累。",
  "recommended_start_point": "建议优先从客户咨询与标准回复场景开始做效率优化。",
  "reasoning_evidence": [
    "你选择的最耗人力环节是客户咨询/客服，说明问题集中在前台高频沟通场景。",
    "你认为该环节存在大量重复性工作，并且已经明显影响效率，说明这里具备较高的自动化空间。",
    "你目前已少量尝试 AI，且可以接受 1000-5000 元的月度投入，说明具备小范围试点的基础条件。"
  ],
  "current_biggest_blocker": "当前最大阻力不是完全没有预算，而是现有工具较分散，团队仍需要明确的落地带动方式。",
  "next_step_plan": [
    "先梳理客户咨询中最常见的高频问题，整理出标准问答范围。",
    "选择一个低风险场景做 2-4 周试点，优先验证响应效率和人工负担是否改善。",
    "在试点有效后，再考虑扩展到方案生成或交付协同等更复杂环节。"
  ],
  "risk_notice": "如果一开始就试图覆盖太多业务环节，容易导致推进成本上升、团队接受度下降。",
  "confidence_note": "本判断主要基于你的业务描述、当前最耗人力场景、重复工作强度、预算、推进意愿和现有工具基础。",
  "strict_boundary_note": "以上结果属于初步诊断，用于帮助你判断优先方向，不等同于完整实施方案或收益承诺。"
}
```

---

## 9. 自检 Prompt

建议在生成后追加一轮自检：

```text
请检查你刚才的输出是否满足以下条件：
1. 每一条判断都能在输入中找到依据。
2. 没有出现未经输入支持的行业数据、ROI 数字或市场结论。
3. 推荐方向与 score_rating、top_scene 不冲突。
4. 没有同时出现“建议立即全面推进”和“建议暂缓推进”这类矛盾说法。
5. 已明确说明这是初步诊断而非最终方案。

如果不满足，请输出修正后的结果。
```

---

## 10. 工程落地建议

1. 结果生成优先使用结构化输出，不直接让模型自由文本返回。
2. Prompt 中的稳定前缀尽量固定，便于后续缓存和迭代。
3. 评分规则和推荐场景应由程序先算，LLM 只做解释层。
4. 对生成结果建立 benchmark 样本库，持续比对“是否像套话”“是否自洽”“是否越界”。
