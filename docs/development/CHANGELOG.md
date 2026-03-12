# KARPOL — Development Changelog

> Tüm geliştirme aşamalarının kayıt altına alındığı dosya.

---

## [0.1.0] — 2026-03-11

### 🆕 Added — Next.js + Supabase Initialization
- ✅ Next.js 15 project created (App Router, TypeScript, ESLint, Turbopack)
- ✅ Supabase JS + SSR packages installed
- ✅ Supabase client setup (browser, server, middleware)
- ✅ TypeScript database types for 8 tables
- ✅ Site configuration with navigation structure
- ✅ SQL schema with tables, indexes, RLS policies, seed data
- ✅ Environment variables template (`.env.example`)
- ✅ Full `src/` directory structure:
  - `app/` — All route directories created
  - `components/` — ui, layout, sections, products, forms
  - `lib/` — Supabase clients, config
  - `types/` — Database type definitions
  - `hooks/`, `utils/` — Empty, ready for use

### 📄 Key Files Created
| File | Purpose |
|---|---|
| `src/lib/supabase-client.ts` | Browser-side Supabase client |
| `src/lib/supabase-server.ts` | Server-side Supabase client (SSR) |
| `src/lib/supabase-middleware.ts` | Session management utility |
| `src/middleware.ts` | Next.js middleware for auth |
| `src/lib/config.ts` | Site config, navigation, categories |
| `src/types/database.ts` | All TypeScript types |
| `docs/development/supabase_schema.sql` | Full database schema |
| `.env.example` | Environment template |

---

## [0.0.1] — 2026-03-11

### 📋 Project Initialization
- ✅ Created project directory structure
- ✅ Completed website strategy document (14 sections)
- ✅ Created development guide and code standards
- ✅ Created design system documentation
- ✅ Created SEO playbook
- ✅ Created content calendar
- ✅ Created development tracking system

### 📄 Documents Created
| Document | Path | Status |
|---|---|---|
| Website Strategy | `docs/strategy/website_strategy.md` | ✅ Complete |
| Development Guide | `docs/development/development_guide.md` | ✅ Complete |
| Changelog | `docs/development/CHANGELOG.md` | ✅ Active |
| Design System | `docs/design/design_system.md` | ✅ Complete |
| SEO Playbook | `docs/seo/seo_playbook.md` | ✅ Complete |
| Content Calendar | `docs/content/content_calendar.md` | ✅ Complete |
| Development Tracker | `docs/development/tracker.md` | ✅ Active |

---

## Template for Future Entries

```markdown
## [X.Y.Z] — YYYY-MM-DD

### 🆕 Added
- New feature or page

### 🔄 Changed
- Modification to existing feature

### 🐛 Fixed
- Bug fix description

### 🗑 Removed
- Removed feature or deprecated code

### 📝 Notes
- Important notes or decisions
```
