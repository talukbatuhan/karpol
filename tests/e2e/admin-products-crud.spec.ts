import { test, expect } from "@playwright/test";
import { getServiceClient } from "./helpers/supabase";

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

test.describe("Admin product CRUD", () => {
  test.skip(
    !adminEmail || !adminPassword,
    "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD",
  );

  test("create draft, publish, visible on public TR page", async ({ page }) => {
    const slug = `e2e-pub-${Date.now()}`;
    const titleTr = `E2E Ürün ${Date.now()}`;

    await page.goto("/admin/login");
    await page.getByLabel(/E-posta/i).fill(adminEmail!);
    await page.getByLabel(/Şifre/i).fill(adminPassword!);
    await page.getByRole("button", { name: /Giriş/i }).click();
    await expect(page).toHaveURL(/\/admin\/?$/);

    const service = getServiceClient();
    const catSlug = `e2e-cat-${Date.now()}`;
    const { data: category } = await service
      .from("categories")
      .insert({
        slug: catSlug,
        name_tr: "E2E Kategori",
        name_en: "E2E Category",
      })
      .select("id")
      .single();
    expect(category?.id).toBeTruthy();

    await page.goto("/admin/products/new");
    await page.locator('input[name="slug"]').fill(slug);
    await page.locator('select[name="category_id"]').selectOption(category!.id);
    await page.locator('select[name="status"]').selectOption("published");
    await page.locator('input[name="title_tr"]').fill(titleTr);
    await page.locator('input[name="title_en"]').fill(`E2E Product ${slug}`);
    await page.locator('input[name="description_tr"]').fill("E2E test");
    await page.locator('input[name="description_en"]').fill("E2E test");
    await page.locator('textarea[name="body_tr"]').fill("Gövde metni");
    await page.locator('textarea[name="body_en"]').fill("Body text");
    await page.getByRole("button", { name: /Oluştur/i }).click();
    await expect(page).toHaveURL(/\/admin\/products/);

    await page.goto(`/tr/products/${slug}`);
    await expect(page.getByRole("heading", { name: titleTr })).toBeVisible({
      timeout: 15_000,
    });

    const { data: rows } = await service
      .from("products")
      .select("id")
      .eq("slug", slug);
    if (rows?.[0]?.id) {
      await service.from("products").delete().eq("id", rows[0].id);
    }
    await service.from("categories").delete().eq("slug", catSlug);
  });
});
