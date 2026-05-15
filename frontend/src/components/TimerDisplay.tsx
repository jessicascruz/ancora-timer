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
        return 'text-green-600'
      case 'pre-warning':
        return 'text-yellow-600'
      case 'break':
        return 'text-blue-600'
      case 'done':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`text-8xl font-bold font-mono ${getStatusColor()} transition-colors`}>
        {displayTime}
      </div>
      <p className="mt-4 text-xl capitalize text-gray-600">
        {status === 'idle' ? 'Ready to start' : status.replace('-', ' ')}
      </p>
    </div>
  )
}
