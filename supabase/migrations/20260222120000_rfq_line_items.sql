-- Optional multi-product line items for RFQ submissions (Karpol quote list).
-- Run in Supabase SQL editor or via `supabase db push` if CLI is linked.

alter table if exists public.rfq_submissions
  add column if not exists line_items jsonb default '[]'::jsonb;

comment on column public.rfq_submissions.line_items is 'Array of { product_id?, product_sku?, product_name?, quantity?, notes? }';
