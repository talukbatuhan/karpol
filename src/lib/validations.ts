import { z } from 'zod'

export const rfqSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  industry: z.string().optional(),
  product_interest: z.string().optional(),
  quantity: z.string().optional(),
  material_preference: z.string().optional(),
  hardness_requirement: z.string().optional(),
  urgency: z.enum(['standard', 'urgent', 'critical']).default('standard'),
  message: z.string().min(1, 'Message is required'),
  file_urls: z.array(z.string()).default([]),
  source_page: z.string().optional(),
  locale: z.string().optional(),
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
  locale: z.string().optional(),
})

export const catalogDownloadSchema = z.object({
  email: z.string().email('Valid email is required'),
  company: z.string().optional(),
  country: z.string().optional(),
  locale: z.string().optional(),
  catalog_name: z.string().min(1),
  file_url: z.string().url(),
})

export type RFQFormData = z.infer<typeof rfqSchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type CatalogDownloadData = z.infer<typeof catalogDownloadSchema>
