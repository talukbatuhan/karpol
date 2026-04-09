import { NextRequest, NextResponse } from "next/server";
import { getCatalogManifest } from "@/lib/data/catalog-storage";
import { requireAdminContext } from "@/lib/auth/admin-guard";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const throttled = await enforceRateLimit(request, "admin-api");
  if (throttled) return throttled;

  const { denied } = await requireAdminContext(request);
  if (denied) return denied;

  try {
    const { id } = await context.params;
    const manifest = await getCatalogManifest(id);
    return NextResponse.json(manifest);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Catalog not found",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 404 },
    );
  }
}
