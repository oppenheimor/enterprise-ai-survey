import { getOptionLabel, surveyQuestions, type SurveyFieldKey } from "@/lib/survey/config";
import type { PreviewTransport } from "@/lib/validations/detail-analysis";
import type { DiagnosisResult, SurveyAnswersInput } from "@/lib/validations/survey";

type PromptInput = {
  answers: SurveyAnswersInput;
  preview: PreviewTransport;
  diagnosis: DiagnosisResult;
};

function buildQuestionListBlock() {
  return surveyQuestions
    .map((question) => {
      const options = question.options.map((option) => `${option.value} = ${option.label}`).join("；");
      return `${question.shortId} ${question.title}\n选项：${options}`;
    })
    .join("\n\n");
}

function buildAnswerListBlock(answers: SurveyAnswersInput) {
  return surveyQuestions
    .map((question) => {
      const value = answers[question.id];
      const label = getOptionLabel(question.id, value);
      return `${question.shortId} ${question.title}\n用户答案值：${value}\n用户答案文本：${label}`;
    })
    .join("\n\n");
}

function buildPreviewBlock(preview: PreviewTransport) {
  const dimensionLines = preview.dimensions.map((item) => {
    return `${item.label}：${item.score} 分，等级 ${item.level}，说明：${item.summary}`;
  });

  return [
    `角色：${preview.persona.name}`,
    `角色描述：${preview.persona.description}`,
    `阶段：${preview.stage}`,
    `AI 转型就绪指数：${preview.readinessScore}`,
    "六维分数：",
    ...dimensionLines,
    `优势：${preview.insights.strengths.join("；")}`,
    `阻碍：${preview.insights.blockers.join("；")}`,
    `建议：${preview.insights.nextActions.join("；")}`,
    `预览摘要：${preview.summary}`,
  ].join("\n");
}

function buildStructuredDiagnosisBlock(diagnosis: DiagnosisResult) {
  return JSON.stringify(diagnosis, null, 2);
}

export function buildStreamingAnalysisMessages(input: PromptInput) {
  return {
    system: [
      "你是一名企业 AI 转型分析顾问。",
      "你要基于问卷题目、用户真实答案、本地评估结果和结构化诊断结果，输出适合移动端阅读的中文分析文本。",
      "你不能修改任何本地评估分数、阶段、角色和结构化诊断中已经给出的结论，只能做解释、展开和建议。",
      "禁止编造外部行业数据、ROI、同行 benchmark、客户案例、政策信息或任何未提供事实。",
      "输出时请严格围绕以下 5 个部分展开：1. 总判断 2. 六维解读 3. 当前阶段与角色成因 4. 优先切入场景与推进路线 5. 风险提醒。",
      "每个部分单独成段，每段 3-5 句，语气专业、清晰、可执行，不要写标题编号，不要输出 markdown 列表。",
      "建议必须尽量具体，优先给出可落地动作，而不是空泛原则。",
      "当提到 AI 工具时，只能给工具类别或典型用法，例如：知识库问答助手、客服回复助手、会议纪要助手、内容初稿助手、表单流转自动化、工单归类助手、销售线索整理助手。不要编造具体品牌已经验证有效。",
      "当提到推进周期时，可以基于输入和结构化诊断，给出 0-2 周、2-4 周、1-3 个月这类阶段建议，但不能承诺确定收益。",
      "建议里要尽量覆盖：第一步怎么做、谁适合负责、先用什么轻量方式验证、哪些场景暂时不要碰。",
      "全文只输出分析正文，不要加开场白、免责声明、代码块或 JSON。",
    ].join("\n"),
    user: [
      "以下是你必须依据的输入信息。",
      "一、完整问题列表：",
      buildQuestionListBlock(),
      "二、用户答案：",
      buildAnswerListBlock(input.answers),
      "三、本地评估结果：",
      buildPreviewBlock(input.preview),
      "四、结构化诊断结果：",
      buildStructuredDiagnosisBlock(input.diagnosis),
      "五、输出约束：",
      [
        "1. 不得改写本地评估的角色、阶段、分数、优势、阻碍和建议。",
        "2. 六维解读必须覆盖：转型紧迫度、数字化基础、组织执行力、资源投入力、落地成熟度、场景适配度。",
        "3. 角色与阶段解释必须回扣到用户的题目答案。",
        "4. 建议必须具体到先做什么、为什么是现在、为什么不是别的方向。",
        "5. 至少给出 2-3 个具有操作性的动作建议，优先写轻量试点、信息整理、负责人、验证指标、节奏拆分。",
        "6. 可以给出适合的 AI 工具类别或典型工作流，但不能写成某个品牌已被证明最适合用户。",
        "7. 风险提醒要结合用户当前基础，不要泛泛而谈。",
      ].join("\n"),
      "现在开始输出最终分析正文。",
    ].join("\n\n"),
  };
}

export function buildQuestionAnswerDigest(answers: SurveyAnswersInput) {
  return surveyQuestions.map((question) => ({
    shortId: question.shortId,
    field: question.id satisfies SurveyFieldKey,
    title: question.title,
    value: answers[question.id],
    label: getOptionLabel(question.id, answers[question.id]),
  }));
}
