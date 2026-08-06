-- Showroom image for the homepage "Find Us Online" section — run this once
-- in the Supabase SQL editor.

alter table about_settings add column if not exists showroom_image_url text;
