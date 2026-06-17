<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Karpol — Proje Kuralları

## Dizin yapısı

Tüm uygulama kodu `src/` altındadır:

| Klasör | Sorumluluk |
|--------|------------|
| `src/app/` | Next.js App Router (sayfalar, layout, error boundaries) |
| `src/components/` | UI — `atoms/`, `molecules/`, `organisms/`, `ui/` (shadcn) |
| `src/services/` | Supabase ve dış servis erişimi (repository pattern) |
| `src/actions/` | `"use server"` — auth, validation, revalidate |
| `src/types/` | `database.types.ts` + domain tipleri |
| `src/hooks/` | Client hooks |
| `src/lib/` | Supabase client'ları, Zod şemaları, utils, SEO, e-posta |
| `src/i18n/`, `src/messages/` | next-intl |
| `features/` | Domain logic (ör. `tools/makara`) |

Kökte: `src/proxy.ts`, `public/`, `supabase/`, `tests/`

## Mimari kurallar

1. **Supabase** yalnızca `src/services/` ve `src/lib/supabase/` içinde import edilir.
2. **RSC sayfaları** okuma için `services/` çağırır.
3. **Client bileşenler** veri mutasyonu için yalnızca `actions/` kullanır.
4. **Tipler** `src/types/database.types.ts` merkezli; migration sonrası `npm run types:gen` (uzak şema kodla uyumlu olmalı — bkz. `docs/SUPABASE_SYNC.md`).
5. **i18n** — hardcoded string yok; `getTranslations` / `useTranslations`.
6. **UI** — shadcn primitives (`components/ui/`), marka renkleri CSS değişkenlerinde.

## Geliştirme

```bash
npm run dev      # http://localhost:3000/tr
npm run build
npm run types:gen  # Supabase şema değişince
```
