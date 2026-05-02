'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search, Filter, Package } from 'lucide-react'
import {
  supabase,
  getAssets,
  getCategories,
  getLocations,
  createAsset,
  updateAsset,
  deleteAsset,
  type Asset,
  type Category,
  type Location,
} from '@/lib/supabase'
import PageHeader from '@/components/PageHeader'
import StatusBadge from '@/components/StatusBadge'
import Modal from '@/components/Modal'

type StatusType = 'Tersedia' | 'Digunakan' | 'Rusak'

const emptyForm: {
  name: string
  serial_number: string
  category_id: string
  location_id: string
  status: StatusType
  notes: string
} = {
  name: '',
  serial_number: '',
  category_id: '',
  location_id: '',
  status: 'Tersedia' as 'Tersedia' | 'Digunakan' | 'Rusak',
  notes: '',
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('Semua')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchAll = async () => {
    setLoading(true)
    const [{ data: a }, { data: c }, { data: l }] = await Promise.all([
      getAssets(),
      getCategories(),
      getLocations(),
    ])
    setAssets(
      (a || []).map((asset: Record<string, unknown>) => ({
        ...asset,
        category_name: (asset.category as { name: string } | null)?.name || '—',
        location_name: (asset.location as { name: string } | null)?.name || '—',
      })) as Asset[]
    )
    setCategories((c || []) as Category[])
    setLocations((l || []) as Location[])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const openCreate = () => {
    setEditingAsset(null)
    setForm(emptyForm)
    setError('')
    setIsModalOpen(true)
  }

  const openEdit = (asset: Asset) => {
    setEditingAsset(asset)
    setForm({
      name: asset.name,
      serial_number: asset.serial_number,
      category_id: asset.category_id || '',
      location_id: asset.location_id || '',
      status: asset.status,
      notes: asset.notes || '',
    })
    setError('')
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.serial_number) {
      setError('Nama dan Serial Number wajib diisi.')
      return
    }
    setSaving(true)
    setError('')
    if (editingAsset) {
      const { error: e } = await updateAsset(editingAsset.id, form)
      if (e) { setError(e.message); setSaving(false); return }
    } else {
      const { error: e } = await createAsset(form)
      if (e) { setError(e.message); setSaving(false); return }
    }
    setIsModalOpen(false)
    setSaving(false)
    fetchAll()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus aset "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return
    await deleteAsset(id)
    fetchAll()
  }

  const filtered = assets.filter(a => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.serial_number.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'Semua' || a.status === filterStatus
    return matchSearch && matchStatus
  })

  const inputClass =
    'w-full bg-[#0f2040] border border-[#1e4080]/60 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9] transition-colors'

  return (
    <div>
      <PageHeader
        title="Manajemen Aset"
        subtitle={`${assets.length} aset terdaftar`}
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Aset
          </button>
        }
      />

      {/* Filter Bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari nama atau serial number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0a1628] border border-[#1e4080]/40 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          {['Semua', 'Tersedia', 'Digunakan', 'Rusak'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                filterStatus === s
                  ? 'bg-[#0ea5e9] text-white'
                  : 'bg-[#0a1628] border border-[#1e4080]/40 text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0a1628] border border-[#1e4080]/40 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e4080]/40">
              {['Nama Aset', 'Serial Number', 'Kategori', 'Lokasi', 'Status', 'Aksi'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-mono text-slate-500 uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-[#0f2040] rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <Package className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Tidak ada aset ditemukan</p>
                </td>
              </tr>
            ) : (
              filtered.map(asset => (
                <tr key={asset.id} className="border-b border-[#1e4080]/20 table-row-hover transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-white">{asset.name}</p>
                    {asset.notes && (
                      <p className="text-xs text-slate-500 truncate max-w-[200px]">{asset.notes}</p>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <code className="text-xs font-mono text-[#38bdf8] bg-[#0ea5e9]/10 px-2 py-0.5 rounded">
                      {asset.serial_number}
                    </code>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-300">{asset.category_name}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-300">{asset.location_name}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={asset.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(asset)}
                        className="p-2 rounded-lg text-slate-400 hover:text-[#38bdf8] hover:bg-[#0ea5e9]/10 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(asset.id, asset.name)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAsset ? 'Edit Aset' : 'Tambah Aset Baru'}
      >
        <div className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Nama Aset *</label>
            <input
              type="text"
              placeholder="Contoh: Router Cisco ISR 4321"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Serial Number *</label>
            <input
              type="text"
              placeholder="Contoh: CSC-ISR4321-001"
              value={form.serial_number}
              onChange={e => setForm({ ...form, serial_number: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Kategori</label>
              <select
                value={form.category_id}
                onChange={e => setForm({ ...form, category_id: e.target.value })}
                className={inputClass}
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Lokasi</label>
              <select
                value={form.location_id}
                onChange={e => setForm({ ...form, location_id: e.target.value })}
                className={inputClass}
              >
                <option value="">-- Pilih Lokasi --</option>
                {locations.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Status</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value as typeof form.status })}
              className={inputClass}
            >
              <option value="Tersedia">Tersedia</option>
              <option value="Digunakan">Digunakan</option>
              <option value="Rusak">Rusak</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Catatan</label>
            <textarea
              placeholder="Keterangan tambahan (opsional)"
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className={inputClass + ' resize-none'}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2.5 border border-[#1e4080]/60 text-slate-300 text-sm rounded-lg hover:bg-white/5 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {saving ? 'Menyimpan...' : editingAsset ? 'Perbarui' : 'Simpan'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
