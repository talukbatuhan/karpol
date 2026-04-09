import { createAdminClient } from '@/lib/supabase-admin'
import type {
  Product,
  ProductCategory,
  Article,
  RFQSubmission,
  ContactSubmission,
  Industry,
  MediaLibraryItem,
  AdminActivityLog,
} from '@/types/database'

type DataResponse<T> = { data: T[]; error: string | null }
type ItemResponse<T> = { data: T | null; error: string | null }

// ─── Dashboard Stats ────────────────────────────────────────
export async function getDashboardStats() {
  const supabase = createAdminClient()

  const [products, categories, articles, rfqNew, contacts] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('product_categories').select('id', { count: 'exact', head: true }),
    supabase.from('articles').select('id', { count: 'exact', head: true }),
    supabase.from('rfq_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
  ])

  return {
    totalProducts: products.count ?? 0,
    totalCategories: categories.count ?? 0,
    totalArticles: articles.count ?? 0,
    pendingRFQs: rfqNew.count ?? 0,
    newContacts: contacts.count ?? 0,
  }
}

// ─── Products ───────────────────────────────────────────────
export async function getAdminProducts(): Promise<DataResponse<Product>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })

  return { data: (data ?? []) as Product[], error: error?.message ?? null }
}

export async function getAdminProductById(id: string): Promise<ItemResponse<Product>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  return { data: data as Product | null, error: error?.message ?? null }
}

export async function upsertProduct(product: Partial<Product> & { id?: string }) {
  const supabase = createAdminClient()
  if (product.id) {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', product.id)
      .select()
      .single()
    return { data, error: error?.message ?? null }
  }
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single()
  return { data, error: error?.message ?? null }
}

export async function deleteProduct(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  return { error: error?.message ?? null }
}

// ─── Categories ─────────────────────────────────────────────
export async function getAdminCategories(): Promise<DataResponse<ProductCategory>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('sort_order', { ascending: true })

  return { data: (data ?? []) as ProductCategory[], error: error?.message ?? null }
}

export async function getAdminCategoryById(id: string): Promise<ItemResponse<ProductCategory>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  return { data: data as ProductCategory | null, error: error?.message ?? null }
}

export async function upsertCategory(category: Partial<ProductCategory> & { id?: string }) {
  const supabase = createAdminClient()
  if (category.id) {
    const { data, error } = await supabase
      .from('product_categories')
      .update(category)
      .eq('id', category.id)
      .select()
      .single()
    return { data, error: error?.message ?? null }
  }
  const { data, error } = await supabase
    .from('product_categories')
    .insert(category)
    .select()
    .single()
  return { data, error: error?.message ?? null }
}

export async function deleteCategory(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('product_categories').delete().eq('id', id)
  return { error: error?.message ?? null }
}

// ─── Articles ───────────────────────────────────────────────
export async function getAdminArticles(): Promise<DataResponse<Article>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  return { data: (data ?? []) as Article[], error: error?.message ?? null }
}

export async function getAdminArticleById(id: string): Promise<ItemResponse<Article>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  return { data: data as Article | null, error: error?.message ?? null }
}

export async function upsertArticle(article: Partial<Article> & { id?: string }) {
  const supabase = createAdminClient()
  if (article.id) {
    const { data, error } = await supabase
      .from('articles')
      .update(article)
      .eq('id', article.id)
      .select()
      .single()
    return { data, error: error?.message ?? null }
  }
  const { data, error } = await supabase
    .from('articles')
    .insert(article)
    .select()
    .single()
  return { data, error: error?.message ?? null }
}

export async function deleteArticle(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('articles').delete().eq('id', id)
  return { error: error?.message ?? null }
}

// ─── RFQ Submissions ────────────────────────────────────────
export async function getAdminRFQs(): Promise<DataResponse<RFQSubmission>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('rfq_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  return { data: (data ?? []) as RFQSubmission[], error: error?.message ?? null }
}

export async function getAdminRFQById(id: string): Promise<ItemResponse<RFQSubmission>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('rfq_submissions')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  return { data: data as RFQSubmission | null, error: error?.message ?? null }
}

export async function updateRFQStatus(id: string, status: string, notes?: string) {
  const supabase = createAdminClient()
  const update: Record<string, unknown> = { status }
  if (notes !== undefined) update.internal_notes = notes
  if (status === 'quoted') update.quoted_at = new Date().toISOString()

  const { error } = await supabase
    .from('rfq_submissions')
    .update(update)
    .eq('id', id)

  return { error: error?.message ?? null }
}

// ─── Contact Submissions ────────────────────────────────────
export async function getAdminContacts(): Promise<DataResponse<ContactSubmission>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  return { data: (data ?? []) as ContactSubmission[], error: error?.message ?? null }
}

// ─── Industries ─────────────────────────────────────────────
export async function getAdminIndustries(): Promise<DataResponse<Industry>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('industries')
    .select('*')
    .order('sort_order', { ascending: true })

  return { data: (data ?? []) as Industry[], error: error?.message ?? null }
}

export async function upsertIndustry(industry: Partial<Industry> & { id?: string }) {
  const supabase = createAdminClient()
  if (industry.id) {
    const { data, error } = await supabase
      .from('industries')
      .update(industry)
      .eq('id', industry.id)
      .select()
      .single()
    return { data, error: error?.message ?? null }
  }
  const { data, error } = await supabase
    .from('industries')
    .insert(industry)
    .select()
    .single()
  return { data, error: error?.message ?? null }
}

// ─── Media Library ──────────────────────────────────────────
export async function getAdminMedia(): Promise<DataResponse<MediaLibraryItem>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('media_library')
    .select('*')
    .order('created_at', { ascending: false })

  return { data: (data ?? []) as MediaLibraryItem[], error: error?.message ?? null }
}

export async function insertMedia(media: Omit<MediaLibraryItem, 'id' | 'created_at'>) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('media_library')
    .insert(media)
    .select()
    .single()
  return { data: data as MediaLibraryItem | null, error: error?.message ?? null }
}

export async function deleteMedia(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('media_library').delete().eq('id', id)
  return { error: error?.message ?? null }
}

type LogAdminActivityInput = {
  userId?: string | null
  action: AdminActivityLog['action']
  entityType: AdminActivityLog['entity_type']
  entityId?: string | null
  details?: Record<string, unknown>
}

type SecurityEventInput = {
  event: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  requestPath: string
  ip?: string | null
  userId?: string | null
  details?: Record<string, unknown>
}

export async function logAdminActivity({
  userId,
  action,
  entityType,
  entityId,
  details,
}: LogAdminActivityInput) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('admin_activity_log').insert({
    user_id: userId || undefined,
    action,
    entity_type: entityType,
    entity_id: entityId || undefined,
    details: details || undefined,
  })

  return { error: error?.message ?? null }
}

export async function logSecurityEvent({
  event,
  severity,
  requestPath,
  ip,
  userId,
  details,
}: SecurityEventInput) {
  return logAdminActivity({
    userId,
    action: 'status_change',
    entityType: 'page_content',
    entityId: requestPath,
    details: {
      type: 'security_event',
      event,
      severity,
      ip,
      ...details,
    },
  })
}

export async function getAdminSecurityEvents(limit = 100) {
  const supabase = createAdminClient()
  const safeLimit = Math.min(Math.max(limit, 1), 500)
  const { data, error } = await supabase
    .from('admin_activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(safeLimit)

  if (error) {
    return { data: [] as AdminActivityLog[], error: error.message }
  }

  const filtered = (data ?? []).filter((item) => {
    const details = item.details as Record<string, unknown> | undefined
    return details?.type === 'security_event'
  }) as AdminActivityLog[]

  return { data: filtered, error: null }
}
