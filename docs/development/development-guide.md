# KARPOL — Development Guide

> Geliştirici rehberi ve teknik standartlar

---

## 🛠 Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | SSR + SSG hybrid for SEO |
| **Database** | Supabase (PostgreSQL) | Products, articles, RFQ data |
| **Auth** | Supabase Auth | Admin panel authentication |
| **Storage** | Supabase Storage | Product images, catalogs, PDFs |
| **Styling** | Vanilla CSS + CSS Custom Properties | Design token system |
| **Language** | TypeScript | Type safety |
| **Hosting** | Vercel | Edge functions + CDN |
| **Analytics** | Google Analytics 4 + Search Console | Conversion tracking |
| **Forms** | Next.js API Routes + Supabase | RFQ + contact form submissions |
| **Images** | Next/Image + WebP | Auto-optimization |
| **i18n** | next-intl | EN, TR |

### Supabase Architecture
```
src/lib/
├── supabase-client.ts      # Browser client (client components)
├── supabase-server.ts      # Server client (SSR, API routes)
├── supabase-middleware.ts   # Session management
└── config.ts               # Site configuration

src/types/
└── database.ts             # TypeScript types (auto-generated)

src/middleware.ts            # Next.js middleware (session refresh)
```

---

## 📐 Code Standards

### File Naming
```
components/     → PascalCase.tsx  (e.g., ProductCard.tsx)
pages/          → kebab-case/    (e.g., custom-manufacturing/)
styles/         → kebab-case.css (e.g., product-card.css)
utils/          → camelCase.ts   (e.g., formatPrice.ts)
public/images/  → kebab-case     (e.g., pu-roller-hero.webp)
```

### CSS Architecture
```css
/* Design Tokens — variabes defined in :root */
:root {
  --color-primary: #1A1A2E;
  --color-secondary: #2D2D44;
  --color-accent: #E8611A;
  --color-accent-hover: #CC5216;
  --color-bg: #F5F5F0;
  --color-white: #FFFFFF;
  --color-text: #1A1A1A;
  --color-text-secondary: #6B7280;
  --color-border: #E2E8F0;
  --color-success: #2ECC71;

  --font-primary: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;

  --shadow-card: 0 4px 24px rgba(0,0,0,0.08);
  --shadow-hover: 0 8px 32px rgba(0,0,0,0.12);

  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  --container-max: 1200px;
  --gutter: 24px;
  --section-gap: 120px;
}
```

### Component Structure
```
src/components/ProductCard/
├── ProductCard.tsx          # Component logic
├── ProductCard.css          # Component styles
├── ProductCard.test.tsx     # Unit tests
└── index.ts                 # Named export
```

---

## 📦 Page Architecture

### Route Structure
```
/                           → Home
/about                      → About KARPOL
/products                   → Product Categories
/products/[category]        → Category Page
/products/[category]/[slug] → Product Detail
/industries                 → Industries Overview
/industries/[slug]          → Industry Page
/industries/marble-stone    → Marble Special Page
/custom-manufacturing       → Custom Manufacturing
/factory-technology         → Factory & Technology
/knowledge                  → Technical Knowledge (Blog)
/knowledge/[slug]           → Article Detail
/catalog                    → Downloads & Catalog
/contact                    → Contact & RFQ
```

### Multi-language Routes
```
/en/products/polyurethane/rollers
/tr/urunler/poliuretan/makaralar
```

---

## 🔧 Development Workflow

### Branch Strategy
```
main            → Production (auto-deploy)
staging         → Staging environment
dev             → Active development
feature/*       → Feature branches
fix/*           → Bug fixes
content/*       → Content updates
```

### Commit Convention
```
feat: add product detail page template
fix: correct RFQ form validation
style: update hero section spacing
content: add vulkolan article
seo: add schema markup to product pages
i18n: add localized strings for products
perf: optimize product image loading
```

---

## ✅ Quality Checklist (Per Page)

- [ ] Responsive: Mobile (375px) → Tablet (768px) → Desktop (1440px)
- [ ] SEO: Unique title, meta description, OG tags
- [ ] Schema.org: Structured data markup
- [ ] Performance: LCP < 2.5s, CLS < 0.1
- [ ] Accessibility: WCAG 2.1 AA compliant
- [ ] i18n: All strings translatable
- [ ] Images: WebP format, proper alt text, lazy loading
- [ ] CTA: At least one conversion point per page
- [ ] Analytics: Page view, event tracking configured
- [ ] Cross-browser: Chrome, Firefox, Safari, Edge

---

## 🏗 Build Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint

# Run type check
npm run typecheck

# Generate sitemap
npm run sitemap
```

---

## 📝 Environment Variables

```env
# .env.local — Şablonu .env.example dosyasından kopyalayın
# cp .env.example .env.local

# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# SITE
NEXT_PUBLIC_SITE_URL=https://karpol.net
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_WHATSAPP=+90XXXXXXXXXX

# EMAIL (Server-only)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@karpol.net
SMTP_PASS=*****
```

## 🗄 Database Setup

1. Supabase'de yeni proje oluşturun: [supabase.com](https://supabase.com)
2. `.env.local` dosyasına URL ve key'leri yapıştırın
3. SQL Editor'da şemayı çalıştırın: `docs/development/supabase_schema.sql`
4. Bu şema 8 tablo, indexler, RLS politikaları ve örnek verileri otomatik oluşturur
