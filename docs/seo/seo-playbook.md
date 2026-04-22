# KARPOL — SEO Playbook

> Uluslararası SEO stratejisi ve uygulama rehberi

---

## 🎯 SEO Objectives

1. Organic traffic: 15,000+ sessions/month within 12 months
2. Top 10 ranking for 50+ target keywords
3. Featured snippets for key informational queries
4. International visibility across EN, TR, DE, AR markets

---

## 🔑 Master Keyword Map

### Tier 1 — High Priority (Direct Revenue)

| Keyword | Language | Volume | Difficulty | Target Page | Status |
|---|---|---|---|---|---|
| polyurethane rollers | EN | High | Medium | `/products/polyurethane/rollers` | ⬜ Not Started |
| vulkolan rollers | EN | Medium | Low | `/products/vulkolan/rollers` | ⬜ Not Started |
| marble machine spare parts | EN | Medium | Low | `/industries/marble-stone` | ⬜ Not Started |
| stone cutting machine parts | EN | Medium | Low | `/industries/marble-stone` | ⬜ Not Started |
| custom polyurethane parts | EN | Medium | Medium | `/custom-manufacturing` | ⬜ Not Started |
| industrial rubber products | EN | High | High | `/products/rubber` | ⬜ Not Started |
| PTFE gasket manufacturer | EN | Medium | Medium | `/products/ptfe-teflon` | ⬜ Not Started |
| poliüretan makara | TR | Medium | Low | `/tr/urunler/poliuretan` | ⬜ Not Started |
| mermer makinesi yedek parça | TR | Medium | Low | `/tr/sektorler/mermer-tas` | ⬜ Not Started |
| polyurethan rollen hersteller | DE | Low | Low | `/de/produkte/polyurethan` | ⬜ Not Started |

### Tier 2 — Supporting (Traffic + Authority)

| Keyword | Target Page | Status |
|---|---|---|
| polyurethane manufacturer Turkey | `/about` | ⬜ |
| industrial hose manufacturer | `/products/rubber/hoses` | ⬜ |
| polyurethane casting service | `/custom-manufacturing` | ⬜ |
| CNC machined aluminum parts | `/products/aluminum-cnc` | ⬜ |
| engineering plastic parts | `/products/engineering-plastics` | ⬜ |
| viton seals manufacturer | `/products/viton` | ⬜ |
| silicone gaskets industrial | `/products/silicone` | ⬜ |
| rubber vibration dampener | `/products/rubber/dampeners` | ⬜ |

### Tier 3 — Long-tail (Blog / Knowledge)

| Keyword | Target Article | Status |
|---|---|---|
| what is vulkolan material | `vulkolan-nedir` | ⬜ |
| polyurethane vs rubber comparison | `polyurethane-vs-rubber` | ⬜ |
| shore hardness explained | `shore-sertlik-rehberi` | ⬜ |
| how polyurethane rollers are made | `polyurethane-roller-uretim` | ⬜ |
| marble cutting machine components | `mermer-kesme-makine-parcalari` | ⬜ |
| abrasion resistance elastomers | `abrasion-resistance-guide` | ⬜ |

---

## 📄 On-Page SEO Checklist (Per Page)

```
☐ Unique title tag (max 60 chars) — Format: {Product} | {Category} | KARPOL
☐ Unique meta description (max 155 chars) — Include CTA verb
☐ Single H1 per page containing primary keyword
☐ H2/H3 hierarchy with secondary keywords
☐ Image alt text — descriptive, keyword-rich
☐ Image file names — kebab-case with keywords
☐ Internal links to related products/pages (3–5 minimum)
☐ External links (0–2 authority sources where relevant)
☐ Schema.org structured data (see below)
☐ Canonical URL set
☐ Hreflang tags for multi-language pages
☐ Breadcrumb navigation with schema
☐ Open Graph and Twitter Card meta tags
☐ URL is clean, keyword-containing, kebab-case
```

---

## 🏗 Schema.org Implementation

### Product Page
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Polyurethane Conveyor Roller",
  "sku": "PU-RLR-080120",
  "description": "High-performance polyurethane conveyor roller...",
  "image": "https://karpol.net/images/pu-roller-080120.webp",
  "brand": { "@type": "Brand", "name": "KARPOL" },
  "manufacturer": { "@type": "Organization", "name": "KARPOL" },
  "material": "Polyurethane 95A Shore",
  "category": "Industrial Rollers"
}
```

### Organization (Sitewide)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "KARPOL",
  "url": "https://karpol.net",
  "logo": "https://karpol.net/images/karpol-logo.svg",
  "sameAs": [
    "https://linkedin.com/company/karpol",
    "https://instagram.com/karpol"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+90-XXX-XXX-XXXX",
    "contactType": "sales"
  }
}
```

### FAQ Page (Knowledge Articles)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is Vulkolan?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Vulkolan is a high-performance polyurethane elastomer..."
    }
  }]
}
```

### BreadcrumbList
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://karpol.net/" },
    { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://karpol.net/products/" },
    { "@type": "ListItem", "position": 3, "name": "Polyurethane", "item": "https://karpol.net/products/polyurethane/" }
  ]
}
```

---

## 🌍 International SEO Structure

### URL Pattern
```
karpol.net/en/...     → English (default)
karpol.net/tr/...     → Turkish
karpol.net/de/...     → German
karpol.net/ar/...     → Arabic
```

### Hreflang Tags (Every Page)
```html
<link rel="alternate" hreflang="en" href="https://karpol.net/en/products/polyurethane/" />
<link rel="alternate" hreflang="tr" href="https://karpol.net/tr/urunler/poliuretan/" />
<link rel="alternate" hreflang="de" href="https://karpol.net/de/produkte/polyurethan/" />
<link rel="alternate" hreflang="ar" href="https://karpol.net/ar/منتجات/بولي-يوريثان/" />
<link rel="alternate" hreflang="x-default" href="https://karpol.net/en/products/polyurethane/" />
```

---

## 📊 Tracking & Measurement

### Monthly SEO Report Template

| Metric | Target | Jan | Feb | Mar | ... |
|---|---|---|---|---|---|
| Organic Sessions | 15,000 | | | | |
| Top 10 Keywords | 50+ | | | | |
| Top 3 Keywords | 15+ | | | | |
| RFQ from Organic | 50+ | | | | |
| New Backlinks | 10+ | | | | |
| Avg. Position | < 20 | | | | |
| Pages Indexed | 100+ | | | | |
| Core Web Vitals | Pass | | | | |

---

## 🔗 Link Building Strategy

| Tactic | Target | Priority |
|---|---|---|
| Industry directories (Thomasnet, Kompass, Europages) | 10 listings | 🔴 High |
| Guest articles on industrial trade publications | 2/quarter | 🟡 Medium |
| Alibaba / Made-in-Turkey profiles | 3 profiles | 🔴 High |
| YouTube video descriptions with backlinks | All videos | 🟡 Medium |
| LinkedIn articles with website links | 2/month | 🟢 Low |
| Partner/client website mentions | Ongoing | 🟡 Medium |
