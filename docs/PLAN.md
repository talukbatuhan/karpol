# Karpol — Sinematik UX Planı

Tam plan ve uygulama promptu: `.cursor/plans/karpol_sinematik_ux_aa97592c.plan.md` (Bölüm 10: ilk sprint talimatları).

## İlk sprint durumu

- [x] `tailwind.config.ts` — Navy / Gold / Ivory, `borderRadius: 0`
- [x] `app/globals.css` — global radius override
- [x] `next-intl` — `app/[locale]`, `messages/tr.json`, `en.json`
- [x] `lib/motion/variants.ts`
- [x] `TypographicManifest`, `ScrollLinkedTape`, `MaterialIndex`
- [x] `next-view-transitions` — `app/layout.tsx`
- [x] Faz 4: about, products, products/[slug], contact + PageTransition
- [x] Faz 5: Araçlar hub (`/tools`) + Makara 3D + Kauçuk Titreşim Takozları Teknik Resim (legacy HTML)

## Geliştirme

```bash
npm run dev
```

- TR: http://localhost:3000/tr
- EN: http://localhost:3000/en
