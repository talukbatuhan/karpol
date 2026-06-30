-- Digital e-catalogs (book-style spreads with product hotspots)

create table public.ecatalogs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status public.product_status not null default 'draft',
  title_tr text not null,
  title_en text not null,
  description_tr text not null default '',
  description_en text not null default '',
  cover_image text not null default '',
  year text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ecatalogs_slug_format check (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  )
);

create index ecatalogs_status_idx on public.ecatalogs (status);
create index ecatalogs_sort_order_idx on public.ecatalogs (sort_order);

create table public.ecatalog_spreads (
  id uuid primary key default gen_random_uuid(),
  ecatalog_id uuid not null references public.ecatalogs (id) on delete cascade,
  sort_order int not null default 0,
  left_image text not null default '',
  right_image text not null default '',
  links jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index ecatalog_spreads_ecatalog_id_idx on public.ecatalog_spreads (ecatalog_id);
create index ecatalog_spreads_sort_idx on public.ecatalog_spreads (ecatalog_id, sort_order);

create trigger ecatalogs_set_updated_at
before update on public.ecatalogs
for each row execute function public.set_updated_at();

create trigger ecatalog_spreads_set_updated_at
before update on public.ecatalog_spreads
for each row execute function public.set_updated_at();

alter table public.ecatalogs enable row level security;
alter table public.ecatalog_spreads enable row level security;

-- ecatalogs
create policy "ecatalogs_select_public"
on public.ecatalogs for select
to public
using (status = 'published');

create policy "ecatalogs_admin_all"
on public.ecatalogs for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- spreads (readable when parent catalog is published)
create policy "ecatalog_spreads_select_public"
on public.ecatalog_spreads for select
to public
using (
  exists (
    select 1
    from public.ecatalogs e
    where e.id = ecatalog_id
      and e.status = 'published'
  )
);

create policy "ecatalog_spreads_admin_all"
on public.ecatalog_spreads for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
