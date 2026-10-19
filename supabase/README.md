# Supabase setup

The site works before these steps (it falls back gracefully), but run them to switch on
product details, quote requests, spam protection and email alerts.

## 1. Run migration 002

Supabase dashboard → **SQL Editor** → paste `migrations/002_product_details_and_enquiries.sql` → **Run**.

Adds product detail fields (photos, dimensions, materials, colours, minimum order, lead time),
pretty product URLs (`/products/djembe-drum`), and quote-request columns on `contact_messages`.

## 2. Deploy the `submit-enquiry` Edge Function

Dashboard → **Edge Functions** → **Deploy a new function** → **Via Editor** →
name it `submit-enquiry` → paste `functions/submit-enquiry/index.ts` → **Deploy**.

(Or with the CLI: `supabase functions deploy submit-enquiry`.)

## 3. Turn on email alerts (optional)

1. Create a free account at <https://resend.com> and create an API key.
2. Dashboard → **Edge Functions → Secrets** → add:
   - `RESEND_API_KEY` — the key from Resend
   - `NOTIFY_EMAIL` — where alerts go (comma-separate for several)
   - `RESEND_FROM` — optional, e.g. `Geolicrafts <website@geolicraftsgh.com>`

Until you verify a domain in Resend, emails can only be sent **to the address you signed up
to Resend with**, so use that as `NOTIFY_EMAIL` at first.

## 4. Test, then lock down direct inserts

Send a test message and a test quote from the live site and check they arrive in
**Admin → Messages** (and your inbox). Then run `migrations/003_lock_contact_inserts.sql`
so every submission has to pass the function's spam checks.

## 5. Move product images off the old WordPress site

Many product images still load from geolicrafts.com. This script downloads each one,
compresses it to WebP (max 1600px), uploads it to the `images` bucket and updates the
product — so the shop keeps working if the old site goes offline.

1. Copy the **service_role** key from Supabase → Project Settings → API (keep it secret —
   don't commit it or put it in Vercel).
2. From the project folder, preview first, then run it:

   ```bash
   SUPABASE_SERVICE_ROLE_KEY=your-key npm run migrate-images -- --dry-run
   SUPABASE_SERVICE_ROLE_KEY=your-key npm run migrate-images
   ```

   On Windows PowerShell: `$env:SUPABASE_SERVICE_ROLE_KEY="your-key"; npm run migrate-images`

   The project URL is read from `VITE_SUPABASE_URL` in your `.env`.

It's safe to re-run — images already copied are reused, and any that fail keep their old
link and are listed in `migrate-images-errors.json`. Try `--limit 5` for a first test.
Typical product photos come out at 30–80KB each, well within the free 1GB of storage.
