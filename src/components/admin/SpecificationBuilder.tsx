'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { ProductSpecification } from '@/types/database'
import styles from '@/app/admin/admin.module.css'

interface SpecificationBuilderProps {
  value: ProductSpecification[]
  onChange: (specs: ProductSpecification[]) => void
}

export default function SpecificationBuilder({ value, onChange }: SpecificationBuilderProps) {
  const addRow = () => {
    onChange([...value, { label: '', value: '', unit: '', test_method: '' }])
  }

  const updateRow = (index: number, field: keyof ProductSpecification, text: string) => {
    const updated = [...value]
    updated[index] = { ...updated[index], [field]: text }
    onChange(updated)
  }

  const removeRow = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Technical Specifications</label>
      <div className={styles.dataTable} style={{ marginBottom: 12 }}>
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
              <th>Unit</th>
              <th>Test Method</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {value.map((spec, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={spec.label}
                    onChange={(e) => updateRow(index, 'label', e.target.value)}
                    placeholder="e.g. Tensile Strength"
                    style={{ padding: '6px 10px', fontSize: 13 }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={spec.value}
                    onChange={(e) => updateRow(index, 'value', e.target.value)}
                    placeholder="e.g. 45"
                    style={{ padding: '6px 10px', fontSize: 13 }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={spec.unit || ''}
                    onChange={(e) => updateRow(index, 'unit', e.target.value)}
                    placeholder="e.g. MPa"
                    style={{ padding: '6px 10px', fontSize: 13 }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={spec.test_method || ''}
                    onChange={(e) => updateRow(index, 'test_method', e.target.value)}
                    placeholder="e.g. DIN 53504"
                    style={{ padding: '6px 10px', fontSize: 13 }}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
                    style={{ padding: 6 }}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={addRow} className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}>
        <Plus size={14} /> Add Specification
      </button>
    </div>
  )
}
