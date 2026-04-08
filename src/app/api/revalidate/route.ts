import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, tag } = body

    if (tag) {
      revalidateTag(tag, 'default')
    }

    if (path) {
      revalidatePath(path, 'page')
    }

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
