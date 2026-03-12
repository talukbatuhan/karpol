-- ============================================
-- KARPOL — Supabase Database Schema
-- Bu SQL'i Supabase SQL Editor'da çalıştırın
-- ============================================

-- ============================================
-- 1. Product Categories
-- ============================================
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_tr TEXT,
  description TEXT NOT NULL DEFAULT '',
  description_tr TEXT,
  image_url TEXT,
  icon TEXT,
  prefix TEXT NOT NULL, -- PU-, VK-, RB-, SI-, VT-, TF-, AL-, EP-
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- ============================================
-- 2. Products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_tr TEXT,
  description TEXT NOT NULL DEFAULT '',
  description_tr TEXT,
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  material TEXT,
  hardness TEXT,
  hardness_unit TEXT DEFAULT 'Shore A',
  temperature_min NUMERIC,
  temperature_max NUMERIC,
  color TEXT,
  applications TEXT[] DEFAULT '{}',
  compatible_machines TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  technical_drawing_url TEXT,
  datasheet_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0
);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. Industries
-- ============================================
CREATE TABLE IF NOT EXISTS industries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_tr TEXT,
  description TEXT NOT NULL DEFAULT '',
  description_tr TEXT,
  challenges TEXT[] DEFAULT '{}',
  solutions TEXT[] DEFAULT '{}',
  image_url TEXT,
  hero_image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);

-- ============================================
-- 4. Industry ↔ Product (Many-to-Many)
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
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_tr TEXT,
  excerpt TEXT NOT NULL DEFAULT '',
  excerpt_tr TEXT,
  content TEXT NOT NULL DEFAULT '',
  content_tr TEXT,
  cover_image_url TEXT,
  category TEXT CHECK (category IN ('material', 'industry', 'process', 'technical')),
  tags TEXT[] DEFAULT '{}',
  target_keyword TEXT,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  author TEXT
);

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
  industry TEXT,
  product_interest TEXT,
  quantity TEXT,
  material_preference TEXT,
  hardness_requirement TEXT,
  message TEXT NOT NULL DEFAULT '',
  file_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'quoted', 'closed')),
  notes TEXT
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
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
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
  catalog_name TEXT NOT NULL,
  file_url TEXT NOT NULL
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_product_categories_slug ON product_categories(slug);
CREATE INDEX idx_industries_slug ON industries(slug);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_is_published ON articles(is_published);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_rfq_status ON rfq_submissions(status);
CREATE INDEX idx_contact_status ON contact_submissions(status);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Public read access for products, categories, industries, articles
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_downloads ENABLE ROW LEVEL SECURITY;

-- Public can READ active products and categories
CREATE POLICY "Public can read active categories" ON product_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read industries" ON industries
  FOR SELECT USING (true);

CREATE POLICY "Public can read industry_products" ON industry_products
  FOR SELECT USING (true);

CREATE POLICY "Public can read published articles" ON articles
  FOR SELECT USING (is_published = true);

-- Public can INSERT submissions (forms)
CREATE POLICY "Public can submit RFQ" ON rfq_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can submit contact" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can log catalog downloads" ON catalog_downloads
  FOR INSERT WITH CHECK (true);

-- ============================================
-- Seed: Product Categories
-- ============================================
INSERT INTO product_categories (slug, name, name_tr, description, description_tr, prefix, sort_order) VALUES
  ('polyurethane', 'Polyurethane Products', 'Poliüretan Ürünler', 'High-performance polyurethane rollers, wheels, linings, scrapers, bumpers, seals, and bushings for industrial applications.', 'Endüstriyel uygulamalar için yüksek performanslı poliüretan makaralar, tekerlekler, kaplamalar, sıyırıcılar ve burçlar.', 'PU', 1),
  ('vulkolan', 'Vulkolan Products', 'Vulkolan Ürünler', 'Premium Vulkolan elastomer components for heavy-duty applications requiring exceptional load-bearing and abrasion resistance.', 'Üstün yük taşıma ve aşınma direnci gerektiren ağır hizmet uygulamaları için premium Vulkolan elastomer bileşenler.', 'VK', 2),
  ('rubber', 'Rubber Products', 'Kauçuk Ürünler', 'Industrial rubber O-rings, gaskets, vibration dampeners, bellows, and hoses for hydraulic and pneumatic systems.', 'Hidrolik ve pnömatik sistemler için endüstriyel kauçuk O-ringler, contalar, titreşim damperleri ve hortumlar.', 'RB', 3),
  ('silicone', 'Silicone Products', 'Silikon Ürünler', 'Food-grade and industrial silicone seals, tubing, and heat-resistant gaskets for high-temperature environments.', 'Yüksek sıcaklık ortamları için gıda sınıfı ve endüstriyel silikon contalar, boru ve ısıya dayanıklı gasketler.', 'SI', 4),
  ('viton', 'Viton Products', 'Viton Ürünler', 'Chemical-resistant Viton seals, O-rings, and diaphragms for aggressive chemical and fuel environments.', 'Agresif kimyasal ve yakıt ortamları için kimyasala dayanıklı Viton contalar, O-ringler ve diyaframlar.', 'VT', 5),
  ('ptfe-teflon', 'PTFE / Teflon Products', 'PTFE / Teflon Ürünler', 'Low-friction PTFE bearings, seals, slide plates, gaskets, and piston rings for precision applications.', 'Hassas uygulamalar için düşük sürtünmeli PTFE yataklar, contalar, kayar plakalar ve piston segmanları.', 'TF', 6),
  ('aluminum-cnc', 'Aluminum CNC Parts', 'Alüminyum CNC Parçalar', 'Precision CNC machined aluminum housings, brackets, plates, and adapters for machine building and automation.', 'Makine imalatı ve otomasyon için hassas CNC işlenmiş alüminyum muhafazalar, braketler ve adaptörler.', 'AL', 7),
  ('engineering-plastics', 'Engineering Plastics', 'Mühendislik Plastikleri', 'Technical plastic gears, bushings, and wear plates from POM, PA, and PE-UHMW for specialized applications.', 'Özel uygulamalar için POM, PA ve PE-UHMW malzemeden teknik plastik dişliler, burçlar ve aşınma plakaları.', 'EP', 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Seed: Industries
-- ============================================
INSERT INTO industries (slug, name, name_tr, description, description_tr, challenges, solutions, is_featured, sort_order) VALUES
  ('marble-stone', 'Marble & Stone Processing', 'Mermer ve Taş İşleme', 'Precision components for stone cutting, polishing, and processing machinery.', 'Taş kesme, cilalama ve işleme makineleri için hassas bileşenler.', ARRAY['Extreme abrasion', 'Precision cutting requirements', 'Water and dust exposure', 'Vibration control'], ARRAY['Custom PU rollers', 'Vulkolan drive wheels', 'Rubber suction cups', 'Wear-resistant guide components'], true, 1),
  ('mining', 'Mining', 'Madencilik', 'Heavy-duty components for mining equipment operating under extreme conditions.', 'Aşırı koşullarda çalışan madencilik ekipmanları için ağır hizmet bileşenleri.', ARRAY['Extreme wear conditions', 'Heavy loads', 'Chemical exposure', 'Dust and debris'], ARRAY['Wear-resistant linings', 'Heavy-duty Vulkolan rollers', 'PU scrapers', 'Reinforced rubber hoses'], true, 2),
  ('construction', 'Construction Machinery', 'İnşaat Makineleri', 'Engineered parts for concrete, earthmoving, and construction equipment.', 'Beton, hafriyat ve inşaat ekipmanları için mühendislik parçaları.', ARRAY['Heavy vibration', 'Hydraulic sealing', 'Impact resistance', 'Outdoor exposure'], ARRAY['Vibration dampeners', 'Hydraulic seals', 'PU bumpers', 'PTFE guide bearings'], true, 3),
  ('automation', 'Automation Systems', 'Otomasyon Sistemleri', 'Precision components for industrial automation and robotic systems.', 'Endüstriyel otomasyon ve robotik sistemler için hassas bileşenler.', ARRAY['Tight tolerances', 'Low friction needs', 'Repeatability', 'Clean environments'], ARRAY['CNC machined aluminum parts', 'PTFE slide bearings', 'POM precision gears', 'PU guide rollers'], false, 4),
  ('chemical', 'Chemical Industry', 'Kimya Endüstrisi', 'Chemical-resistant sealing and containment components for process equipment.', 'Proses ekipmanları için kimyasala dayanıklı sızdırmazlık ve muhafaza bileşenleri.', ARRAY['Aggressive chemicals', 'High temperatures', 'Regulatory compliance', 'Corrosion'], ARRAY['Viton chemical seals', 'PTFE gaskets', 'Silicone tubing', 'Chemical-resistant coatings'], false, 5),
  ('food', 'Food Industry', 'Gıda Endüstrisi', 'FDA-compliant components for food processing and packaging machinery.', 'Gıda işleme ve paketleme makineleri için FDA uyumlu bileşenler.', ARRAY['FDA/food-grade compliance', 'Hygiene requirements', 'Temperature variation', 'Washdown resistance'], ARRAY['Food-grade silicone seals', 'PE-UHMW wear plates', 'FDA-compliant PU components', 'Stainless-compatible plastics'], false, 6)
ON CONFLICT (slug) DO NOTHING;
