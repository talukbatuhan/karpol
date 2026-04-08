import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAdminCategories } from '@/lib/data/admin-data'
import { getLocalizedField } from '@/lib/i18n-helpers'
import styles from '../admin.module.css'

export default async function AdminCategoriesPage() {
  const { data: categories } = await getAdminCategories()

  const topLevel = categories.filter((c) => !c.parent_id)
  const childMap = new Map<string, typeof categories>()
  categories.filter((c) => c.parent_id).forEach((c) => {
    const existing = childMap.get(c.parent_id!) || []
    existing.push(c)
    childMap.set(c.parent_id!, existing)
  })

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topBarTitle}>Categories</h1>
        </div>
        <div className={styles.topBarRight}>
          <Link href="/admin/categories/new" className={`${styles.btn} ${styles.btnPrimary}`}>
            <Plus size={16} /> Add Category
          </Link>
        </div>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.dataTable}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Prefix</th>
                <th>Products</th>
                <th>Status</th>
                <th>Sort</th>
              </tr>
            </thead>
            <tbody>
              {topLevel.map((category) => {
                const children = childMap.get(category.id) || []
                return (
                  <>
                    <tr key={category.id}>
                      <td>
                        <Link href={`/admin/categories/${category.id}`} style={{ color: '#e8611a', fontWeight: 600 }}>
                          {getLocalizedField(category.name, 'en')}
                        </Link>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{category.slug}</td>
                      <td>{category.prefix}</td>
                      <td>—</td>
                      <td>
                        <span className={`${styles.badge} ${category.is_active ? styles.badgeActive : styles.badgeDraft}`}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{category.sort_order}</td>
                    </tr>
                    {children.map((child) => (
                      <tr key={child.id}>
                        <td style={{ paddingLeft: 36 }}>
                          <Link href={`/admin/categories/${child.id}`} style={{ color: '#3b82f6' }}>
                            ↳ {getLocalizedField(child.name, 'en')}
                          </Link>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{child.slug}</td>
                        <td>{child.prefix}</td>
                        <td>—</td>
                        <td>
                          <span className={`${styles.badge} ${child.is_active ? styles.badgeActive : styles.badgeDraft}`}>
                            {child.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{child.sort_order}</td>
                      </tr>
                    ))}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
