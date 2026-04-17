"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type SurveyInput, surveySchema } from "@/lib/validations/survey";

export function SurveyIntakeForm() {
  const [submitted, setSubmitted] = useState<SurveyInput | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SurveyInput>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      goals: "",
    },
  });

  const onSubmit = async (values: SurveyInput) => {
    setSubmitted(values);
  };

  return (
    <Card className="border-white/10 bg-slate-900/75 shadow-2xl shadow-slate-950/30 backdrop-blur">
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl text-white">转型线索采集表单</CardTitle>
        <CardDescription className="text-slate-300">
          这份示例表单已经接好 shadcn/ui、React Hook Form 与 Zod。后续问卷可以按相同模式继续拆分步骤和字段。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-2">
            <Label htmlFor="companyName">企业名称</Label>
            <Input
              id="companyName"
              placeholder="例如：星海制造集团"
              {...register("companyName")}
            />
            {errors.companyName ? (
              <p className="text-sm text-red-300">{errors.companyName.message}</p>
            ) : null}
          </div>

          <div className="grid gap-2 md:grid-cols-2 md:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="contactName">联系人</Label>
              <Input id="contactName" placeholder="张三" {...register("contactName")} />
              {errors.contactName ? (
                <p className="text-sm text-red-300">{errors.contactName.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">手机号</Label>
              <Input id="phone" placeholder="13800000000" {...register("phone")} />
              {errors.phone ? <p className="text-sm text-red-300">{errors.phone.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">邮箱</Label>
            <Input id="email" placeholder="ceo@company.com" {...register("email")} />
            {errors.email ? <p className="text-sm text-red-300">{errors.email.message}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="goals">核心诉求</Label>
            <Textarea
              id="goals"
              placeholder="请描述你希望通过 AI 转型解决的关键问题，例如销售提效、客服自动化、知识沉淀等。"
              className="min-h-32"
              {...register("goals")}
            />
            {errors.goals ? <p className="text-sm text-red-300">{errors.goals.message}</p> : null}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button className="sm:w-fit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "提交中..." : "验证表单链路"}
            </Button>
            <p className="text-sm text-slate-400">
              目前只做本地验证，不写入数据库，避免基建验证阶段制造脏数据。
            </p>
          </div>
        </form>

        {submitted ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="size-4" />
              表单验证已通过
            </div>
            <p className="mt-2 text-emerald-50/90">
              已采集 {submitted.companyName} 的线索，后续可以直接接到 Server Action 与 Prisma。
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
