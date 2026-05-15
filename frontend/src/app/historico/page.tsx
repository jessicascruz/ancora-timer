'use client'

import { SessionList } from '@/components'

export default function HistoricoPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Session History</h1>
        <p className="text-gray-600">View all your completed and ongoing sessions</p>
      </div>

      <SessionList />
    </div>
  )
}
