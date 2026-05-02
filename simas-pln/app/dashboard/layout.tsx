'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/landing')
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#050d1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0ea5e9]/30 border-t-[#0ea5e9] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
