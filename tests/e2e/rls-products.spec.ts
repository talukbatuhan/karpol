import { test, expect } from "@playwright/test";
import { getAnonClient, getServiceClient } from "./helpers/supabase";

test.describe("RLS — products", () => {
  test("anon cannot read draft products", async () => {
    const supabase = getAnonClient();
    const service = getServiceClient();
    const slug = `e2e-draft-${Date.now()}`;

    const { data: category } = await service
      .from("categories")
      .select("id")
      .limit(1)
      .single();

    expect(category?.id).toBeTruthy();

    const { error: insertError } = await supabase.from("products").insert({
      slug,
      category_id: category!.id,
      status: "draft",
      title_tr: "E2E Draft",
      title_en: "E2E Draft",
      description_tr: "",
      description_en: "",
      body_tr: "",
      body_en: "",
      metadata: {},
    });

    expect(insertError).toBeTruthy();
    expect(insertError?.message).toMatch(/policy|permission|row-level|JWT/i);

    const { data, error: selectError } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    expect(selectError).toBeNull();
    expect(data).toBeNull();
  });

  test("anon can read published products", async () => {
    const supabase = getAnonClient();
    const { data, error } = await supabase
      .from("products")
      .select("slug, status")
      .eq("status", "published")
      .limit(5);

    expect(error).toBeNull();
    expect(data?.length).toBeGreaterThan(0);
    expect(data?.every((r) => r.status === "published")).toBe(true);
  });
});
