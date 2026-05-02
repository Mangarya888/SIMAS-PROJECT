'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function RootPage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/dashboard')
    } else {
      router.replace('/landing')
    }
  }, [isLoggedIn, router])

  return (
    <div className="min-h-screen bg-[#050d1a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#0ea5e9]/30 border-t-[#0ea5e9] rounded-full animate-spin" />
    </div>
  )
}
