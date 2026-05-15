'use client'

import { useTimerStore } from '@/store/timerStore'
import { useNotification } from '@/hooks/useNotification'
import { createSession } from '@/services/api'
import { useDb } from '@/hooks/useDb'

export function TimerControls() {
  const store = useTimerStore()
  const notification = useNotification()
  const db = useDb()

  const handleStart = async () => {
    try {
      const sessionData = await createSession({
        duration_minutes: store.duration,
        break_minutes: store.breakDuration,
      })

      store.setCurrentSessionId(sessionData.id)

      await db.write(async () => {
        const sessions = db.get('sessions')
        await sessions.create((session) => {
          session.server_id = sessionData.id
          session.durationMinutes = store.duration
          session.breakMinutes = store.breakDuration
          session.status = 'running'
          session.startedAt = new Date()
          session.synced = false
        })
      })

      store.startTimer()
      notification.success('Session started')
    } catch (error) {
      notification.error('Failed to start session')
    }
  }

  const handlePause = () => {
    store.pauseTimer()
    notification.info('Session paused')
  }

  const handleResume = () => {
    store.resumeTimer()
    notification.info('Session resumed')
  }

  const handleReset = () => {
    store.resetTimer()
    notification.info('Session reset')
  }

  return (
    <div className="flex gap-4 justify-center p-8 flex-wrap">
      {store.status === 'idle' ? (
        <button
          onClick={handleStart}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg"
        >
          Start
        </button>
      ) : store.status === 'running' || store.status === 'pre-warning' ? (
        <>
          <button
            onClick={handlePause}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            Pause
          </button>
          <button
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            Reset
          </button>
        </>
      ) : store.status === 'break' ? (
        <button
          onClick={handleResume}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg"
        >
          End Break
        </button>
      ) : null}

      {store.status === 'paused' && (
        <button
          onClick={handleResume}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg"
        >
          Resume
        </button>
      )}
    </div>
  )
}
