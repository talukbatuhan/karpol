'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import I18nFieldEditor from '@/components/admin/I18nFieldEditor'
import { saveArticle } from '@/lib/actions/admin-article-actions'
import type { LocalizedField } from '@/types/database'
import styles from '../../admin.module.css'

const CATEGORIES = [
  { value: 'material', label: 'Material Science' },
  { value: 'industry', label: 'Industry Application' },
  { value: 'process', label: 'Manufacturing Process' },
  { value: 'technical', label: 'Technical Guide' },
  { value: 'guide', label: 'How-to Guide' },
]

export default function NewArticlePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState<LocalizedField>({})
  const [excerpt, setExcerpt] = useState<LocalizedField>({})
  const [content, setContent] = useState<LocalizedField>({})
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('material')
  const [tags, setTags] = useState('')
  const [targetKeyword, setTargetKeyword] = useState('')
  const [author, setAuthor] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const result = await saveArticle({
      title,
      excerpt,
      content,
      slug,
      category,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      target_keyword: targetKeyword || undefined,
      author: author || undefined,
      is_published: isPublished,
      is_featured: isFeatured,
      published_at: isPublished ? new Date().toISOString() : undefined,
    })

    if (result.error) {
      setError(result.error)
      setSaving(false)
    } else {
      router.push('/admin/articles')
    }
  }

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <Link href="/admin/articles" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.topBarTitle}>New Article</h1>
        </div>
        <div className={styles.topBarRight}>
          <button type="submit" form="article-form" className={`${styles.btn} ${styles.btnPrimary}`} disabled={saving}>
            {saving ? 'Saving...' : 'Publish Article'}
          </button>
        </div>
      </div>

      <div className={styles.pageContent}>
        {error && (
          <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#991b1b', borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
            {error}
          </div>
        )}

        <form id="article-form" onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
            <div>
              <I18nFieldEditor label="Title" value={title} onChange={setTitle} required />
              <I18nFieldEditor label="Excerpt" value={excerpt} onChange={setExcerpt} multiline />
              <I18nFieldEditor label="Content" value={content} onChange={setContent} multiline />
            </div>

            <div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Slug <span style={{ color: '#e8611a' }}>*</span></label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  placeholder="polyurethane-material-guide"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category</label>
                <select className={styles.formSelect} value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tags (comma separated)</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="polyurethane, roller, hardness"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Target SEO Keyword</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  placeholder="polyurethane roller hardness"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Author</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="KARPOL Engineering"
                />
              </div>

              <div className={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
                  <span className={styles.formLabel} style={{ marginBottom: 0 }}>Publish immediately</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                  <span className={styles.formLabel} style={{ marginBottom: 0 }}>Featured article</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
