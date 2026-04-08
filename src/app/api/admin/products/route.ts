import { NextRequest, NextResponse } from 'next/server'
import { getAdminProductById } from '@/lib/data/admin-data'

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const { data, error } = await getAdminProductById(id)
  if (error || !data) {
    return NextResponse.json({ error: error || 'Not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}
