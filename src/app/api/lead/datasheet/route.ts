import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { datasheetLeadSchema } from "@/lib/validations";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { enforceSameOrigin } from "@/lib/security/request-guards";

export async function POST(request: NextRequest) {
  const invalidOrigin = enforceSameOrigin(request);
  if (invalidOrigin) return invalidOrigin;

  const throttled = await enforceRateLimit(request, "upload");
  if (throttled) return throttled;

  try {
    const body = await request.json();
    const parsed = datasheetLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { privacy_consent: _p, marketing_opt_in: _m, ...row } = parsed.data;

    const supabase = createAdminClient();
    const { error } = await supabase.from("catalog_downloads").insert({
      email: row.email,
      company: row.company,
      country: row.country,
      locale: row.locale,
      catalog_name: row.catalog_name,
      file_url: row.file_url,
    });

    if (error) {
      console.error("datasheet lead insert error:", error);
      return NextResponse.json(
        { error: "Could not save your request. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, download_url: row.file_url }, { status: 201 });
  } catch (e) {
    console.error("datasheet lead unexpected error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
