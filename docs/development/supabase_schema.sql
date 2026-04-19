-- ============================================
-- KARPOL — Supabase Database Schema v2.0
-- JSONB-based i18n for EN, TR, DE, AR
-- Run in Supabase SQL Editor
-- ============================================

-- ============================================
-- 0. Utility: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- 1. Product Categories (with subcategory support)
-- ============================================
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  name JSONB NOT NULL DEFAULT '{}',
  description JSONB NOT NULL DEFAULT '{}',
  image_url TEXT,
  icon TEXT,
  prefix TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  meta_title JSONB DEFAULT '{}',
  meta_description JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS update_product_categories_updated_at ON product_categories;
CREATE TRIGGER update_product_categories_updated_at
  BEFORE UPDATE ON product_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. Products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT NOT NULL,
  name JSONB NOT NULL DEFAULT '{}',
  description JSONB NOT NULL DEFAULT '{}',
  short_description JSONB DEFAULT '{}',
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  material TEXT,
  hardness TEXT,
  hardness_unit TEXT DEFAULT 'Shore A',
  temperature_min NUMERIC,
  temperature_max NUMERIC,
  color TEXT,
  weight TEXT,
  dimensions JSONB DEFAULT '{}',
  applications JSONB DEFAULT '{}',
  compatible_machines TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '[]',
  size_table JSONB DEFAULT '[]',
  images TEXT[] DEFAULT '{}',
  gallery JSONB DEFAULT '[]',
  model_3d_url TEXT,
  technical_drawing_url TEXT,
  datasheet_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  meta_title JSONB DEFAULT '{}',
  meta_description JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. Industries
-- ============================================
CREATE TABLE IF NOT EXISTS industries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name JSONB NOT NULL DEFAULT '{}',
  description JSONB NOT NULL DEFAULT '{}',
  challenges JSONB DEFAULT '{}',
  solutions JSONB DEFAULT '{}',
  image_url TEXT,
  hero_image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  meta_title JSONB DEFAULT '{}',
  meta_description JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS update_industries_updated_at ON industries;
CREATE TRIGGER update_industries_updated_at
  BEFORE UPDATE ON industries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. Industry <-> Product (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS industry_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  industry_id UUID REFERENCES industries(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  usage_description TEXT,
  UNIQUE(industry_id, product_id)
);

-- ============================================
-- 5. Articles (Blog / Technical Knowledge)
-- ============================================
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title JSONB NOT NULL DEFAULT '{}',
  excerpt JSONB NOT NULL DEFAULT '{}',
  content JSONB NOT NULL DEFAULT '{}',
  cover_image_url TEXT,
  category TEXT CHECK (category IN ('material', 'industry', 'process', 'technical', 'guide')),
  tags TEXT[] DEFAULT '{}',
  target_keyword TEXT,
  author TEXT,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  meta_title JSONB DEFAULT '{}',
  meta_description JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. RFQ Submissions (Request for Quote)
-- ============================================
CREATE TABLE IF NOT EXISTS rfq_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  country TEXT,
  industry TEXT,
  product_interest TEXT,
  quantity TEXT,
  material_preference TEXT,
  hardness_requirement TEXT,
  urgency TEXT DEFAULT 'standard' CHECK (urgency IN ('standard', 'urgent', 'critical')),
  message TEXT NOT NULL DEFAULT '',
  file_urls TEXT[] DEFAULT '{}',
  source_page TEXT,
  locale TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'quoted', 'accepted', 'rejected', 'closed')),
  assigned_to TEXT,
  internal_notes TEXT,
  quoted_at TIMESTAMPTZ,
  quoted_amount NUMERIC
);

-- ============================================
-- 7. Contact Submissions
-- ============================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  country TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  locale TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied'))
);

-- ============================================
-- 8. Catalog Downloads (lead capture)
-- ============================================
CREATE TABLE IF NOT EXISTS catalog_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  email TEXT NOT NULL,
  company TEXT,
  country TEXT,
  locale TEXT,
  catalog_name TEXT NOT NULL,
  file_url TEXT NOT NULL
);

-- ============================================
-- 9. Media Library
-- ============================================
CREATE TABLE IF NOT EXISTS media_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'document', '3d-model', 'technical-drawing')),
  mime_type TEXT,
  file_size INT,
  alt_text JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 10. Page Content (CMS-managed static sections)
-- ============================================
CREATE TABLE IF NOT EXISTS page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL,
  section_key TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  media_urls TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(page_key, section_key)
);

DROP TRIGGER IF EXISTS update_page_content_updated_at ON page_content;
CREATE TRIGGER update_page_content_updated_at
  BEFORE UPDATE ON page_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 11. Admin Activity Log
-- ============================================
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'status_change')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('product', 'article', 'rfq', 'category', 'industry', 'media', 'page_content', 'contact')),
  entity_id UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_product_categories_parent ON product_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_slug ON product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_product_categories_active ON product_categories(is_active);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);

CREATE INDEX IF NOT EXISTS idx_industries_slug ON industries(slug);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_is_published ON articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

CREATE INDEX IF NOT EXISTS idx_rfq_status ON rfq_submissions(status);
CREATE INDEX IF NOT EXISTS idx_rfq_urgency ON rfq_submissions(urgency);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);

CREATE INDEX IF NOT EXISTS idx_media_file_type ON media_library(file_type);
CREATE INDEX IF NOT EXISTS idx_media_tags ON media_library USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_page_content_key ON page_content(page_key);

CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON admin_activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON admin_activity_log(user_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Public can READ active content
DROP POLICY IF EXISTS "Public can read active categories" ON product_categories;
CREATE POLICY "Public can read active categories" ON product_categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can read active products" ON products;
CREATE POLICY "Public can read active products" ON products
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can read industries" ON industries;
CREATE POLICY "Public can read industries" ON industries
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read industry_products" ON industry_products;
CREATE POLICY "Public can read industry_products" ON industry_products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read published articles" ON articles;
CREATE POLICY "Public can read published articles" ON articles
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can read active page content" ON page_content;
CREATE POLICY "Public can read active page content" ON page_content
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can read media" ON media_library;
CREATE POLICY "Public can read media" ON media_library
  FOR SELECT USING (true);

-- Public can INSERT submissions
DROP POLICY IF EXISTS "Public can submit RFQ" ON rfq_submissions;
CREATE POLICY "Public can submit RFQ" ON rfq_submissions
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can submit contact" ON contact_submissions;
CREATE POLICY "Public can submit contact" ON contact_submissions
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can log catalog downloads" ON catalog_downloads;
CREATE POLICY "Public can log catalog downloads" ON catalog_downloads
  FOR INSERT WITH CHECK (true);

-- Admin policies (service_role bypasses RLS, but for authenticated admins):
DROP POLICY IF EXISTS "Admins full access categories" ON product_categories;
CREATE POLICY "Admins full access categories" ON product_categories
  FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins full access products" ON products;
CREATE POLICY "Admins full access products" ON products
  FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins full access industries" ON industries;
CREATE POLICY "Admins full access industries" ON industries
  FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins full access industry_products" ON industry_products;
CREATE POLICY "Admins full access industry_products" ON industry_products
  FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins full access articles" ON articles;
CREATE POLICY "Admins full access articles" ON articles
  FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins full access rfq" ON rfq_submissions;
CREATE POLICY "Admins full access rfq" ON rfq_submissions
  FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins full access contacts" ON contact_submissions;
CREATE POLICY "Admins full access contacts" ON contact_submissions
  FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins full access catalog_downloads" ON catalog_downloads;
CREATE POLICY "Admins full access catalog_downloads" ON catalog_downloads
  FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins full access media" ON media_library;
CREATE POLICY "Admins full access media" ON media_library
  FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins full access page_content" ON page_content;
CREATE POLICY "Admins full access page_content" ON page_content
  FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins full access activity_log" ON admin_activity_log;
CREATE POLICY "Admins full access activity_log" ON admin_activity_log
  FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ============================================
-- Seed: Product Categories (JSONB i18n)
-- ============================================
INSERT INTO product_categories (slug, name, description, prefix, sort_order) VALUES
  ('polyurethane', '{"en": "Polyurethane Products", "tr": "Poliüretan Ürünler", "de": "Polyurethan-Produkte", "ar": "منتجات البولي يوريثان"}', '{"en": "High-performance polyurethane rollers, wheels, linings, scrapers, bumpers, seals, and bushings for industrial applications.", "tr": "Endüstriyel uygulamalar için yüksek performanslı poliüretan makaralar, tekerlekler, kaplamalar, sıyırıcılar ve burçlar.", "de": "Hochleistungs-Polyurethan-Walzen, Räder, Beschichtungen und Dichtungen für industrielle Anwendungen.", "ar": "بكرات ومكونات بولي يوريثان عالية الأداء للتطبيقات الصناعية."}', 'PU', 1),
  ('vulkolan', '{"en": "Vulkolan Products", "tr": "Vulkolan Ürünler", "de": "Vulkolan-Produkte", "ar": "منتجات فولكولان"}', '{"en": "Premium Vulkolan elastomer components for heavy-duty applications requiring exceptional load-bearing and abrasion resistance.", "tr": "Üstün yük taşıma ve aşınma direnci gerektiren ağır hizmet uygulamaları için premium Vulkolan elastomer bileşenler.", "de": "Premium Vulkolan-Elastomerkomponenten für Schwerlastanwendungen.", "ar": "مكونات فولكولان المطاطية المتميزة للتطبيقات الشاقة."}', 'VK', 2),
  ('rubber', '{"en": "Rubber Products", "tr": "Kauçuk Ürünler", "de": "Gummiprodukte", "ar": "منتجات المطاط"}', '{"en": "Industrial rubber O-rings, gaskets, vibration dampeners, bellows, and hoses for hydraulic and pneumatic systems.", "tr": "Hidrolik ve pnömatik sistemler için endüstriyel kauçuk O-ringler, contalar, titreşim damperleri ve hortumlar.", "de": "Industrielle Gummi-O-Ringe, Dichtungen und Schwingungsdämpfer.", "ar": "حلقات مطاطية صناعية وحشيات ومخمدات اهتزاز."}', 'RB', 3),
  ('silicone', '{"en": "Silicone Products", "tr": "Silikon Ürünler", "de": "Silikonprodukte", "ar": "منتجات السيليكون"}', '{"en": "Food-grade and industrial silicone seals, tubing, and heat-resistant gaskets for high-temperature environments.", "tr": "Yüksek sıcaklık ortamları için gıda sınıfı ve endüstriyel silikon contalar, boru ve ısıya dayanıklı gasketler.", "de": "Lebensmitteltaugliche und industrielle Silikondichtungen und hitzebeständige Dichtungen.", "ar": "أختام سيليكون صناعية وغذائية ومقاومة للحرارة."}', 'SI', 4),
  ('viton', '{"en": "Viton Products", "tr": "Viton Ürünler", "de": "Viton-Produkte", "ar": "منتجات فيتون"}', '{"en": "Chemical-resistant Viton seals, O-rings, and diaphragms for aggressive chemical and fuel environments.", "tr": "Agresif kimyasal ve yakıt ortamları için kimyasala dayanıklı Viton contalar, O-ringler ve diyaframlar.", "de": "Chemikalienbeständige Viton-Dichtungen und O-Ringe.", "ar": "أختام فيتون مقاومة للمواد الكيميائية."}', 'VT', 5),
  ('ptfe-teflon', '{"en": "PTFE / Teflon Products", "tr": "PTFE / Teflon Ürünler", "de": "PTFE / Teflon-Produkte", "ar": "منتجات PTFE / تفلون"}', '{"en": "Low-friction PTFE bearings, seals, slide plates, gaskets, and piston rings for precision applications.", "tr": "Hassas uygulamalar için düşük sürtünmeli PTFE yataklar, contalar, kayar plakalar ve piston segmanları.", "de": "Reibungsarme PTFE-Lager, Dichtungen und Gleitplatten.", "ar": "محامل PTFE منخفضة الاحتكاك وأختام للتطبيقات الدقيقة."}', 'TF', 6),
  ('aluminum-cnc', '{"en": "Aluminum CNC Parts", "tr": "Alüminyum CNC Parçalar", "de": "Aluminium-CNC-Teile", "ar": "أجزاء ألمنيوم CNC"}', '{"en": "Precision CNC machined aluminum housings, brackets, plates, and adapters for machine building and automation.", "tr": "Makine imalatı ve otomasyon için hassas CNC işlenmiş alüminyum muhafazalar, braketler ve adaptörler.", "de": "Präzisions-CNC-gefräste Aluminiumgehäuse und Halterungen.", "ar": "أجزاء ألمنيوم مُشَكَّلة بالتحكم الرقمي بدقة عالية."}', 'AL', 7),
  ('engineering-plastics', '{"en": "Engineering Plastics", "tr": "Mühendislik Plastikleri", "de": "Technische Kunststoffe", "ar": "البلاستيك الهندسي"}', '{"en": "Technical plastic gears, bushings, and wear plates from POM, PA, and PE-UHMW for specialized applications.", "tr": "Özel uygulamalar için POM, PA ve PE-UHMW malzemeden teknik plastik dişliler, burçlar ve aşınma plakaları.", "de": "Technische Kunststoffzahnräder und Verschleißplatten aus POM, PA und PE-UHMW.", "ar": "تروس وبطانات بلاستيكية هندسية من POM و PA و PE-UHMW."}', 'EP', 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Seed: Industries (JSONB i18n)
-- ============================================
INSERT INTO industries (slug, name, description, challenges, solutions, is_featured, sort_order) VALUES
  ('marble-stone', '{"en": "Marble & Stone Processing", "tr": "Mermer ve Taş İşleme", "de": "Marmor- & Steinbearbeitung", "ar": "معالجة الرخام والحجر"}', '{"en": "Precision components for stone cutting, polishing, and processing machinery.", "tr": "Taş kesme, cilalama ve işleme makineleri için hassas bileşenler.", "de": "Präzisionskomponenten für Steinbearbeitungsmaschinen.", "ar": "مكونات دقيقة لآلات قص ومعالجة الحجر."}', '{"en": ["Extreme abrasion", "Precision cutting requirements", "Water and dust exposure", "Vibration control"], "tr": ["Aşırı aşınma", "Hassas kesim gereksinimleri", "Su ve toz maruziyeti", "Titreşim kontrolü"]}', '{"en": ["Custom PU rollers", "Vulkolan drive wheels", "Rubber suction cups", "Wear-resistant guide components"], "tr": ["Özel PU makaralar", "Vulkolan tahrik tekerlekleri", "Kauçuk vakum çanakları", "Aşınmaya dayanıklı kılavuz bileşenler"]}', true, 1),
  ('mining', '{"en": "Mining", "tr": "Madencilik", "de": "Bergbau", "ar": "التعدين"}', '{"en": "Heavy-duty components for mining equipment operating under extreme conditions.", "tr": "Aşırı koşullarda çalışan madencilik ekipmanları için ağır hizmet bileşenleri.", "de": "Schwerlastkomponenten für Bergbauausrüstung.", "ar": "مكونات شاقة لمعدات التعدين."}', '{"en": ["Extreme wear conditions", "Heavy loads", "Chemical exposure", "Dust and debris"], "tr": ["Aşırı aşınma koşulları", "Ağır yükler", "Kimyasal maruziyeti", "Toz ve moloz"]}', '{"en": ["Wear-resistant linings", "Heavy-duty Vulkolan rollers", "PU scrapers", "Reinforced rubber hoses"], "tr": ["Aşınmaya dayanıklı kaplamalar", "Ağır hizmet Vulkolan makaraları", "PU sıyırıcılar", "Takviyeli kauçuk hortumlar"]}', true, 2),
  ('construction', '{"en": "Construction Machinery", "tr": "İnşaat Makineleri", "de": "Baumaschinen", "ar": "آلات البناء"}', '{"en": "Engineered parts for concrete, earthmoving, and construction equipment.", "tr": "Beton, hafriyat ve inşaat ekipmanları için mühendislik parçaları.", "de": "Konstruktionsteile für Beton- und Baumaschinen.", "ar": "أجزاء هندسية لمعدات البناء."}', '{"en": ["Heavy vibration", "Hydraulic sealing", "Impact resistance", "Outdoor exposure"], "tr": ["Ağır titreşim", "Hidrolik sızdırmazlık", "Darbe dayanımı", "Dış ortam maruziyeti"]}', '{"en": ["Vibration dampeners", "Hydraulic seals", "PU bumpers", "PTFE guide bearings"], "tr": ["Titreşim damperleri", "Hidrolik contalar", "PU tamponlar", "PTFE kılavuz yataklar"]}', true, 3),
  ('automation', '{"en": "Automation Systems", "tr": "Otomasyon Sistemleri", "de": "Automatisierungssysteme", "ar": "أنظمة الأتمتة"}', '{"en": "Precision components for industrial automation and robotic systems.", "tr": "Endüstriyel otomasyon ve robotik sistemler için hassas bileşenler.", "de": "Präzisionskomponenten für industrielle Automatisierung.", "ar": "مكونات دقيقة لأنظمة الأتمتة الصناعية."}', '{"en": ["Tight tolerances", "Low friction needs", "Repeatability", "Clean environments"], "tr": ["Dar toleranslar", "Düşük sürtünme ihtiyacı", "Tekrarlanabilirlik", "Temiz ortamlar"]}', '{"en": ["CNC machined aluminum parts", "PTFE slide bearings", "POM precision gears", "PU guide rollers"], "tr": ["CNC işlenmiş alüminyum parçalar", "PTFE kayar yataklar", "POM hassas dişliler", "PU kılavuz makaraları"]}', false, 4),
  ('chemical', '{"en": "Chemical Industry", "tr": "Kimya Endüstrisi", "de": "Chemische Industrie", "ar": "الصناعة الكيميائية"}', '{"en": "Chemical-resistant sealing and containment components for process equipment.", "tr": "Proses ekipmanları için kimyasala dayanıklı sızdırmazlık ve muhafaza bileşenleri.", "de": "Chemikalienbeständige Dichtungs- und Behälterkomponenten.", "ar": "مكونات ختم مقاومة للمواد الكيميائية."}', '{"en": ["Aggressive chemicals", "High temperatures", "Regulatory compliance", "Corrosion"], "tr": ["Agresif kimyasallar", "Yüksek sıcaklıklar", "Mevzuata uyum", "Korozyon"]}', '{"en": ["Viton chemical seals", "PTFE gaskets", "Silicone tubing", "Chemical-resistant coatings"], "tr": ["Viton kimyasal contaları", "PTFE gasketler", "Silikon borular", "Kimyasala dayanıklı kaplamalar"]}', false, 5),
  ('food', '{"en": "Food Industry", "tr": "Gıda Endüstrisi", "de": "Lebensmittelindustrie", "ar": "صناعة الأغذية"}', '{"en": "FDA-compliant components for food processing and packaging machinery.", "tr": "Gıda işleme ve paketleme makineleri için FDA uyumlu bileşenler.", "de": "FDA-konforme Komponenten für Lebensmittelverarbeitungsmaschinen.", "ar": "مكونات متوافقة مع FDA لآلات تصنيع الأغذية."}', '{"en": ["FDA/food-grade compliance", "Hygiene requirements", "Temperature variation", "Washdown resistance"], "tr": ["FDA/gıda sınıfı uyumluluk", "Hijyen gereksinimleri", "Sıcaklık değişimi", "Yıkama direnci"]}', '{"en": ["Food-grade silicone seals", "PE-UHMW wear plates", "FDA-compliant PU components", "Stainless-compatible plastics"], "tr": ["Gıda sınıfı silikon contalar", "PE-UHMW aşınma plakaları", "FDA uyumlu PU bileşenler", "Paslanmaz çelik uyumlu plastikler"]}', false, 6)
ON CONFLICT (slug) DO NOTHING;
