# Karpol Premium UI/UX — Implementation Plan

This document matches the approved architecture plan. **`src/app/globals.css` is the canonical source** for runtime tokens; use this file for phased rollout and audits.

---

## Baseline review

| Source | Notes |
|--------|--------|
| [docs/design/design-system.md](design-system.md) | Human-readable reference; keep aligned with `globals.css`. |
| [src/app/globals.css](../../src/app/globals.css) | Premium v3: Navy, warm gold, ivory, steel scale, z-index stack, shadows. |
| [tailwind.config.ts](../../tailwind.config.ts) | Extends sans/mono, z-index, shadows, aspect ratios. |
| [src/components/ui/](../../src/components/ui/) | Primitives + Skeleton, Toaster, Breadcrumbs. |

---

## Phase 1 — Design system and component expansion

- Standardize **z-index** and **elevation** via CSS variables and Tailwind.
- Add **Skeleton**, **Toast (sonner)**, **Breadcrumbs** primitive; export from `src/components/ui/index.ts`.
- Keep **Roboto Mono** for technical data (loaded in root layout); Inter for UI/body; Barlow for nav where used.

---

## Phase 2 — UX and micro-interactions

- **`--ease-spring`** on `:root`; button **active** scale with **`prefers-reduced-motion`** fallback.
- Root **`::view-transition`** already in `globals.css`; prefer in-page transitions for interactive elements.

---

## Phase 3 — Accessibility and typography

- **WCAG 4.5:1:** secondary text on ivory uses **`--steel-600` floor** where needed; document in design-system.
- **Inter** = UI/reading; **monospace** = SKU, specs, tabular numerics.

---

## Phase 4 — Performance and layout

- **`aspect-ratio`** on image cards and gallery parents; **`content-visibility`** via `.lazy-section` on below-fold blocks (not LCP hero).

---

## Phase 5 — Mobile-first

- **`.touch-target`** minimum 44×44px.
- **`MobileActionBar`** fixed dock (z-`--z-dock`) on PDP and product category; safe-area padding.

---

## Phase 1 execution checklist (completed in repo)

1. Sync **design-system.md** with Premium v3.
2. **Mono font:** Roboto Mono (documented).
3. **Z-index + elevation** tokens + Tailwind; nav/modals use `var(--z-*)`.
4. **Contrast** pass; `--color-text-secondary` → steel-600 on light.
5. **Skeleton** component + export.
6. **Sonner** Toaster in `ClientProviders`; RFQ success toast.
7. **Breadcrumbs** UI primitive; PDP uses composable breadcrumbs.

---

## Execution readiness

Implementation lives in the codebase as above. Extend with **IconButton**, **EmptyState**, **Tabs** when product scope allows.
