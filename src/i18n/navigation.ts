import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'tr'],
 
  // Used when no locale matches
  defaultLocale: 'en',

  // Define route mappings for different languages
  pathnames: {
    '/': '/',
    '/about': {
      en: '/about',
      tr: '/hakkimizda'
    },
    '/contact': {
      en: '/contact',
      tr: '/iletisim'
    },
    '/products': {
      en: '/products',
      tr: '/urunler'
    },
    '/custom-manufacturing': {
      en: '/custom-manufacturing',
      tr: '/ozel-uretim'
    },
    '/knowledge': {
      en: '/knowledge',
      tr: '/bilgi-merkezi'
    },
    '/catalog': {
      en: '/catalog',
      tr: '/catalog'
    },
    '/products/[category]': {
      en: '/products/[category]',
      tr: '/urunler/[category]'
    },
    '/products/[category]/[slug]': {
      en: '/products/[category]/[slug]',
      tr: '/urunler/[category]/[slug]'
    }
  }
});
 
export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);
