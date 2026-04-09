import { NextRequest, NextResponse } from "next/server";
import { listCatalogIds, saveCatalogManifest } from "@/lib/data/catalog-storage";
import { requireAdminContext } from "@/lib/auth/admin-guard";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { logAdminActivity, logSecurityEvent } from "@/lib/data/admin-data";
import { enforceSameOrigin } from "@/lib/security/request-guards";
import { z } from "zod";

const pageSchema = z.object({
  index: z.number().int().nonnegative(),
  pageNumber: z.number().int().positive(),
  url: z.string().url().nullable(),
  thumbUrl: z.string().url().nullable(),
});

const manifestSchema = z.object({
  schemaVersion: z.number().int().default(1),
  catalogId: z.string().min(1),
  title: z.string().optional(),
  totalPages: z.number().int().nonnegative(),
  pages: z.array(pageSchema),
});

export async function GET(request: NextRequest) {
  const throttled = await enforceRateLimit(request, "admin-api");
  if (throttled) return throttled;

  const { denied } = await requireAdminContext(request);
  if (denied) return denied;

  const ids = await listCatalogIds();
  return NextResponse.json({ catalogs: ids });
}

export async function POST(request: NextRequest) {
  const invalidOrigin = enforceSameOrigin(request);
  if (invalidOrigin) {
    await logSecurityEvent({
      event: "origin_check_failed",
      severity: "high",
      requestPath: request.nextUrl.pathname,
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
      details: { module: "catalog_manifest" },
    });
    return invalidOrigin;
  }

  const throttled = await enforceRateLimit(request, "admin-api");
  if (throttled) return throttled;

  const { denied, userId } = await requireAdminContext(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const parsed = manifestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid manifest payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await saveCatalogManifest({
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    });
    await logAdminActivity({
      userId,
      action: "update",
      entityType: "page_content",
      entityId: parsed.data.catalogId,
      details: {
        module: "catalog_manifest",
        totalPages: parsed.data.totalPages,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to save catalog manifest",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
