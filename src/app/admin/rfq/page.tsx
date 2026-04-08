import Link from 'next/link'
import { getAdminRFQs } from '@/lib/data/admin-data'
import styles from '../admin.module.css'

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
  standard: '⚪ Standard',
  urgent: '🟡 Urgent',
  critical: '🔴 Critical',
}

export default async function AdminRFQPage() {
  const { data: rfqs } = await getAdminRFQs()

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topBarTitle}>RFQ Pipeline</h1>
        </div>
      </div>

      <div className={styles.pageContent}>
        {rfqs.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>📬</div>
            <div className={styles.emptyStateTitle}>No RFQ submissions yet</div>
            <p>Quote requests from the website will appear here.</p>
          </div>
        ) : (
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
                      <Link href={`/admin/rfq/${rfq.id}`} style={{ color: '#e8611a', fontWeight: 600 }}>
                        {rfq.name}
                      </Link>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{rfq.email}</div>
                    </td>
                    <td>{rfq.company || '—'}</td>
                    <td>{rfq.product_interest || '—'}</td>
                    <td>{urgencyLabels[rfq.urgency] || rfq.urgency}</td>
                    <td>
                      <span className={`${styles.badge} ${statusStyles[rfq.status] || styles.badgeNew}`}>
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
        )}
      </div>
    </>
  )
}
