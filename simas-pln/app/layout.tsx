import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'SIMAS – PLN Icon Plus',
  description: 'Sistem Informasi Manajemen Aset PLN Icon Plus',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="bg-[#050d1a] text-slate-200 min-h-screen flex">
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen">
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
