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
    <div className="min-h-screen bg-[#050d1a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#0ea5e9]/30 border-t-[#0ea5e9] rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-[#050d1a]/80 backdrop-blur border-b border-[#1e4080]/30 px-8 py-3 flex items-center justify-end">
          <GlobalSearch />
        </header>
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
