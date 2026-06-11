-- Dynamic product categories (admin-managed hierarchy)

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_tr text not null,
  name_en text not null,
  parent_id uuid references public.categories (id) on delete set null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_slug_format check (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  )
);

create index categories_parent_id_idx on public.categories (parent_id);
create index categories_sort_order_idx on public.categories (sort_order);

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

-- Map legacy enum values to initial categories
insert into public.categories (slug, name_tr, name_en, sort_order) values
  ('makara', 'Makara', 'Rollers', 10),
  ('silim', 'Silim', 'Grinding', 20),
  ('tip-bt', 'Tip BT', 'Type BT', 30),
  ('tip-ct', 'Tip CT', 'Type CT', 40),
  ('tip-yt', 'Tip YT', 'Type YT', 50);

alter table public.products
  add column category_id uuid references public.categories (id) on delete restrict;

update public.products p
set category_id = c.id
from public.categories c
where (p.category::text = 'tip_bt' and c.slug = 'tip-bt')
   or (p.category::text = 'tip_ct' and c.slug = 'tip-ct')
   or (p.category::text = 'tip_yt' and c.slug = 'tip-yt')
   or (p.category::text = 'makara' and c.slug = 'makara')
   or (p.category::text = 'silim' and c.slug = 'silim');

update public.products
set category_id = (select id from public.categories where slug = 'tip-bt' limit 1)
where category_id is null;

alter table public.products alter column category_id set not null;

drop index if exists products_category_idx;
alter table public.products drop column category;
drop type public.product_category;

create index products_category_id_idx on public.products (category_id);

-- RLS
alter table public.categories enable row level security;

create policy "categories_select_public"
on public.categories for select
to anon, authenticated
using (true);

create policy "categories_insert_admin"
on public.categories for insert
to authenticated
with check (public.is_admin());

create policy "categories_update_admin"
on public.categories for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "categories_delete_admin"
on public.categories for delete
to authenticated
using (public.is_admin());
