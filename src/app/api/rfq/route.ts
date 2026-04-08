import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { rfqSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = rfqSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('rfq_submissions')
      .insert({
        ...parsed.data,
        status: 'new',
      })
      .select('id')
      .single()

    if (error) {
      console.error('RFQ submission error:', error)
      return NextResponse.json(
        { error: 'Failed to submit RFQ' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
