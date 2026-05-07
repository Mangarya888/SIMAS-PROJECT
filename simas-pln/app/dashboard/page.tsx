'use client'

import { useEffect, useState } from 'react'
import { Package, CheckCircle, Activity, AlertTriangle } from 'lucide-react'
import { supabase, getDashboardStats } from '@/lib/supabase'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#22c55e', '#6366f1', '#ef4444']

const StatCard = ({ label, value, icon: Icon, color, bg, description }: {
  label: string; value: number; icon: React.ElementType
  color: string; bg: string; description: string
}) => (
  <div className="rounded-xl p-5 fade-in flex items-start justify-between"
    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
    <div>
      <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>{label}</p>
      <p className="text-3xl font-bold mb-1" style={{ color }}>{value}</p>
      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{description}</p>
    </div>
    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: bg }}>
      <Icon className="w-4.5 h-4.5" style={{ color }} />
    </div>
  </div>
)

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, tersedia: 0, digunakan: 0, rusak: 0 })
  const [recentLogs, setRecentLogs] = useState<Array<{ id: string; asset_name: string; action: string; changed_at: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const s = await getDashboardStats()
      setStats(s)
      const { data: logs } = await supabase.from('asset_logs').select('id, asset_name, action, changed_at').order('changed_at', { ascending: false }).limit(5)
      setRecentLogs(logs || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const pieData = [
    { name: 'Tersedia', value: stats.tersedia },
    { name: 'Digunakan', value: stats.digunakan },
    { name: 'Rusak', value: stats.rusak },
  ].filter(d => d.value > 0)

  const actionLabel: Record<string, string> = { INSERT: 'Ditambahkan', UPDATE: 'Diperbarui', DELETE: 'Dihapus' }
  const actionColor: Record<string, string> = { INSERT: 'var(--green)', UPDATE: 'var(--accent-light)', DELETE: 'var(--red)' }

  return (
    <div>
      <div className="mb-7">
        <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--accent-light)' }}>Overview</p>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Ringkasan kondisi aset infrastruktur PLN Icon Plus</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Aset" value={stats.total} icon={Package} color="var(--text-primary)" bg="var(--surface-3)" description="Semua terdaftar" />
        <StatCard label="Tersedia" value={stats.tersedia} icon={CheckCircle} color="var(--green)" bg="var(--green-dim)" description="Siap digunakan" />
        <StatCard label="Digunakan" value={stats.digunakan} icon={Activity} color="var(--accent-light)" bg="var(--accent-dim)" description="Aktif dipakai" />
        <StatCard label="Rusak" value={stats.rusak} icon={AlertTriangle} color="var(--red)" bg="var(--red-dim)" description="Perlu perbaikan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pie Chart */}
        <div className="rounded-xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>Distribusi Status Aset</p>
          <p className="text-xs mb-5" style={{ color: 'var(--text-tertiary)' }}>Persentase kondisi seluruh aset</p>
          {loading ? (
            <div className="h-56 flex items-center justify-center text-sm" style={{ color: 'var(--text-tertiary)' }}>Memuat...</div>
          ) : stats.total === 0 ? (
            <div className="h-56 flex items-center justify-center text-sm" style={{ color: 'var(--text-tertiary)' }}>Belum ada data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
                <Legend formatter={v => <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Aktivitas */}
        <div className="rounded-xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>Aktivitas Terakhir</p>
          <p className="text-xs mb-5" style={{ color: 'var(--text-tertiary)' }}>5 perubahan terbaru</p>
          {loading ? (
            <div className="space-y-2.5">
              {[...Array(4)].map((_, i) => <div key={i} className="h-12 rounded-lg animate-pulse" style={{ background: 'var(--surface-2)' }} />)}
            </div>
          ) : recentLogs.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-sm" style={{ color: 'var(--text-tertiary)' }}>Belum ada riwayat</div>
          ) : (
            <div className="space-y-2">
              {recentLogs.map(log => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                  <div>
                    <p className="text-xs font-medium" style={{ color: actionColor[log.action] }}>{actionLabel[log.action]}</p>
                    <p className="text-sm font-medium truncate max-w-[180px]" style={{ color: 'var(--text-primary)' }}>{log.asset_name}</p>
                  </div>
                  <p className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                    {new Date(log.changed_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
