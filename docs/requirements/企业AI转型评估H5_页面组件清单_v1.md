# 企业 AI 转型评估 H5 页面组件清单

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档名称 | 企业 AI 转型评估 H5 页面组件清单 |
| 文档版本 | v1.1 |
| 关联文档 | `docs/requirements/企业AI转型评估H5_PRD_v1.md` |
| 关联文档 | `docs/requirements/企业AI转型评估H5_页面级线框与文案清单_v1.md` |

---

## 1. 通用基础组件

1. `PageContainer`
2. `PageHeader`
3. `ProgressBar`
4. `PrimaryButton`
5. `SecondaryButton`
6. `OptionCard`
7. `TextInput`
8. `HelperText`
9. `ErrorText`
10. `SectionBlock`
11. `StatusCard`

说明：问卷已明确全部为选择题，因此不再需要 `TextareaInput`。

---

## 2. 业务组件

1. `HeroBanner`
2. `ValuePointList`
3. `AudienceList`
4. `QuestionCard`
5. `ResultScoreCard`
6. `ResultInsightCard`
7. `UnlockBenefitList`
8. `LeadForm`
9. `SuccessSummaryCard`

---

## 3. 页面到组件映射

### 3.1 落地页

1. `PageContainer`
2. `HeroBanner`
3. `ValuePointList`
4. `AudienceList`
5. `PrimaryButton`

### 3.2 问卷步骤页

1. `PageContainer`
2. `PageHeader`
3. `ProgressBar`
4. `QuestionCard`
5. `OptionCard`
6. `PrimaryButton`
7. `SecondaryButton`

### 3.3 结果预览页

1. `PageContainer`
2. `ResultScoreCard`
3. `ResultInsightCard`
4. `UnlockBenefitList`
5. `PrimaryButton`
6. `SecondaryButton`
7. `StatusCard`

### 3.4 留资页

1. `PageContainer`
2. `PageHeader`
3. `LeadForm`
4. `TextInput`
5. `OptionCard`
6. `ErrorText`
7. `PrimaryButton`

### 3.5 提交成功页

1. `PageContainer`
2. `SuccessSummaryCard`
3. `PrimaryButton`
4. `SecondaryButton`
