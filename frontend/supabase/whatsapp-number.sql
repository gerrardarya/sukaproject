-- WhatsApp contact number — run this once in the Supabase SQL editor.

-- Digits only, international format without "+" (e.g. 6281234567890),
-- matching what wa.me expects. Used site-wide wherever a WhatsApp link
-- is generated.
alter table whatsapp_settings add column if not exists phone_number text not null default '';
