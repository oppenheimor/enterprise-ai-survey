import roleBujuzhe from "@/app/assets/role-bujuzhe.png";
import roleBukesheng from "@/app/assets/role-bukesheng.png";
import roleChonggouzhe from "@/app/assets/role-chonggouzhe.png";
import roleDianhuozhe from "@/app/assets/role-dianhuozhe.png";
import roleGenpaozhe from "@/app/assets/role-genpaozhe.png";
import roleGuanchayuan from "@/app/assets/role-guanchayuan.png";
import roleGuanwangpai from "@/app/assets/role-guanwangpai.png";
import roleGuyongzhe from "@/app/assets/role-guyongzhe.png";
import roleKadianpai from "@/app/assets/role-kadianpai.png";
import rolePojuzhe from "@/app/assets/role-pojuzhe.png";
import roleShenglipai from "@/app/assets/role-shenglipai.png";
import roleShiganpai from "@/app/assets/role-shiganpai.png";
import roleShipaopai from "@/app/assets/role-shipaopai.png";
import roleWenduoshou from "@/app/assets/role-wenduoshou.png";
import roleXianxingzhe from "@/app/assets/role-xianxingzhe.png";
import roleZengzhangpai from "@/app/assets/role-zengzhangpai.png";
import type { PersonaMeta } from "@/lib/survey/assessment/types";

export const personaCatalog: PersonaMeta[] = [
  {
    code: "xianxingzhe",
    slug: "role-xianxingzhe",
    name: "先行者",
    image: roleXianxingzhe,
    shortDescription: "看得见问题，也有条件立刻开跑。",
    defaultStrengths: ["问题判断清晰", "数字化底座较强", "组织推动条件成熟"],
    defaultBlockers: ["容易在起步阶段把范围铺得过大"],
    defaultActions: ["先锁定单一高价值场景，再用样板项目带动后续扩展"],
  },
  {
    code: "shipaopai",
    slug: "role-shipaopai",
    name: "试跑派",
    image: roleShipaopai,
    shortDescription: "适合先找一个小场景试点，边跑边赢。",
    defaultStrengths: ["行动意愿明确", "团队具备基本配合度", "当前问题已经足够具体"],
    defaultBlockers: ["底座和资源还不足以同时跑多个方向"],
    defaultActions: ["先用 2 到 4 周做一个低风险、高重复的 MVP 试点"],
  },
  {
    code: "pojuzhe",
    slug: "role-pojuzhe",
    name: "破局者",
    image: rolePojuzhe,
    shortDescription: "问题已经压到眼前，必须用 AI 找突破口。",
    defaultStrengths: ["紧迫度高", "推动意愿强", "愿意尝试新方法"],
    defaultBlockers: ["数字化基础偏弱，容易在执行上卡壳"],
    defaultActions: ["先从最痛的单点流程切入，用结果倒逼底座升级"],
  },
  {
    code: "shiganpai",
    slug: "role-shiganpai",
    name: "实干派",
    image: roleShiganpai,
    shortDescription: "不爱空谈，只认能不能上线、能不能省事。",
    defaultStrengths: ["组织配合度高", "更关注落地效果", "推进节奏务实"],
    defaultBlockers: ["如果试点边界不清，容易把执行力浪费在错误方向"],
    defaultActions: ["围绕最稳定的流程场景先上手，再扩展到相邻环节"],
  },
  {
    code: "bujuzhe",
    slug: "role-bujuzhe",
    name: "布局者",
    image: roleBujuzhe,
    shortDescription: "不是不做，而是要按战略节奏布局。",
    defaultStrengths: ["基础强", "资源条件好", "节奏判断稳"],
    defaultBlockers: ["容易因为过度审慎而错过最佳起步窗口"],
    defaultActions: ["先确定阶段性试点，再逐步纳入整体转型节奏"],
  },
  {
    code: "guanchayuan",
    slug: "role-guanchayuan",
    name: "观察员",
    image: roleGuanchayuan,
    shortDescription: "在认真看趋势，但还没真正动起来。",
    defaultStrengths: ["趋势认知已形成", "开始关注 AI 的现实价值"],
    defaultBlockers: ["尚未形成明确行动节奏", "组织执行条件不足"],
    defaultActions: ["先选一个最贴近业务的问题做轻量验证，而不是继续泛泛观望"],
  },
  {
    code: "guanwangpai",
    slug: "role-guanwangpai",
    name: "观望派",
    image: roleGuanwangpai,
    shortDescription: "知道 AI 重要，但仍停留在“再看看”。",
    defaultStrengths: ["已经意识到外部变化", "具备初步判断动机"],
    defaultBlockers: ["组织和资源都没定下来", "缺少明确第一步"],
    defaultActions: ["先收敛到一个可解释、低风险的问题，不要继续泛化讨论"],
  },
  {
    code: "kadianpai",
    slug: "role-kadianpai",
    name: "卡点派",
    image: roleKadianpai,
    shortDescription: "问题不在 AI，本质卡在人和决策。",
    defaultStrengths: ["资源并非完全不足", "已经感受到转型必要性"],
    defaultBlockers: ["推进链条不清", "owner 缺位或决策反复"],
    defaultActions: ["先确定牵头负责人和试点边界，再谈工具和方案"],
  },
  {
    code: "guyongzhe",
    slug: "role-guyongzhe",
    name: "孤勇者",
    image: roleGuyongzhe,
    shortDescription: "一个人在往前冲，背后还没人真正跟上。",
    defaultStrengths: ["个人推动意愿强", "对结果有明确期待"],
    defaultBlockers: ["组织支持不足", "容易出现单点推进后继无人"],
    defaultActions: ["先做一个能被团队看懂的样板，降低后续协同阻力"],
  },
  {
    code: "shenglipai",
    slug: "role-shenglipai",
    name: "省力派",
    image: roleShenglipai,
    shortDescription: "只想先把最耗时、最重复的工作省下来。",
    defaultStrengths: ["目标明确", "更容易接受轻量提效型场景"],
    defaultBlockers: ["如果一上来做太重，投入产出会失衡"],
    defaultActions: ["优先选择高重复、低风险、可快速见效的任务做试点"],
  },
  {
    code: "bukesheng",
    slug: "role-bukesheng",
    name: "补课生",
    image: roleBukesheng,
    shortDescription: "现在最需要的不是上难项目，而是先补底座。",
    defaultStrengths: ["问题意识开始形成", "还有较大的提升空间"],
    defaultBlockers: ["数字化基础明显偏弱", "短期不适合上复杂方案"],
    defaultActions: ["先补工具和流程底座，再考虑更复杂的 AI 应用"],
  },
  {
    code: "dianhuozhe",
    slug: "role-dianhuozhe",
    name: "点火者",
    image: roleDianhuozhe,
    shortDescription: "只要有个火种点起来，后面就能越烧越旺。",
    defaultStrengths: ["态度积极", "愿意快速验证一个样板项目"],
    defaultBlockers: ["如果第一把火点得太大，容易过早失温"],
    defaultActions: ["先做一个可被快速证明的小样板，再带动团队扩展"],
  },
  {
    code: "wenduoshou",
    slug: "role-wenduoshou",
    name: "稳舵手",
    image: roleWenduoshou,
    shortDescription: "宁可慢一点，也要确保方向和组织承接。",
    defaultStrengths: ["风险意识强", "不会盲目追热点"],
    defaultBlockers: ["过度谨慎会让高紧迫问题继续积压"],
    defaultActions: ["先把组织责任和边界划清，再推进最稳的一步"],
  },
  {
    code: "genpaozhe",
    slug: "role-genpaozhe",
    name: "跟跑者",
    image: roleGenpaozhe,
    shortDescription: "不想第一个吃螃蟹，但也不想落后。",
    defaultStrengths: ["愿意参考成熟案例", "有一定现实判断"],
    defaultBlockers: ["缺少自己公司的明确起步标准"],
    defaultActions: ["先借鉴同行已验证的小场景，再挑一个适合自己的切入点"],
  },
  {
    code: "zengzhangpai",
    slug: "role-zengzhangpai",
    name: "增长派",
    image: roleZengzhangpai,
    shortDescription: "最关心 AI 能不能直接带来业务增量。",
    defaultStrengths: ["增长目标明确", "场景适配度较高", "愿意为业务结果投入"],
    defaultBlockers: ["如果没有收敛试点口径，容易把增长目标拉得过散"],
    defaultActions: ["先从获客、转化或客服承接中选一个最可验证的增长场景"],
  },
  {
    code: "chonggouzhe",
    slug: "role-chonggouzhe",
    name: "重构派",
    image: roleChonggouzhe,
    shortDescription: "想借 AI 重塑业务，而不只是加一个工具。",
    defaultStrengths: ["不满足局部提效", "具备较强资源与执行条件"],
    defaultBlockers: ["一开始就全局重构，实施风险会明显上升"],
    defaultActions: ["先从最关键的流程枢纽切入，再逐步带动系统重塑"],
  },
];

export const personaMap = Object.fromEntries(personaCatalog.map((persona) => [persona.code, persona])) as Record<
  PersonaMeta["code"],
  PersonaMeta
>;
