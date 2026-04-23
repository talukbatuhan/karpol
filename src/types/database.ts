/* ============================================
   KARPOL — Database Types v2.0
   JSONB-based i18n (public site: EN, TR)
   ============================================ */

export type SupportedLocale = "en" | "tr";

export type LocalizedField = Partial<Record<SupportedLocale, string>>
export type LocalizedArrayField = Partial<Record<SupportedLocale, string[]>>

export interface ProductSpecification {
  label: string
  value: string
  unit?: string
  test_method?: string
}

/**
 * @deprecated Eski sabit-şemalı satır. Yeni kayıtlar `SizeTable` kullanır.
 * Geriye uyumluluk için tutuluyor; `normalizeSizeTable` runtime'da otomatik dönüştürür.
 */
export interface ProductSizeRow {
  size: string
  wing?: string
  outerDiameter: string
  innerDiameter: string
  width: string
}

export type SizeColumnAlign = 'left' | 'center' | 'right'

/**
 * Otomatik doldurma yapılandırması. Aktifken yeni eklenen satırlarda bu sütun
 * `${prefix}${pad(start + index)}` deseniyle önceden doldurulur. Kullanıcı her
 * hücreyi elle düzenleyebilir.
 *
 * Örn. prefix="KRP-ST/", padding=2, start=1 → "KRP-ST/01", "KRP-ST/02", ...
 */
export interface SizeColumnAutoFill {
  enabled: boolean
  prefix: string
  /** Sayı kaç haneli yazılsın (1=1, 2=01, 3=001 …). */
  padding: number
  /** Başlangıç sayısı (varsayılan 1). */
  start: number
}

export interface SizeColumn {
  /** Sütunun benzersiz makine-okunur anahtarı (slug). Satır verisinde key olarak kullanılır. */
  key: string
  /** Sütun başlığı (her dil için). */
  label: LocalizedField
  /** İsteğe bağlı birim (örn. "mm", "kg"). Başlık yanında parantez içinde gösterilir. */
  unit?: string
  /** Hücre hizalama. Sayısal sütunlarda 'right' önerilir. */
  align?: SizeColumnAlign
  /** Otomatik model/seri numarası üretici. */
  autoFill?: SizeColumnAutoFill
}

export type SizeRow = Record<string, string>

export interface SizeTable {
  columns: SizeColumn[]
  rows: SizeRow[]
}

export const EMPTY_SIZE_TABLE: SizeTable = { columns: [], rows: [] }

export interface ProductGalleryAsset {
  url: string
  alt?: LocalizedField
  type?: 'photo' | 'technical' | 'application'
}

export interface ProductModules {
  specifications: boolean
  size_table: boolean
  technical_drawing: boolean
  model_3d: boolean
  gallery: boolean
  datasheet: boolean
  applications: boolean
}

export const DEFAULT_PRODUCT_MODULES: ProductModules = {
  specifications: true,
  size_table: false,
  technical_drawing: false,
  model_3d: false,
  gallery: false,
  datasheet: false,
  applications: false,
}

export interface ProductTechnicalDrawing {
  url: string
  caption?: LocalizedField
}

export interface ProductModel3D {
  glb_url?: string
  stp_url?: string
  preview_image_url?: string
}

export interface ProductDatasheet {
  url: string
  label?: LocalizedField
}

/** Facet panel config for category listing (defaults: material/hardness true if omitted). */
export interface CategoryFacetConfig {
  material?: boolean
  hardness?: boolean
  /** When true, show industry / machine line facet (from `industry_products`). */
  industry?: boolean
  /** Extra facet keys matching `category_attribute_definitions.key` with is_filterable. */
  customFacetKeys?: string[]
}

export type CategoryAttributeFieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'boolean'

export interface CategoryAttributeDefinition {
  id: string
  category_id: string
  key: string
  label_tr: string
  label_en: string
  field_type: CategoryAttributeFieldType
  /** Select/multiselect options as string list */
  options: string[]
  unit?: string | null
  is_filterable: boolean
  is_required_for_publish: boolean
  sort_order: number
  maps_to_spec_key?: string | null
  created_at: string
  updated_at: string
}

export type StructuredAttributeValue = string | number | boolean | string[]

export interface ProductCategory {
  id: string
  parent_id?: string | null
  slug: string
  slugs?: LocalizedField
  name: LocalizedField
  description: LocalizedField
  image_url?: string
  icon?: string
  prefix: string
  sort_order: number
  is_active: boolean
  meta_title?: LocalizedField
  meta_description?: LocalizedField
  /** Hub / grouped list: stable key (e.g. polymers, metals). */
  nav_group_key?: string | null
  /** Optional section title per locale for hub cards. */
  group_labels?: LocalizedField
  /** Which facets to show on the public category page. */
  facet_config?: CategoryFacetConfig | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  slug: string
  slugs?: LocalizedField
  sku: string
  name: LocalizedField
  description: LocalizedField
  short_description?: LocalizedField
  category_id: string
  /** Filterable/custom fields from category schema (JSONB). */
  structured_attributes?: Record<string, StructuredAttributeValue> | null
  /** Optional subsection title on category grid. */
  list_group_key?: string | null
  material?: string
  hardness?: string
  hardness_unit?: string
  temperature_min?: number
  temperature_max?: number
  color?: string
  weight?: string
  dimensions?: Record<string, string>
  applications?: LocalizedArrayField
  compatible_machines: string[]
  specifications?: ProductSpecification[]
  /**
   * Esnek ölçü tablosu (sütun + satır şeması). Geriye uyumluluk için eski
   * `ProductSizeRow[]` formatı da kabul edilir; `normalizeSizeTable` çağrılmalı.
   */
  size_table?: SizeTable | ProductSizeRow[]
  images: string[]
  gallery?: ProductGalleryAsset[]
  model_3d_url?: string
  technical_drawing_url?: string
  datasheet_url?: string
  modules?: ProductModules
  technical_drawings?: ProductTechnicalDrawing[]
  model_3d?: ProductModel3D
  datasheets?: ProductDatasheet[]
  is_featured: boolean
  is_active: boolean
  sort_order: number
  meta_title?: LocalizedField
  meta_description?: LocalizedField
  cloned_from_product_id?: string | null
  created_at: string
  updated_at: string
}

export interface Industry {
  id: string
  slug: string
  name: LocalizedField
  description: LocalizedField
  challenges?: LocalizedArrayField
  solutions?: LocalizedArrayField
  image_url?: string
  hero_image_url?: string
  is_featured: boolean
  sort_order: number
  meta_title?: LocalizedField
  meta_description?: LocalizedField
  created_at: string
  updated_at: string
}

export interface IndustryProduct {
  id: string
  industry_id: string
  product_id: string
  usage_description?: string
}

export interface Article {
  id: string
  slug: string
  title: LocalizedField
  excerpt: LocalizedField
  content: LocalizedField
  cover_image_url?: string
  category: 'material' | 'industry' | 'process' | 'technical' | 'guide'
  tags: string[]
  target_keyword?: string
  author?: string
  is_published: boolean
  is_featured: boolean
  published_at?: string
  meta_title?: LocalizedField
  meta_description?: LocalizedField
  created_at: string
  updated_at: string
}

export interface RFQLineItem {
  product_id?: string
  product_sku?: string
  product_name?: string
  quantity?: string
  notes?: string
}

export interface RFQSubmission {
  id: string
  created_at: string
  name: string
  email: string
  phone?: string
  company?: string
  country?: string
  industry?: string
  product_interest?: string
  quantity?: string
  material_preference?: string
  hardness_requirement?: string
  urgency: 'standard' | 'urgent' | 'critical'
  message: string
  file_urls: string[]
  /** Multi-product cart / quote list (optional DB column). */
  line_items?: RFQLineItem[] | null
  source_page?: string
  locale?: string
  status: 'new' | 'in_review' | 'quoted' | 'accepted' | 'rejected' | 'closed'
  assigned_to?: string
  internal_notes?: string
  quoted_at?: string
  quoted_amount?: number
}

export interface ContactSubmission {
  id: string
  created_at: string
  name: string
  email: string
  phone?: string
  company?: string
  country?: string
  subject: string
  message: string
  locale?: string
  status: 'new' | 'read' | 'replied'
}

export interface CatalogDownload {
  id: string
  created_at: string
  email: string
  company?: string
  country?: string
  locale?: string
  catalog_name: string
  file_url: string
}

export interface MediaLibraryItem {
  id: string
  file_name: string
  file_url: string
  file_type: 'image' | 'document' | '3d-model' | 'technical-drawing'
  mime_type?: string
  file_size?: number
  alt_text?: LocalizedField
  tags: string[]
  uploaded_by?: string
  created_at: string
}

export interface PageContent {
  id: string
  page_key: string
  section_key: string
  content: LocalizedField | Record<string, unknown>
  media_urls: string[]
  sort_order: number
  is_active: boolean
  updated_at: string
}

export interface AdminActivityLog {
  id: string
  user_id?: string
  action: 'create' | 'update' | 'delete' | 'status_change'
  entity_type: 'product' | 'article' | 'rfq' | 'category' | 'industry' | 'media' | 'page_content' | 'contact'
  entity_id?: string
  details?: Record<string, unknown>
  created_at: string
}

/* ============================================
   Supabase Database Type Helper
   ============================================ */

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at'>>
      }
      product_categories: {
        Row: ProductCategory
        Insert: Omit<ProductCategory, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ProductCategory, 'id' | 'created_at'>>
      }
      category_attribute_definitions: {
        Row: CategoryAttributeDefinition
        Insert: Omit<CategoryAttributeDefinition, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CategoryAttributeDefinition, 'id' | 'created_at'>>
      }
      industries: {
        Row: Industry
        Insert: Omit<Industry, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Industry, 'id' | 'created_at'>>
      }
      industry_products: {
        Row: IndustryProduct
        Insert: Omit<IndustryProduct, 'id'>
        Update: Partial<Omit<IndustryProduct, 'id'>>
      }
      articles: {
        Row: Article
        Insert: Omit<Article, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Article, 'id' | 'created_at'>>
      }
      rfq_submissions: {
        Row: RFQSubmission
        Insert: Omit<RFQSubmission, 'id' | 'created_at'>
        Update: Partial<Omit<RFQSubmission, 'id' | 'created_at'>>
      }
      contact_submissions: {
        Row: ContactSubmission
        Insert: Omit<ContactSubmission, 'id' | 'created_at'>
        Update: Partial<Omit<ContactSubmission, 'id' | 'created_at'>>
      }
      catalog_downloads: {
        Row: CatalogDownload
        Insert: Omit<CatalogDownload, 'id' | 'created_at'>
        Update: Partial<Omit<CatalogDownload, 'id' | 'created_at'>>
      }
      media_library: {
        Row: MediaLibraryItem
        Insert: Omit<MediaLibraryItem, 'id' | 'created_at'>
        Update: Partial<Omit<MediaLibraryItem, 'id' | 'created_at'>>
      }
      page_content: {
        Row: PageContent
        Insert: Omit<PageContent, 'id' | 'updated_at'>
        Update: Partial<Omit<PageContent, 'id'>>
      }
      admin_activity_log: {
        Row: AdminActivityLog
        Insert: Omit<AdminActivityLog, 'id' | 'created_at'>
        Update: never
      }
    }
  }
}
