'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  LogOut,
} from 'lucide-react'
import styles from '@/app/admin/admin.module.css'

const navItems = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    section: 'Content',
    items: [
      { label: 'Products', href: '/admin/products', icon: Package },
      { label: 'Categories', href: '/admin/categories', icon: FolderTree },
      { label: 'Industries', href: '/admin/industries', icon: Factory },
      { label: 'Articles', href: '/admin/articles', icon: FileText },
      { label: 'Media Library', href: '/admin/media', icon: Image },
      { label: 'Catalogs', href: '/admin/catalogs', icon: BookOpen },
    ],
  },
  {
    section: 'CRM',
    items: [
      { label: 'RFQ Pipeline', href: '/admin/rfq', icon: MessageSquare },
      { label: 'Contacts', href: '/admin/contacts', icon: Mail },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
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
        <Link href="/" className={styles.navItem}>
          <LogOut className={styles.navItemIcon} />
          Back to Site
        </Link>
      </div>
    </aside>
  )
}
