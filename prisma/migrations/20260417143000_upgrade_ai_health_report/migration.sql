ALTER TABLE "SurveySubmission"
  ADD COLUMN "diagnosis" JSONB;

UPDATE "SurveySubmission"
SET "diagnosis" = jsonb_build_object(
  'reportTitle', '企业 AI 转型体检报告',
  'reportSubtitle', '由历史诊断结果迁移而来',
  'executiveSummary', jsonb_build_object(
    'verdict', COALESCE("overallJudgement", '历史诊断结果已迁移'),
    'rating', COALESCE("scoreRating", '待提升'),
    'score', COALESCE("scoreTotal", 0),
    'recommendedScene', COALESCE("topScene", '流程优化'),
    'keyFinding', COALESCE("coreProblemSummary", '历史诊断结果未包含完整关键结论'),
    'currentBlocker', COALESCE("currentBiggestBlocker", '历史诊断结果未包含完整阻力分析')
  ),
  'dimensionReports', jsonb_build_array(
    jsonb_build_object(
      'key', 'transformationPotential',
      'name', '转型潜力',
      'score', LEAST(100, GREATEST(0, COALESCE("transformationPotential", 0) * 100 / 40)),
      'level', COALESCE("scoreRating", '待提升'),
      'summary', '由历史评分迁移而来',
      'evidence', jsonb_build_array(
        jsonb_build_object('label', '来源', 'value', '历史评分迁移'),
        jsonb_build_object('label', '场景', 'value', COALESCE("topScene", '流程优化'))
      ),
      'attention', '建议基于最新问卷结果重新生成完整报告'
    ),
    jsonb_build_object(
      'key', 'painUrgency',
      'name', '痛点迫切度',
      'score', LEAST(100, GREATEST(0, COALESCE("painUrgency", 0) * 100 / 30)),
      'level', COALESCE("scoreRating", '待提升'),
      'summary', '由历史评分迁移而来',
      'evidence', jsonb_build_array(
        jsonb_build_object('label', '来源', 'value', '历史评分迁移'),
        jsonb_build_object('label', '问题', 'value', COALESCE("q7CoreProblem", '未知'))
      ),
      'attention', '建议基于最新问卷结果重新生成完整报告'
    ),
    jsonb_build_object(
      'key', 'executionFeasibility',
      'name', '落地可行性',
      'score', LEAST(100, GREATEST(0, COALESCE("executionFeasibility", 0) * 100 / 30)),
      'level', COALESCE("scoreRating", '待提升'),
      'summary', '由历史评分迁移而来',
      'evidence', jsonb_build_array(
        jsonb_build_object('label', '来源', 'value', '历史评分迁移'),
        jsonb_build_object('label', '负责人', 'value', COALESCE("q14Owner", '未知'))
      ),
      'attention', '建议基于最新问卷结果重新生成完整报告'
    )
  ),
  'visualAnalysis', jsonb_build_object(
    'radar', jsonb_build_array(
      jsonb_build_object('label', '转型潜力', 'value', LEAST(100, GREATEST(0, COALESCE("transformationPotential", 0) * 100 / 40)), 'note', '历史评分迁移'),
      jsonb_build_object('label', '痛点迫切度', 'value', LEAST(100, GREATEST(0, COALESCE("painUrgency", 0) * 100 / 30)), 'note', '历史评分迁移'),
      jsonb_build_object('label', '落地可行性', 'value', LEAST(100, GREATEST(0, COALESCE("executionFeasibility", 0) * 100 / 30)), 'note', '历史评分迁移')
    ),
    'priorityMatrix', jsonb_build_array(
      jsonb_build_object(
        'label', COALESCE("topScene", '流程优化'),
        'impact', LEAST(100, GREATEST(0, COALESCE("painUrgency", 0) * 100 / 30)),
        'feasibility', LEAST(100, GREATEST(0, COALESCE("executionFeasibility", 0) * 100 / 30)),
        'recommendation', '建议重新生成完整报告'
      ),
      jsonb_build_object(
        'label', '历史诊断',
        'impact', LEAST(100, GREATEST(0, COALESCE("scoreTotal", 0))),
        'feasibility', LEAST(100, GREATEST(0, COALESCE("executionFeasibility", 0) * 100 / 30)),
        'recommendation', '仅供历史查看'
      )
    )
  ),
  'sceneDiagnosis', jsonb_build_object(
    'primaryScene', COALESCE("topScene", '流程优化'),
    'whyThisScene', COALESCE("recommendedStartPoint", '历史数据未包含完整场景解释'),
    'notRecommendedYet', '历史数据迁移后不保留旧的完整场景边界说明，建议重新生成完整报告',
    'businessValue', jsonb_build_array(
      '历史结果已迁移，可继续用于线索查看',
      '若需完整报告，请基于最新问卷重新生成'
    )
  ),
  'toolRecommendations', jsonb_build_array(
    jsonb_build_object(
      'category', 'AI 工具类型建议待重新生成',
      'fitReason', '历史诊断结果未保存完整工具建议',
      'firstUseCase', '建议基于最新问卷重新生成报告',
      'valueArea', '帮助补齐完整工具建议模块',
      'caution', '当前为迁移占位内容'
    ),
    jsonb_build_object(
      'category', '轻量试点工具',
      'fitReason', '历史线索仍建议从轻量场景开始',
      'firstUseCase', '优先从单一流程或单一岗位试点',
      'valueArea', '降低重新启动分析的成本',
      'caution', '请勿将占位建议视为正式工具方案'
    )
  ),
  'actionRoadmap', jsonb_build_array(
    jsonb_build_object(
      'phase', '立即',
      'goal', '查看历史结果并确认是否需要重测',
      'actions', jsonb_build_array('查看已迁移诊断', '确认业务现状是否已变化'),
      'validationSignal', '能判断历史结果是否仍具参考价值'
    ),
    jsonb_build_object(
      'phase', '短期',
      'goal', '重新生成完整报告',
      'actions', jsonb_build_array('重新填写问卷', '生成新的完整体检报告'),
      'validationSignal', '拿到完整工具建议和路线图'
    ),
    jsonb_build_object(
      'phase', '后续',
      'goal', '依据新报告推进试点',
      'actions', jsonb_build_array('锁定一个试点场景', '安排负责人跟进'),
      'validationSignal', '试点具备明确边界和负责人'
    )
  ),
  'evidenceChain', COALESCE("reasoningEvidence", '[]'::jsonb),
  'riskNotice', COALESCE("riskNotice", '历史诊断未保存完整风险说明，建议重新生成完整报告'),
  'confidenceNote', COALESCE("confidenceNote", '当前内容由历史诊断迁移而来，仅供参考'),
  'boundaryNote', COALESCE("strictBoundaryNote", '当前内容来自历史迁移，不等同于重新生成的完整体检报告')
)
WHERE "diagnosis" IS NULL;

ALTER TABLE "SurveySubmission"
  ALTER COLUMN "diagnosis" SET NOT NULL;

ALTER TABLE "SurveySubmission"
  DROP COLUMN IF EXISTS "overallJudgement",
  DROP COLUMN IF EXISTS "coreProblemSummary",
  DROP COLUMN IF EXISTS "recommendedStartPoint",
  DROP COLUMN IF EXISTS "reasoningEvidence",
  DROP COLUMN IF EXISTS "currentBiggestBlocker",
  DROP COLUMN IF EXISTS "nextStepPlan",
  DROP COLUMN IF EXISTS "riskNotice",
  DROP COLUMN IF EXISTS "confidenceNote",
  DROP COLUMN IF EXISTS "strictBoundaryNote";
