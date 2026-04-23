import { getAdminRFQs } from '@/lib/data/admin-data'
import RFQInboxClient from '@/components/admin/RFQInboxClient'
import styles from '../admin.module.css'

export default async function AdminRFQPage() {
  const { data: rfqs } = await getAdminRFQs()

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topBarTitle}>RFQ Pipeline</h1>
        </div>
      </div>

      <div className={styles.pageContent}>
        <RFQInboxClient rfqs={rfqs} />
      </div>
    </>
  )
}
