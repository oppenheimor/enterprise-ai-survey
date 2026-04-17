import { describe, expect, it } from "vitest";

import { surveySchema } from "@/lib/validations/survey";

describe("surveySchema", () => {
  it("accepts valid survey payloads", () => {
    const result = surveySchema.safeParse({
      companyName: "星海制造集团",
      contactName: "张三",
      email: "ceo@example.com",
      phone: "13800000000",
      goals: "希望通过 AI 提升销售效率并沉淀企业知识库。",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid survey payloads", () => {
    const result = surveySchema.safeParse({
      companyName: "A",
      contactName: "",
      email: "not-an-email",
      phone: "1",
      goals: "太短",
    });

    expect(result.success).toBe(false);
  });
});
