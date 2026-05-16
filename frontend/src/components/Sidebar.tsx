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
        className="fixed top-20 left-4 z-40 md:hidden p-2 text-on-surface hover:bg-white/10 rounded-md"
      >
        ☰
      </button>

      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-surface-container border-r border-outline-variant glass-panel transition-transform duration-300 ${
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
                  ? 'bg-primary/20 text-primary'
                  : 'text-on-surface hover:bg-white/5'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-outline-variant">
            <button className="flex items-center gap-3 w-full py-3 px-4 rounded-lg font-medium text-on-surface hover:bg-white/5 transition">
              <span className="text-xl">⚙️</span>
              <span>Settings</span>
            </button>
            <button className="flex items-center gap-3 w-full py-3 px-4 rounded-lg font-medium text-on-surface hover:bg-white/5 transition">
              <span className="text-xl">ℹ️</span>
              <span>About</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
