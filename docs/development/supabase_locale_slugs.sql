-- ============================================
-- KARPOL — Locale-Aware Slugs Migration
-- ============================================
-- products ve product_categories için per-locale slug desteği.
-- Eski `slug` (TEXT UNIQUE) kolonu canonical/internal olarak kalır.
-- Yeni `slugs` (JSONB) kolonu URL'lerde gösterilen lokalize slug'ları tutar.
-- Format: { "tr": "kaucuk-titresim-takozu", "en": "rubber-vibration-block" }
--
-- ÖNEMLİ: Bu dosyayı çalıştırmadan önce supabase_schema.sql + supabase_categories_align.sql çalışmış olmalı.

-- 0) Ön kontrol
do $$
begin
  if not exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'products'
  ) then
    raise exception 'products tablosu yok. Önce supabase_schema.sql çalıştırın.';
  end if;
end $$;

-- ============================================
-- 1) products.slugs jsonb
-- ============================================
alter table public.products
  add column if not exists slugs jsonb default '{}'::jsonb;

-- Mevcut tüm ürünler için slugs alanını canonical slug ile doldur (her dil için aynı)
update public.products
set slugs = jsonb_build_object('tr', slug, 'en', slug)
where slugs is null or slugs = '{}'::jsonb;

-- Slug lookup performansı için fonksiyonel indeksler
create index if not exists idx_products_slug_tr on public.products ((slugs->>'tr'));
create index if not exists idx_products_slug_en on public.products ((slugs->>'en'));

-- ============================================
-- 2) product_categories.slugs jsonb
-- ============================================
alter table public.product_categories
  add column if not exists slugs jsonb default '{}'::jsonb;

-- Mevcut kategoriler için slugs'ı önce canonical ile doldur
update public.product_categories
set slugs = jsonb_build_object('tr', slug, 'en', slug)
where slugs is null or slugs = '{}'::jsonb;

-- Türkçe lokalize slug'ları manuel olarak yerleştir (canonical = İngilizce kalır)
update public.product_categories set slugs = jsonb_build_object('tr', 'poliuretan-bilesenler',         'en', slug) where slug = 'polyurethane-components';
update public.product_categories set slugs = jsonb_build_object('tr', 'vulkollan-bilesenler',          'en', slug) where slug = 'vulkollan-components';
update public.product_categories set slugs = jsonb_build_object('tr', 'kaucuk-bilesenler',             'en', slug) where slug = 'rubber-components';
update public.product_categories set slugs = jsonb_build_object('tr', 'silikon-bilesenler',            'en', slug) where slug = 'silicone-components';
update public.product_categories set slugs = jsonb_build_object('tr', 'teknik-plastikler',             'en', slug) where slug = 'technical-plastics';
update public.product_categories set slugs = jsonb_build_object('tr', 'aluminyum-islenmis-parcalar',   'en', slug) where slug = 'aluminum-machined-parts';
update public.product_categories set slugs = jsonb_build_object('tr', 'krom-kaplamali-bilesenler',     'en', slug) where slug = 'chrome-plated-components';
update public.product_categories set slugs = jsonb_build_object('tr', 'ozel-muhendislik-parcalari',    'en', slug) where slug = 'custom-engineered-parts';
update public.product_categories set slugs = jsonb_build_object('tr', 'vakum-tutma-bilesenleri',       'en', slug) where slug = 'vacuum-handling-components';
update public.product_categories set slugs = jsonb_build_object('tr', 'konveyor-tasima-parcalari',     'en', slug) where slug = 'conveyor-transport-parts';
update public.product_categories set slugs = jsonb_build_object('tr', 'mermer-makine-yedek-parcalari', 'en', slug) where slug = 'marble-machine-spare-parts';

create index if not exists idx_categories_slug_tr on public.product_categories ((slugs->>'tr'));
create index if not exists idx_categories_slug_en on public.product_categories ((slugs->>'en'));

-- ============================================
-- 3) Doğrulama
-- ============================================
-- select slug, slugs->>'tr' as tr, slugs->>'en' as en
-- from public.product_categories
-- order by sort_order;
--
-- Beklenen örnek:
--   rubber-components   |  kaucuk-bilesenler   |  rubber-components
