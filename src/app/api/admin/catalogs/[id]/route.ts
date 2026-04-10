import { NextRequest, NextResponse } from "next/server";
import { getCatalogManifest, deleteCatalog } from "@/lib/data/catalog-storage";
import { requireAdminContext } from "@/lib/auth/admin-guard";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { logAdminActivity, logSecurityEvent } from "@/lib/data/admin-data";
import { enforceSameOrigin } from "@/lib/security/request-guards";

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

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const invalidOrigin = enforceSameOrigin(request);
  if (invalidOrigin) {
    await logSecurityEvent({
      event: "origin_check_failed",
      severity: "high",
      requestPath: request.nextUrl.pathname,
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
      details: { module: "catalog_delete" },
    });
    return invalidOrigin;
  }

  const throttled = await enforceRateLimit(request, "admin-api");
  if (throttled) return throttled;

  const { denied, userId } = await requireAdminContext(request);
  if (denied) return denied;

  try {
    const { id } = await context.params;
    await deleteCatalog(id);
    await logAdminActivity({
      userId,
      action: "delete",
      entityType: "page_content",
      entityId: id,
      details: { module: "catalog_delete" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete catalog",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
