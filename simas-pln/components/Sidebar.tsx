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

  const handleLogout = () => {
    logout()
    router.push('/landing')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0a1628] border-r border-[#1e4080]/40 flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#1e4080]/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#0ea5e9] rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm tracking-wider">SIMAS</p>
            <p className="text-[10px] text-[#0ea5e9] font-mono uppercase tracking-widest">PLN Icon Plus</p>
          </div>
        </div>
      </div>

      {/* User Badge */}
      {user && (
        <div className="px-4 py-3 border-b border-[#1e4080]/40">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isAdmin ? 'bg-[#0ea5e9]/10 border border-[#0ea5e9]/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
            {isAdmin
              ? <Shield className="w-3.5 h-3.5 text-[#38bdf8]" />
              : <Eye className="w-3.5 h-3.5 text-amber-400" />}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className={`text-[10px] font-mono ${isAdmin ? 'text-[#38bdf8]' : 'text-amber-400'}`}>
                {isAdmin ? 'Administrator' : 'Viewer'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#0ea5e9]/15 text-[#38bdf8] border border-[#0ea5e9]/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#0ea5e9]' : ''}`} />
              {label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0ea5e9]" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 border-t border-[#1e4080]/40 pt-3">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="w-4 h-4" />Keluar
        </button>
        <p className="text-[10px] text-slate-600 font-mono px-3 mt-2">v2.0.0 · Asset Management</p>
      </div>
    </aside>
  )
}
