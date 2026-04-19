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
          <h1 className={styles.topBarTitle}>Kontrol Paneli</h1>
        </div>
        <div className={styles.topBarRight}>
          <Link href="/admin/products/new" className={`${styles.btn} ${styles.btnPrimary}`}>
            <Package size={16} /> Yeni Ürün
          </Link>
        </div>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Toplam Ürün</div>
            <div className={styles.statValue}>{stats.totalProducts}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Kategoriler</div>
            <div className={styles.statValue}>{stats.totalCategories}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Makaleler</div>
            <div className={styles.statValue}>{stats.totalArticles}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Bekleyen Teklif Talepleri</div>
            <div className={styles.statValue}>{stats.pendingRFQs}</div>
            {stats.pendingRFQs > 0 && (
              <div className={`${styles.statChange} ${styles.statPositive}`}>
                Dikkat gerektiriyor
              </div>
            )}
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Yeni İletişim Mesajları</div>
            <div className={styles.statValue}>{stats.newContacts}</div>
          </div>
        </div>

        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageHeaderTitle}>Hızlı İşlemler</h2>
            <p className={styles.pageHeaderDescription}>En sık kullanılan görevlere hızlı erişim</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <Link href="/admin/products" className={styles.statCard} style={{ textDecoration: 'none' }}>
            <Package size={24} style={{ color: '#e8611a', marginBottom: 12 }} />
            <div className={styles.statLabel}>Ürünleri Yönet</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Katalogtaki ürünleri ekleyin, düzenleyin veya silin
            </p>
          </Link>
          <Link href="/admin/categories" className={styles.statCard} style={{ textDecoration: 'none' }}>
            <FolderTree size={24} style={{ color: '#3b82f6', marginBottom: 12 }} />
            <div className={styles.statLabel}>Kategoriler</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Ürün kategorilerini ve alt kategorileri düzenleyin
            </p>
          </Link>
          <Link href="/admin/articles" className={styles.statCard} style={{ textDecoration: 'none' }}>
            <FileText size={24} style={{ color: '#8b5cf6', marginBottom: 12 }} />
            <div className={styles.statLabel}>Bilgi Merkezi</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Teknik makaleler yazın ve yayınlayın
            </p>
          </Link>
          <Link href="/admin/rfq" className={styles.statCard} style={{ textDecoration: 'none' }}>
            <MessageSquare size={24} style={{ color: '#10b981', marginBottom: 12 }} />
            <div className={styles.statLabel}>Teklif Talepleri</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Teklif isteklerini takip edin ve yanıtlayın
            </p>
          </Link>
          <Link href="/admin/contacts" className={styles.statCard} style={{ textDecoration: 'none' }}>
            <Mail size={24} style={{ color: '#f59e0b', marginBottom: 12 }} />
            <div className={styles.statLabel}>İletişim Mesajları</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Form üzerinden gelen mesajları görüntüleyin ve yanıtlayın
            </p>
          </Link>
        </div>
      </div>
    </>
  )
}
