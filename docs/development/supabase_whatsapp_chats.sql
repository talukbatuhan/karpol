-- =====================================================================
-- KARPOL — WhatsApp Chat Log Tablosu
-- ---------------------------------------------------------------------
-- /api/whatsapp endpoint'i her gelen mesajı bu tabloya kaydeder.
-- Site ziyaretçileri "Canlı Destek Alın" butonuyla mesaj göndererek
-- doğrudan iş telefonunuza iletişim kurar; biz de aynı mesajları burada
-- audit log olarak tutarız.
--
-- Çalıştırmak için Supabase Studio > SQL Editor'da aşağıyı tek seferde
-- çalıştırın. Mevcut tabloyu KAYBETMEDEN tekrar çalıştırılabilir
-- (IF NOT EXISTS / CREATE OR REPLACE kullanıyoruz).
-- =====================================================================

create extension if not exists "pgcrypto";

create table if not exists public.whatsapp_chats (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text,
  phone           text,
  message         text not null,
  product_name    text,
  sku             text,
  source_page     text,
  locale          text,
  forwarded       boolean not null default false,
  forward_error   text,
  cloud_message_id text,
  status          text not null default 'new'
                  check (status in ('new','read','responded','archived'))
);

create index if not exists idx_whatsapp_chats_created_at
  on public.whatsapp_chats (created_at desc);

create index if not exists idx_whatsapp_chats_status
  on public.whatsapp_chats (status);

-- ---------------------------------------------------------------------
-- RLS — yalnızca service_role yazar; istemci doğrudan okuyamaz/yazamaz.
-- ---------------------------------------------------------------------
alter table public.whatsapp_chats enable row level security;

drop policy if exists "service role full access" on public.whatsapp_chats;
create policy "service role full access"
  on public.whatsapp_chats
  for all
  to service_role
  using (true)
  with check (true);

-- Anon erişimi yok; admin paneli `createAdminClient()` (service role)
-- kullandığı için tabloyu sınırsız okuyup günceller.

comment on table public.whatsapp_chats is
  'Site WhatsApp chat modal''ından gelen mesajlar. /api/whatsapp tarafından doldurulur.';
