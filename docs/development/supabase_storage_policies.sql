-- ============================================
-- KARPOL — Supabase Storage Policies (Catalogs)
-- ============================================
-- Bucket name: catalogs
-- Public READ, Admin WRITE

-- 1) Create bucket if missing (run once in SQL Editor)
insert into storage.buckets (id, name, public)
values ('catalogs', 'catalogs', true)
on conflict (id) do nothing;

-- 2) Public read access to catalog files
create policy "Public can read catalogs"
on storage.objects
for select
to public
using (bucket_id = 'catalogs');

-- 3) Admin write access (insert/update/delete)
create policy "Admins can upload catalogs"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'catalogs'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

create policy "Admins can update catalogs"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'catalogs'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
with check (
  bucket_id = 'catalogs'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

create policy "Admins can delete catalogs"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'catalogs'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
