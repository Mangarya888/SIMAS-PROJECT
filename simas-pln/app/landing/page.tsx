'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Zap, Shield, BarChart3, Package, History, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 600)) // animasi loading
    const success = login(username, password)
    if (success) {
      router.push('/dashboard')
    } else {
      setError('Username atau password salah.')
      setLoading(false)
    }
  }

  const features = [
    { icon: Package, title: 'Manajemen Aset', desc: 'Kelola aset infrastruktur secara digital, real-time' },
    { icon: BarChart3, title: 'Dashboard Analitik', desc: 'Visualisasi distribusi status aset dalam grafik interaktif' },
    { icon: History, title: 'Riwayat Otomatis', desc: 'Setiap perubahan tercatat otomatis via database trigger' },
    { icon: Shield, title: 'Akses Terkontrol', desc: 'Sistem autentikasi untuk menjaga keamanan data aset' },
  ]

  return (
    <div className="min-h-screen bg-[#050d1a] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1e4080]/30 backdrop-blur-md bg-[#050d1a]/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0ea5e9] rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">SIMAS</span>
              <span className="text-[#0ea5e9] text-xs ml-2 font-mono">PLN Icon Plus</span>
            </div>
          </div>
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-medium rounded-lg transition-colors"
          >
            Login Admin
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] animate-pulse" />
            <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest">
              PLN Icon Plus · Sistem Aset Digital
            </span>
          </div>

          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Sistem Informasi<br />
            <span className="text-[#0ea5e9]">Manajemen Aset</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Platform digital untuk mengelola, memantau, dan mencatat riwayat aset infrastruktur 
            telekomunikasi & IT PLN Icon Plus secara efisien dan akurat.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#0ea5e9]/25"
            >
              <Shield className="w-4 h-4" />
              Masuk sebagai Admin
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y border-[#1e4080]/30 bg-[#0a1628]/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { label: 'Kategori Aset', value: '5+' },
              { label: 'Titik Lokasi', value: '4+' },
              { label: 'Log Otomatis', value: '∞' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-[#38bdf8]">{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">Fitur Unggulan</h2>
            <p className="text-slate-400 text-sm">Solusi lengkap untuk manajemen aset infrastruktur</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-[#0a1628] border border-[#1e4080]/40 rounded-xl p-6 hover:border-[#0ea5e9]/40 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-[#0ea5e9]/15 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#38bdf8]" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e4080]/30 py-6 px-6 text-center">
        <p className="text-xs text-slate-600 font-mono">
          © 2024 SIMAS · PLN Icon Plus · Sistem Informasi Manajemen Aset v1.0
        </p>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => { setShowLogin(false); setError('') }}
          />
          <div className="relative w-full max-w-sm bg-[#0a1628] border border-[#1e4080]/60 rounded-2xl shadow-2xl p-8 fade-in">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 bg-[#0ea5e9]/15 rounded-2xl flex items-center justify-center border border-[#0ea5e9]/30">
                <Zap className="w-7 h-7 text-[#0ea5e9]" fill="currentColor" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-1">Login Admin</h2>
            <p className="text-xs text-slate-500 text-center mb-6">Masukkan kredensial untuk mengakses SIMAS</p>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Username</label>
                <input
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className="w-full bg-[#0f2040] border border-[#1e4080]/60 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#0f2040] border border-[#1e4080]/60 rounded-lg px-3 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] disabled:opacity-60 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Masuk
                  </>
                )}
              </button>
            </form>

            <p className="text-[10px] text-slate-600 text-center mt-4 font-mono">
              Hanya personel yang berwenang diizinkan masuk
            </p>
            <div className="mt-3 p-3 bg-[#0f2040] rounded-lg border border-[#1e4080]/40">
              <p className="text-[10px] font-mono text-slate-500 mb-1.5">AKUN TERSEDIA:</p>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-[#38bdf8]">admin / pln2024</span>
                  <span className="text-emerald-400">Administrator</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-[#38bdf8]">manager / manager123</span>
                  <span className="text-amber-400">Viewer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
