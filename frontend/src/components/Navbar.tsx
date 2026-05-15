'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white border-b border-gray-200 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Ancora Timer ⏱️
            </Link>

            <div className="hidden md:flex gap-6">
              <Link
                href="/timer"
                className={`py-2 px-3 rounded-md text-sm font-medium transition ${
                  isActive('/timer')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Timer
              </Link>
              <Link
                href="/historico"
                className={`py-2 px-3 rounded-md text-sm font-medium transition ${
                  isActive('/historico')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                History
              </Link>
              <Link
                href="/relatorios"
                className={`py-2 px-3 rounded-md text-sm font-medium transition ${
                  isActive('/relatorios')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Reports
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-md transition">
              🔔
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
