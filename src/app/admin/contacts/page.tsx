import { getAdminContacts } from '@/lib/data/admin-data'
import styles from '../admin.module.css'

const statusStyles: Record<string, string> = {
  new: styles.badgeNew,
  read: styles.badgeInReview,
  replied: styles.badgeAccepted,
}

export default async function AdminContactsPage() {
  const { data: contacts } = await getAdminContacts()

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topBarTitle}>Contact Messages</h1>
        </div>
      </div>

      <div className={styles.pageContent}>
        {contacts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>📧</div>
            <div className={styles.emptyStateTitle}>No contact messages yet</div>
            <p>Messages from the contact form will appear here.</p>
          </div>
        ) : (
          <div className={styles.dataTable}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td style={{ fontWeight: 600 }}>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.subject}</td>
                    <td>
                      <span className={`${styles.badge} ${statusStyles[contact.status] || styles.badgeNew}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {new Date(contact.created_at).toLocaleDateString()}
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
