'use client'

import { ReportCharts } from '@/components'

export default function RelatortiosPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">
          Track your productivity and focus time statistics
        </p>
      </div>

      <ReportCharts />
    </div>
  )
}
