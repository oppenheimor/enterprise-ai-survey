# 企业 AI 转型评估 H5 字段与埋点映射表

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档名称 | 企业 AI 转型评估 H5 字段与埋点映射表 |
| 文档版本 | v1.1 |
| 关联文档 | `docs/requirements/企业AI转型评估H5_PRD_v1.md` |

---

## 1. 核心埋点

| 事件名 | 触发时机 | 关键参数 |
|--------|----------|----------|
| `landing_view` | 落地页曝光 | `source`, `campaign`, `device_type` |
| `start_click` | 点击开始诊断 | `source`, `campaign`, `cta_position` |
| `question_view` | 单题曝光 | `question_id`, `question_index` |
| `question_answer` | 单题作答 | `question_id`, `selected_option`, `selected_label` |
| `questionnaire_complete` | 16 题全部完成 | `duration_seconds`, `score_total`, `score_rating` |
| `result_view` | 结果页曝光 | `score_total`, `score_rating`, `top_scene` |
| `unlock_click` | 点击解锁完整结果 | `score_total`, `score_rating` |
| `lead_submit` | 留资成功 | `score_total`, `score_rating`, `lead_focus` |

---

## 2. 16 题问卷字段映射

| 题号 | 前端字段 key | 后端字段 | 类型 |
|------|--------------|----------|------|
| Q1 | `q1Industry` | `q1_industry` | enum |
| Q2 | `q2CompanySize` | `q2_company_size` | enum |
| Q3 | `q3BusinessType` | `q3_business_type` | enum |
| Q4 | `q4RevenueModel` | `q4_revenue_model` | enum |
| Q5 | `q5MainProcess` | `q5_main_process` | enum |
| Q6 | `q6RepeatedWork` | `q6_repeated_work` | enum |
| Q7 | `q7CoreProblem` | `q7_core_problem` | enum |
| Q8 | `q8ImpactLevel` | `q8_impact_level` | enum |
| Q9 | `q9AiUsage` | `q9_ai_usage` | enum |
| Q10 | `q10ToolingLevel` | `q10_tooling_level` | enum |
| Q11 | `q11TeamAdoption` | `q11_team_adoption` | enum |
| Q12 | `q12Budget` | `q12_budget` | enum |
| Q13 | `q13Timeline` | `q13_timeline` | enum |
| Q14 | `q14Owner` | `q14_owner` | enum |
| Q15 | `q15Attitude` | `q15_attitude` | enum |
| Q16 | `q16ExpectedResult` | `q16_expected_result` | enum |

---

## 3. 结果字段

| 字段 | 前端 key | 后端字段 |
|------|----------|----------|
| 总分 | `scoreTotal` | `score_total` |
| 等级 | `scoreRating` | `score_rating` |
| 主推荐场景 | `topScene` | `top_scene` |
| 当前阶段判断 | `overallJudgement` | `overall_judgement` |
| 核心问题总结 | `coreProblemSummary` | `core_problem_summary` |
| 推荐起点 | `recommendedStartPoint` | `recommended_start_point` |
| 当前最大阻力 | `currentBiggestBlocker` | `current_biggest_blocker` |
| 证据链 | `reasoningEvidence` | `reasoning_evidence` |
| 下一步建议 | `nextStepPlan` | `next_step_plan` |
| 风险提醒 | `riskNotice` | `risk_notice` |
| 可信度说明 | `confidenceNote` | `confidence_note` |
| 边界说明 | `strictBoundaryNote` | `strict_boundary_note` |

---

## 4. 留资字段

| 页面字段 | 前端 key | 后端字段 | 类型 |
|----------|----------|----------|------|
| 姓名 | `leadName` | `lead_name` | string |
| 手机号 | `leadPhone` | `lead_phone` | string |
| 企业名称 | `companyName` | `company_name` | string |
| 备用联系方式 | `backupContact` | `backup_contact` | string |
| 最关注的问题 | `leadFocus` | `lead_focus` | enum |
