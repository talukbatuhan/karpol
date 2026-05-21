# Karpol Poliüretan — Sinematik Web

Minimalist Industrial tasarım: keskin köşeler, Navy / Gold / Ivory paleti, Framer Motion scroll animasyonları.

## Kurulum

```bash
npm install
npm run dev
```

- Türkçe: [http://localhost:3000/tr](http://localhost:3000/tr)
- English: [http://localhost:3000/en](http://localhost:3000/en)

## Yapı

- `app/[locale]/` — next-intl rotaları
- `components/{atoms,molecules,organisms,motion}/`
- `lib/motion/variants.ts` — sinematik easing `[0.65, 0, 0.35, 1]`
- `messages/{tr,en}.json`
- `docs/PLAN.md` — uygulama planı özeti

## Tasarım kısıtları

- `border-radius: 0` (Tailwind + global CSS)
- `container` sınıfı yok — 12 kolon grid
- View Transitions: `next-view-transitions` (`app/layout.tsx`)
