import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAdminCategories } from '@/lib/data/admin-data'
import styles from '../admin.module.css'
import CategoryBannerManager from '@/components/admin/CategoryBannerManager'

export default async function AdminCategoriesPage() {
  const { data: categories } = await getAdminCategories()

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
        <CategoryBannerManager initialCategories={categories} />
      </div>
    </>
  )
}
