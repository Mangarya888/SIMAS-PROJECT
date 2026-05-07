'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Package, Tag, MapPin, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface SearchResult {
  id: string; type: 'asset' | 'category' | 'location'
  title: string; subtitle: string; href: string
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setOpen(true); setTimeout(() => inputRef.current?.focus(), 50) }
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
      setResults([
        ...(assets || []).map(a => ({ id: a.id, type: 'asset' as const, title: a.name, subtitle: `${a.serial_number} · ${a.status}`, href: '/dashboard/assets' })),
        ...(categories || []).map(c => ({ id: c.id, type: 'category' as const, title: c.name, subtitle: c.description || 'Kategori aset', href: '/dashboard/categories' })),
        ...(locations || []).map(l => ({ id: l.id, type: 'location' as const, title: l.name, subtitle: l.address || 'Lokasi', href: '/dashboard/locations' })),
      ])
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const icons = { asset: Package, category: Tag, location: MapPin }
  const colors = {
    asset:    { bg: 'var(--accent-dim)',  text: 'var(--accent-light)',  label: 'Aset' },
    category: { bg: 'var(--green-dim)',   text: 'var(--green)',         label: 'Kategori' },
    location: { bg: 'var(--amber-dim)',   text: 'var(--amber)',         label: 'Lokasi' },
  }

  if (!open) return (
    <button onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50) }}
      className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors w-60"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-tertiary)' }}>
      <Search className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="flex-1 text-left text-xs">Cari aset, kategori...</span>
      <kbd className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: 'var(--surface-3)', color: 'var(--text-tertiary)' }}>Ctrl K</kbd>
    </button>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-md rounded-xl shadow-2xl overflow-hidden fade-in"
        style={{ background: 'var(--surface)', border: '1px solid var(--border-2)' }}>
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-light)' }} />
          <input ref={inputRef} type="text" placeholder="Cari aset, kategori, lokasi..."
            value={query} onChange={e => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent focus:outline-none"
            style={{ color: 'var(--text-primary)' }} />
          {query && <button onClick={() => setQuery('')}><X className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} /></button>}
        </div>
        <div className="max-h-72 overflow-y-auto">
          {loading && <div className="py-8 text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>Mencari...</div>}
          {!loading && query && results.length === 0 && (
            <div className="py-8 text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>Tidak ada hasil untuk &quot;{query}&quot;</div>
          )}
          {!loading && results.length > 0 && (
            <div className="p-2 space-y-0.5">
              {results.map(r => {
                const Icon = icons[r.type]
                const c = colors[r.type]
                return (
                  <button key={r.id} onClick={() => { router.push(r.href); setOpen(false); setQuery('') }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: c.bg }}>
                      <Icon className="w-4 h-4" style={{ color: c.text }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.title}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>{r.subtitle}</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                      style={{ background: c.bg, color: c.text }}>{c.label}</span>
                  </button>
                )
              })}
            </div>
          )}
          {!query && (
            <div className="py-6 text-center text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
              Ketik untuk mulai mencari...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
