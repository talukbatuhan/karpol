'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  FileText,
  MessageSquare,
  Mail,
  Image,
  Factory,
  BookOpen,
  ShieldAlert,
  LogOut,
} from 'lucide-react'
import styles from '@/app/admin/admin.module.css'

const navItems = [
  {
    section: 'Genel',
    items: [
      { label: 'Kontrol Paneli', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    section: 'İçerik',
    items: [
      { label: 'Ürünler', href: '/admin/products', icon: Package },
      { label: 'Kategoriler', href: '/admin/categories', icon: FolderTree },
      { label: 'Sektörler', href: '/admin/industries', icon: Factory },
      { label: 'Makaleler', href: '/admin/articles', icon: FileText },
      { label: 'Medya Kütüphanesi', href: '/admin/media', icon: Image },
      { label: 'Kataloglar', href: '/admin/catalogs', icon: BookOpen },
    ],
  },
  {
    section: 'CRM',
    items: [
      { label: 'Teklif Talepleri', href: '/admin/rfq', icon: MessageSquare },
      { label: 'İletişim Mesajları', href: '/admin/contacts', icon: Mail },
    ],
  },
  {
    section: 'Güvenlik',
    items: [
      { label: 'Güvenlik Olayları', href: '/admin/security', icon: ShieldAlert },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
    } finally {
      setLoggingOut(false)
      router.push('/admin/login')
      router.refresh()
    }
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <Link href="/admin" style={{ textDecoration: 'none' }}>
          <span className={styles.sidebarLogo}>KARPOL</span>
          <span className={styles.sidebarBadge}>CMS</span>
        </Link>
      </div>

      <nav className={styles.sidebarNav}>
        {navItems.map((section) => (
          <div key={section.section} className={styles.navSection}>
            <div className={styles.navSectionLabel}>{section.section}</div>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive(item.href) ? styles.navItemActive : ''}`}
              >
                <item.icon className={styles.navItemIcon} />
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <button onClick={handleLogout} className={styles.navItem} disabled={loggingOut} type="button">
          <LogOut className={styles.navItemIcon} />
          {loggingOut ? 'Çıkış yapılıyor...' : 'Çıkış Yap'}
        </button>
        <Link href="/" className={styles.navItem}>
          <LogOut className={styles.navItemIcon} />
          Siteye Dön
        </Link>
      </div>
    </aside>
  )
}
