# Karpol CMS (Supabase)

Admin panel: `/admin` — locale dışında, `profiles.role = 'admin'` ile korunur.

## Kurulum

1. [Supabase CLI](https://supabase.com/docs/guides/cli) kurun.
2. Proje kökünde `.env.local` oluşturun (`.env.example` şablonu).
3. Yerel Supabase:

```bash
supabase start
supabase db reset
```

Migration dosyaları: `supabase/migrations/`.

## İlk admin

1. `/admin/login` üzerinden kayıt olun (Auth signup açık).
2. Supabase Studio veya SQL:

```sql
update public.profiles
set role = 'admin'
where id = '<auth-user-uuid>';
```

## Kategoriler

- Tablo: `public.categories` — `slug`, `name_tr`, `name_en`, `parent_id`, `sort_order`
- Admin: `/admin/categories` — oluştur, düzenle, sil (ürün bağlıysa silme engellenir)
- Hiyerarşi: `parent_id` ile üst-alt kategori; döngü engellenir

## Ürünler

- Tablo: `public.products` — `category_id` ile kategoriye bağlı
- Durum: `draft` | `published` — anon yalnızca `published` okur (RLS).
- Seed: `20260521000003_seed_products.sql` (makara, damper, silim).

Public sayfalar `revalidate = 60`; admin mutasyonları `revalidatePath` ile `/tr|en/products` günceller.

## Storage

| Bucket | Amaç |
|--------|------|
| `product-images` | Görseller (public read) |
| `product-files` | CAD / PDF (public read) |

Upload / silme: yalnızca admin (`is_admin()`).

Admin dosya yöneticisi: `/admin/files` — yüklenen path’i ürün formunda `metadata.assets` alanına yazın.

## Ortam değişkenleri

| Değişken | Kullanım |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Tüm istemciler |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server session |
| `SUPABASE_SERVICE_ROLE_KEY` | E2E seed, güvenilir sunucu işleri |
| `NEXT_PUBLIC_SITE_URL` | SEO canonical, sitemap |

## E2E

```bash
supabase start
npm run test:e2e
```

`E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` ile admin CRUD testleri; RLS testi anon anahtar ile draft SELECT reddini doğrular.
