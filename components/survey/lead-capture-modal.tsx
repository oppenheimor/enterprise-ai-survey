"use client";

import { ZodError } from "zod";
import { useEffect, useState, useTransition } from "react";
import { LoaderCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LeadFormInput } from "@/lib/validations/survey";

type LeadCaptureModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: LeadFormInput) => Promise<void>;
};

type FieldErrors = Partial<Record<keyof LeadFormInput, string>>;

function createInitialState(): LeadFormInput {
  return {
    leadName: "",
    leadPhone: "",
    companyName: "",
  };
}

function getFieldErrors(error: unknown) {
  if (!(error instanceof ZodError)) {
    return null;
  }

  return error.issues.reduce<FieldErrors>((accumulator, issue) => {
    const field = issue.path[0];
    if (typeof field === "string" && !accumulator[field as keyof LeadFormInput]) {
      accumulator[field as keyof LeadFormInput] = issue.message;
    }
    return accumulator;
  }, {});
}

export function LeadCaptureModal({ open, onClose, onSubmit }: LeadCaptureModalProps) {
  const [form, setForm] = useState<LeadFormInput>(() => createInitialState());
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="safe-top safe-bottom safe-x fixed inset-0 z-50 grid place-items-center bg-slate-950/78 px-4 backdrop-blur-sm">
      <button aria-label="关闭弹窗" className="absolute inset-0 cursor-default" onClick={onClose} type="button" />
      <Card className="relative z-10 w-full max-w-lg border-white/12 bg-[rgba(9,14,26,.96)] p-5 text-white shadow-[0_26px_80px_rgba(0,0,0,.48)]">
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-2">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--brand)]">解锁 AI 全面分析</p>
            <h2 className="text-2xl font-black tracking-[-0.05em]">先留一下资料 <br></br>我们继续往下分析</h2>
          </div>
          <Button
            aria-label="关闭"
            className="size-9 rounded-full"
            onClick={() => {
              setForm(createInitialState());
              setError("");
              setFieldErrors({});
              onClose();
            }}
            size="icon"
            variant="ghost"
          >
            <X className="size-4" />
          </Button>
        </div>

        <form
          className="mt-6 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            setError("");
            setFieldErrors({});

            startTransition(async () => {
              try {
                await onSubmit(form);
              } catch (submitError) {
                const nextFieldErrors = getFieldErrors(submitError);
                if (nextFieldErrors) {
                  setFieldErrors(nextFieldErrors);
                  return;
                }

                setError(submitError instanceof Error ? submitError.message : "提交失败，请稍后再试。");
              }
            });
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="leadName">你的姓名</Label>
            <Input
              className="h-11 border-white/10 bg-white/5 text-white"
              id="leadName"
              onChange={(event) => {
                const value = event.target.value;
                setForm((current) => ({ ...current, leadName: value }));
                setFieldErrors((current) => ({ ...current, leadName: undefined }));
              }}
              placeholder="请输入姓名"
              value={form.leadName}
            />
            {fieldErrors.leadName ? <p className="text-xs text-rose-300">{fieldErrors.leadName}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="leadPhone">手机号</Label>
            <Input
              className="h-11 border-white/10 bg-white/5 text-white"
              id="leadPhone"
              inputMode="numeric"
              onChange={(event) => {
                const value = event.target.value;
                setForm((current) => ({ ...current, leadPhone: value }));
                setFieldErrors((current) => ({ ...current, leadPhone: undefined }));
              }}
              placeholder="请输入手机号"
              value={form.leadPhone}
            />
            {fieldErrors.leadPhone ? <p className="text-xs text-rose-300">{fieldErrors.leadPhone}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="companyName">企业名称</Label>
            <Input
              className="h-11 border-white/10 bg-white/5 text-white"
              id="companyName"
              onChange={(event) => {
                const value = event.target.value;
                setForm((current) => ({ ...current, companyName: value }));
                setFieldErrors((current) => ({ ...current, companyName: undefined }));
              }}
              placeholder="请输入企业名称"
              value={form.companyName}
            />
            {fieldErrors.companyName ? <p className="text-xs text-rose-300">{fieldErrors.companyName}</p> : null}
          </div>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <Button className="h-12 rounded-full text-sm font-semibold" disabled={pending} type="submit">
            {pending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                正在解锁详情分析
              </>
            ) : (
              "提交并进入 AI 全面分析"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
