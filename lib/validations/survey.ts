import { z } from "zod";

export const surveySchema = z.object({
  companyName: z.string().min(2, "请输入企业名称"),
  contactName: z.string().min(2, "请输入联系人姓名"),
  email: z.email("请输入有效邮箱"),
  phone: z.string().min(6, "请输入有效手机号").optional().or(z.literal("")),
  goals: z.string().min(10, "请至少输入 10 个字符"),
});

export type SurveyInput = z.infer<typeof surveySchema>;
