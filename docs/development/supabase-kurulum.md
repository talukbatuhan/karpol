# Supabase Kurulum Sırası

SQL dosyalarını **bu sırayla** Supabase Dashboard → SQL Editor'da çalıştırın:

## 1) Ana şema (bir kez)

**Dosya:** `supabase_schema.sql`

Tüm tabloları (`products`, `product_categories`, `articles`, `rfq_submissions`, vb.) ve RLS politikalarını oluşturur. Ayrıca seed verisi olarak 8 ürün kategorisi ve 6 sektör ekler.

> Eğer Supabase projeniz tamamen boşsa **ilk önce bunu çalıştırmalısınız**.

## 2) Katalog storage politikaları (bir kez)

**Dosya:** `supabase_storage_policies.sql`

`catalogs` storage bucket'ını ve onun erişim politikalarını oluşturur. Sadece katalog özelliğini kullanacaksanız gereklidir.

## 3) Ürün modülleri migration (bir kez)

**Dosya:** `supabase_product_modules.sql`

`products` tablosuna `modules`, `technical_drawings`, `model_3d`, `datasheets` kolonlarını ekler. Ayrıca `product-assets` storage bucket'ını ve politikalarını kurar.

> Bu dosya `products` tablosunun var olup olmadığını otomatik kontrol eder.
> "relation public.products does not exist" hatası alıyorsanız → önce **adım 1**.

## 4) Kategori slug hizalama (bir kez)

**Dosya:** `supabase_categories_align.sql`

Veritabanındaki kategori slug'larını frontend `productCategories` (src/lib/config.ts) listesi ile eşler. Bu adım **kritik** — yapılmazsa kategori sayfaları 404 verir, ürünler hub'da görünmez.

Yapılan değişiklikler:
- `polyurethane` → `polyurethane-components`
- `vulkolan` → `vulkollan-components`
- `rubber` → `rubber-components`
- `silicone` → `silicone-components`
- `ptfe-teflon` → `technical-plastics`
- `aluminum-cnc` → `aluminum-machined-parts`
- Yeni eklenenler: `chrome-plated-components`, `custom-engineered-parts`, `vacuum-handling-components`, `conveyor-transport-parts`, `marble-machine-spare-parts`

Doğrulama (SQL Editor):

```sql
select slug, name->>'tr' as ad_tr from public.product_categories order by sort_order;
```

11 satır görmelisiniz, hepsinin slug'ı `*-components` veya `*-parts` formatında olmalı.

> Not: `viton` ve `engineering-plastics` kategorileri config'te olmadığı için silinmedi. Bu kategorilere bağlı ürününüz varsa admin panelinden başka bir kategoriye taşıyın.

## 5) Admin kullanıcı oluşturma (bir kez)

Supabase Dashboard → **Authentication** → **Users** → **Add user**

- E-posta + parola girin (örn. `admin@karpol.com.tr`)
- Kullanıcı oluştuktan sonra **SQL Editor**'da:

```sql
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
where email = 'admin@karpol.com.tr';
```

Bu, RLS politikalarının kullandığı `app_metadata.role = 'admin'` kontrolünü geçer.

## 6) `.env.local` ortam değişkenleri

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Bu değerleri Supabase Dashboard → **Project Settings** → **API** kısmından alabilirsiniz.

## Doğrulama

1. `npm run dev` ile uygulamayı başlatın
2. `http://localhost:3000/admin/login` → admin hesabıyla giriş yapın
3. **Kontrol Paneli**'nde "Toplam Ürün: 0" görmelisiniz
4. **Ürünler → Ürün Ekle** ile bir test ürünü oluşturun
5. **Görsel Galerisi** modülünü açıp bir görsel yükleyin (Supabase Storage `product-assets` bucket'ına gitmeli)

## Sorun giderme

**"relation public.products does not exist"**
→ Adım 1 atlandı. `supabase_schema.sql` dosyasını çalıştırın.

**"new row violates row-level security policy"**
→ Admin kullanıcının `app_metadata.role` değeri `admin` değil. Adım 4'teki SQL'i çalıştırın ve oturumu kapatıp tekrar açın.

**Görsel yüklemede "Bu klasör için desteklenmeyen dosya tipi"**
→ FileUploader'a doğru `accept` parametresi geçiliyor; klasör/MIME tipi uyumsuzluğu var. `src/app/api/admin/upload/route.ts` içindeki `ALLOWED_MIME` listesine bakın.

**Yükleme yapılıyor ama dosya görünmüyor**
→ Bucket `public` değil. Supabase Dashboard → **Storage → product-assets → Settings → Public bucket = ON** olmalı (migration bunu otomatik yapar; manuel kontrol için).
