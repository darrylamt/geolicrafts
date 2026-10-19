-- =============================================
-- 004 — Categories, featured products, testimonials, partner logos, upload policies
-- Run in the Supabase SQL Editor. Safe to run more than once.
-- =============================================

-- ── Categories (managed in Admin → Categories) ──
-- Products keep storing the category name as text; this table controls which
-- categories exist and the order they appear in.
CREATE TABLE IF NOT EXISTS categories (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text UNIQUE NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Seed with the standard categories plus anything products already use
INSERT INTO categories (name, sort_order) VALUES
  ('Musical Instruments', 10),
  ('Baskets & Weaving', 20),
  ('Wood Carvings', 30),
  ('Textiles & Fashion', 40),
  ('Gifts & Souvenirs', 50)
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, sort_order)
SELECT DISTINCT category, 100 FROM products WHERE category IS NOT NULL AND category <> ''
ON CONFLICT (name) DO NOTHING;

-- ── Products: featured flag + manual sort order ──
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS featured   boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sort_order int;            -- lower shows first; empty = after numbered ones

CREATE INDEX IF NOT EXISTS products_featured_idx ON products (featured) WHERE featured;

-- ── Testimonials ──
CREATE TABLE IF NOT EXISTS testimonials (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quote      text NOT NULL,
  name       text NOT NULL,
  role       text,          -- e.g. "Owner"
  company    text,          -- e.g. "Trommelhaus Berlin"
  country    text,          -- e.g. "Germany"
  published  boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ── Partner / buyer logos ──
CREATE TABLE IF NOT EXISTS partners (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL,
  logo_url   text NOT NULL,
  website    text,
  published  boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ── Row Level Security: public read, signed-in admins write ──
ALTER TABLE categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners     ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read categories" ON categories;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin manage categories" ON categories;
CREATE POLICY "Admin manage categories" ON categories FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT
  USING (published OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin manage testimonials" ON testimonials;
CREATE POLICY "Admin manage testimonials" ON testimonials FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read partners" ON partners;
CREATE POLICY "Public read partners" ON partners FOR SELECT
  USING (published OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin manage partners" ON partners;
CREATE POLICY "Admin manage partners" ON partners FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ── Storage: let signed-in admins upload/replace/delete in the public `images` bucket ──
DROP POLICY IF EXISTS "Admin upload images" ON storage.objects;
CREATE POLICY "Admin upload images" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin update images" ON storage.objects;
CREATE POLICY "Admin update images" ON storage.objects FOR UPDATE
  USING (bucket_id = 'images' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin delete images" ON storage.objects;
CREATE POLICY "Admin delete images" ON storage.objects FOR DELETE
  USING (bucket_id = 'images' AND auth.role() = 'authenticated');
