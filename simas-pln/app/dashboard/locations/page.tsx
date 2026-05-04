'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react'
import { getLocations, createLocation, updateLocation, deleteLocation, type Location } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import PageHeader from '@/components/PageHeader'
import Modal from '@/components/Modal'

const emptyForm = { name: '', address: '' }

export default function LocationsPage() {
  const { isAdmin } = useAuth()
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Location | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchData = async () => {
    setLoading(true)
    const { data } = await getLocations()
    setLocations((data || []) as Location[])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => { setEditingItem(null); setForm(emptyForm); setError(''); setIsModalOpen(true) }
  const openEdit = (item: Location) => {
    setEditingItem(item)
    setForm({ name: item.name, address: item.address || '' })
    setError(''); setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Nama lokasi wajib diisi.'); return }
    setSaving(true); setError('')
    if (editingItem) {
      const { error: e } = await updateLocation(editingItem.id, form)
      if (e) { setError(e.message); setSaving(false); return }
    } else {
      const { error: e } = await createLocation(form)
      if (e) { setError(e.message); setSaving(false); return }
    }
    setIsModalOpen(false); setSaving(false); fetchData()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus lokasi "${name}"?`)) return
    await deleteLocation(id); fetchData()
  }

  const inputClass = 'w-full bg-[#0f2040] border border-[#1e4080]/60 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9] transition-colors'

  return (
    <div>
      <PageHeader
        title="Lokasi"
        subtitle="Kelola titik lokasi penempatan aset"
        action={isAdmin ? (
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-medium rounded-lg transition-colors">
            <Plus className="w-4 h-4" />Tambah Lokasi
          </button>
        ) : undefined}
      />

      {!isAdmin && (
        <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg w-fit">
          <span className="text-xs text-amber-400">👁 Mode Viewer — hanya dapat melihat data</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-[#0a1628] border border-[#1e4080]/40 rounded-xl animate-pulse" />
          ))
        ) : locations.length === 0 ? (
          <div className="col-span-3 py-20 text-center">
            <MapPin className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Belum ada lokasi terdaftar</p>
          </div>
        ) : (
          locations.map(item => (
            <div key={item.id}
              className="bg-[#0a1628] border border-[#1e4080]/40 rounded-xl p-5 hover:border-[#0ea5e9]/40 transition-all duration-200 fade-in group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-[#0ea5e9]/15 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#38bdf8]" />
                </div>
                {/* Edit & Delete hanya admin */}
                {isAdmin && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#38bdf8] hover:bg-[#0ea5e9]/10 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(item.id, item.name)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <h3 className="text-base font-semibold text-white">{item.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{item.address || 'Tidak ada alamat'}</p>
              <p className="text-[10px] font-mono text-slate-600 mt-3">
                {new Date(item.created_at).toLocaleDateString('id-ID')}
              </p>
            </div>
          ))
        )}
      </div>

      {isAdmin && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Lokasi' : 'Tambah Lokasi'}>
          <div className="space-y-4">
            {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">{error}</div>}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Nama Lokasi *</label>
              <input type="text" placeholder="Contoh: Gudang A" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Alamat</label>
              <textarea placeholder="Alamat lengkap (opsional)" value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })} rows={3} className={inputClass + ' resize-none'} />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-[#1e4080]/60 text-slate-300 text-sm rounded-lg hover:bg-white/5 transition-colors">Batal</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
                {saving ? 'Menyimpan...' : editingItem ? 'Perbarui' : 'Simpan'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
