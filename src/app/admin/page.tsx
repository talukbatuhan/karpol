import Link from 'next/link'
import { Package, FolderTree, FileText, MessageSquare, Mail } from 'lucide-react'
import { getDashboardStats } from '@/lib/data/admin-data'
import styles from './admin.module.css'

export default async function AdminDashboardPage() {
  let stats = {
    totalProducts: 0,
    totalCategories: 0,
    totalArticles: 0,
    pendingRFQs: 0,
    newContacts: 0,
  }

  try {
    stats = await getDashboardStats()
  } catch {
    // Supabase may not be configured yet
  }

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topBarTitle}>Dashboard</h1>
        </div>
        <div className={styles.topBarRight}>
          <Link href="/admin/products/new" className={`${styles.btn} ${styles.btnPrimary}`}>
            <Package size={16} /> New Product
          </Link>
        </div>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Products</div>
            <div className={styles.statValue}>{stats.totalProducts}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Categories</div>
            <div className={styles.statValue}>{stats.totalCategories}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Articles</div>
            <div className={styles.statValue}>{stats.totalArticles}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Pending RFQs</div>
            <div className={styles.statValue}>{stats.pendingRFQs}</div>
            {stats.pendingRFQs > 0 && (
              <div className={`${styles.statChange} ${styles.statPositive}`}>
                Requires attention
              </div>
            )}
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>New Contacts</div>
            <div className={styles.statValue}>{stats.newContacts}</div>
          </div>
        </div>

        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageHeaderTitle}>Quick Actions</h2>
            <p className={styles.pageHeaderDescription}>Jump to the most common tasks</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <Link href="/admin/products" className={styles.statCard} style={{ textDecoration: 'none' }}>
            <Package size={24} style={{ color: '#e8611a', marginBottom: 12 }} />
            <div className={styles.statLabel}>Manage Products</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Add, edit, or remove products from the catalog
            </p>
          </Link>
          <Link href="/admin/categories" className={styles.statCard} style={{ textDecoration: 'none' }}>
            <FolderTree size={24} style={{ color: '#3b82f6', marginBottom: 12 }} />
            <div className={styles.statLabel}>Categories</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Organize product categories and subcategories
            </p>
          </Link>
          <Link href="/admin/articles" className={styles.statCard} style={{ textDecoration: 'none' }}>
            <FileText size={24} style={{ color: '#8b5cf6', marginBottom: 12 }} />
            <div className={styles.statLabel}>Knowledge Base</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Write and publish technical articles
            </p>
          </Link>
          <Link href="/admin/rfq" className={styles.statCard} style={{ textDecoration: 'none' }}>
            <MessageSquare size={24} style={{ color: '#10b981', marginBottom: 12 }} />
            <div className={styles.statLabel}>RFQ Pipeline</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Track and respond to quote requests
            </p>
          </Link>
          <Link href="/admin/contacts" className={styles.statCard} style={{ textDecoration: 'none' }}>
            <Mail size={24} style={{ color: '#f59e0b', marginBottom: 12 }} />
            <div className={styles.statLabel}>Contact Messages</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              View and respond to contact form submissions
            </p>
          </Link>
        </div>
      </div>
    </>
  )
}
