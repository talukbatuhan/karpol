import AdminSidebar from '@/components/admin/AdminSidebar'
import styles from './admin.module.css'

export const metadata = {
  title: 'KARPOL CMS',
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  )
}
