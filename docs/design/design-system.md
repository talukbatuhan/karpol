# KARPOL — Design System Reference

> Görsel tasarım sistemi ve UI bileşen standartları

---

## 🎨 Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|---|---|---|---|
| Graphite Black | `#1A1A2E` | `26, 26, 46` | Hero backgrounds, headers, footers |
| Steel Grey | `#2D2D44` | `45, 45, 68` | Cards, secondary backgrounds, overlays |
| Warm White | `#F5F5F0` | `245, 245, 240` | Page backgrounds, content areas |
| Pure White | `#FFFFFF` | `255, 255, 255` | Text on dark, content containers |

### Accent Colors

| Name | Hex | RGB | Usage |
|---|---|---|---|
| Industrial Orange | `#E8611A` | `232, 97, 26` | CTAs, highlights, active states |
| Deep Orange | `#CC5216` | `204, 82, 22` | Hover states, pressed states |
| Orange Light | `#FFF3ED` | `255, 243, 237` | Orange tinted backgrounds |

### Semantic Colors

| Name | Hex | Usage |
|---|---|---|
| Success Green | `#2ECC71` | Success states, check marks |
| Warning Amber | `#F39C12` | Warning indicators |
| Error Red | `#E74C3C` | Error states, validation |
| Info Blue | `#3498DB` | Information badges |

### Neutral Scale

| Name | Hex | Usage |
|---|---|---|
| Text Primary | `#1A1A1A` | Body text on light backgrounds |
| Text Secondary | `#6B7280` | Supporting text, captions |
| Text Tertiary | `#9CA3AF` | Placeholder text |
| Border | `#E2E8F0` | Dividers, card borders |
| Border Light | `#F1F5F9` | Subtle separators |

---

## 🔤 Typography

### Font Stack

```css
/* Primary: Inter — Engineering clarity */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* Monospace: JetBrains Mono — Technical data */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
```

### Type Scale

| Element | Font | Weight | Size (Desktop) | Size (Mobile) | Line Height | Letter Spacing |
|---|---|---|---|---|---|---|
| Display | Inter | 800 | 80px | 40px | 1.05 | -0.02em |
| H1 | Inter | 800 | 64px | 36px | 1.1 | -0.02em |
| H2 | Inter | 700 | 48px | 30px | 1.2 | -0.01em |
| H3 | Inter | 600 | 32px | 24px | 1.3 | 0 |
| H4 | Inter | 600 | 24px | 20px | 1.4 | 0 |
| H5 | Inter | 600 | 20px | 18px | 1.4 | 0.01em |
| Body Large | Inter | 400 | 18px | 16px | 1.6 | 0 |
| Body | Inter | 400 | 16px | 15px | 1.6 | 0 |
| Body Small | Inter | 400 | 14px | 13px | 1.5 | 0.01em |
| Caption | Inter | 400 | 13px | 12px | 1.5 | 0.02em |
| Technical | JetBrains Mono | 400 | 14px | 13px | 1.5 | 0 |
| Button | Inter | 600 | 15px | 14px | 1.0 | 0.03em |

---

## 📐 Spacing System

### Base Unit: 4px

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Minimal gap |
| `--space-2` | 8px | Tight spacing |
| `--space-3` | 12px | Small gap |
| `--space-4` | 16px | Default gap |
| `--space-5` | 20px | Medium gap |
| `--space-6` | 24px | Gutter |
| `--space-8` | 32px | Section inner |
| `--space-10` | 40px | Large gap |
| `--space-12` | 48px | Section separator |
| `--space-16` | 64px | Large section |
| `--space-20` | 80px | Section gap (mobile) |
| `--space-24` | 96px | Section gap (tablet) |
| `--space-30` | 120px | Section gap (desktop) |

### Layout

| Property | Value |
|---|---|
| Container Max | 1200px |
| Container Padding | 24px (mobile: 16px) |
| Grid Columns | 12 |
| Grid Gutter | 24px (mobile: 16px) |
| Sidebar Width | 280px |

---

## 🔘 Component Styles

### Buttons

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| **Primary** | `#E8611A` | `#FFFFFF` | none | `#CC5216` + shadow |
| **Secondary** | transparent | `#FFFFFF` | 2px `#FFFFFF` | `rgba(255,255,255,0.1)` bg |
| **Ghost** | transparent | `#1A1A2E` | 2px `#E2E8F0` | `#F5F5F0` bg |
| **Dark** | `#1A1A2E` | `#FFFFFF` | none | `#2D2D44` |

```css
/* Button Base */
.btn {
  padding: 14px 28px;
  border-radius: 8px;
  font-family: var(--font-primary);
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  cursor: pointer;
  transition: var(--transition);
}
```

### Cards

```css
.card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 24px;
  box-shadow: var(--shadow-card);
  transition: var(--transition);
}

.card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}
```

### Product Category Card

```css
.category-card {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  aspect-ratio: 4/3;
  background: var(--color-primary);
}

.category-card__overlay {
  background: linear-gradient(
    to top,
    rgba(26, 26, 46, 0.9) 0%,
    rgba(26, 26, 46, 0.3) 100%
  );
}
```

---

## 🖼 Shadows & Effects

| Token | Value | Usage |
|---|---|---|
| `--shadow-card` | `0 4px 24px rgba(0,0,0,0.08)` | Default card elevation |
| `--shadow-hover` | `0 8px 32px rgba(0,0,0,0.12)` | Hover state elevation |
| `--shadow-modal` | `0 24px 64px rgba(0,0,0,0.24)` | Modal/dialog backdrop |
| `--shadow-nav` | `0 2px 16px rgba(0,0,0,0.06)` | Sticky navbar shadow |

---

## 📱 Breakpoints

| Name | Min Width | Usage |
|---|---|---|
| `xs` | 0px | Mobile (portrait) |
| `sm` | 576px | Mobile (landscape) |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `xxl` | 1440px | Ultra-wide |

```css
/* Mobile-first approach */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large desktop */ }
```

---

## 🎬 Animation Tokens

```css
:root {
  --ease-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-enter: 400ms;
}

/* Fade In Up — for scroll reveals */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale In — for modals */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 🖼 Image Guidelines

| Context | Aspect Ratio | Min Resolution | Format |
|---|---|---|---|
| Hero Banner | 16:9 | 1920×1080 | WebP + JPEG fallback |
| Product Hero | 1:1 | 2400×2400 | WebP |
| Product Thumbnail | 4:3 | 600×450 | WebP |
| Category Card | 4:3 | 800×600 | WebP |
| Blog Header | 16:9 | 1200×675 | WebP |
| Logo | SVG | Vector | SVG |

---

## ✅ Design Checklist (New Component)

- [ ] Uses design tokens (no hardcoded values)
- [ ] Responsive across all breakpoints
- [ ] Hover and focus states defined
- [ ] Accessible (contrast ratio ≥ 4.5:1)
- [ ] Animates with defined easing curves
- [ ] Works on dark and light backgrounds
- [ ] Loading/skeleton state defined
