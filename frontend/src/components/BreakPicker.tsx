'use client'

import { useTimerStore } from '@/store/timerStore'
import { useState } from 'react'

export function BreakPicker() {
  const { breakDuration, setBreakDuration } = useTimerStore()
  const [customInput, setCustomInput] = useState('')

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = Number(customInput)
    if (value > 0 && value <= 999) {
      setBreakDuration(value)
      setCustomInput('')
    }
  }

  return (
    <div className="glass-panel flex flex-col items-center gap-4 p-6">
      <label className="text-lg font-semibold font-display text-on-surface">
        Break Duration (minutes)
      </label>
      <input
        type="range"
        min="1"
        max="30"
        value={breakDuration}
        onChange={(e) => setBreakDuration(Number(e.target.value))}
        className="w-full max-w-xs accent-secondary"
      />
      <div className="text-3xl font-bold font-display text-secondary">{breakDuration}</div>
      <div className="flex gap-2">
        {[5, 10, 15].map((min) => (
          <button
            key={min}
            onClick={() => setBreakDuration(min)}
            className={`px-4 py-2 rounded transition-all ${
              breakDuration === min
                ? 'bg-secondary/20 text-secondary font-semibold'
                : 'bg-white/5 text-on-surface hover:bg-white/10'
            }`}
          >
            {min}m
          </button>
        ))}
      </div>
      <form onSubmit={handleCustomSubmit} className="flex gap-2 mt-2">
        <input
          type="number"
          min="1"
          max="999"
          placeholder="Custom"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          className="w-20 px-2 py-1 bg-white/5 border border-outline-variant text-on-surface rounded text-center focus:outline-none focus:border-secondary focus:bg-white/10 transition-all"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-secondary/20 text-secondary rounded hover:bg-secondary/30 transition-all font-medium text-sm"
        >
          Set
        </button>
      </form>
    </div>
  )
}
