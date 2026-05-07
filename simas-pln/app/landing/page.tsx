'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Zap, Shield, BarChart3, Package, History, Eye, EyeOff, ArrowRight, Lock } from 'lucide-react'

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
    setLoading(true); setError('')
    await new Promise(r => setTimeout(r, 500))
    const ok = login(username, password)
    if (ok) { router.push('/dashboard') } else { setError('Username atau password salah.'); setLoading(false) }
  }

  const features = [
    { icon: Package,  title: 'Manajemen Aset',    desc: 'CRUD lengkap dengan filter, pencarian, dan pagination' },
    { icon: BarChart3,title: 'Laporan & Grafik',  desc: 'Analisis tren bulanan dengan visualisasi interaktif' },
    { icon: History,  title: 'Log Otomatis',       desc: 'Setiap perubahan tercatat via database trigger' },
    { icon: Shield,   title: 'Akses Berbasis Role',desc: 'Admin dan Viewer dengan hak akses berbeda' },
  ]

  const inputStyle = {
    width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '10px 12px', fontSize: '14px', color: 'var(--text-primary)',
    outline: 'none',
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: 'rgba(14,14,16,0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <Zap className="w-3.5 h-3.5 text-white" fill="white" />
          </div>
          <span className="font-semibold text-sm">SIMAS</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)', border: '1px solid var(--accent-border)' }}>
            PLN Icon Plus
          </span>
        </div>
        <button onClick={() => setShowLogin(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ background: 'var(--accent)', color: '#fff' }}>
          Login Admin <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-6"
            style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)', border: '1px solid var(--accent-border)' }}>
            <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--accent-light)' }} />
            PLN Icon Plus · Sistem Aset Digital v2.0
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight tracking-tight">
            Sistem Informasi<br />
            <span style={{ color: 'var(--accent-light)' }}>Manajemen Aset</span>
          </h1>
          <p className="text-base leading-relaxed mb-8 mx-auto max-w-lg" style={{ color: 'var(--text-secondary)' }}>
            Platform digital untuk mengelola dan memantau aset infrastruktur telekomunikasi & IT PLN Icon Plus secara efisien.
          </p>
          <button onClick={() => setShowLogin(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: 'var(--accent)', color: '#fff' }}>
            <Lock className="w-4 h-4" />Masuk sebagai Admin
          </button>
        </div>
      </section>

      {/* Stats */}
      <div className="py-6 mx-auto max-w-2xl px-6">
        <div className="grid grid-cols-3 gap-4 text-center p-6 rounded-2xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          {[['5+','Kategori Aset'],['4+','Titik Lokasi'],['∞','Log Otomatis']].map(([v,l]) => (
            <div key={l}>
              <p className="text-2xl font-bold mb-0.5" style={{ color: 'var(--accent-light)' }}>{v}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold text-center mb-2">Fitur Unggulan</h2>
          <p className="text-sm text-center mb-10" style={{ color: 'var(--text-tertiary)' }}>Solusi lengkap untuk manajemen aset infrastruktur</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-xl transition-all"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: 'var(--accent-dim)' }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: 'var(--accent-light)' }} />
                </div>
                <p className="text-sm font-semibold mb-1.5">{title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 text-center" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
          © 2025 SIMAS · PLN Icon Plus · v2.0.0
        </p>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
            onClick={() => { setShowLogin(false); setError('') }} />
          <div className="relative w-full max-w-sm rounded-2xl shadow-2xl p-8 fade-in"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-2)' }}>
            <div className="flex justify-center mb-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
                <Zap className="w-6 h-6" style={{ color: 'var(--accent-light)' }} fill="currentColor" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-center mb-1">Masuk ke SIMAS</h2>
            <p className="text-xs text-center mb-6" style={{ color: 'var(--text-tertiary)' }}>
              Masukkan kredensial untuk mengakses sistem
            </p>

            <form onSubmit={handleLogin} className="space-y-3">
              {error && (
                <div className="p-3 rounded-lg text-xs text-center" style={{ background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid var(--red-border)' }}>
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Username</label>
                <input type="text" placeholder="Masukkan username" value={username}
                  onChange={e => setUsername(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} placeholder="Masukkan password"
                    value={password} onChange={e => setPassword(e.target.value)} required
                    style={{ ...inputStyle, paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-tertiary)' }}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 mt-1"
                style={{ background: loading ? 'var(--surface-3)' : 'var(--accent)', color: loading ? 'var(--text-tertiary)' : '#fff' }}>
                {loading ? (
                  <><div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--text-tertiary)', borderTopColor: 'transparent' }} />Memverifikasi...</>
                ) : (
                  <><Shield className="w-4 h-4" />Masuk</>
                )}
              </button>
            </form>
            <p className="text-[10px] text-center mt-4" style={{ color: 'var(--text-tertiary)' }}>
              Hanya personel yang berwenang diizinkan masuk
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
