import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { enforceSameOrigin } from "@/lib/security/request-guards";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/acad",
  "application/x-autocad",
  "application/step",
  "application/sla",
  "model/step",
]);

const EXT_TO_MIME: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  dwg: "application/acad",
  dxf: "application/x-autocad",
  step: "application/step",
  stp: "application/step",
  stl: "application/sla",
};

function resolveContentType(file: File): string | null {
  if (file.type && ALLOWED_TYPES.has(file.type)) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext) {
    const inferred = EXT_TO_MIME[ext];
    if (inferred && ALLOWED_TYPES.has(inferred)) return inferred;
  }
  return null;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const BUCKET = "rfq-files";

export async function POST(request: NextRequest) {
  const invalidOrigin = enforceSameOrigin(request);
  if (invalidOrigin) return invalidOrigin;

  const throttled = await enforceRateLimit(request, "upload");
  if (throttled) return throttled;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 25MB)" }, { status: 400 });
    }
    const contentType = resolveContentType(file);
    if (!contentType) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const ext = file.name.split(".").pop() || "bin";
    const safeOriginal = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]/g, "-")
      .replace(/-+/g, "-");
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeOriginal || `file.${ext}`}`;
    const filePath = `custom-rfq/${fileName}`;

    const buffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      console.error("RFQ attachment upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

    return NextResponse.json(
      {
        success: true,
        url: urlData.publicUrl,
        fileName: file.name,
        fileSize: file.size,
      },
      { status: 201 },
    );
  } catch (e) {
    console.error("RFQ attachment unexpected error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
