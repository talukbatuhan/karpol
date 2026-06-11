-- Enums
create type public.product_status as enum ('draft', 'published');
create type public.product_category as enum (
  'tip_bt',
  'tip_ct',
  'tip_yt',
  'makara',
  'silim'
);

-- Profiles (linked to auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products (CMS)
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category public.product_category not null,
  status public.product_status not null default 'draft',
  title_tr text not null,
  title_en text not null,
  description_tr text not null default '',
  description_en text not null default '',
  body_tr text not null default '',
  body_en text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_status_idx on public.products (status);
create index products_category_idx on public.products (category);
create index products_updated_at_idx on public.products (updated_at desc);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Admin helper (security definer for RLS)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.products enable row level security;

-- profiles
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "profiles_select_admin"
on public.profiles for select
to authenticated
using (public.is_admin());

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- products: public read published only
create policy "products_select_published"
on public.products for select
to anon, authenticated
using (status = 'published');

-- products: admin read all (including drafts)
create policy "products_select_admin"
on public.products for select
to authenticated
using (public.is_admin());

create policy "products_insert_admin"
on public.products for insert
to authenticated
with check (public.is_admin());

create policy "products_update_admin"
on public.products for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "products_delete_admin"
on public.products for delete
to authenticated
using (public.is_admin());
