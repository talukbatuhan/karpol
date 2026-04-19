-- ====================================================================
-- KARPOL · SKU Unique Constraint Kaldırma
-- ====================================================================
-- Amaç: Aynı SKU'nun birden fazla üründe kullanılabilmesi (örn. varyant
-- ürünleri, manuel test verileri, geçici taslaklar).
--
-- Notlar:
--  - Index'i de düşürüyoruz çünkü UNIQUE constraint otomatik index üretir.
--  - Yerine NON-UNIQUE bir index ekliyoruz (arama performansı için).
--  - SKU yine NOT NULL kalır (zorunlu alan).
-- ====================================================================

DO $$
BEGIN
  -- UNIQUE constraint'i sil (varsa)
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND constraint_name = 'products_sku_key'
      AND constraint_type = 'UNIQUE'
  ) THEN
    ALTER TABLE public.products DROP CONSTRAINT products_sku_key;
    RAISE NOTICE 'products_sku_key UNIQUE constraint kaldırıldı.';
  ELSE
    RAISE NOTICE 'products_sku_key UNIQUE constraint zaten yok, atlandı.';
  END IF;
END $$;

-- Eski unique index varsa düşür (Postgres genellikle UNIQUE constraint'i
-- silince index'i de siler, ama elle oluşturulmuş olabilir)
DROP INDEX IF EXISTS public.products_sku_key;

-- Performans için NON-UNIQUE index (arama / filtreleme)
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
