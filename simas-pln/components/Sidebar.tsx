'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, Tag, MapPin, History, Zap, LogOut, BarChart3, Shield, Eye } from 'lucide-react'
import { useAuth } from '@/lib/auth'

const navItems = [
  { href: '/dashboard',            label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/dashboard/assets',     label: 'Aset',       icon: Package },
  { href: '/dashboard/categories', label: 'Kategori',   icon: Tag },
  { href: '/dashboard/locations',  label: 'Lokasi',     icon: MapPin },
  { href: '/dashboard/history',    label: 'Riwayat',    icon: History },
  { href: '/dashboard/reports',    label: 'Laporan',    icon: BarChart3 },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { logout, user, isAdmin } = useAuth()
  const router = useRouter()

  const handleLogout = () => { logout(); router.push('/landing') }

  return (
    <aside className="fixed left-0 top-0 h-full w-[230px] flex flex-col z-50"
      style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>

      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--accent)' }}>
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>SIMAS</p>
            <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--accent-light)' }}>PLN Icon Plus</p>
          </div>
        </div>
      </div>

      {/* User */}
      {user && (
        <div className="px-3 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
            style={{ background: isAdmin ? 'var(--accent-dim)' : 'var(--amber-dim)', border: `1px solid ${isAdmin ? 'var(--accent-border)' : 'rgba(245,158,11,0.2)'}` }}>
            {isAdmin
              ? <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--accent-light)' }} />
              : <Eye className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--amber)' }} />}
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
              <p className="text-[10px]" style={{ color: isAdmin ? 'var(--accent-light)' : 'var(--amber)' }}>
                {isAdmin ? 'Administrator' : 'Viewer'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)' }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {isActive && <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--accent-light)' }} />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--red-dim)'; (e.currentTarget as HTMLElement).style.color = 'var(--red)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)' }}
        >
          <LogOut className="w-4 h-4" />Keluar
        </button>
        <p className="text-[10px] px-3 mt-2 font-mono" style={{ color: 'var(--text-tertiary)' }}>v2.0.0</p>
      </div>
    </aside>
  )
}
