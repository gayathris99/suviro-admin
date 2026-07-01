'use client'

import { usePathname, useRouter } from 'next/navigation'
import { IconCategory, IconPill, IconLogout } from '@tabler/icons-react'
import './AdminShell.css'

const TABS = [
  { label: 'Categories', href: '/categories', icon: IconCategory },
  { label: 'Products',   href: '/products',   icon: IconPill },
]

export default function AdminShell({ children }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="admin">
      {/* Top bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-in">
          <div className="admin-brand">
            <span className="admin-brand-name">Suviro</span>
            <span className="admin-brand-sub">Admin Portal</span>
          </div>
          <div className="admin-topbar-right">
            <div className="admin-user">
              <div className="admin-avatar">SP</div>
              <span className="admin-user-name">Suviro Admin</span>
            </div>
            <button className="admin-logout" onClick={() => router.push('/login')}>
              <IconLogout size={16} /> Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="admin-tabs">
        <div className="admin-tabs-in">
          {TABS.map((t) => {
            const Icon = t.icon
            const active = pathname.startsWith(t.href)
            return (
              <button
                key={t.href}
                className={`admin-tab ${active ? 'admin-tab--active' : ''}`}
                onClick={() => router.push(t.href)}
              >
                <Icon size={18} /> {t.label}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Page content */}
      <main className="admin-main">{children}</main>
    </div>
  )
}