import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { rfqSchema } from '@/lib/validations'
import { renderRfqEmail, sendNotificationMail } from '@/lib/mailer'

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

    // Admin'e bildirim e-postası — SMTP yoksa sessizce atlanır.
    // Talep yine de Supabase'e kaydedildiği için kayıp olmaz.
    const mail = renderRfqEmail({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      product_interest: parsed.data.product_interest,
      quantity: parsed.data.quantity,
      message: parsed.data.message,
      source_page: parsed.data.source_page,
      locale: parsed.data.locale,
    })

    const mailResult = await sendNotificationMail({
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      replyTo: parsed.data.email,
    })

    if (!mailResult.ok) {
      console.warn('RFQ notification email skipped:', mailResult.reason)
    }

    return NextResponse.json(
      {
        success: true,
        id: data.id,
        notified: mailResult.ok,
        notify_status: mailResult.ok ? 'mail_sent' : mailResult.reason,
      },
      { status: 201 },
    )
  } catch (err) {
    console.error('RFQ submission unexpected error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
