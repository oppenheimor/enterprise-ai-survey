## Why

当前结果预览虽然已经在点击“查看结果预览”时触发模型生成，但输出结构过薄，用户看到的是几段摘要，无法形成“专业、系统、像体检报告”的感知。

需要把结果链路升级为完整的 AI 转型体检报告：模型基于 prompt 框架、问卷答案和规则评分生成系统分析，前端用移动端 H5 报告形式呈现维度结果、解释、图表数据、工具建议和行动路线。

## What Changes

- 点击“查看结果预览”后仍立即触发一次模型生成，但生成目标从摘要诊断升级为完整结构化报告。
- 替换诊断输出 schema：旧 9 字段摘要不再作为契约，新的 `diagnosis` 是完整健康报告对象。
- 结果预览页改为“体检报告式 H5”：先展示核心结论、维度图表和推荐切入场景，再引导留资解锁完整报告。
- 留资成功页展示同一份已生成报告的完整内容，不二次生成，避免前后结论不一致。
- 更新落库结构：删除旧诊断摘要字段，统一保存完整报告 JSON，供运营看板后续抽检和跟进。
- 更新 benchmark 测试，约束报告必须具体、自洽、可回溯，不允许空泛口号、ROI 编造或行业 benchmark 幻觉。

## Capabilities

### New Capabilities
- `ai-health-report-preview`: 用户完成问卷并点击查看结果后，系统生成并展示体检报告式 AI 转型预览。
- `ai-health-report-generation`: 系统通过结构化 prompt 和 Vercel AI SDK 生成完整、可校验的 AI 转型体检报告。
- `ai-tool-recommendation`: 报告根据用户场景推荐 AI 工具类型、适用方式和价值点，并避免编造未经维护的具体工具事实。

### Modified Capabilities

## Impact

- 影响前台核心链路：最后一题提交、结果预览、留资解锁、成功页。
- 影响代码：`lib/validations/survey.ts`、`lib/survey/diagnosis.ts`、`components/survey/survey-app.tsx`、`app/actions.ts`、`lib/survey/repository.ts`。
- 影响数据库：`SurveySubmission` 删除旧诊断摘要列，改为保存唯一完整报告 JSON。
- 影响测试：需要更新诊断 benchmark、schema 单测和核心 H5 流程测试。
