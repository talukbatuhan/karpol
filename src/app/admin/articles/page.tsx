import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAdminArticles } from '@/lib/data/admin-data'
import { getLocalizedField } from '@/lib/i18n-helpers'
import styles from '../admin.module.css'

export default async function AdminArticlesPage() {
  const { data: articles } = await getAdminArticles()

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topBarTitle}>Articles</h1>
        </div>
        <div className={styles.topBarRight}>
          <Link href="/admin/articles/new" className={`${styles.btn} ${styles.btnPrimary}`}>
            <Plus size={16} /> New Article
          </Link>
        </div>
      </div>

      <div className={styles.pageContent}>
        {articles.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>📝</div>
            <div className={styles.emptyStateTitle}>No articles yet</div>
            <p>Create your first article to build your knowledge base.</p>
            <Link href="/admin/articles/new" className={`${styles.btn} ${styles.btnPrimary}`} style={{ marginTop: 16 }}>
              <Plus size={16} /> New Article
            </Link>
          </div>
        ) : (
          <div className={styles.dataTable}>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id}>
                    <td>
                      <Link href={`/admin/articles/${article.id}`} style={{ color: '#e8611a', fontWeight: 600 }}>
                        {getLocalizedField(article.title, 'en')}
                      </Link>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeNew}`}>
                        {article.category}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${article.is_published ? styles.badgeActive : styles.badgeDraft}`}>
                        {article.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString()
                        : new Date(article.created_at).toLocaleDateString()}
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
