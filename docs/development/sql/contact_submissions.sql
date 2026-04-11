-- =============================================================================
-- contact_submissions — İletişim formu tablosu (tek başına kurulum)
-- =============================================================================
-- Supabase Dashboard → SQL Editor → New query → bu dosyanın tamamını yapıştırıp Run.
-- Hata alırsanız mesajı kaydedin; politikalar zaten varsa DROP sonrası yeniden oluşur.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.contact_submissions (
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

CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_submissions(status);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Yeniden çalıştırmada çakışmayı önle
DROP POLICY IF EXISTS "Public can submit contact" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins full access contacts" ON public.contact_submissions;

-- Anon / site ziyaretçisi INSERT (API service role RLS’i bypass eder; politika yine tutarlılık için)
CREATE POLICY "Public can submit contact"
  ON public.contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- Admin paneli (JWT app_metadata.role = admin)
CREATE POLICY "Admins full access contacts"
  ON public.contact_submissions
  FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Tablo yeni oluşturulduysa ve API hâlâ görmüyorsa: Settings → API → “Reload schema” veya birkaç saniye bekleyin.
