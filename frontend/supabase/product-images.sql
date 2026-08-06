-- Multiple images per product — run this once in the Supabase SQL editor.

-- Ordered list of image URLs; first element is the cover image shown in
-- listings. `image_url` is kept in sync (mirrors the first entry) so
-- existing queries/older clients that only know about a single cover
-- image keep working.
alter table products add column if not exists image_urls text[] not null default '{}';

-- Backfill existing single-image products into the new array column.
update products
set image_urls = array[image_url]
where (image_urls is null or image_urls = '{}')
  and image_url is not null
  and image_url <> '';
