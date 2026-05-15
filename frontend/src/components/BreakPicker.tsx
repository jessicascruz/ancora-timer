'use client'

import { useTimerStore } from '@/store/timerStore'

export function BreakPicker() {
  const { breakDuration, setBreakDuration } = useTimerStore()

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-lg">
      <label className="text-lg font-semibold text-gray-700">
        Break Duration (minutes)
      </label>
      <input
        type="range"
        min="1"
        max="30"
        value={breakDuration}
        onChange={(e) => setBreakDuration(Number(e.target.value))}
        className="w-full max-w-xs"
      />
      <div className="text-3xl font-bold text-green-600">{breakDuration}</div>
      <div className="flex gap-2">
        {[5, 10, 15].map((min) => (
          <button
            key={min}
            onClick={() => setBreakDuration(min)}
            className={`px-4 py-2 rounded ${
              breakDuration === min
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {min}m
          </button>
        ))}
      </div>
    </div>
  )
}
