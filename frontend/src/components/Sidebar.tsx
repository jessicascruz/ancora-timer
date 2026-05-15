'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  const isActive = (path: string) => pathname === path

  const links = [
    { href: '/timer', label: 'Timer', icon: '⏱️' },
    { href: '/historico', label: 'History', icon: '📚' },
    { href: '/relatorios', label: 'Reports', icon: '📊' },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-40 md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md"
      >
        ☰
      </button>

      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-30`}
      >
        <div className="p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 w-full py-3 px-4 rounded-lg font-medium transition ${
                isActive(link.href)
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-200">
            <button className="flex items-center gap-3 w-full py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition">
              <span className="text-xl">⚙️</span>
              <span>Settings</span>
            </button>
            <button className="flex items-center gap-3 w-full py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition">
              <span className="text-xl">ℹ️</span>
              <span>About</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
