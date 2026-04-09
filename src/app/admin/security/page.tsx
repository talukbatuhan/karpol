import styles from '../admin.module.css'
import { getAdminSecurityEvents } from '@/lib/data/admin-data'
import SecurityEventsTable from '@/components/admin/SecurityEventsTable'

export default async function AdminSecurityEventsPage() {
  const { data, error } = await getAdminSecurityEvents(200)

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topBarTitle}>Security Events</h1>
        </div>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageHeaderTitle}>Recent Security Activity</h2>
            <p className={styles.pageHeaderDescription}>
              Failed origin checks, rate-limit violations, and suspicious auth events
            </p>
          </div>
        </div>

        {error ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateTitle}>Security events could not be loaded.</p>
            <p>{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateTitle}>No security events yet.</p>
            <p>System logs will appear here when suspicious activity is detected.</p>
          </div>
        ) : (
          <SecurityEventsTable rows={data} />
        )}
      </div>
    </>
  )
}
