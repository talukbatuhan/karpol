-- ============================================
-- KARPOL — Kategori Slug Hizalama Migration
-- ============================================
-- Amaç: product_categories tablosundaki slug'ları
-- src/lib/config.ts içindeki productCategories listesi ile eşle.
--
-- ÖNEMLİ: Bu dosyayı çalıştırmadan ÖNCE supabase_schema.sql çalışmış olmalı.
--
-- Eski slug                    →  Yeni slug
-- ─────────────────────────────────────────────────
-- polyurethane                 →  polyurethane-components
-- vulkolan                     →  vulkollan-components
-- rubber                       →  rubber-components
-- silicone                     →  silicone-components
-- ptfe-teflon                  →  technical-plastics
-- aluminum-cnc                 →  aluminum-machined-parts
--
-- Yeni eklenenler (config'te var, DB'de yok):
--   - chrome-plated-components
--   - custom-engineered-parts
--   - vacuum-handling-components
--   - conveyor-transport-parts
--   - marble-machine-spare-parts
--
-- Dokunulmayanlar (config'te yok, ürünleriniz varsa kategori değiştirin):
--   - viton
--   - engineering-plastics
-- ============================================

-- 0) Ön kontrol
do $$
begin
  if not exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'product_categories'
  ) then
    raise exception 'product_categories tablosu yok. Önce supabase_schema.sql dosyasını çalıştırın.';
  end if;
end $$;

-- 1) Mevcut slug'ları yeniden adlandır (tek tek, conflict koruyarak)
update public.product_categories
set slug = 'polyurethane-components'
where slug = 'polyurethane'
  and not exists (select 1 from public.product_categories where slug = 'polyurethane-components');

update public.product_categories
set slug = 'vulkollan-components'
where slug = 'vulkolan'
  and not exists (select 1 from public.product_categories where slug = 'vulkollan-components');

update public.product_categories
set slug = 'rubber-components'
where slug = 'rubber'
  and not exists (select 1 from public.product_categories where slug = 'rubber-components');

update public.product_categories
set slug = 'silicone-components'
where slug = 'silicone'
  and not exists (select 1 from public.product_categories where slug = 'silicone-components');

update public.product_categories
set slug = 'technical-plastics'
where slug = 'ptfe-teflon'
  and not exists (select 1 from public.product_categories where slug = 'technical-plastics');

update public.product_categories
set slug = 'aluminum-machined-parts'
where slug = 'aluminum-cnc'
  and not exists (select 1 from public.product_categories where slug = 'aluminum-machined-parts');

-- 2) Eksik kategorileri ekle
insert into public.product_categories (slug, name, description, prefix, sort_order) values
  (
    'chrome-plated-components',
    '{"en": "Chrome Plated Components", "tr": "Krom Kaplamalı Bileşenler", "de": "Verchromte Komponenten", "ar": "مكونات مطلية بالكروم"}',
    '{"en": "Hard chrome plated shafts and cylinders for corrosion resistance and surface hardness.", "tr": "Korozyon direnci ve yüzey sertliği için sert krom kaplı miller ve silindirler.", "de": "Hartverchromte Wellen und Zylinder für Korrosionsbeständigkeit.", "ar": "أعمدة وأسطوانات مطلية بالكروم الصلب لمقاومة التآكل."}',
    'CR',
    9
  ),
  (
    'custom-engineered-parts',
    '{"en": "Custom Engineered Parts", "tr": "Özel Mühendislik Parçaları", "de": "Sonderanfertigungen", "ar": "قطع هندسية مخصصة"}',
    '{"en": "Made-to-order parts from technical drawings. Mold design and prototype development.", "tr": "Teknik çizimlerden özel üretim. Kalıp tasarımı ve prototip geliştirme.", "de": "Maßgefertigte Teile nach technischen Zeichnungen. Formdesign und Prototypenentwicklung.", "ar": "أجزاء مصنوعة حسب الطلب من الرسومات الفنية."}',
    'CE',
    10
  ),
  (
    'vacuum-handling-components',
    '{"en": "Vacuum Handling Components", "tr": "Vakum Tutma Bileşenleri", "de": "Vakuum-Handhabungskomponenten", "ar": "مكونات التعامل بالفراغ"}',
    '{"en": "Suction cups, vacuum pads, and seals for stone, glass, and composite handling systems.", "tr": "Taş, cam ve kompozit taşıma sistemleri için vantuzlar, vakum pedleri ve contalar.", "de": "Saugnäpfe, Vakuumpads und Dichtungen für Handhabungssysteme.", "ar": "كؤوس شفط ووسادات تفريغ لأنظمة المناولة."}',
    'VH',
    11
  ),
  (
    'conveyor-transport-parts',
    '{"en": "Conveyor & Transport Parts", "tr": "Konveyör ve Taşıma Parçaları", "de": "Förder- & Transportteile", "ar": "أجزاء الناقلات والنقل"}',
    '{"en": "Drive pulleys, rollers, and conveyor elements for heavy-duty material handling.", "tr": "Ağır hizmet malzeme taşıma için tahrik kasnakları, makaralar ve konveyör elemanları.", "de": "Antriebsrollen und Förderelemente für Schwerlastmaterialhandhabung.", "ar": "بكرات ومكونات ناقل للمناولة الشاقة."}',
    'CT',
    12
  ),
  (
    'marble-machine-spare-parts',
    '{"en": "Marble Machine Spare Parts", "tr": "Mermer Makine Yedek Parçaları", "de": "Ersatzteile für Marmormaschinen", "ar": "قطع غيار ماكينات الرخام"}',
    '{"en": "Drop-in compatible spare parts for Simec, Breton, Gaspari, and other major stone machines.", "tr": "Simec, Breton, Gaspari ve diğer büyük taş makineleri için birebir uyumlu yedek parçalar.", "de": "Kompatible Ersatzteile für Simec, Breton, Gaspari und andere Steinmaschinen.", "ar": "قطع غيار متوافقة لآلات الحجر الرئيسية."}',
    'MS',
    13
  )
on conflict (slug) do nothing;

-- 3) Doğrulama (output: 11 satır olmalı, hepsi config'teki slug'larla eşleşmeli)
-- select slug, name->>'tr' as ad_tr from public.product_categories order by sort_order;
