'use client'

import { useEffect, useState } from 'react'
import { History, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { getAssetLogs, type AssetLog } from '@/lib/supabase'
import PageHeader from '@/components/PageHeader'

// Field yang ditampilkan + label yang ramah
const FIELD_LABELS: Record<string, string> = {
  name:        'Nama',
  status:      'Status',
  notes:       'Catatan',
  category_id: 'Kategori (ID)',
  location_id: 'Lokasi (ID)',
}

// Ambil semua field yang berubah (kecuali field teknis)
const SKIP_FIELDS = ['id', 'updated_at', 'created_at']

function getChangedFields(oldData: Record<string, unknown>, newData: Record<string, unknown>) {
  const allKeys = Array.from(new Set([...Object.keys(oldData), ...Object.keys(newData)]))
  return allKeys.filter(key => {
    if (SKIP_FIELDS.includes(key)) return false
    return String(oldData[key] ?? '') !== String(newData[key] ?? '')
  })
}

const actionConfig = {
  INSERT: { label: 'Ditambahkan', icon: Plus,      color: 'var(--green)',        bg: 'var(--green-dim)',   border: 'var(--green-border)' },
  UPDATE: { label: 'Diperbarui',  icon: RefreshCw, color: 'var(--accent-light)', bg: 'var(--accent-dim)', border: 'var(--accent-border)' },
  DELETE: { label: 'Dihapus',     icon: Trash2,    color: 'var(--red)',          bg: 'var(--red-dim)',    border: 'var(--red-border)' },
}

const FILTERS = [
  { key: 'ALL',    label: 'Semua' },
  { key: 'INSERT', label: 'Ditambahkan' },
  { key: 'UPDATE', label: 'Diperbarui' },
  { key: 'DELETE', label: 'Dihapus' },
] as const

export default function HistoryPage() {
  const [logs, setLogs] = useState<AssetLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'INSERT' | 'UPDATE' | 'DELETE'>('ALL')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data } = await getAssetLogs()
      setLogs((data || []) as AssetLog[])
      setLoading(false)
    }
    fetchData()
  }, [])

  const filtered = filter === 'ALL' ? logs : logs.filter(l => l.action === filter)

  const inputStyle = {
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '12px',
    color: 'var(--text-primary)',
    width: '100%',
    resize: 'none' as const,
    outline: 'none',
  }

  return (
    <div>
      <PageHeader
        title="Riwayat Aset"
        subtitle="Log perubahan otomatis setiap mutasi data aset"
      />

      {/* Filter Bar */}
      <div className="flex items-center gap-2 mb-6">
        {FILTERS.map(f => {
          const active = filter === f.key
          return (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all"
              style={{
                background: active ? 'var(--accent)' : 'var(--surface-2)',
                color: active ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
              }}>
              {f.label}
            </button>
          )
        })}
        <span className="ml-auto text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
          {filtered.length} entri
        </span>
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--surface)' }} />
          ))
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <History className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Belum ada riwayat perubahan</p>
          </div>
        ) : (
          filtered.map(log => {
            const cfg = actionConfig[log.action as keyof typeof actionConfig]
            const Icon = cfg.icon

            // Hitung field yang berubah untuk UPDATE
            const changedFields = log.action === 'UPDATE' && log.old_data && log.new_data
              ? getChangedFields(
                  log.old_data as Record<string, unknown>,
                  log.new_data as Record<string, unknown>
                )
              : []

            return (
              <div key={log.id} className="rounded-xl p-4 fade-in transition-all"
                style={{ background: 'var(--surface)', border: `1px solid var(--border)` }}>
                <div className="flex items-start gap-3.5">
                  {/* Icon */}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: cfg.bg }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                        {cfg.label}
                      </span>
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {log.asset_name}
                      </p>
                    </div>
                    <code className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{log.serial_number}</code>

                    {/* Detail perubahan UPDATE — fix bug: tampilkan semua field yang berubah */}
                    {log.action === 'UPDATE' && changedFields.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {/* SEBELUM */}
                        <div className="rounded-lg p-3 space-y-1.5"
                          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid var(--red-border)' }}>
                          <p className="text-[10px] font-mono font-semibold mb-2" style={{ color: 'var(--red)' }}>
                            SEBELUM
                          </p>
                          {changedFields.map(key => {
                            const val = (log.old_data as Record<string, unknown>)[key]
                            return (
                              <div key={key}>
                                <p className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                                  {FIELD_LABELS[key] || key}
                                </p>
                                <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                                  {val === null || val === undefined || val === '' ? '(kosong)' : String(val)}
                                </p>
                              </div>
                            )
                          })}
                        </div>

                        {/* SESUDAH */}
                        <div className="rounded-lg p-3 space-y-1.5"
                          style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid var(--green-border)' }}>
                          <p className="text-[10px] font-mono font-semibold mb-2" style={{ color: 'var(--green)' }}>
                            SESUDAH
                          </p>
                          {changedFields.map(key => {
                            const val = (log.new_data as Record<string, unknown>)[key]
                            return (
                              <div key={key}>
                                <p className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                                  {FIELD_LABELS[key] || key}
                                </p>
                                <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                                  {val === null || val === undefined || val === '' ? '(kosong)' : String(val)}
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* UPDATE tapi tidak ada perubahan field yang terdeteksi */}
                    {log.action === 'UPDATE' && changedFields.length === 0 && (
                      <p className="text-xs mt-2 italic" style={{ color: 'var(--text-tertiary)' }}>
                        Data diperbarui
                      </p>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(log.changed_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-[11px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                      {new Date(log.changed_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
