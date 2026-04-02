/* ============================================
   KARPOL — Site Configuration
   Merkezi konfigürasyon dosyası
   ============================================ */

export const siteConfig = {
  name: 'KARPOL',
  legalName: 'KARPOL Poliüretan Ltd. Şti.',
  title: 'KARPOL — Precision Engineered Industrial Components',
  description: 'Global manufacturer of polyurethane, rubber, silicone, Viton, PTFE, and aluminum industrial components for marble processing, mining, construction, and automation industries.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://karpol.net',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '',
  
  contact: {
    email: 'info@karpol.net',
    phone: '+90 542 665 25 60',
    address: {
      street: 'Bozburun Mahallesi, 7151 Sokak No:13/1',
      city: 'Merkezefendi / Denizli',
      country: 'Türkiye',
    },
  },

  social: {
    linkedin: 'https://linkedin.com/company/karpol',
    instagram: 'https://instagram.com/karpol',
    youtube: 'https://youtube.com/@karpol',
  },

  stats: {
    yearsExperience: '20+',
    countriesExported: '50+',
    productTypes: '10,000+',
    certifications: ['ISO 9001', 'ISO 14001'],
  },
} as const

export const navigation = {
  main: [
    { label: 'Home', key: 'home', href: '/' },
    { label: 'About', key: 'about', href: '/about' },
    { 
      label: 'Products',
      key: 'products',
      href: '/products',
      children: [
        { label: 'Polyurethane Components', href: '/products/polyurethane-components' },
        { label: 'Vulkollan Components', href: '/products/vulkollan-components' },
        { label: 'Rubber Components', href: '/products/rubber-components' },
        { label: 'Silicone Components', href: '/products/silicone-components' },
        { label: 'Technical Plastics', href: '/products/technical-plastics' },
        { label: 'Aluminum Machined Parts', href: '/products/aluminum-machined-parts' },
      ],
    },
    { label: 'Custom Manufacturing', key: 'custom manufacturing', href: '/custom-manufacturing' },
    { label: 'Factory & Technology', key: 'factory & technology', href: '/factory-technology' },
    { label: 'Technical Knowledge', key: 'technical knowledge', href: '/knowledge' },
    { label: 'E-Katalog', key: 'e-catalog', href: '/catalog' },
    { label: 'Contact', key: 'contact', href: '/contact' },
  ],
} as const

export const productCategories = [
  { slug: 'polyurethane-components', name: 'Polyurethane Components', prefix: 'PU', icon: '🔶' },
  { slug: 'vulkollan-components', name: 'Vulkollan Components', prefix: 'VK', icon: '⚙️' },
  { slug: 'rubber-components', name: 'Rubber Components', prefix: 'RB', icon: '⬛' },
  { slug: 'silicone-components', name: 'Silicone Components', prefix: 'SI', icon: '🔹' },
  { slug: 'technical-plastics', name: 'Technical Plastics', prefix: 'TP', icon: '🔷' },
  { slug: 'aluminum-machined-parts', name: 'Aluminum Machined Parts', prefix: 'AL', icon: '🔩' },
  { slug: 'chrome-plated-components', name: 'Chrome Plated Components', prefix: 'CR', icon: '✨' },
  { slug: 'custom-engineered-parts', name: 'Custom Engineered Parts', prefix: 'CE', icon: '📐' },
  { slug: 'vacuum-handling-components', name: 'Vacuum Handling Components', prefix: 'VH', icon: '🌀' },
  { slug: 'conveyor-transport-parts', name: 'Conveyor & Transport Parts', prefix: 'CT', icon: '🛤️' },
  { slug: 'marble-machine-spare-parts', name: 'Marble Machine Spare Parts', prefix: 'MS', icon: '🏗️' },
] as const
