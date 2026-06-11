import { test, expect } from "@playwright/test";

test.describe("Admin auth", () => {
  test("unauthenticated user is redirected to login", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("login page renders", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: /Karpol CMS/i })).toBeVisible();
    await expect(page.getByLabel(/E-posta/i)).toBeVisible();
  });
});
