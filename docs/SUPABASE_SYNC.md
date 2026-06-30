# Supabase — Şema kurulumu

Migration dosyaları yalnızca şema ve altyapı içerir; örnek ürün veya kategori verisi eklenmez.

## Dosyalar

| Dosya | İçerik |
|-------|--------|
| `20260521000001_init_cms.sql` | `profiles`, `categories`, `products`, RLS, trigger'lar |
| `20260521000002_storage.sql` | `product-images` / `product-files` bucket'ları ve storage RLS |

## Uzak projeye uygulama

```bash
npm run supabase:login
npm run supabase:link
npm run supabase:push
```

Boş yeni proje için tüm migration'lar sırayla çalışır.

## Doğrulama

1. `/admin/login` ile kayıt olun; SQL ile `profiles.role = 'admin'` yapın.
2. `/admin/categories` — en az bir kategori ekleyin.
3. `/admin/products` — ürün oluşturup yayınlayın.
4. `/tr/products` — yayınlanmış ürünler listelenir.

## Tipler

```bash
npm run types:gen
npm run build
```
