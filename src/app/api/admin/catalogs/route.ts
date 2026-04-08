import { NextRequest, NextResponse } from "next/server";
import { listCatalogIds, saveCatalogManifest } from "@/lib/data/catalog-storage";
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

export async function GET() {
  const ids = await listCatalogIds();
  return NextResponse.json({ catalogs: ids });
}

export async function POST(request: NextRequest) {
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
