'use client'

import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, TrendingDown, Minus, Download } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend, Cell,
} from 'recharts'
import PageHeader from '@/components/PageHeader'

const MONTHS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des']

export default function ReportsPage() {
  const [monthlyData, setMonthlyData] = useState<Array<{ month: string; total: number; tersedia: number; digunakan: number; rusak: number }>>([])
  const [categoryData, setCategoryData] = useState<Array<{ name: string; total: number }>>([])
  const [locationData, setLocationData] = useState<Array<{ name: string; total: number }>>([])
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      const { data: assets } = await supabase
        .from('assets')
        .select(`*, category:categories(name), location:locations(name)`)

      if (!assets) { setLoading(false); return }

      // Monthly data — dari created_at
      const monthly = MONTHS.map((month, i) => {
        const monthAssets = assets.filter(a => {
          const d = new Date(a.created_at)
          return d.getFullYear() === year && d.getMonth() === i
        })
        return {
          month,
          total: monthAssets.length,
          tersedia: monthAssets.filter(a => a.status === 'Tersedia').length,
          digunakan: monthAssets.filter(a => a.status === 'Digunakan').length,
          rusak: monthAssets.filter(a => a.status === 'Rusak').length,
        }
      })
      setMonthlyData(monthly)

      // Category distribution
      const catMap: Record<string, number> = {}
      assets.forEach(a => {
        const name = (a.category as { name: string } | null)?.name || 'Tanpa Kategori'
        catMap[name] = (catMap[name] || 0) + 1
      })
      setCategoryData(Object.entries(catMap).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total))

      // Location distribution
      const locMap: Record<string, number> = {}
      assets.forEach(a => {
        const name = (a.location as { name: string } | null)?.name || 'Tanpa Lokasi'
        locMap[name] = (locMap[name] || 0) + 1
      })
      setLocationData(Object.entries(locMap).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total))

      setLoading(false)
    }
    fetchReports()
  }, [year])

  const totalThisYear = monthlyData.reduce((s, m) => s + m.total, 0)
  const lastMonthIdx = new Date().getMonth()
  const thisMonth = monthlyData[lastMonthIdx]?.total || 0
  const prevMonth = monthlyData[lastMonthIdx - 1]?.total || 0
  const trend = thisMonth - prevMonth

  const BAR_COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#f87171', '#a78bfa', '#fb923c']

  const handleExportCSV = () => {
    const rows = [
      ['Bulan', 'Total Ditambahkan', 'Tersedia', 'Digunakan', 'Rusak'],
      ...monthlyData.map(m => [m.month, m.total, m.tersedia, m.digunakan, m.rusak])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `laporan-aset-${year}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader
        title="Laporan Bulanan"
        subtitle={`Analisis tren aset tahun ${year}`}
        action={
          <div className="flex gap-2">
            <select value={year} onChange={e => setYear(Number(e.target.value))}
              className="bg-[#0a1628] border border-[#1e4080]/40 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <button onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
              <Download className="w-4 h-4" />Export CSV
            </button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#0a1628] border border-[#1e4080]/40 rounded-xl p-5">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Total Aset {year}</p>
          <p className="text-3xl font-bold text-white">{totalThisYear}</p>
          <p className="text-xs text-slate-500 mt-1">Ditambahkan sepanjang tahun</p>
        </div>
        <div className="bg-[#0a1628] border border-[#1e4080]/40 rounded-xl p-5">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Bulan Ini</p>
          <p className="text-3xl font-bold text-white">{thisMonth}</p>
          <div className="flex items-center gap-1 mt-1">
            {trend > 0 ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> :
             trend < 0 ? <TrendingDown className="w-3.5 h-3.5 text-red-400" /> :
             <Minus className="w-3.5 h-3.5 text-slate-400" />}
            <p className={`text-xs ${trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-red-400' : 'text-slate-400'}`}>
              {trend > 0 ? `+${trend}` : trend} dari bulan lalu
            </p>
          </div>
        </div>
        <div className="bg-[#0a1628] border border-[#1e4080]/40 rounded-xl p-5">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Rata-rata/Bulan</p>
          <p className="text-3xl font-bold text-white">
            {totalThisYear > 0 ? (totalThisYear / 12).toFixed(1) : '0'}
          </p>
          <p className="text-xs text-slate-500 mt-1">Penambahan aset per bulan</p>
        </div>
      </div>

      {/* Bar Chart - Monthly Trend */}
      <div className="bg-[#0a1628] border border-[#1e4080]/40 rounded-xl p-6 mb-6">
        <h2 className="text-base font-semibold text-white mb-1">Tren Penambahan Aset per Bulan</h2>
        <p className="text-xs text-slate-500 mb-6">Jumlah aset yang ditambahkan setiap bulan di tahun {year}</p>
        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-500 text-sm">Memuat grafik...</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e4080" strokeOpacity={0.4} />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f2040', border: '1px solid #1e4080', borderRadius: '8px', color: '#e2e8f0', fontSize: '12px' }} cursor={{ fill: 'rgba(14,165,233,0.05)' }} />
              <Bar dataKey="total" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Line Chart - Status per Bulan */}
      <div className="bg-[#0a1628] border border-[#1e4080]/40 rounded-xl p-6 mb-6">
        <h2 className="text-base font-semibold text-white mb-1">Distribusi Status per Bulan</h2>
        <p className="text-xs text-slate-500 mb-6">Perbandingan status aset sepanjang tahun {year}</p>
        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-500 text-sm">Memuat grafik...</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e4080" strokeOpacity={0.4} />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f2040', border: '1px solid #1e4080', borderRadius: '8px', color: '#e2e8f0', fontSize: '12px' }} />
              <Legend formatter={v => <span style={{ color: '#94a3b8', fontSize: '11px' }}>{v}</span>} />
              <Line type="monotone" dataKey="tersedia" stroke="#10b981" strokeWidth={2} dot={false} name="Tersedia" />
              <Line type="monotone" dataKey="digunakan" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Digunakan" />
              <Line type="monotone" dataKey="rusak" stroke="#f87171" strokeWidth={2} dot={false} name="Rusak" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kategori */}
        <div className="bg-[#0a1628] border border-[#1e4080]/40 rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-1">Aset per Kategori</h2>
          <p className="text-xs text-slate-500 mb-5">Total aset berdasarkan jenis</p>
          {loading ? <div className="h-48 bg-[#0f2040] rounded-lg animate-pulse" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e4080" strokeOpacity={0.3} horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#0f2040', border: '1px solid #1e4080', borderRadius: '8px', color: '#e2e8f0', fontSize: '12px' }} />
                <Bar dataKey="total" radius={[0, 4, 4, 0]} maxBarSize={20}>
                  {categoryData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Lokasi */}
        <div className="bg-[#0a1628] border border-[#1e4080]/40 rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-1">Aset per Lokasi</h2>
          <p className="text-xs text-slate-500 mb-5">Distribusi aset di setiap lokasi</p>
          {loading ? <div className="h-48 bg-[#0f2040] rounded-lg animate-pulse" /> : (
            <div className="space-y-3">
              {locationData.map((l, i) => {
                const max = locationData[0]?.total || 1
                const pct = Math.round((l.total / max) * 100)
                return (
                  <div key={l.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{l.name}</span>
                      <span className="text-slate-500 font-mono">{l.total} aset</span>
                    </div>
                    <div className="h-2 bg-[#0f2040] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }} />
                    </div>
                  </div>
                )
              })}
              {locationData.length === 0 && <p className="text-center text-slate-500 text-sm py-8">Belum ada data</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
