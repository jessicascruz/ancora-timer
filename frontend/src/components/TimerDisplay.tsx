'use client'

import { useTimerStore } from '@/store/timerStore'
import { useEffect, useState } from 'react'

export function TimerDisplay() {
  const { timeLeft, status } = useTimerStore()
  const [displayTime, setDisplayTime] = useState('00:00')

  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    setDisplayTime(
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    )
  }, [timeLeft])

  const getStatusColor = () => {
    switch (status) {
      case 'running':
        return 'text-primary'
      case 'pre-warning':
        return 'text-tertiary'
      case 'break':
        return 'text-secondary'
      case 'done':
        return 'text-error'
      default:
        return 'text-on-surface'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`text-8xl font-bold font-display ${getStatusColor()} transition-colors`}>
        {displayTime}
      </div>
      <p className="mt-4 text-xl capitalize text-on-surface-variant">
        {status === 'idle' ? 'Ready To Start' : status.replace('-', ' ')}
      </p>
    </div>
  )
}
