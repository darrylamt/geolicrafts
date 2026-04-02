-- =============================================
-- Geolicrafts Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL,
  category    text NOT NULL,
  description text,
  image_url   text,
  created_at  timestamptz DEFAULT now()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title        text NOT NULL,
  slug         text UNIQUE NOT NULL,
  excerpt      text,
  content      text,
  category     text,
  image_url    text,
  published    boolean DEFAULT false,
  published_at timestamptz,
  read_time    int DEFAULT 3,
  created_at   timestamptz DEFAULT now()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL,
  email      text NOT NULL,
  subject    text NOT NULL,
  message    text NOT NULL,
  read       boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Products: public can read, only authenticated admin can write
CREATE POLICY "Public read products"
  ON products FOR SELECT USING (true);

CREATE POLICY "Authenticated write products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Blog posts: public can read published, admin can do everything
CREATE POLICY "Public read published posts"
  ON blog_posts FOR SELECT
  USING (published = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated manage posts"
  ON blog_posts FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Contact messages: anyone can insert (for contact form), only admin can read/delete
CREATE POLICY "Anyone can submit contact"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated read messages"
  ON contact_messages FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update messages"
  ON contact_messages FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete messages"
  ON contact_messages FOR DELETE
  USING (auth.role() = 'authenticated');

-- =============================================
-- Storage bucket for product images
-- Run this or create via Supabase dashboard
-- =============================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Storage policy (run after creating bucket)
-- CREATE POLICY "Public read images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
-- CREATE POLICY "Auth upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
-- CREATE POLICY "Auth delete images" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
