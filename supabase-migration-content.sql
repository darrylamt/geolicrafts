-- =============================================
-- Geolicrafts Content Migration
-- Moves all static page text to the database.
-- Run this in your Supabase SQL Editor AFTER
-- running supabase-schema.sql.
-- =============================================


-- ─────────────────────────────────────────────
-- NEW TABLES
-- ─────────────────────────────────────────────

-- Generic page section copy (hero, mission, CTA, etc.)
CREATE TABLE IF NOT EXISTS page_sections (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page        text NOT NULL,           -- 'home' | 'about' | 'blog' | 'products' | 'contact'
  section_key text NOT NULL,           -- e.g. 'hero', 'mission', 'cta'
  badge_text  text,
  heading     text,
  subheading  text,
  body        text,                    -- longer paragraph(s); use \n to separate paragraphs
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now(),
  UNIQUE (page, section_key)
);

-- Stats bar on the Home page
CREATE TABLE IF NOT EXISTS site_stats (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  value      text NOT NULL,            -- e.g. '20+'
  label      text NOT NULL,            -- e.g. 'Years of Craft'
  icon_name  text,                     -- lucide icon name: 'Award' | 'Users' | 'Heart' | 'Globe'
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Home page product-category showcase cards
CREATE TABLE IF NOT EXISTS product_categories (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text NOT NULL,
  description text,
  badge       text,
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- Adinkra symbol values (used on both Home and About pages)
CREATE TABLE IF NOT EXISTS site_values (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page           text NOT NULL DEFAULT 'home',  -- 'home' | 'about'
  symbol_name    text NOT NULL,         -- component name: 'GyeNyame' | 'Sankofa' | etc.
  label          text NOT NULL,
  meaning        text,
  title          text,                  -- used on About page card
  description    text,                  -- longer body used on About page card
  text           text,                  -- shorter text used on Home page card
  sort_order     int DEFAULT 0,
  created_at     timestamptz DEFAULT now()
);

-- About page timeline milestones
CREATE TABLE IF NOT EXISTS timeline_events (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  year        text NOT NULL,            -- e.g. '2004' or 'Today'
  event       text NOT NULL,
  color_class text,                     -- Tailwind class for the dot colour
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- About page team members
CREATE TABLE IF NOT EXISTS team_members (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL,
  role       text,
  bio        text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Contact page info blocks (addresses, email, blurbs)
CREATE TABLE IF NOT EXISTS contact_info (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type       text NOT NULL,   -- 'address' | 'email' | 'blurb'
  label      text,            -- 'Main Office' | 'Training Centre' | 'Email' | 'Export Enquiries' | 'Training Programmes'
  value      text,            -- the actual address / email / body text
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);


-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

ALTER TABLE page_sections      ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_stats         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_values        ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events    ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members       ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info       ENABLE ROW LEVEL SECURITY;

-- Public can read all content tables
CREATE POLICY "Public read page_sections"      ON page_sections      FOR SELECT USING (true);
CREATE POLICY "Public read site_stats"         ON site_stats         FOR SELECT USING (true);
CREATE POLICY "Public read product_categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Public read site_values"        ON site_values        FOR SELECT USING (true);
CREATE POLICY "Public read timeline_events"    ON timeline_events    FOR SELECT USING (true);
CREATE POLICY "Public read team_members"       ON team_members       FOR SELECT USING (true);
CREATE POLICY "Public read contact_info"       ON contact_info       FOR SELECT USING (true);

-- Only authenticated admins can write
CREATE POLICY "Auth manage page_sections"      ON page_sections      FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth manage site_stats"         ON site_stats         FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth manage product_categories" ON product_categories FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth manage site_values"        ON site_values        FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth manage timeline_events"    ON timeline_events    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth manage team_members"       ON team_members       FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth manage contact_info"       ON contact_info       FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────
-- SEED DATA
-- ─────────────────────────────────────────────

-- ── Page Sections ───────────────────────────

INSERT INTO page_sections (page, section_key, badge_text, heading, subheading, body, sort_order) VALUES

-- Home
('home', 'hero',
  'Made in Ghana',
  'Crafting Ghana''s Soul Into The World',
  'Authentic African arts, musical instruments, and handcrafted gifts — woven with the spirit of Ghana, reaching every corner of the globe.',
  NULL,
  10),

('home', 'crafts',
  'Handcrafted in Ghana',
  'Our Crafts',
  'Every product is made with pride, preserving centuries of Ghanaian artistry passed down through generations.',
  NULL,
  20),

('home', 'mission',
  'Est. 2004 · Accra, Ghana',
  'Empowering Artisans, Preserving Culture',
  NULL,
  'Founded by George Akologo in Accra''s Burma Camp area, Geolicrafts has grown from a workshop of 5 to a team of 45+ skilled artisans. Today, we export authentic African crafts — drums, Bolga baskets, carvings, and textiles — to Europe, the USA, and beyond.\n\nThrough our vocational training centre in Dodowa — supported by over $1 million from Invest For Employment — we''re equipping 2,000+ rural youth and women with craft skills for lasting livelihoods.',
  30),

('home', 'values',
  'Guided by Adinkra',
  'Our Values in Symbols',
  'The Adinkra symbols of the Akan people carry profound wisdom. These four guide everything we do at Geolicrafts.',
  NULL,
  40),

('home', 'blog_teaser',
  'Latest Stories',
  'From Our Blog',
  'News, stories, and insights from the heart of Ghana''s craft industry.',
  NULL,
  50),

('home', 'cta',
  NULL,
  'Akwaaba — Welcome',
  NULL,
  'Whether you''re a buyer, partner, or simply a lover of African culture — we''d love to hear from you.',
  60),

-- About
('about', 'header',
  'Our Story',
  'About Geolicrafts',
  'Two decades of crafting Ghana''s cultural heritage — one chisel stroke, one weave, one drumbeat at a time.',
  NULL,
  10),

('about', 'founder',
  'The Beginning',
  'A Vision Born in Accra',
  NULL,
  'In 2004, George Akologo — a craftsman from Ghana''s Upper East Region — started Geolicrafts in Accra''s Burma Camp with just five workers and a belief that Ghana''s artisans had the talent to serve the world.\n\nTwo decades on, Geolicrafts employs 45+ artisans and exports 90% of its products — African drums, Bolga baskets, Akuaba carvings, kente textiles — to Europe, the USA, and beyond. In 2021 alone, our exports were valued at 771,000 euros.',
  20),

('about', 'founder_quote',
  NULL,
  NULL,
  NULL,
  '"I always believed that our hands — the craft in our hands — could build this nation." — George Akologo, Founder & CEO',
  25),

('about', 'values',
  'Our Values',
  'Guided by Adinkra Wisdom',
  'The Adinkra symbols of the Akan people carry timeless truths. Each one mirrors a pillar of how we work.',
  NULL,
  30),

('about', 'timeline',
  'Sankofa — Look Back to Move Forward',
  'Our Journey',
  'Two decades of growth, craftsmanship, and community impact across Ghana.',
  NULL,
  40),

('about', 'training_centre',
  'Dodowa Training Centre',
  'Investing in Ghana''s Future',
  NULL,
  'With over $1 million in grant funding from Invest For Employment (German Development Cooperation), Geolicrafts opened a state-of-the-art vocational training centre in Dodowa, Greater Accra Region.\n\nThe facility trains approximately 2,000 young people — with a focus on rural women — in handicraft creation, sewing, fashion design, and artisan skills.',
  50),

('about', 'training_centre_quote',
  NULL,
  NULL,
  NULL,
  '"Every time we train someone, we are investing in a family. We are investing in a community." — George Akologo',
  55),

('about', 'team',
  'Our Leadership',
  'The People Behind the Craft',
  'Driven by passion for craft, community, and cultural preservation.',
  NULL,
  60),

-- Blog
('blog', 'header',
  'Blog & Stories',
  'Our Stories',
  'News, insights, and stories from the heart of Ghana''s craft industry.',
  NULL,
  10),

-- Products
('products', 'header',
  'Handcrafted in Ghana',
  'Our Products',
  'Authentic African arts, musical instruments, and handcrafted gifts — each piece made with skill and cultural pride.',
  NULL,
  10),

-- Contact
('contact', 'header',
  'Get In Touch',
  'Contact Us',
  'Interested in our products, partnerships, or training programmes? We''d love to hear from you.',
  NULL,
  10);


-- ── Site Stats ──────────────────────────────

INSERT INTO site_stats (value, label, icon_name, sort_order) VALUES
('20+',    'Years of Craft',   'Award',  10),
('45+',    'Skilled Artisans', 'Users',  20),
('2,000+', 'People Trained',   'Heart',  30),
('90%',    'Global Export',    'Globe',  40);


-- ── Product Category Showcase Cards (Home) ──

INSERT INTO product_categories (title, description, badge, sort_order) VALUES
('African Drums',  'Hand-carved djembe and talking drums — the heartbeat of West Africa.',                      'Musical',  10),
('Bolga Baskets',  'Traditional woven baskets from Bolgatanga, crafted by skilled women.',                     'Weaving',  20),
('Wood Carvings',  'Akuaba dolls, masks, and sculptures celebrating Akan tradition.',                          'Carvings', 30),
('Kente & Fashion','Handcrafted fashion and textiles weaving colour into everyday life.',                       'Textiles', 40);


-- ── Adinkra Values — Home page ──────────────

INSERT INTO site_values (page, symbol_name, label, meaning, text, sort_order) VALUES
('home', 'GyeNyame',    'Gye Nyame',    'Except God',            'Rooted in faith and purpose, every craft we make honours a tradition greater than ourselves.',                          10),
('home', 'Sankofa',     'Sankofa',      'Go back and fetch it',  'We look to Ghana''s past to craft products that carry centuries of culture into the future.',                          20),
('home', 'Adinkrahene', 'Adinkrahene',  'Greatness & leadership','We lead the Ghanaian handicraft sector with quality, vision, and community impact.',                                   30),
('home', 'Dwennimmen',  'Dwennimmen',   'Humility & strength',   'We uplift our artisans with humility — their strength is the foundation of our story.',                                40);


-- ── Adinkra Values — About page ─────────────

INSERT INTO site_values (page, symbol_name, label, meaning, title, description, sort_order) VALUES
('about', 'GyeNyame',    'Gye Nyame',    '"Except God"',            'Quality Craftsmanship',    'Every product meets stringent standards before leaving our workshop. We never compromise on the quality that defines Ghanaian craft.',                                 10),
('about', 'Dwennimmen',  'Dwennimmen',   '"Humility & Strength"',   'Community Empowerment',    'We create sustainable livelihoods for rural youth and women through skills training and fair employment.',                                                            20),
('about', 'Sankofa',     'Sankofa',      '"Go back and fetch it"',  'Global Reach',             '90% of our products are exported internationally, bringing authentic African culture to homes around the world.',                                                      30),
('about', 'Adinkrahene', 'Adinkrahene',  '"Greatness & Leadership"','Sustainable Practice',     'We use locally sourced, sustainable materials and support eco-friendly production across all our craft lines.',                                                       40);


-- ── Timeline Events ──────────────────────────

INSERT INTO timeline_events (year, event, color_class, sort_order) VALUES
('2004',  'Geolicrafts founded in Accra''s Burma Camp by George Akologo with 5 artisans.',                              'bg-accra-500',  10),
('2008',  'Expanded product range to include Bolga baskets, Akuaba carvings, and kente textiles.',                       'bg-kente-400',  20),
('2015',  'Grew to 45+ artisans; began exporting regularly to Europe and the United States.',                            'bg-forest-600', 30),
('2021',  'Exported products worth 771,000 euros — representing ~3% of Ghana''s total handicraft exports.',              'bg-accra-600',  40),
('2023',  'Opened Dodowa Training Centre with $1M+ grant from Invest For Employment.',                                   'bg-kente-500',  50),
('Today', 'Serving global markets, training 2,000+ artisans, championing Ghana''s craft heritage worldwide.',            'bg-forest-700', 60);


-- ── Team Members ────────────────────────────

INSERT INTO team_members (name, role, bio, sort_order) VALUES
('George Akologo', 'Founder & CEO',
 'Originally from Ghana''s Upper East Region, George founded Geolicrafts in 2004 with a mission to make Ghanaian craftsmanship a global force — while keeping its soul firmly rooted in African tradition.',
 10);


-- ── Contact Info ─────────────────────────────

INSERT INTO contact_info (type, label, value, sort_order) VALUES
('address', 'Main Office',      'Burma Camp, Accra, Ghana',                                                                                                                          10),
('address', 'Training Centre',  'Dodowa, Greater Accra Region, Ghana',                                                                                                                20),
('email',   'Email',            'info@geolicrafts.com',                                                                                                                               30),
('blurb',   'Export Enquiries', 'We export to Europe, the USA, and worldwide. Contact us for bulk orders, wholesale partnerships, or international trade enquiries.',                 40),
('blurb',   'Training Programmes', 'Interested in our vocational training? Get in touch to learn about our programmes for youth and women in the Dodowa area.',                       50);


-- ── Products (existing table seed) ──────────

INSERT INTO products (name, category, description) VALUES
('Djembe Drum',       'Musical Instruments', 'Hand-carved djembe drum made from authentic Ghanaian wood with goat-skin head.'),
('Bolga Basket (Large)', 'Baskets & Weaving','Traditional woven basket from Bolgatanga, crafted by skilled women artisans.'),
('Kente Wall Art',    'Textiles & Fashion',  'Framed Kente cloth wall art celebrating Ghana''s royal weaving tradition.'),
('Carved Mask',       'Wood Carvings',       'Decorative hand-carved wooden mask, inspired by traditional Ghanaian masquerade.'),
('Talking Drum',      'Musical Instruments', 'Hourglass-shaped talking drum used in traditional Ghanaian ceremonies.'),
('Straw Hat',         'Baskets & Weaving',   'Hand-woven straw hat with intricate geometric patterns.'),
('Fertility Doll',    'Wood Carvings',       'Traditional Akuaba fertility doll carved from dark Ghanaian wood.'),
('Batik Fabric',      'Textiles & Fashion',  'Hand-dyed batik fabric using traditional resist-dyeing techniques.');


-- ── Blog Posts (existing table seed) ────────

INSERT INTO blog_posts (title, slug, excerpt, content, category, published, published_at, read_time) VALUES

(
  'Geolicrafts CEO Foresees Handicraft Sector as Catalyst for Ghana''s Economic Transformation',
  'geolicrafts-ceo-vision',
  'Founder George Akologo shares his vision for how the craft industry can drive sustainable economic development in Ghana and across Africa.',
  'George Akologo, the founder and CEO of Geolicrafts Company Limited, has articulated a bold vision for Ghana''s handicraft sector — one where traditional crafts become a primary engine of national economic transformation.

## A Journey That Started With Five

In 2004, Akologo started Geolicrafts with just five workers in Accra''s Burma Camp area. Two decades later, the company employs over 45 skilled artisans, exports products worth hundreds of thousands of euros annually, and runs a full-scale vocational training centre in Dodowa.

"I always believed that our hands — the craft in our hands — could build this nation," Akologo told The Business & Financial Times. "We are not just making drums and baskets. We are building a legacy."

## Exporting Culture to the World

Today, 90% of Geolicrafts'' products are exported internationally, primarily to Europe and the United States. In 2021 alone, the company exported handicraft products worth 771,000 euros — representing approximately 3% of Ghana''s total handicraft exports.

Products include:
- **African musical instruments** (djembe drums, talking drums, xylophones)
- **Traditional Bolga baskets** from the Upper East Region
- **Hand-carved wooden sculptures and masks**
- **Fashion and textile items**

## The Training Centre Vision

With over $1 million in grant funding from Invest For Employment (part of the German Development Cooperation), Geolicrafts opened a state-of-the-art training centre in Dodowa, designed to train approximately 2,000 people — particularly rural women and youth — in handicraft and fashion creation.

"Every time we train someone, we are investing in a family. We are investing in a community," said Akologo.

## The Road Ahead

Geolicrafts has ambitious plans: international craft exhibitions, collaboration with Ghana''s Tourism Ministry, and establishing global warehouses to streamline international sourcing.

The CEO believes the handicraft sector, if properly supported, could rival Ghana''s cocoa and gold exports. "We have the talent, the heritage, and the creativity. What we need is the platform — and we are building it."',
  'News',
  true,
  '2023-12-08',
  5
),

(
  'New Training Centre in Dodowa to Empower 2,000 Artisans',
  'training-centre-dodowa',
  'With over $1 million in grant funding from Invest For Employment, our Dodowa training facility is set to transform lives through craft skills.',
  'In a landmark step for Ghana''s handicraft sector, Geolicrafts has opened a state-of-the-art vocational training centre in Dodowa, Greater Accra Region.

## The Centre

Funded by a $1 million+ grant from Invest For Employment — a programme of the German Development Cooperation (GIZ) — the facility is one of the most ambitious skills-development projects in Ghana''s craft industry.

## Who It Serves

The centre is designed to train approximately 2,000 young people, with a particular focus on rural women and youth who have limited access to formal employment. Courses cover handicraft creation, basket weaving, sewing, fashion design, and artisan skills.

## Impact

"Every time we train someone, we are investing in a family. We are investing in a community," said George Akologo, Founder & CEO of Geolicrafts.

The training programmes provide participants with marketable skills, connecting them to Geolicrafts'' global export network and enabling them to build sustainable livelihoods in their home communities.',
  'Community',
  true,
  '2023-06-15',
  4
),

(
  'Bolga Baskets: How a Ghanaian Tradition Conquered Global Markets',
  'bolga-baskets-global',
  'The story of how traditional hand-woven baskets from Bolgatanga became one of Ghana''s most beloved craft exports, shipped to Europe and the Americas.',
  'Few products capture the essence of Ghanaian craft quite like the Bolga basket — a hand-woven marvel from the Upper East Region that has found its way into homes across Europe, North America, and beyond.

## Origins in Bolgatanga

The Bolga basket takes its name from Bolgatanga, the capital of Ghana''s Upper East Region. For generations, women in the region have woven these baskets from elephant grass (veta vera), a local plant that provides both strength and flexibility.

## The Craft

Each basket begins with harvested elephant grass, which is dried and dyed in vivid colours using natural and modern dyes. Weavers — predominantly women — shape the grass into intricate geometric and figurative patterns unique to each maker.

A single basket can take between one and three days to complete, depending on size and complexity.

## Going Global

Geolicrafts has played a key role in connecting Bolga weavers to international buyers. Today, Bolga baskets are among the company''s highest-export products, shipped regularly to Europe and the United States.

"There is something universal about a well-made basket," says George Akologo. "It is functional, it is beautiful, and it carries the hands of the person who made it."

## Supporting the Weavers

By sourcing directly from artisan groups in Bolgatanga, Geolicrafts ensures that the economic benefit flows back to the communities where the craft originates.',
  'Crafts',
  true,
  '2023-03-20',
  6
),

(
  'The Heartbeat of Ghana: Preserving the Art of Drum-Making',
  'drums-cultural-heritage',
  'African drums are more than instruments — they carry the voices of ancestors. Here''s how Geolicrafts keeps this sacred tradition alive.',
  'In West African culture, the drum is not merely a musical instrument. It is a language, a messenger, a keeper of history.

## The Talking Drum

The most iconic of Ghana''s drums, the talking drum (or "fontomfrom") is an hourglass-shaped instrument whose pitch can be altered by squeezing the cords connecting its two heads. Skilled players can mimic the tones of spoken language — sending messages across villages before the age of telecommunications.

## The Djembe

Originally from the Mande people of West Africa, the djembe has become one of the continent''s best-known instruments globally. Carved from a single piece of hardwood and topped with a goat-skin head, a well-made djembe produces three distinct tones: bass, tone, and slap.

## How They Are Made

At Geolicrafts, drums are carved by hand from locally sourced Ghanaian wood. The process involves:
- **Selecting** the right timber — hardwoods like tweneboa or other local species
- **Carving** the shell over several days using chisels and gouges
- **Stretching and tuning** the animal-skin head
- **Finishing** with decorative rope-work and natural oils

## Passing It On

Geolicrafts'' training centre in Dodowa includes drum-making as part of its curriculum, ensuring the next generation of Ghanaian artisans inherits this ancient skill.

"These drums have spoken for our ancestors for centuries," says George Akologo. "Our job is to make sure they keep speaking."',
  'Crafts',
  true,
  '2022-11-10',
  7
);
