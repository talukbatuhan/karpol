'use client'

import { useMemo, useState } from 'react'
import styles from '@/app/admin/admin.module.css'
import { Input, Select, Button } from '@/components/ui'
import type { AdminActivityLog } from '@/types/database'

type Props = {
  rows: AdminActivityLog[]
}

type Severity = 'low' | 'medium' | 'high' | 'critical'

function getSeverityBadgeClass(severity: string) {
  if (severity === 'critical' || severity === 'high') return styles.badgeRejected
  if (severity === 'medium') return styles.badgeInReview
  return styles.badgeActive
}

function toCsvValue(value: string) {
  const escaped = value.replace(/"/g, '""')
  return `"${escaped}"`
}

export default function SecurityEventsTable({ rows }: Props) {
  const [severityFilter, setSeverityFilter] = useState<'all' | Severity>('all')
  const [eventFilter, setEventFilter] = useState<'all' | string>('all')
  const [query, setQuery] = useState('')

  const eventOptions = useMemo(() => {
    const all = rows.map((row) => {
      const details = (row.details ?? {}) as Record<string, unknown>
      return String(details.event ?? 'unknown')
    })
    return Array.from(new Set(all)).sort()
  }, [rows])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      const details = (row.details ?? {}) as Record<string, unknown>
      const event = String(details.event ?? 'unknown')
      const severity = String(details.severity ?? 'low') as Severity
      const path = String(row.entity_id ?? '-')
      const ip = String(details.ip ?? '-')

      if (severityFilter !== 'all' && severity !== severityFilter) return false
      if (eventFilter !== 'all' && event !== eventFilter) return false
      if (!q) return true

      const haystack = `${event} ${severity} ${path} ${ip}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [rows, severityFilter, eventFilter, query])

  const exportCsv = () => {
    const header = ['time', 'event', 'severity', 'path', 'ip']
    const body = filtered.map((row) => {
      const details = (row.details ?? {}) as Record<string, unknown>
      const event = String(details.event ?? 'unknown')
      const severity = String(details.severity ?? 'low')
      const path = String(row.entity_id ?? '-')
      const ip = String(details.ip ?? '-')
      return [
        toCsvValue(new Date(row.created_at).toISOString()),
        toCsvValue(event),
        toCsvValue(severity),
        toCsvValue(path),
        toCsvValue(ip),
      ].join(',')
    })
    const csv = [header.join(','), ...body].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `security-events-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px 220px auto', gap: 12, marginBottom: 16 }}>
        <Input
          className={styles.formInput}
          placeholder='Search event, path, or IP'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select
          className={styles.formSelect}
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as 'all' | Severity)}
        >
          <option value='all'>All severities</option>
          <option value='low'>Low</option>
          <option value='medium'>Medium</option>
          <option value='high'>High</option>
          <option value='critical'>Critical</option>
        </Select>
        <Select
          className={styles.formSelect}
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
        >
          <option value='all'>All events</option>
          {eventOptions.map((event) => (
            <option key={event} value={event}>
              {event}
            </option>
          ))}
        </Select>
        <Button type='button' className={`${styles.btn} ${styles.btnSecondary}`} onClick={exportCsv}>
          Export CSV
        </Button>
      </div>

      <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-muted)' }}>
        Showing {filtered.length} / {rows.length} events
      </div>

      <div className={styles.dataTable}>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Event</th>
              <th>Severity</th>
              <th>Path</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const details = (row.details ?? {}) as Record<string, unknown>
              const event = String(details.event ?? 'unknown')
              const severity = String(details.severity ?? 'low')
              const path = String(row.entity_id ?? '-')
              const ip = String(details.ip ?? '-')
              return (
                <tr key={row.id}>
                  <td>{new Date(row.created_at).toLocaleString()}</td>
                  <td>{event}</td>
                  <td>
                    <span className={`${styles.badge} ${getSeverityBadgeClass(severity)}`}>{severity}</span>
                  </td>
                  <td>{path}</td>
                  <td>{ip}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
