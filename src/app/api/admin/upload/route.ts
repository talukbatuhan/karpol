import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { requireAdminContext } from '@/lib/auth/admin-guard'
import { enforceRateLimit } from '@/lib/security/rate-limit'
import { enforceSameOrigin } from '@/lib/security/request-guards'
import { logSecurityEvent } from '@/lib/data/admin-data'

const BUCKET = 'product-assets'
const MAX_BYTES = 50 * 1024 * 1024 // 50 MB

const ALLOWED_FOLDERS = [
  'gallery',
  'drawings',
  'models',
  'datasheets',
  'hero',
  'misc',
] as const
type AllowedFolder = (typeof ALLOWED_FOLDERS)[number]

const ALLOWED_MIME: Record<AllowedFolder, string[]> = {
  gallery: ['image/png', 'image/jpeg', 'image/webp', 'image/avif'],
  drawings: ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'],
  models: [
    'model/gltf-binary',
    'application/octet-stream',
    'application/sla',
    'application/step',
    'application/vnd.ms-pki.stl',
  ],
  datasheets: ['application/pdf'],
  hero: ['image/png', 'image/jpeg', 'image/webp', 'image/avif'],
  misc: [
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/avif',
    'application/pdf',
  ],
}

function sanitizeFileName(name: string) {
  const base = name
    .normalize('NFKD')
    .replace(/[^\w.\-]+/g, '_')
    .replace(/_+/g, '_')
    .slice(-120)
  const ts = Date.now()
  const rand = Math.random().toString(36).slice(2, 8)
  return `${ts}-${rand}-${base}`
}

export async function POST(request: NextRequest) {
  const invalidOrigin = enforceSameOrigin(request)
  if (invalidOrigin) {
    await logSecurityEvent({
      event: 'origin_check_failed',
      severity: 'high',
      requestPath: request.nextUrl.pathname,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      details: { module: 'admin_upload' },
    })
    return invalidOrigin
  }

  const throttled = await enforceRateLimit(request, 'upload')
  if (throttled) return throttled

  const { denied } = await requireAdminContext(request)
  if (denied) return denied

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Geçersiz form verisi' }, { status: 400 })
  }

  const file = formData.get('file')
  const folderRaw = String(formData.get('folder') ?? 'misc')
  const productSlugRaw = String(formData.get('productSlug') ?? '')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
  }

  if (!ALLOWED_FOLDERS.includes(folderRaw as AllowedFolder)) {
    return NextResponse.json({ error: 'Geçersiz klasör' }, { status: 400 })
  }
  const folder = folderRaw as AllowedFolder

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Dosya çok büyük (max 50 MB)' }, { status: 413 })
  }

  const allowedMime = ALLOWED_MIME[folder]
  const extLower = (file.name.split('.').pop() ?? '').toLowerCase()
  const isGlb = extLower === 'glb'
  const isStp = extLower === 'stp' || extLower === 'step'
  const mimeOk =
    allowedMime.includes(file.type) ||
    (folder === 'models' && (isGlb || isStp))

  if (!mimeOk) {
    return NextResponse.json(
      { error: `Bu klasör için desteklenmeyen dosya tipi: ${file.type || extLower}` },
      { status: 415 },
    )
  }

  const productPart = productSlugRaw.replace(/[^a-z0-9-]/gi, '-').toLowerCase().slice(0, 80)
  const prefix = productPart ? `${productPart}/${folder}` : `_unsorted/${folder}`
  const path = `${prefix}/${sanitizeFileName(file.name)}`

  const supabase = createAdminClient()
  const arrayBuffer = await file.arrayBuffer()

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, Buffer.from(arrayBuffer), {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
      cacheControl: '3600',
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)

  return NextResponse.json({
    url: data.publicUrl,
    path,
    folder,
    name: file.name,
    size: file.size,
    type: file.type,
  })
}

export async function DELETE(request: NextRequest) {
  const invalidOrigin = enforceSameOrigin(request)
  if (invalidOrigin) return invalidOrigin

  const throttled = await enforceRateLimit(request, 'admin-api')
  if (throttled) return throttled

  const { denied } = await requireAdminContext(request)
  if (denied) return denied

  const path = request.nextUrl.searchParams.get('path')
  if (!path) {
    return NextResponse.json({ error: 'path gerekli' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
