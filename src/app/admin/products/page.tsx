import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAdminProducts, getAdminCategories } from '@/lib/data/admin-data'
import { getLocalizedField } from '@/lib/i18n-helpers'
import styles from '../admin.module.css'

export default async function AdminProductsPage() {
  const [{ data: products }, { data: categories }] = await Promise.all([
    getAdminProducts(),
    getAdminCategories(),
  ])

  const categoryMap = new Map(categories.map((c) => [c.id, c]))

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topBarTitle}>Ürünler</h1>
        </div>
        <div className={styles.topBarRight}>
          <Link href="/admin/products/new" className={`${styles.btn} ${styles.btnPrimary}`}>
            <Plus size={16} /> Ürün Ekle
          </Link>
        </div>
      </div>

      <div className={styles.pageContent}>
        {products.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>📦</div>
            <div className={styles.emptyStateTitle}>Henüz ürün yok</div>
            <p>Başlamak için ilk ürününüzü ekleyin.</p>
            <Link href="/admin/products/new" className={`${styles.btn} ${styles.btnPrimary}`} style={{ marginTop: 16 }}>
              <Plus size={16} /> Ürün Ekle
            </Link>
          </div>
        ) : (
          <div className={styles.dataTable}>
            <table>
              <thead>
                <tr>
                  <th>Ürün Adı</th>
                  <th>SKU</th>
                  <th>Kategori</th>
                  <th>Malzeme</th>
                  <th>Durum</th>
                  <th>Sıra</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const cat = product.category_id ? categoryMap.get(product.category_id) : null
                  return (
                    <tr key={product.id}>
                      <td>
                        <Link href={`/admin/products/${product.id}`} style={{ color: '#e8611a', fontWeight: 600 }}>
                          {getLocalizedField(product.name, 'tr') || getLocalizedField(product.name, 'en')}
                        </Link>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{product.sku}</td>
                      <td>{cat ? getLocalizedField(cat.name, 'tr') || getLocalizedField(cat.name, 'en') : '—'}</td>
                      <td>{product.material || '—'}</td>
                      <td>
                        <span className={`${styles.badge} ${product.is_active ? styles.badgeActive : styles.badgeDraft}`}>
                          {product.is_active ? 'Aktif' : 'Taslak'}
                        </span>
                      </td>
                      <td>{product.sort_order}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
