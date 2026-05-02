'use client'

import { useEffect, useState } from 'react'
import { History, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { getAssetLogs, type AssetLog } from '@/lib/supabase'
import PageHeader from '@/components/PageHeader'

const actionConfig = {
  INSERT: { label: 'Ditambahkan', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: Plus },
  UPDATE: { label: 'Diperbarui', color: 'text-[#38bdf8]', bg: 'bg-[#0ea5e9]/10', border: 'border-[#0ea5e9]/30', icon: RefreshCw },
  DELETE: { label: 'Dihapus', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: Trash2 },
}

export default function HistoryPage() {
  const [logs, setLogs] = useState<AssetLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'INSERT' | 'UPDATE' | 'DELETE'>('ALL')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const { data } = await getAssetLogs()
      setLogs((data || []) as AssetLog[])
      setLoading(false)
    }
    fetch()
  }, [])

  const filtered = filter === 'ALL' ? logs : logs.filter(l => l.action === filter)

  return (
    <div>
      <PageHeader
        title="Riwayat Aset"
        subtitle="Log perubahan otomatis setiap mutasi data aset"
      />

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(['ALL', 'INSERT', 'UPDATE', 'DELETE'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              filter === f
                ? 'bg-[#0ea5e9] text-white'
                : 'bg-[#0a1628] border border-[#1e4080]/40 text-slate-400 hover:text-white'
            }`}
          >
            {f === 'ALL' ? 'Semua' : f === 'INSERT' ? 'Ditambahkan' : f === 'UPDATE' ? 'Diperbarui' : 'Dihapus'}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500 flex items-center">
          {filtered.length} entri
        </span>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-[#0a1628] border border-[#1e4080]/40 rounded-xl animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center bg-[#0a1628] border border-[#1e4080]/40 rounded-xl">
            <History className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Belum ada riwayat perubahan</p>
          </div>
        ) : (
          filtered.map(log => {
            const cfg = actionConfig[log.action as keyof typeof actionConfig]
            const Icon = cfg.icon
            return (
              <div
                key={log.id}
                className={`bg-[#0a1628] border rounded-xl p-4 ${cfg.border} fade-in`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                        {cfg.label}
                      </span>
                      <p className="text-sm font-medium text-white truncate">{log.asset_name}</p>
                    </div>
                    <code className="text-xs font-mono text-slate-500">{log.serial_number}</code>

                    {/* Detail perubahan untuk UPDATE */}
                    {log.action === 'UPDATE' && log.old_data && log.new_data && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2">
                          <p className="text-[10px] text-red-400 font-mono mb-1">SEBELUM</p>
                          {['status', 'location_id', 'name'].map(key => {
                            const oldVal = (log.old_data as Record<string, unknown>)[key]
                            const newVal = (log.new_data as Record<string, unknown>)[key]
                            if (oldVal !== newVal && oldVal !== undefined) {
                              return (
                                <p key={key} className="text-xs text-slate-400">
                                  <span className="text-slate-500">{key}:</span> {String(oldVal)}
                                </p>
                              )
                            }
                            return null
                          })}
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-2">
                          <p className="text-[10px] text-emerald-400 font-mono mb-1">SESUDAH</p>
                          {['status', 'location_id', 'name'].map(key => {
                            const oldVal = (log.old_data as Record<string, unknown>)[key]
                            const newVal = (log.new_data as Record<string, unknown>)[key]
                            if (oldVal !== newVal && newVal !== undefined) {
                              return (
                                <p key={key} className="text-xs text-slate-400">
                                  <span className="text-slate-500">{key}:</span> {String(newVal)}
                                </p>
                              )
                            }
                            return null
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] font-mono text-slate-500">
                      {new Date(log.changed_at).toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </p>
                    <p className="text-[10px] font-mono text-slate-600">
                      {new Date(log.changed_at).toLocaleTimeString('id-ID', {
                        hour: '2-digit', minute: '2-digit',
                      })}
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
