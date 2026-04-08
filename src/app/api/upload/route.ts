import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/acad',
  'application/x-autocad',
  'application/step',
  'application/sla',
  'model/step',
]

const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB

export async function POST(request: NextRequest) {
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

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const ext = file.name.split('.').pop() || 'bin'
    const safeOriginal = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]/g, '-')
      .replace(/-+/g, '-')
    const generated = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const fileName = keepOriginalName ? safeOriginal : generated
    const normalizedFolder = folder.replace(/^\/+|\/+$/g, '')
    const filePath = `${normalizedFolder}/${fileName}`

    const buffer = await file.arrayBuffer()
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: overwrite,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

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
