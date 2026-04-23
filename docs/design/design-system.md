# KARPOL — Design System Reference

> Görsel tasarım sistemi ve UI bileşen standartları. **Tek kaynak (token’lar, tipografi değişkenleri, gölge/z-index):** [`src/app/globals.css`](../../src/app/globals.css) (`:root`, yardımcı sınıflar, kök `::view-transition-*`). Koyu kullanıcı teması ve birçok public sayfada “ivory’yi karanlığa çevirme” mantığı ayrıca [`src/app/dark-overrides.css`](../../src/app/dark-overrides.css) içindedir. Bu belge, ekip referansı ve WCAG/typography kurallarını özetler; belge ile kod çelişirse **kod / `globals.css` baskındır**.

---

## Premium v3 (Mevcut — Navy / Ivory / Warm Gold)

Eski endüstriyel turuncu (`#E8611A`) **halka açık sitede** kaldırıldı. Vurgu rengi **ılık altın**; derin alan rengi **lacivert**. **Admin** arayüzü kendi modül stillerinde turuncu kullanmaya devam edebilir (`admin.module.css`); public/marketing yüzeyleri Premium v3 ile uyumludur.

### Marka ve yüzey

| Name | Hex | Kullanım |
|------|-----|----------|
| Navy (primary) | `#0F1729` | Başlıklar, marka ciddiyeti, koyu alan |
| Navy secondary | `#1B2540` | Kart/gradient ikincil alan |
| Warm gold (accent) | `#C8A85A` | CTA, eyebrow, odak, aktif sınır |
| Gold hover | `#B09347` | Hover / pressed (açık zeminde) |
| Cream / accent light | `#F6F1E6` | Yumuşak vurgu zemin |
| Steel scale | `--steel-50` … `--steel-900` (globals) | Nötr gövde, sınır, metin hiyerarşisi |
| Semantic | `--color-success` / `warning` / `error` / `info` | Form ve durum mesajları |

### Ivory bant (ürün/landing sayfaları)

`globals.css` içinde: `--ivory-bg`, `--ivory-band`, `--ivory-text-strong`, `--ivory-text-body`, `--ivory-text-muted`, `--ivory-text-dim`, `--ivory-border`, `--ivory-accent*`.

**Metin tercihi:** Açık krem/ivory üzerinde gövde için **`--ivory-text-body`**; ikincil metin için **`--ivory-text-muted`**; çok hafif etiketler için `--ivory-text-dim` (yalnızca büyük puntoda veya bold ile).

### Z-index stack (sabit)

Sihirli büyük `z-index` değerleri yerine yalnızca bu ölçek (tanım: `globals.css`):

| Token | Değer (ref.) | Kullanım |
|--------|----------------|----------|
| `--z-base` | 0 | Varsayılan istifleme |
| `--z-raised` | 1 | Hafif üst üste (badge, tablo hücresi) |
| `--z-stacked` | 2 | İkinci düzey yerel üst üste |
| `--z-sticky` | 20 | Sabit navbar |
| `--z-dropdown` / `--z-dock` | 30 | Açılır menü, mobil alt dock |
| `--z-overlay` | 40 | Yarı saydam perde (modal dışı) |
| `--z-modal` | 50 | Modal, sheet |
| `--z-toast` | 60 | Toast yığını |
| `--z-max` | 100 | Nadir, üst sınır (ör. kritik global overlay) |

### Gölge / elevation

`globals.css` içinde hem isimlendirilmiş elevation (`--elevation-*`) hem de legacy `--shadow-*` alias’ları vardır; yeni kodda tercihen semantic elevation veya aşağıdaki eşleşmeler.

| Token | Anlam / eşleşen alias |
|------|--------|
| `--elevation-0` | Düz yüzey |
| `--shadow-sm` | Çok hafif ayırıcı (1px ağırlıklı) |
| `--elevation-1` / `--shadow-card` | Varsayılan kart |
| `--elevation-2` / `--shadow-hover` | Hover / vurgu |
| `--elevation-popover` / `--shadow-md` | Menü, küçük panel |
| `--shadow-lg` | Daha yüksek yüzen panel / kart (orta-yüksek) |
| `--elevation-dialog` / `--shadow-modal` | Dialog / tam odak modali |
| `--shadow-nav` | Sticky bar / alt dock ayracı |

**Geriye dönük altın alias’lar:** `--gold`, `--gold-dim`, `--gold-glow` → `--color-accent` tabanlı; yeni bileşenlerde doğrudan `--color-accent` / `--ivory-accent` tercih edin.

---

## Tipografi (uygulama)

### Sans ve nav (yükleme)

Fontlar `next/font` ile kök layout’ta yüklenir: [**Inter**](https://fonts.google.com/specimen/Inter) (gövde, UI, formlar), [**Barlow**](https://fonts.google.com/specimen/Barlow) (nav/hero vurgu ailesi, `var(--font-nav)`), teknik monospaced aile aşağıdaki karara göre.

### Monospace: Roboto Mono (kanonik) — JetBrains yok

| Karar | Açıklama |
|--------|-----------|
| **Kullanılan** | **Roboto Mono** — [`src/app/layout.tsx`](../../src/app/layout.tsx) içinde `Roboto_Mono` → `--font-roboto-mono`; `globals.css` içinde `--font-mono: var(--font-roboto-mono), monospace`. |
| **Kullanılmayan** | **JetBrains Mono** projede `next/font` veya bu token zinciriyle yüklenmiyor. Strateji/PDF gibi dış belgelerde geçen JetBrains, geçmiş öneri sayılır; UI ve kod **Roboto Mono** ile hizalanır. |
| **Ne zaman** | SKU, ölçü, spec tabloları, kod benzeri string’ler: `var(--font-mono)` + mümkünse `font-variant-numeric: tabular-nums` (veya `text-tabular-nums`). |
| **JetBrains’e geçiş** | İstenirse ayrı iş kalemi: `layout.tsx`’e font ekleme, `--font-mono` ataması ve tüm tüketimlerin regresyon testi. |

| Rol | Aile | Not |
|-----|------|-----|
| UI / okuma / form | `Inter` / `var(--font-primary)` | Tr / EN / DE / AR metinler |
| Nav / vurgu UI | `Barlow` nerede kullanıldıysa | `var(--font-nav)` |
| Teknik veri | **Roboto Mono** / `var(--font-mono)` | `tabular-nums` tercih edilir |
| Görsel başlık (üretim sayfaları) | Cormorant / DM Sans (bileşen özel) | Sadece ilgili Premium bileşenlerde |

### Type scale (hedef; bileşenlerde `clamp` kullanımı yaygın)

| Element | Ağırlık | Masaüstü | Mobil |
|---------|---------|----------|--------|
| Display / H1 | 700–800 | büyük clamp | küçük clamp |
| H2–H3 | 600–700 | — | — |
| Body | 400 | 16–18px | 15–16px |
| Caption | 500–600 | 12–14px | — |
| Button | 600 | 14–15px | uppercase (ürün bölümlerinde) |

---

## Spacing, radius, hareket

`--space-*`, `--radius-*`, `--ease-out`, `--ease-in-out`, `--ease-spring`, `--transition`, `--duration-fast` / `normal` — tümü `globals.css` içinde. Buton **active** hafif ölçek için `--ease-spring` kullanır; `prefers-reduced-motion: reduce` altında ölçek yok.

### Touch hedefi

Etkileşimli kontroller (mobil): en az **44×44px**; `.touch-target` sınıfı `globals.css` içinde.

---

## Bileşenler ve durumlar

- **Buton / link:** `:focus-visible` ile görünür halka (navy/altın); hover/active tanımlı.
- **Yükleme:** `Spinner` (kısa işlemler), `Skeleton` (içerik iskeleti); mümkünse layout kayması yok.
- **Modal:** `var(--z-modal)`; RFQ, WhatsApp vb. aynı katmanda.
- **Toast:** `sonner` + `Toaster` — `var(--z-toast)`.
- **Breadcrumb:** `src/components/ui/breadcrumbs` — `nav` + `ol` + `aria-current="page"`.
- **Mobil:** `MobileActionBar` (PDP / kategori) — `var(--z-dock)` + `safe-area-inset-bottom`.

---

## Performans

- **Content visibility:** `globals.css` içinde `.section` ve `.lazy-section` için `content-visibility: auto` + `contain-intrinsic-size` (sırasıyla ~500px / ~480px referans yükseklik). LCP/hero ve üst kısım yüklerinde kullanmayın; uzun sayfalarda LCP dışı bloklarda tercih edin.
- Görseller: `next/image` + açık `aspect-ratio` (kart, galeri, liste).
- Kök `::view-transition-old/new(root)` cross-fade (ör. koyu ↔ ivory) `globals.css` içinde; `prefers-reduced-motion: reduce` altında animasyon yok.

---

## Görsel yönergeler (ölçü)

| Bağlam | Oran | Not |
|--------|------|-----|
| Hero / banner | 16:9 | LCP: priority, lazy-section kullanma |
| Ürün galeri ana | 4:3 | `ProductVisualsWrapper` |
| İlgili ürün kartı | 4:3 | `ProductDetailView` |
| Kategori / küçük önizleme | 4:3 | — |

---

## WCAG 4.5:1 — kontrast (ivory / açık zemin)

Hesap: **WCAG 2.1** göreli parlaklık oranı (normal metin **AA** eşiği **4.5:1**). Aşağıdaki değerler `sRGB` üzerinden doğrulanmıştır; arka plan hex’leri `globals.css` ile aynıdır.

### Global ikincil metin — `--color-text-secondary`

Açık temada `var(--steel-600)` → **`#475569`**. `.section-text` ve diğer `var(--color-text-secondary)` kullanımları için:

| Arka plan (token / hex) | Kontrast |
|-------------------------|----------|
| `--ivory-bg` / beyaz `#FFFFFF` | **7.58:1** |
| `--ivory-band` `#F4F1EA` | **6.72:1** |
| `--ivory-band-soft` `#FBF8F2` | **7.15:1** |
| `--bg-main` / `--steel-50` `#F8FAFC` | **7.24:1** |
| `--steel-100` `#F1F5F9` | **6.92:1** |

**Sonuç:** Ek token değişikliği gerekmez; `--color-text-secondary` bu yüzeylerde AA normal metin eşiğini karşılar.

### Ivory hiyerarşisi — `--ivory-text-*`

| Token | Açık tema rengi | Not |
|--------|------------------|-----|
| `--ivory-text-strong` | `#0F1729` | Başlıklar / vurgu gövde |
| `--ivory-text-body` | `#475569` | `steel-600` ile aynı; `--color-text-secondary` ile uyumlu |
| `--ivory-text-muted` | `#5C6575` | Krem bantlarda `steel-500` yerine koyulaştırıldı (AA); hâlâ gövdeden bir kademe daha düşük kontrast |
| `--ivory-text-dim` | `#94A3B8` | Yalnızca büyük punto, kalın veya yardımcı etiket; küçük gövde metninde kullanmayın |

### Kullanıcı koyu teması — `html[data-user-theme="dark"]`

`--color-text-secondary` → `var(--dk-text-2)` (**`#CBD5E1`**). `--dk-bg` / `--dk-bg-2` / `--dk-bg-3` üzerinde ölçülen oranlar **~11.7:1–13.3:1** (AA büyük ölçüde).

### Diğer

- **Altın** (`--color-accent`): ince metin ve küçük puntoda çift kontrol; tercihen büyük veya kalın vurgu.
- **Doğrulama:** Tarayıcı geliştirici araçları, Figma kontrast, veya `axe`.

---

## Checklist (yeni bileşen)

- [ ] Design token; hardcoded # yok
- [ ] Tüm kırılmalar ve touch 44px (mobil)
- [ ] Hover, focus-visible, active (gerekirse)
- [ ] Kontrast 4.5:1 (gövde)
- [ ] `prefers-reduced-motion` (animasyon / spring)
- [ ] Açık + koyu (veya sadece açık public)
- [ ] Yükleme: skeleton / spinner

---

## Tarihsel: Endüstriyel “turuncu” palet (arşiv)

Tasarım evrimi öncesi: Graphite `#1A1A2E`, CTA turuncu `#E8611A` / hover `#CC5216`, “Warm white” arka plan. Eski pazarlama PDF veya ekran görüntüleri bu renkleri yansıtabilir. **Kod ve canlı sitede** yukarıdaki **Premium v3** geçerlidir.
