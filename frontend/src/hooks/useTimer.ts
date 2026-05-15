'use client'
import { useEffect, useRef } from 'react'
import { useTimerStore } from '@/store/timerStore'
import { playWarningSound, playCompleteSound, playBreakEndSound } from '@/lib/sounds'

export function useTimer() {
  const store    = useTimerStore()
  const interval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (store.status === 'running' || store.status === 'pre-warning' || store.status === 'break') {
      interval.current = setInterval(() => {
        store.tickTimer()
      }, 1000)
    } else {
      if (interval.current) clearInterval(interval.current)
    }
    return () => { if (interval.current) clearInterval(interval.current) }
  }, [store.status])

  useEffect(() => {
    if (store.status === 'pre-warning') {
      playWarningSound()
      document.title = '⚠️ Anote o que está fazendo! — Pomodoro'
    } else if (store.status === 'break') {
      playCompleteSound()
      document.title = '☕ Pausa — Pomodoro'
    } else if (store.status === 'idle' && store.showBreakSummary) {
      playBreakEndSound()
      document.title = '▶️ Hora de focar — Pomodoro'
    } else {
      document.title = 'Pomodoro'
    }
  }, [store.status, store.showBreakSummary])

  return store
}
