import { getAdminMedia } from '@/lib/data/admin-data'
import styles from '../admin.module.css'

export default async function AdminMediaPage() {
  const { data: media } = await getAdminMedia()

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topBarTitle}>Media Library</h1>
        </div>
        <div className={styles.topBarRight}>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            Upload Files
          </button>
        </div>
      </div>

      <div className={styles.pageContent}>
        {media.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>🖼️</div>
            <div className={styles.emptyStateTitle}>No media files yet</div>
            <p>Upload product images, technical drawings, and documents.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {media.map((item) => (
              <div key={item.id} className={styles.statCard} style={{ padding: 12 }}>
                {item.file_type === 'image' ? (
                  <div style={{
                    aspectRatio: '4/3',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 6,
                    marginBottom: 8,
                    overflow: 'hidden',
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.file_url}
                      alt={item.file_name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div style={{
                    aspectRatio: '4/3',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 6,
                    marginBottom: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                  }}>
                    📄
                  </div>
                )}
                <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.file_name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {item.file_type} {item.file_size ? `• ${Math.round(item.file_size / 1024)}KB` : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
