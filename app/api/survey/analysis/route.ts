import { NextResponse } from "next/server";

import { streamDetailedAnalysisNarrative } from "@/lib/survey/detail-analysis";
import { analysisStreamRequestSchema } from "@/lib/validations/detail-analysis";

export async function POST(request: Request) {
  try {
    const payload = analysisStreamRequestSchema.parse(await request.json());

    const result = streamDetailedAnalysisNarrative({
      answers: payload.answers,
      preview: payload.preview,
      diagnosis: payload.diagnosis,
    });

    return result.toTextStreamResponse({
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI 详情分析暂时生成失败。";
    return NextResponse.json(
      {
        message,
      },
      {
        status: 400,
      },
    );
  }
}
