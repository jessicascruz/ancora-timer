'use client'

import { useTimerStore } from '@/store/timerStore'

export function DurationPicker() {
  const { duration, setDuration } = useTimerStore()

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-lg">
      <label className="text-lg font-semibold text-gray-700">
        Focus Duration (minutes)
      </label>
      <input
        type="range"
        min="1"
        max="60"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        className="w-full max-w-xs"
      />
      <div className="text-3xl font-bold text-blue-600">{duration}</div>
      <div className="flex gap-2">
        {[15, 25, 45].map((min) => (
          <button
            key={min}
            onClick={() => setDuration(min)}
            className={`px-4 py-2 rounded ${
              duration === min
                ? 'bg-blue-600 text-white'
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
