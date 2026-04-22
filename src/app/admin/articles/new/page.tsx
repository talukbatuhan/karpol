'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import I18nFieldEditor from '@/components/admin/I18nFieldEditor'
import { saveArticle } from '@/lib/actions/admin-article-actions'
import type { LocalizedField } from '@/types/database'
import styles from '../../admin.module.css'
import { Label, Input, Select, Button, FormAlert } from '@/components/ui'

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
          <Button
            type="submit"
            form="article-form"
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Publish Article'}
          </Button>
        </div>
      </div>

      <div className={styles.pageContent}>
        {error && <FormAlert variant="adminBanner">{error}</FormAlert>}

        <form id="article-form" onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
            <div>
              <I18nFieldEditor label="Title" value={title} onChange={setTitle} required />
              <I18nFieldEditor label="Excerpt" value={excerpt} onChange={setExcerpt} multiline />
              <I18nFieldEditor label="Content" value={content} onChange={setContent} multiline />
            </div>

            <div>
              <div className={styles.formGroup}>
                <Label htmlFor="article-slug" className={styles.formLabel}>
                  Slug <span style={{ color: '#e8611a' }}>*</span>
                </Label>
                <Input
                  id="article-slug"
                  type="text"
                  className={styles.formInput}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  placeholder="polyurethane-material-guide"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="article-category" className={styles.formLabel}>
                  Category
                </Label>
                <Select
                  id="article-category"
                  className={styles.formSelect}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </Select>
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="article-tags" className={styles.formLabel}>
                  Tags (comma separated)
                </Label>
                <Input
                  id="article-tags"
                  type="text"
                  className={styles.formInput}
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="polyurethane, roller, hardness"
                />
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="article-keyword" className={styles.formLabel}>
                  Target SEO Keyword
                </Label>
                <Input
                  id="article-keyword"
                  type="text"
                  className={styles.formInput}
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  placeholder="polyurethane roller hardness"
                />
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="article-author" className={styles.formLabel}>
                  Author
                </Label>
                <Input
                  id="article-author"
                  type="text"
                  className={styles.formInput}
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="KARPOL Engineering"
                />
              </div>

              <div className={styles.formGroup}>
                <Label
                  style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                >
                  <Input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                  />
                  <span className={styles.formLabel} style={{ marginBottom: 0 }}>Publish immediately</span>
                </Label>
              </div>

              <div className={styles.formGroup}>
                <Label
                  style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                >
                  <Input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  <span className={styles.formLabel} style={{ marginBottom: 0 }}>Featured article</span>
                </Label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
