import { expect, test } from "@playwright/test";

test("renders the home page", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: /别急着做\s*AI\s*，\s*先测清楚\s*值不值得做。/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "立即开始评测" })).toBeVisible();
});

test("keeps next button disabled until the user selects an answer", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "立即开始评测" }).click();

  await expect(page.getByRole("heading", { level: 2, name: "你所在的行业是？" })).toBeVisible();
  await expect(page.getByRole("button", { name: "下一题" })).toBeDisabled();

  await page.getByRole("button", { name: "制造业" }).click();
  await expect(page.getByRole("button", { name: "下一题" })).toBeEnabled();
});

test("shows the local persona preview after the final answer", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "立即开始评测" }).click();

  const answers = [
    "服务业",
    "11-50 人",
    "咨询、培训、设计等专业服务",
    "提供定制化服务",
    "客户咨询 / 客服",
    "非常多，已经明显影响效率",
    "响应速度慢",
    "比较大，明显拖慢业务",
    "正在少量尝试",
    "有一些工具，但比较分散",
    "还可以，需要有人带着落地",
    "5000-10000 元",
    "1-3 个月",
    "我自己就能推动",
    "愿意尝试，但希望有人带着做",
    "判断先从哪里做",
  ];

  for (let index = 0; index < answers.length; index += 1) {
    await page.getByRole("button", { name: answers[index] }).click();
    await page.getByRole("button", { name: index === answers.length - 1 ? "查看结果预览" : "下一题" }).click();
  }

  await expect(page.getByRole("heading", { level: 2, name: "试跑派" })).toBeVisible();
  await expect(page.getByText("结果解读")).toBeVisible();
  await expect(page.getByText("建议")).toBeVisible();
  await expect(page.getByRole("button", { name: "重新测试" })).toBeVisible();
  await expect(page.getByRole("button", { name: "解锁完整结果" })).toHaveCount(0);
});
