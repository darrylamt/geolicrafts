-- =============================================
-- 002 — Product detail pages + quote requests
-- Run in the Supabase SQL Editor. Safe to run more than once.
-- =============================================

-- ── Products: extra detail fields + URL slug ──
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS slug        text,
  ADD COLUMN IF NOT EXISTS images      text[] NOT NULL DEFAULT '{}',  -- extra gallery images
  ADD COLUMN IF NOT EXISTS dimensions  text,                           -- e.g. "H 60 cm · Ø 30 cm"
  ADD COLUMN IF NOT EXISTS materials   text,                           -- e.g. "Tweneboa wood, goat skin"
  ADD COLUMN IF NOT EXISTS colors      text,                           -- e.g. "Natural, black, red"
  ADD COLUMN IF NOT EXISTS min_order   text,                           -- e.g. "10 pieces"
  ADD COLUMN IF NOT EXISTS lead_time   text;                           -- e.g. "3–4 weeks"

-- Slugs are generated from the name once and then kept stable, so shared links never break.
CREATE OR REPLACE FUNCTION products_set_slug() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  base      text;
  candidate text;
  n         int := 1;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    base := trim(both '-' from regexp_replace(lower(NEW.name), '[^a-z0-9]+', '-', 'g'));
    IF base = '' THEN base := 'product'; END IF;
    candidate := base;
    WHILE EXISTS (SELECT 1 FROM products WHERE slug = candidate AND id <> NEW.id) LOOP
      n := n + 1;
      candidate := base || '-' || n;
    END LOOP;
    NEW.slug := candidate;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS products_slug ON products;
CREATE TRIGGER products_slug
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION products_set_slug();

-- Backfill existing products one at a time (oldest first keeps the plain slug)
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT id FROM products WHERE slug IS NULL ORDER BY created_at LOOP
    UPDATE products SET slug = NULL WHERE id = r.id;
  END LOOP;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS products_slug_key ON products (slug);

-- ── Contact messages: quote requests ──
ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS type    text NOT NULL DEFAULT 'message',  -- 'message' | 'quote'
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS phone   text,
  ADD COLUMN IF NOT EXISTS items   jsonb;                             -- [{ id, name, qty, notes }]
