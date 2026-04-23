'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { RFQSubmission } from '@/types/database'
import styles from '@/app/admin/admin.module.css'

const STATUS_ORDER: RFQSubmission['status'][] = [
  'new',
  'in_review',
  'quoted',
  'accepted',
  'rejected',
  'closed',
]

const statusStyles: Record<string, string> = {
  new: styles.badgeNew,
  in_review: styles.badgeInReview,
  quoted: styles.badgeQuoted,
  accepted: styles.badgeAccepted,
  rejected: styles.badgeRejected,
  closed: styles.badgeClosed,
}

const statusLabels: Record<string, string> = {
  new: 'New',
  in_review: 'In Review',
  quoted: 'Quoted',
  accepted: 'Accepted',
  rejected: 'Rejected',
  closed: 'Closed',
}

const urgencyLabels: Record<string, string> = {
  standard: 'Standard',
  urgent: 'Urgent',
  critical: 'Critical',
}

type RFQInboxClientProps = {
  rfqs: RFQSubmission[]
}

export default function RFQInboxClient({ rfqs }: RFQInboxClientProps) {
  const [view, setView] = useState<'list' | 'board'>('list')

  if (rfqs.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>📬</div>
        <div className={styles.emptyStateTitle}>No RFQ submissions yet</div>
        <p>Quote requests from the website will appear here.</p>
      </div>
    )
  }

  const byStatus = (s: RFQSubmission['status']) => rfqs.filter((r) => r.status === s)

  return (
    <div>
      <div
        style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 16 }}
      >
        <button
          type="button"
          onClick={() => setView('list')}
          className={styles.btn}
          style={{ fontSize: 12, opacity: view === 'list' ? 1 : 0.6 }}
        >
          Liste
        </button>
        <button
          type="button"
          onClick={() => setView('board')}
          className={styles.btn}
          style={{ fontSize: 12, opacity: view === 'board' ? 1 : 0.6 }}
        >
          Kanban
        </button>
      </div>

      {view === 'list' ? (
        <div className={styles.dataTable}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Product Interest</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {rfqs.map((rfq) => (
                <tr key={rfq.id}>
                  <td>
                    <Link
                      href={`/admin/rfq/${rfq.id}`}
                      style={{ color: '#e8611a', fontWeight: 600 }}
                    >
                      {rfq.name}
                    </Link>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{rfq.email}</div>
                  </td>
                  <td>{rfq.company || '—'}</td>
                  <td>{rfq.product_interest || '—'}</td>
                  <td>{urgencyLabels[rfq.urgency] || rfq.urgency}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${statusStyles[rfq.status] || styles.badgeNew}`}
                    >
                      {statusLabels[rfq.status] || rfq.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {new Date(rfq.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12,
            alignItems: 'start',
          }}
        >
          {STATUS_ORDER.map((st) => (
            <div key={st}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  marginBottom: 8,
                }}
              >
                {statusLabels[st]} ({byStatus(st).length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {byStatus(st).map((rfq) => (
                  <Link
                    key={rfq.id}
                    href={`/admin/rfq/${rfq.id}`}
                    style={{
                      display: 'block',
                      padding: 10,
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      textDecoration: 'none',
                      color: 'inherit',
                      background: 'var(--admin-card-bg, #0f0f0f0a)',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{rfq.name}</div>
                    <div
                      style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}
                    >
                      {rfq.product_interest || '—'}
                    </div>
                    <div
                      style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}
                    >
                      {new Date(rfq.created_at).toLocaleDateString()}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
