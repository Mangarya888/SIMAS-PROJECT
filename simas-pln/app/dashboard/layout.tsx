'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import GlobalSearch from '@/components/GlobalSearch'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) router.replace('/landing')
  }, [isLoggedIn, router])

  if (!isLoggedIn) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: '230px' }}>
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex items-center justify-end px-8 py-3"
          style={{ background: 'rgba(14,14,16,0.85)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border)' }}>
          <GlobalSearch />
        </header>
        <main className="flex-1 px-8 py-7 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
