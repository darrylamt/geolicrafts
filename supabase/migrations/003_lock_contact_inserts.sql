-- =============================================
-- 003 — Route all enquiries through the submit-enquiry Edge Function
--
-- Run this ONLY after the submit-enquiry function is deployed and you've
-- sent a test message from the live site. Afterwards, bots can no longer
-- insert into contact_messages directly with the public anon key — every
-- submission has to pass the function's spam checks.
-- =============================================

DROP POLICY IF EXISTS "Anyone can submit contact" ON contact_messages;
