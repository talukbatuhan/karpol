-- Storage buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'product-images',
    'product-images',
    true,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'product-files',
    'product-files',
    true,
    52428800,
    array[
      'application/pdf',
      'image/vnd.dwg',
      'application/acad',
      'application/octet-stream',
      'application/step',
      'model/step'
    ]
  )
on conflict (id) do nothing;

-- Public read
create policy "product_images_public_read"
on storage.objects for select
to public
using (bucket_id = 'product-images');

create policy "product_files_public_read"
on storage.objects for select
to public
using (bucket_id = 'product-files');

-- Admin upload/update/delete
create policy "product_images_admin_insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_update"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images' and public.is_admin());

create policy "product_files_admin_insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-files' and public.is_admin());

create policy "product_files_admin_update"
on storage.objects for update
to authenticated
using (bucket_id = 'product-files' and public.is_admin())
with check (bucket_id = 'product-files' and public.is_admin());

create policy "product_files_admin_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-files' and public.is_admin());
