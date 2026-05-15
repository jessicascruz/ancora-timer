'use client'

import { useEffect, useState } from 'react'
import { getReportSummary } from '@/services/api'
import { StatCard } from './StatCard'
import { useNotification } from '@/hooks/useNotification'

interface ReportData {
  sessions_today: number
  total_sessions: number
  days_with_sessions: number
  average_per_day: number
  total_focus_minutes: number
  total_break_minutes: number
}

export function ReportCharts() {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const notification = useNotification()

  useEffect(() => {
    loadReport()
  }, [])

  const loadReport = async () => {
    try {
      setLoading(true)
      const reportData = await getReportSummary()
      setData(reportData)
    } catch (error) {
      notification.error('Failed to load report')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading report...</div>
  }

  if (!data) {
    return <div className="text-center py-8 text-gray-500">No data available</div>
  }

  const totalMinutes = data.total_focus_minutes + data.total_break_minutes
  const focusPercentage = totalMinutes > 0 ? Math.round((data.total_focus_minutes / totalMinutes) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Sessions Today" value={data.sessions_today} icon="📅" />
        <StatCard label="Total Sessions" value={data.total_sessions} icon="⏱️" />
        <StatCard label="Days Active" value={data.days_with_sessions} icon="📊" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Average</h3>
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {data.average_per_day.toFixed(1)}m
          </div>
          <p className="text-gray-600 text-sm">focus time per day</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Focus Time</h3>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <span className="text-sm font-semibold inline-block text-blue-600">
                {focusPercentage}%
              </span>
            </div>
            <div className="overflow-hidden h-3 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${focusPercentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all"
              ></div>
            </div>
            <p className="text-gray-600 text-sm mt-2">
              {data.total_focus_minutes}m focus · {data.total_break_minutes}m break
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
