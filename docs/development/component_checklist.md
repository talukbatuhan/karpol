# KARPOL — Component Development Checklist

> Her component geliştirmeden önce ve sonra bu listeyi kontrol edin.

---

## 🧩 Components Master List

### Layout Components

| Component | File | Status | Notes |
|---|---|---|---|
| Header / Navbar | `src/components/Header/` | ⬜ | Sticky, transparent → solid on scroll |
| Footer | `src/components/Footer/` | ⬜ | Mega footer, multi-column |
| PageLayout | `src/components/PageLayout/` | ⬜ | Main wrapper with SEO head |
| Container | `src/components/Container/` | ⬜ | Max-width 1200px centered |
| Section | `src/components/Section/` | ⬜ | Standard page section with spacing |

### Homepage Components

| Component | File | Status | Notes |
|---|---|---|---|
| HeroSection | `src/components/Hero/` | ⬜ | Video/image background + CTA |
| TrustBar | `src/components/TrustBar/` | ⬜ | Certifications + stats |
| CategoryGrid | `src/components/CategoryGrid/` | ⬜ | 8 product category cards |
| IndustryGrid | `src/components/IndustryGrid/` | ⬜ | Interactive industry cards |
| FactoryShowcase | `src/components/FactoryShowcase/` | ⬜ | Image slider / video reel |
| GlobalReach | `src/components/GlobalReach/` | ⬜ | Animated world map |
| ArticleCards | `src/components/ArticleCards/` | ⬜ | Latest 3 blog posts |
| CTAFooter | `src/components/CTAFooter/` | ⬜ | Final conversion CTA |

### Product Components

| Component | File | Status | Notes |
|---|---|---|---|
| ProductCard | `src/components/ProductCard/` | ⬜ | Category grid card |
| ProductGallery | `src/components/ProductGallery/` | ⬜ | Zoomable image gallery |
| ProductSpecs | `src/components/ProductSpecs/` | ⬜ | Technical specs table |
| ProductTabs | `src/components/ProductTabs/` | ⬜ | Specs / Materials / Compat |
| RelatedProducts | `src/components/RelatedProducts/` | ⬜ | Carousel of related items |
| Breadcrumbs | `src/components/Breadcrumbs/` | ⬜ | Schema-enabled breadcrumbs |

### Form Components

| Component | File | Status | Notes |
|---|---|---|---|
| RFQForm | `src/components/RFQForm/` | ⬜ | Request for Quote form |
| ContactForm | `src/components/ContactForm/` | ⬜ | General inquiry form |
| FileUpload | `src/components/FileUpload/` | ⬜ | Drag-drop DWG/STEP/PDF |
| IndustryRFQ | `src/components/IndustryRFQ/` | ⬜ | Industry-specific RFQ |

### Shared / UI Components

| Component | File | Status | Notes |
|---|---|---|---|
| Button | `src/components/ui/Button/` | ⬜ | 4 variants |
| Badge | `src/components/ui/Badge/` | ⬜ | Status indicators |
| Card | `src/components/ui/Card/` | ⬜ | Base card styles |
| Modal | `src/components/ui/Modal/` | ⬜ | Overlay modal |
| Tabs | `src/components/ui/Tabs/` | ⬜ | Tab navigation |
| Accordion | `src/components/ui/Accordion/` | ⬜ | FAQ sections |
| Carousel | `src/components/ui/Carousel/` | ⬜ | Image/product slider |
| ScrollReveal | `src/components/ui/ScrollReveal/` | ⬜ | Intersection Observer anim |
| WhatsAppButton | `src/components/ui/WhatsAppButton/` | ⬜ | Floating WA CTA |

---

## ✅ Component Quality Checklist

Her component tamamlandığında bu listeyi kontrol edin:

```
☐ Design tokens kullanılıyor (hardcoded değer yok)
☐ Mobile responsive (375px, 768px, 1024px, 1280px)
☐ Hover ve focus states tanımlanmış
☐ Erişilebilirlik (aria-labels, contrast, keyboard nav)
☐ Animation tokens kullanılıyor
☐ Loading/skeleton state var (gerekli ise)
☐ Dark ve light background'da çalışıyor
☐ TypeScript types tanımlı
☐ Props documented
☐ Named export (index.ts)
```

---

## 🗂 Folder Structure Pattern

```
src/components/[ComponentName]/
├── [ComponentName].tsx          # Component implementation
├── [ComponentName].css          # Scoped styles
├── [ComponentName].types.ts     # TypeScript interfaces
├── [ComponentName].test.tsx     # Unit tests (optional)
└── index.ts                     # Named export
```

### index.ts template:
```typescript
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName.types';
```
