'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Tag,
  MapPin,
  History,
  Zap,
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/assets', label: 'Aset', icon: Package },
  { href: '/categories', label: 'Kategori', icon: Tag },
  { href: '/locations', label: 'Lokasi', icon: MapPin },
  { href: '/history', label: 'Riwayat', icon: History },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0a1628] border-r border-[#1e4080]/40 flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#1e4080]/40">
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

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#0ea5e9]/15 text-[#38bdf8] border border-[#0ea5e9]/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#0ea5e9]' : ''}`} />
              {label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0ea5e9]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#1e4080]/40">
        <p className="text-[10px] text-slate-600 font-mono">v1.0.0 · Asset Management</p>
      </div>
    </aside>
  )
}
