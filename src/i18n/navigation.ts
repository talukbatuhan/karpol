import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'tr', 'de', 'ar'],
  defaultLocale: 'en',

  pathnames: {
    '/': '/',
    '/about': {
      en: '/about',
      tr: '/hakkimizda',
      de: '/ueber-uns',
      ar: '/about'
    },
    '/contact': {
      en: '/contact',
      tr: '/iletisim',
      de: '/kontakt',
      ar: '/contact'
    },
    '/products': {
      en: '/products',
      tr: '/urunler',
      de: '/produkte',
      ar: '/products'
    },
    '/custom-manufacturing': {
      en: '/custom-manufacturing',
      tr: '/ozel-uretim',
      de: '/sonderfertigung',
      ar: '/custom-manufacturing'
    },
    '/knowledge': {
      en: '/knowledge',
      tr: '/bilgi-merkezi',
      de: '/wissensdatenbank',
      ar: '/knowledge'
    },
    '/catalog': {
      en: '/catalog',
      tr: '/katalog',
      de: '/katalog',
      ar: '/catalog'
    },
    '/catalog/[catalogId]': {
      en: '/catalog/[catalogId]',
      tr: '/katalog/[catalogId]',
      de: '/katalog/[catalogId]',
      ar: '/catalog/[catalogId]'
    },
    '/industries': {
      en: '/industries',
      tr: '/sektorler',
      de: '/branchen',
      ar: '/industries'
    },
    '/industries/[slug]': {
      en: '/industries/[slug]',
      tr: '/sektorler/[slug]',
      de: '/branchen/[slug]',
      ar: '/industries/[slug]'
    },
    '/factory-technology': {
      en: '/factory-technology',
      tr: '/fabrika-teknoloji',
      de: '/fabrik-technologie',
      ar: '/factory-technology'
    },
    '/products/[category]': {
      en: '/products/[category]',
      tr: '/urunler/[category]',
      de: '/produkte/[category]',
      ar: '/products/[category]'
    },
    '/products/[category]/[slug]': {
      en: '/products/[category]/[slug]',
      tr: '/urunler/[category]/[slug]',
      de: '/produkte/[category]/[slug]',
      ar: '/products/[category]/[slug]'
    },
    '/knowledge/[slug]': {
      en: '/knowledge/[slug]',
      tr: '/bilgi-merkezi/[slug]',
      de: '/wissensdatenbank/[slug]',
      ar: '/knowledge/[slug]'
    }
  }
});

export type AppPathnames = keyof typeof routing.pathnames;

export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);
