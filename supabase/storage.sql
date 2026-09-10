-- Storage bucket for company featured images. Run once in the Supabase SQL
-- editor (after schema.sql, so is_admin() exists). Public read; only admins
-- can upload/change/delete.

insert into storage.buckets (id, name, public)
values ('business-images', 'business-images', true)
on conflict (id) do nothing;

drop policy if exists "business_images_public_read" on storage.objects;
create policy "business_images_public_read" on storage.objects
  for select using (bucket_id = 'business-images');

drop policy if exists "business_images_admin_write" on storage.objects;
create policy "business_images_admin_write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'business-images' and is_admin());

drop policy if exists "business_images_admin_update" on storage.objects;
create policy "business_images_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'business-images' and is_admin())
  with check (bucket_id = 'business-images' and is_admin());

drop policy if exists "business_images_admin_delete" on storage.objects;
create policy "business_images_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'business-images' and is_admin());
