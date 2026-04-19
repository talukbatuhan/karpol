-- ============================================
-- KARPOL — Ürün Modülleri Migration
-- ============================================
-- ÖNEMLİ: Bu dosyayı çalıştırmadan ÖNCE supabase_schema.sql dosyasını çalıştırın!
-- Aksi takdirde "relation public.products does not exist" hatası alırsınız.
--
-- Her üründe hangi içerik bloklarının aktif olduğunu saklar.
-- Ayrıca yeni blok alanlarını ekler (teknik resim listesi, 3D model, datasheet listesi).

-- 0) Ön kontrol: products tablosu var mı?
do $$
begin
  if not exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'products'
  ) then
    raise exception 'products tablosu bulunamadı. Önce supabase_schema.sql dosyasını çalıştırın.';
  end if;
end $$;

-- 1) products tablosuna modules ve yeni içerik kolonları ekle
alter table public.products
  add column if not exists modules jsonb
    default jsonb_build_object(
      'specifications', true,
      'size_table', false,
      'technical_drawing', false,
      'model_3d', false,
      'gallery', false,
      'datasheet', false,
      'applications', false
    );

alter table public.products
  add column if not exists technical_drawings jsonb default '[]'::jsonb;

alter table public.products
  add column if not exists model_3d jsonb default '{}'::jsonb;

alter table public.products
  add column if not exists datasheets jsonb default '[]'::jsonb;

-- 2) Mevcut tüm ürünler için default modül ayarla (null olanları doldur)
update public.products
set modules = jsonb_build_object(
    'specifications', true,
    'size_table', false,
    'technical_drawing', false,
    'model_3d', false,
    'gallery', false,
    'datasheet', false,
    'applications', false
  )
where modules is null;

-- ============================================
-- 3) product-assets bucket (teknik resim / 3D / datasheet / galeri)
-- ============================================
insert into storage.buckets (id, name, public, file_size_limit)
values ('product-assets', 'product-assets', true, 52428800) -- 50MB
on conflict (id) do nothing;

-- 4) Public read (herkes görebilir)
drop policy if exists "Public can read product-assets" on storage.objects;
create policy "Public can read product-assets"
on storage.objects
for select
to public
using (bucket_id = 'product-assets');

-- 5) Admin write (sadece admin yükleyebilir)
drop policy if exists "Admins can upload product-assets" on storage.objects;
create policy "Admins can upload product-assets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-assets'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "Admins can update product-assets" on storage.objects;
create policy "Admins can update product-assets"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-assets'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
with check (
  bucket_id = 'product-assets'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "Admins can delete product-assets" on storage.objects;
create policy "Admins can delete product-assets"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-assets'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Not: Upload işlemleri backend'te service-role key ile yapıldığı için
-- bu politikalar browser'dan direkt upload yapılmasını engelleyecek bir
-- güvenlik katmanı sağlar (defense in depth).
