import { NextRequest, NextResponse } from "next/server";
import { getCatalogManifest } from "@/lib/data/catalog-storage";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
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
