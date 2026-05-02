'use client'

import { useEffect, useState } from 'react'
import { Package, CheckCircle, Activity, AlertTriangle, TrendingUp } from 'lucide-react'
import { supabase, getDashboardStats } from '@/lib/supabase'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#10b981', '#0ea5e9', '#f87171']

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  description,
}: {
  label: string
  value: number
  icon: React.ElementType
  color: string
  description: string
}) => (
  <div className={`bg-[#0a1628] border border-[#1e4080]/40 rounded-xl p-6 hover:border-[#0ea5e9]/40 transition-all duration-200 fade-in`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-4xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-slate-500 mt-2">{description}</p>
      </div>
      <div className={`p-3 rounded-lg bg-white/5`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
  </div>
)

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, tersedia: 0, digunakan: 0, rusak: 0 })
  const [recentLogs, setRecentLogs] = useState<Array<{
    id: string
    asset_name: string
    action: string
    changed_at: string
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const s = await getDashboardStats()
      setStats(s)

      const { data: logs } = await supabase
        .from('asset_logs')
        .select('id, asset_name, action, changed_at')
        .order('changed_at', { ascending: false })
        .limit(5)

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

  const actionLabel: Record<string, string> = {
    INSERT: 'Aset ditambahkan',
    UPDATE: 'Aset diperbarui',
    DELETE: 'Aset dihapus',
  }
  const actionColor: Record<string, string> = {
    INSERT: 'text-emerald-400',
    UPDATE: 'text-[#38bdf8]',
    DELETE: 'text-red-400',
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-[#0ea5e9]" />
          <span className="text-xs font-mono text-[#0ea5e9] uppercase tracking-widest">Overview</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Ringkasan kondisi aset infrastruktur PLN Icon Plus</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Aset"
          value={stats.total}
          icon={Package}
          color="text-white"
          description="Semua aset terdaftar"
        />
        <StatCard
          label="Tersedia"
          value={stats.tersedia}
          icon={CheckCircle}
          color="text-emerald-400"
          description="Siap digunakan"
        />
        <StatCard
          label="Digunakan"
          value={stats.digunakan}
          icon={Activity}
          color="text-[#38bdf8]"
          description="Sedang aktif dipakai"
        />
        <StatCard
          label="Rusak"
          value={stats.rusak}
          icon={AlertTriangle}
          color="text-red-400"
          description="Perlu perbaikan"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-[#0a1628] border border-[#1e4080]/40 rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-1">Distribusi Status Aset</h2>
          <p className="text-xs text-slate-500 mb-6">Persentase kondisi seluruh aset</p>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-500 text-sm">Memuat grafik...</div>
          ) : stats.total === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
              Belum ada data aset
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f2040',
                    border: '1px solid #1e4080',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-[#0a1628] border border-[#1e4080]/40 rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-1">Aktivitas Terakhir</h2>
          <p className="text-xs text-slate-500 mb-6">5 perubahan aset terbaru</p>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-[#0f2040] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recentLogs.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-slate-500 text-sm">
              Belum ada riwayat perubahan
            </div>
          ) : (
            <div className="space-y-2">
              {recentLogs.map(log => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-[#1e4080]/20"
                >
                  <div>
                    <p className={`text-xs font-medium ${actionColor[log.action]}`}>
                      {actionLabel[log.action]}
                    </p>
                    <p className="text-sm text-white font-medium truncate max-w-[200px]">{log.asset_name}</p>
                  </div>
                  <p className="text-[10px] font-mono text-slate-500">
                    {new Date(log.changed_at).toLocaleDateString('id-ID', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
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
