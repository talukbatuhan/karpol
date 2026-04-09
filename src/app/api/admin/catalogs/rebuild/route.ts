import { NextRequest, NextResponse } from "next/server";
import {
  buildCatalogManifestFromStorage,
  saveCatalogManifest,
} from "@/lib/data/catalog-storage";
import { requireAdminContext } from "@/lib/auth/admin-guard";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { logAdminActivity, logSecurityEvent } from "@/lib/data/admin-data";
import { enforceSameOrigin } from "@/lib/security/request-guards";

export async function POST(request: NextRequest) {
  const invalidOrigin = enforceSameOrigin(request);
  if (invalidOrigin) {
    await logSecurityEvent({
      event: "origin_check_failed",
      severity: "high",
      requestPath: request.nextUrl.pathname,
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
      details: { module: "catalog_manifest_rebuild" },
    });
    return invalidOrigin;
  }

  const throttled = await enforceRateLimit(request, "admin-api");
  if (throttled) return throttled;

  const { denied, userId } = await requireAdminContext(request);
  if (denied) return denied;

  try {
    const body = (await request.json()) as {
      catalogId?: string;
      title?: string;
    };
    const catalogId = body.catalogId?.trim();
    if (!catalogId) {
      return NextResponse.json({ error: "catalogId is required" }, { status: 400 });
    }

    const manifest = await buildCatalogManifestFromStorage(catalogId, body.title);
    await saveCatalogManifest(manifest);
    await logAdminActivity({
      userId,
      action: "update",
      entityType: "page_content",
      entityId: catalogId,
      details: {
        module: "catalog_manifest_rebuild",
        totalPages: manifest.totalPages,
      },
    });

    return NextResponse.json({ success: true, manifest });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to rebuild manifest",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
