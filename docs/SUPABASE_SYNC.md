# Supabase — Uzak şema senkronizasyonu

## Durum

Kod tabanı **yeni şemayı** bekler (`categories` tablosu, `products.category_id`).

Uzak proje (`lmfulxcsowlcezqxoand`) şu an **eski şemada**:

- `products.category` enum (`tip_bt`, `makara`, …)
- `categories` tablosu yok
- `contact_submissions` tablosu var (kodda henüz kullanılmıyor)

Bu yüzden `npm run types:gen` çıktısı build'i kırar. `database.types.ts` repodaki migration'lara göre tutulur.

## Hedef

Uzak DB'yi `supabase/migrations/` ile hizalamak.

## Adımlar (Supabase Dashboard veya CLI)

### 1. Mevcut migration'ları "uygulandı" işaretle

İlk üç migration uzakta zaten kısmen var. CLI ile:

```bash
npx supabase migration repair --status applied 20260521000001
npx supabase migration repair --status applied 20260521000002
npx supabase migration repair --status applied 20260521000003
```

### 2. Kategoriler migration'ını uygula

```bash
npm run supabase:push
```

Yalnızca `20260522000004_categories.sql` çalışmalı. Hata alırsanız SQL'i Dashboard → SQL Editor'den manuel çalıştırın.

### 3. Tipleri yeniden üret

```bash
npm run types:gen
npm run build
```

## Doğrulama

- Admin → Kategoriler sayfası açılır
- Ürün eklerken kategori seçimi çalışır
- `/tr/products` yayınlanmış ürünleri listeler

## Not

`db push` sırasında `product_status already exists` hatası = init migration zaten uygulanmış; `migration repair` gerekir.
