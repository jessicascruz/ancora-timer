'use client'

import { usePathname } from 'next/navigation'
import { Navbar, Sidebar } from '@/components'

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <>
      {!isHome && <Navbar />}
      <div className="flex">
        {!isHome && <Sidebar />}
        <main className={isHome ? 'w-full' : 'flex-1 md:ml-64 pt-4 px-4 md:px-8'}>
          {children}
        </main>
      </div>
    </>
  )
}
