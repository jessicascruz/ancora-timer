'use client'

import { SessionCard } from './SessionCard'
import { useEffect, useState } from 'react'
import { listSessions } from '@/services/api'
import { useNotification } from '@/hooks/useNotification'

interface Session {
  id: string
  duration_minutes: number
  break_minutes: number
  status: string
  started_at: string
  completed_at?: string | null
}

export function SessionList() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const notification = useNotification()

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      setLoading(true)
      const data = await listSessions()
      setSessions(data.sort((a: Session, b: Session) =>
        new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
      ))
    } catch (error) {
      notification.error('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading sessions...</div>
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No sessions yet</p>
        <p className="text-sm">Start your first Pomodoro session to see it here</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sessions.map((session) => (
        <SessionCard key={session.id} {...session} />
      ))}
    </div>
  )
}
