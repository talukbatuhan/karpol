import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getAdminRFQById } from '@/lib/data/admin-data'
import RFQStatusForm from './RFQStatusForm'
import styles from '../../admin.module.css'

export default async function RFQDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: rfq, error } = await getAdminRFQById(id)

  if (error || !rfq) notFound()

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <Link href="/admin/rfq" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.topBarTitle}>RFQ: {rfq.name}</h1>
        </div>
      </div>

      <div className={styles.pageContent}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
          <div>
            {/* Contact Info */}
            <div className={styles.statCard} style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Contact Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Name</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{rfq.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Email</div>
                  <div style={{ fontSize: 15, marginTop: 4 }}>{rfq.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Phone</div>
                  <div style={{ fontSize: 15, marginTop: 4 }}>{rfq.phone || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Company</div>
                  <div style={{ fontSize: 15, marginTop: 4 }}>{rfq.company || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Country</div>
                  <div style={{ fontSize: 15, marginTop: 4 }}>{rfq.country || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Industry</div>
                  <div style={{ fontSize: 15, marginTop: 4 }}>{rfq.industry || '—'}</div>
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className={styles.statCard} style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Request Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Product Interest</div>
                  <div style={{ fontSize: 15, marginTop: 4 }}>{rfq.product_interest || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Quantity</div>
                  <div style={{ fontSize: 15, marginTop: 4 }}>{rfq.quantity || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Material</div>
                  <div style={{ fontSize: 15, marginTop: 4 }}>{rfq.material_preference || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Hardness</div>
                  <div style={{ fontSize: 15, marginTop: 4 }}>{rfq.hardness_requirement || '—'}</div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Message</div>
                <div style={{ fontSize: 15, lineHeight: 1.7, background: 'var(--bg-tertiary)', padding: 16, borderRadius: 8 }}>
                  {rfq.message || 'No message provided.'}
                </div>
              </div>
            </div>

            {rfq.line_items && rfq.line_items.length > 0 && (
              <div className={styles.statCard} style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Line items</h3>
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
                  {rfq.line_items.map((line, i) => (
                    <li key={i} style={{ fontSize: 14 }}>
                      {(line.product_name || line.product_sku || 'Item') +
                        (line.quantity ? ` — Qty: ${line.quantity}` : '')}
                      {line.product_id ? (
                        <span style={{ color: 'var(--text-muted)', fontSize: 12, marginLeft: 6 }}>
                          ({line.product_id.slice(0, 8)}…)
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Files */}
            {rfq.file_urls && rfq.file_urls.length > 0 && (
              <div className={styles.statCard}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Attached Files</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {rfq.file_urls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                      style={{ padding: '10px 16px', background: 'var(--bg-tertiary)', borderRadius: 6, fontSize: 14, color: '#E8611A', fontWeight: 600 }}>
                      📎 File {i + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Status & Notes */}
          <div>
            <RFQStatusForm rfqId={rfq.id} currentStatus={rfq.status} currentNotes={rfq.internal_notes || ''} />

            <div className={styles.statCard} style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)' }}>Metadata</h3>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 2 }}>
                <div>Submitted: {new Date(rfq.created_at).toLocaleString()}</div>
                <div>Source: {rfq.source_page || '—'}</div>
                <div>Locale: {rfq.locale || '—'}</div>
                <div>Urgency: {rfq.urgency}</div>
                {rfq.quoted_at && <div>Quoted: {new Date(rfq.quoted_at).toLocaleString()}</div>}
                {rfq.quoted_amount && <div>Amount: ${rfq.quoted_amount}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
