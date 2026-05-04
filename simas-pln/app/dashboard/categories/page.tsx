'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
import { getCategories, createCategory, updateCategory, deleteCategory, type Category } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import PageHeader from '@/components/PageHeader'
import Modal from '@/components/Modal'

const emptyForm = { name: '', description: '' }

export default function CategoriesPage() {
  const { isAdmin } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Category | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchData = async () => {
    setLoading(true)
    const { data } = await getCategories()
    setCategories((data || []) as Category[])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => { setEditingItem(null); setForm(emptyForm); setError(''); setIsModalOpen(true) }
  const openEdit = (item: Category) => {
    setEditingItem(item)
    setForm({ name: item.name, description: item.description || '' })
    setError(''); setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Nama kategori wajib diisi.'); return }
    setSaving(true); setError('')
    if (editingItem) {
      const { error: e } = await updateCategory(editingItem.id, form)
      if (e) { setError(e.message); setSaving(false); return }
    } else {
      const { error: e } = await createCategory(form)
      if (e) { setError(e.message); setSaving(false); return }
    }
    setIsModalOpen(false); setSaving(false); fetchData()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus kategori "${name}"?`)) return
    await deleteCategory(id); fetchData()
  }

  const inputClass = 'w-full bg-[#0f2040] border border-[#1e4080]/60 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9] transition-colors'

  return (
    <div>
      <PageHeader
        title="Kategori Aset"
        subtitle="Kelola jenis/kategori aset infrastruktur"
        action={isAdmin ? (
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-medium rounded-lg transition-colors">
            <Plus className="w-4 h-4" />Tambah Kategori
          </button>
        ) : undefined}
      />

      {!isAdmin && (
        <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg w-fit">
          <span className="text-xs text-amber-400">👁 Mode Viewer — hanya dapat melihat data</span>
        </div>
      )}

      <div className="bg-[#0a1628] border border-[#1e4080]/40 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e4080]/40">
              <th className="text-left px-5 py-3.5 text-xs font-mono text-slate-500 uppercase tracking-widest">Nama</th>
              <th className="text-left px-5 py-3.5 text-xs font-mono text-slate-500 uppercase tracking-widest">Deskripsi</th>
              <th className="text-left px-5 py-3.5 text-xs font-mono text-slate-500 uppercase tracking-widest">Dibuat</th>
              {isAdmin && <th className="text-left px-5 py-3.5 text-xs font-mono text-slate-500 uppercase tracking-widest">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}>{[...Array(isAdmin ? 4 : 3)].map((_, j) => (
                  <td key={j} className="px-5 py-4"><div className="h-4 bg-[#0f2040] rounded animate-pulse" /></td>
                ))}</tr>
              ))
            ) : categories.length === 0 ? (
              <tr><td colSpan={isAdmin ? 4 : 3} className="px-5 py-16 text-center">
                <Tag className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Belum ada kategori</p>
              </td></tr>
            ) : (
              categories.map(item => (
                <tr key={item.id} className="border-b border-[#1e4080]/20 table-row-hover">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#0ea5e9]/15 rounded-lg flex items-center justify-center">
                        <Tag className="w-3.5 h-3.5 text-[#38bdf8]" />
                      </div>
                      <span className="text-sm font-medium text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-400">{item.description || '—'}</td>
                  <td className="px-5 py-3.5 text-xs font-mono text-slate-500">
                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-slate-400 hover:text-[#38bdf8] hover:bg-[#0ea5e9]/10 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id, item.name)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isAdmin && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Kategori' : 'Tambah Kategori'}>
          <div className="space-y-4">
            {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">{error}</div>}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Nama Kategori *</label>
              <input type="text" placeholder="Contoh: Router" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Deskripsi</label>
              <textarea placeholder="Deskripsi singkat (opsional)" value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass + ' resize-none'} />
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
