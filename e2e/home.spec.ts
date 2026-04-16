import { expect, test } from "@playwright/test";

test("renders the home page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "企业 AI 转型问卷基础环境已经就绪" }),
  ).toBeVisible();
});
