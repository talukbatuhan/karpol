import { NextRequest, NextResponse } from "next/server";
import {
  buildCatalogManifestFromStorage,
  saveCatalogManifest,
} from "@/lib/data/catalog-storage";

export async function POST(request: NextRequest) {
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
