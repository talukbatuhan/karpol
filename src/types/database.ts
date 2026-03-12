/* ============================================
   KARPOL — Database Types
   Supabase tablo tipleri
   ============================================ */

export interface Product {
  id: string
  created_at: string
  updated_at: string
  slug: string
  sku: string
  name: string
  name_tr?: string
  description: string
  description_tr?: string
  category_id: string
  material: string
  hardness?: string
  hardness_unit?: string
  temperature_min?: number
  temperature_max?: number
  color?: string
  applications: string[]
  compatible_machines: string[]
  images: string[]
  technical_drawing_url?: string
  datasheet_url?: string
  is_featured: boolean
  is_active: boolean
  sort_order: number
  size_table?: ProductSizeRow[]
  gallery_json?: (string | ProductGalleryAsset)[]
  gallery_images?: (string | ProductGalleryAsset)[]
  product_gallery?: (string | ProductGalleryAsset)[]
}

export interface ProductSizeRow {
  size: string
  wing?: string
  outerDiameter: string
  innerDiameter: string
  width: string
}

export interface ProductGalleryAsset {
  url?: string
  src?: string
  image_url?: string
  title?: string
  alt?: string
}

export interface ProductCategory {
  id: string
  created_at: string
  slug: string
  name: string
  name_tr?: string
  description: string
  description_tr?: string
  image_url?: string
  icon?: string
  prefix: string // PU-, VK-, RB-, etc.
  sort_order: number
  is_active: boolean
}

export interface Industry {
  id: string
  created_at: string
  slug: string
  name: string
  name_tr?: string
  description: string
  description_tr?: string
  challenges: string[]
  solutions: string[]
  image_url?: string
  hero_image_url?: string
  is_featured: boolean
  sort_order: number
}

export interface IndustryProduct {
  id: string
  industry_id: string
  product_id: string
  usage_description?: string
}

export interface Article {
  id: string
  created_at: string
  updated_at: string
  published_at?: string
  slug: string
  title: string
  title_tr?: string
  excerpt: string
  excerpt_tr?: string
  content: string
  content_tr?: string
  cover_image_url?: string
  category: 'material' | 'industry' | 'process' | 'technical'
  tags: string[]
  target_keyword?: string
  is_published: boolean
  is_featured: boolean
  author?: string
}

export interface RFQSubmission {
  id: string
  created_at: string
  name: string
  email: string
  phone?: string
  company?: string
  industry?: string
  product_interest?: string
  quantity?: string
  material_preference?: string
  hardness_requirement?: string
  message: string
  file_urls: string[]
  status: 'new' | 'reviewed' | 'quoted' | 'closed'
  notes?: string
}

export interface ContactSubmission {
  id: string
  created_at: string
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied'
}

export interface CatalogDownload {
  id: string
  created_at: string
  email: string
  company?: string
  catalog_name: string
  file_url: string
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
        Insert: Omit<ProductCategory, 'id' | 'created_at'>
        Update: Partial<Omit<ProductCategory, 'id' | 'created_at'>>
      }
      industries: {
        Row: Industry
        Insert: Omit<Industry, 'id' | 'created_at'>
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
    }
  }
}
