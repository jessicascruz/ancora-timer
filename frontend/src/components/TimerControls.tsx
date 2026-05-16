'use client'

import { useTimerStore } from '@/store/timerStore'
import { useNotification } from '@/hooks/useNotification'
import { createSession } from '@/services/api'
import { useDb } from '@/hooks/useDb'
import { Button } from '@/components/ui/Button'

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

  const isBreakMode = store.status === 'break' || store.status === 'paused'
  const state = isBreakMode ? 'break' : 'focus'

  return (
    <div className="flex gap-4 justify-center p-8 flex-wrap">
      {store.status === 'idle' ? (
        <Button
          onClick={handleStart}
          variant="primary"
          state={state}
          className="py-3 px-8 text-lg"
        >
          Start
        </Button>
      ) : store.status === 'running' || store.status === 'pre-warning' ? (
        <>
          <Button
            onClick={handlePause}
            variant="secondary"
            state="focus"
            className="py-3 px-8 text-lg"
          >
            Pause
          </Button>
          <Button
            onClick={handleReset}
            variant="ghost"
            className="py-3 px-8 text-lg border-error text-error hover:bg-error/10"
          >
            Reset
          </Button>
        </>
      ) : store.status === 'break' ? (
        <Button
          onClick={handleResume}
          variant="primary"
          state="break"
          className="py-3 px-8 text-lg"
        >
          End Break
        </Button>
      ) : null}

      {store.status === 'paused' && (
        <Button
          onClick={handleResume}
          variant="primary"
          state="focus"
          className="py-3 px-8 text-lg"
        >
          Resume
        </Button>
      )}
    </div>
  )
}
