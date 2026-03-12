/* ============================================
   KARPOL — Site Configuration
   Merkezi konfigürasyon dosyası
   ============================================ */

export const siteConfig = {
  name: 'KARPOL',
  title: 'KARPOL — Precision Engineered Industrial Components',
  description: 'Global manufacturer of polyurethane, rubber, silicone, Viton, PTFE, and aluminum industrial components for marble processing, mining, construction, and automation industries.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://karpol.net',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '',
  
  contact: {
    email: 'info@karpol.net',
    phone: '+90 XXX XXX XX XX',
    address: {
      street: '',
      city: '',
      country: 'Turkey',
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
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { 
      label: 'Products', 
      href: '/products',
      children: [
        { label: 'Polyurethane Products', href: '/products/polyurethane' },
        { label: 'Vulkolan Products', href: '/products/vulkolan' },
        { label: 'Rubber Products', href: '/products/rubber' },
        { label: 'Silicone Products', href: '/products/silicone' },
        { label: 'Viton Products', href: '/products/viton' },
        { label: 'PTFE / Teflon Products', href: '/products/ptfe-teflon' },
        { label: 'Aluminum CNC Parts', href: '/products/aluminum-cnc' },
        { label: 'Engineering Plastics', href: '/products/engineering-plastics' },
      ],
    },
    { 
      label: 'Industries', 
      href: '/industries',
      children: [
        { label: 'Marble & Stone Processing', href: '/industries/marble-stone' },
        { label: 'Mining', href: '/industries/mining' },
        { label: 'Construction Machinery', href: '/industries/construction' },
        { label: 'Automation Systems', href: '/industries/automation' },
        { label: 'Chemical Industry', href: '/industries/chemical' },
        { label: 'Food Industry', href: '/industries/food' },
      ],
    },
    { label: 'Custom Manufacturing', href: '/custom-manufacturing' },
    { label: 'Factory & Technology', href: '/factory-technology' },
    { label: 'Technical Knowledge', href: '/knowledge' },
    { label: 'Catalog', href: '/catalog' },
    { label: 'Contact', href: '/contact' },
  ],
} as const

export const productCategories = [
  { slug: 'polyurethane-components', name: 'Polyurethane Components', prefix: 'PU', icon: '🔶' },
  { slug: 'vulkollan-components', name: 'Vulkollan Components', prefix: 'VK', icon: '⚙️' },
  { slug: 'rubber-components', name: 'Rubber Components', prefix: 'RB', icon: '⬛' },
  { slug: 'technical-plastics', name: 'Technical Plastics', prefix: 'TP', icon: '🔷' },
  { slug: 'aluminum-machined-parts', name: 'Aluminum Machined Parts', prefix: 'AL', icon: '🔩' },
  { slug: 'chrome-plated-components', name: 'Chrome Plated Components', prefix: 'CR', icon: '✨' },
  { slug: 'custom-engineered-parts', name: 'Custom Engineered Parts', prefix: 'CE', icon: '📐' },
  { slug: 'vacuum-handling-components', name: 'Vacuum Handling Components', prefix: 'VH', icon: '🌀' },
  { slug: 'conveyor-transport-parts', name: 'Conveyor & Transport Parts', prefix: 'CT', icon: '🛤️' },
  { slug: 'marble-machine-spare-parts', name: 'Marble Machine Spare Parts', prefix: 'MS', icon: '🏗️' },
] as const
