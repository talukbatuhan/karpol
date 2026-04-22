-- ============================================
-- KARPOL — Products: facets, structured attributes, category schema
-- Run in Supabase SQL Editor after supabase_schema.sql
-- ============================================

-- Category: hub grouping + facet UI config
ALTER TABLE public.product_categories
  ADD COLUMN IF NOT EXISTS nav_group_key TEXT,
  ADD COLUMN IF NOT EXISTS group_labels JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS facet_config JSONB NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_product_categories_nav_group ON public.product_categories(nav_group_key);

-- Products: facet values + clone audit + optional list grouping
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS structured_attributes JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS cloned_from_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS list_group_key TEXT;

CREATE INDEX IF NOT EXISTS idx_products_structured_attrs ON public.products USING GIN (structured_attributes jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_products_list_group ON public.products(list_group_key);
CREATE INDEX IF NOT EXISTS idx_products_cloned_from ON public.products(cloned_from_product_id);

-- Per-category dynamic field definitions (admin Specification Builder source of truth)
CREATE TABLE IF NOT EXISTS public.category_attribute_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.product_categories(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  label_tr TEXT NOT NULL DEFAULT '',
  label_en TEXT NOT NULL DEFAULT '',
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'number', 'select', 'multiselect', 'boolean')),
  options JSONB NOT NULL DEFAULT '[]',
  unit TEXT,
  is_filterable BOOLEAN NOT NULL DEFAULT false,
  is_required_for_publish BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  maps_to_spec_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (category_id, key)
);

DROP TRIGGER IF EXISTS update_category_attribute_definitions_updated_at ON public.category_attribute_definitions;
CREATE TRIGGER update_category_attribute_definitions_updated_at
  BEFORE UPDATE ON public.category_attribute_definitions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_cat_attr_def_category ON public.category_attribute_definitions(category_id, sort_order);

ALTER TABLE public.category_attribute_definitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read category_attribute_definitions" ON public.category_attribute_definitions;
CREATE POLICY "Public read category_attribute_definitions"
  ON public.category_attribute_definitions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.product_categories c
      WHERE c.id = category_attribute_definitions.category_id
        AND c.is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins full access category_attribute_definitions" ON public.category_attribute_definitions;
CREATE POLICY "Admins full access category_attribute_definitions"
  ON public.category_attribute_definitions
  FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
