'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateRFQStatusAction } from '@/lib/actions/admin-rfq-actions'
import styles from '../../admin.module.css'
import { Label, Select, Textarea, Button } from '@/components/ui'

const STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'in_review', label: 'In Review' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'closed', label: 'Closed' },
]

export default function RFQStatusForm({
  rfqId,
  currentStatus,
  currentNotes,
}: {
  rfqId: string
  currentStatus: string
  currentNotes: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [notes, setNotes] = useState(currentNotes)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const result = await updateRFQStatusAction(rfqId, status, notes)
    setSaving(false)
    if (result.error) {
      window.alert(result.error)
      return
    }
    router.refresh()
  }

  return (
    <div className={styles.statCard}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Status & Notes</h3>

      <div className={styles.formGroup}>
        <Label htmlFor="rfq-status" className={styles.formLabel}>
          Status
        </Label>
        <Select
          id="rfq-status"
          className={styles.formSelect}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Select>
      </div>

      <div className={styles.formGroup}>
        <Label htmlFor="rfq-notes" className={styles.formLabel}>
          Internal Notes
        </Label>
        <Textarea
          id="rfq-notes"
          className={styles.formTextarea}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add internal notes about this RFQ..."
          rows={5}
        />
      </div>

      <Button
        type="button"
        onClick={handleSave}
        className={`${styles.btn} ${styles.btnPrimary}`}
        disabled={saving}
        style={{ width: '100%' }}
      >
        {saving ? 'Saving...' : 'Update Status'}
      </Button>
    </div>
  )
}
