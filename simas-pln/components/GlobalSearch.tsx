'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Package, Tag, MapPin, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface SearchResult {
  id: string
  type: 'asset' | 'category' | 'location'
  title: string
  subtitle: string
  href: string
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => inputRef.current?.focus(), 50)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      const q = query.toLowerCase()
      const [{ data: assets }, { data: categories }, { data: locations }] = await Promise.all([
        supabase.from('assets').select('id, name, serial_number, status').ilike('name', `%${q}%`).limit(4),
        supabase.from('categories').select('id, name, description').ilike('name', `%${q}%`).limit(3),
        supabase.from('locations').select('id, name, address').ilike('name', `%${q}%`).limit(3),
      ])
      const r: SearchResult[] = [
        ...(assets || []).map(a => ({ id: a.id, type: 'asset' as const, title: a.name, subtitle: `${a.serial_number} · ${a.status}`, href: '/dashboard/assets' })),
        ...(categories || []).map(c => ({ id: c.id, type: 'category' as const, title: c.name, subtitle: c.description || 'Kategori aset', href: '/dashboard/categories' })),
        ...(locations || []).map(l => ({ id: l.id, type: 'location' as const, title: l.name, subtitle: l.address || 'Lokasi aset', href: '/dashboard/locations' })),
      ]
      setResults(r)
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const icons = { asset: Package, category: Tag, location: MapPin }
  const colors = { asset: 'text-[#38bdf8] bg-[#0ea5e9]/10', category: 'text-emerald-400 bg-emerald-500/10', location: 'text-amber-400 bg-amber-500/10' }
  const labels = { asset: 'Aset', category: 'Kategori', location: 'Lokasi' }

  if (!open) return (
    <button onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50) }}
      className="flex items-center gap-2 px-3 py-2 bg-[#0f2040] border border-[#1e4080]/60 rounded-lg text-slate-500 text-sm hover:border-[#0ea5e9]/40 transition-colors w-64"
    >
      <Search className="w-3.5 h-3.5" />
      <span className="flex-1 text-left">Cari aset, kategori...</span>
      <kbd className="text-[10px] bg-[#1e4080]/40 px-1.5 py-0.5 rounded font-mono">Ctrl K</kbd>
    </button>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg bg-[#0a1628] border border-[#1e4080]/60 rounded-2xl shadow-2xl overflow-hidden fade-in">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1e4080]/40">
          <Search className="w-4 h-4 text-[#0ea5e9] flex-shrink-0" />
          <input ref={inputRef} type="text" placeholder="Cari aset, kategori, lokasi..."
            value={query} onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 focus:outline-none"
          />
          {query && <button onClick={() => setQuery('')}><X className="w-4 h-4 text-slate-500 hover:text-white" /></button>}
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {loading && (
            <div className="py-8 text-center text-slate-500 text-sm">Mencari...</div>
          )}
          {!loading && query && results.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-sm">Tidak ada hasil untuk &quot;{query}&quot;</div>
          )}
          {!loading && results.length > 0 && (
            <div className="p-2">
              {results.map(r => {
                const Icon = icons[r.type]
                return (
                  <button key={r.id} onClick={() => { router.push(r.href); setOpen(false); setQuery('') }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[r.type]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{r.title}</p>
                      <p className="text-xs text-slate-500 truncate">{r.subtitle}</p>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${colors[r.type]} border-current/30`}>
                      {labels[r.type]}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
          {!query && (
            <div className="py-6 text-center text-slate-600 text-xs font-mono">
              Ketik untuk mulai mencari...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
