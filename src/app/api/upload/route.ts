import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { requireAdminContext } from '@/lib/auth/admin-guard'
import { enforceRateLimit } from '@/lib/security/rate-limit'
import { logAdminActivity, logSecurityEvent } from '@/lib/data/admin-data'
import { enforceSameOrigin } from '@/lib/security/request-guards'

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/acad',
  'application/x-autocad',
  'application/step',
  'application/sla',
  'model/step',
])

const EXT_TO_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  dwg: 'application/acad',
  dxf: 'application/x-autocad',
  step: 'application/step',
  stp: 'application/step',
  stl: 'application/sla',
}

function resolveContentType(file: File): string | null {
  if (file.type && ALLOWED_TYPES.has(file.type)) return file.type
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (ext) {
    const inferred = EXT_TO_MIME[ext]
    if (inferred && ALLOWED_TYPES.has(inferred)) return inferred
  }
  return null
}

const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB
const ALLOWED_BUCKETS = new Set(['catalogs', 'products', 'rfq-files'])
const SAFE_FOLDER_PATTERN = /^[a-z0-9/ _-]+$/i

export async function POST(request: NextRequest) {
  const invalidOrigin = enforceSameOrigin(request)
  if (invalidOrigin) {
    await logSecurityEvent({
      event: 'origin_check_failed',
      severity: 'high',
      requestPath: request.nextUrl.pathname,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      details: { module: 'upload_api' },
    })
    return invalidOrigin
  }

  const throttled = await enforceRateLimit(request, 'upload')
  if (throttled) {
    await logSecurityEvent({
      event: 'rate_limit_exceeded',
      severity: 'medium',
      requestPath: request.nextUrl.pathname,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      details: { module: 'upload_api' },
    })
    return throttled
  }

  const { denied, userId } = await requireAdminContext(request)
  if (denied) return denied

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const bucket = (formData.get('bucket') as string) || 'rfq-files'
    const folder = (formData.get('folder') as string) || 'uploads'
    const keepOriginalName = (formData.get('keepOriginalName') as string) === 'true'
    const overwrite = (formData.get('overwrite') as string) === 'true'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 25MB)' }, { status: 400 })
    }

    const contentType = resolveContentType(file)
    if (!contentType) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    if (!ALLOWED_BUCKETS.has(bucket)) {
      return NextResponse.json({ error: 'Unsupported bucket' }, { status: 400 })
    }

    const normalizedFolder = folder.replace(/^\/+|\/+$/g, '')
    if (!normalizedFolder || !SAFE_FOLDER_PATTERN.test(normalizedFolder) || normalizedFolder.includes('..')) {
      return NextResponse.json({ error: 'Invalid folder path' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const ext = file.name.split('.').pop() || 'bin'
    const safeOriginal = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]/g, '-')
      .replace(/-+/g, '-')
    const generated = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const fileName = keepOriginalName ? safeOriginal : generated
    const filePath = `${normalizedFolder}/${fileName}`

    const buffer = await file.arrayBuffer()
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType,
        upsert: overwrite,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    await logAdminActivity({
      userId,
      action: 'create',
      entityType: 'media',
      entityId: filePath,
      details: {
        bucket,
        folder: normalizedFolder,
        fileName: file.name,
        fileSize: file.size,
        mimeType: contentType,
        overwrite,
      },
    })

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      fileName: file.name,
      fileSize: file.size,
    }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
