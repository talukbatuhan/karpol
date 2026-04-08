import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAdminIndustries } from '@/lib/data/admin-data'
import { getLocalizedField } from '@/lib/i18n-helpers'
import styles from '../admin.module.css'

export default async function AdminIndustriesPage() {
  const { data: industries } = await getAdminIndustries()

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topBarTitle}>Industries</h1>
        </div>
        <div className={styles.topBarRight}>
          <Link href="/admin/industries/new" className={`${styles.btn} ${styles.btnPrimary}`}>
            <Plus size={16} /> Add Industry
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
                <th>Featured</th>
                <th>Sort</th>
              </tr>
            </thead>
            <tbody>
              {industries.map((industry) => (
                <tr key={industry.id}>
                  <td>
                    <Link href={`/admin/industries/${industry.id}`} style={{ color: '#e8611a', fontWeight: 600 }}>
                      {getLocalizedField(industry.name, 'en')}
                    </Link>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {getLocalizedField(industry.description, 'en')?.slice(0, 80)}...
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{industry.slug}</td>
                  <td>
                    <span className={`${styles.badge} ${industry.is_featured ? styles.badgeActive : styles.badgeClosed}`}>
                      {industry.is_featured ? 'Featured' : 'Standard'}
                    </span>
                  </td>
                  <td>{industry.sort_order}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
