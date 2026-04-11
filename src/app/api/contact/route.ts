import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { sendContactNotificationEmail } from '@/lib/mail'
import { contactSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        ...parsed.data,
        status: 'new',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Contact submission error:', error)
      return NextResponse.json(
        { error: 'Failed to submit contact form' },
        { status: 500 }
      )
    }

    try {
      await sendContactNotificationEmail({
        ...parsed.data,
        submissionId: String(data.id),
      })
    } catch (mailErr) {
      console.error('[mail] Contact notification failed:', mailErr)
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
