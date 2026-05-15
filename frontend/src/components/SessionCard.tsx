'use client'

import { formatDistanceToNow } from 'date-fns'

interface SessionCardProps {
  id: string
  duration_minutes: number
  break_minutes: number
  status: string
  started_at: string
  completed_at?: string | null
}

export function SessionCard({
  id,
  duration_minutes,
  break_minutes,
  status,
  started_at,
  completed_at,
}: SessionCardProps) {
  const statusColors = {
    running: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    done: 'bg-blue-100 text-blue-800',
    canceled: 'bg-red-100 text-red-800',
  }

  const color = statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm text-gray-500">Focus time</p>
          <p className="text-2xl font-bold text-gray-900">{duration_minutes}m</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
          {status}
        </span>
      </div>

      <div className="text-sm text-gray-600 space-y-1 mb-3">
        <p>Break: <span className="font-semibold">{break_minutes}m</span></p>
        <p>Started: <span className="font-semibold">{formatDistanceToNow(new Date(started_at), { addSuffix: true })}</span></p>
        {completed_at && (
          <p>Completed: <span className="font-semibold">{formatDistanceToNow(new Date(completed_at), { addSuffix: true })}</span></p>
        )}
      </div>

      <button className="w-full text-blue-600 hover:text-blue-800 font-semibold text-sm py-2 rounded hover:bg-blue-50 transition">
        View Details
      </button>
    </div>
  )
}
