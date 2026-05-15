'use client'

import { useTimerStore } from '@/store/timerStore'

export function BreakSummary() {
  const { showBreakSummary, aiSummary } = useTimerStore()

  if (!showBreakSummary) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Session Summary</h2>

        <div className="space-y-6">
          {aiSummary ? (
            <div className="bg-blue-50 border border-blue-200 rounded p-6">
              <h3 className="font-semibold text-blue-900 mb-3">AI Summary</h3>
              <p className="text-blue-800 leading-relaxed">{aiSummary}</p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded p-6">
              <p className="text-gray-600 italic">No AI summary available</p>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded p-6">
            <h3 className="font-semibold text-green-900 mb-3">Great work! 🎉</h3>
            <p className="text-green-800">
              Take a break and recharge. You've earned it!
            </p>
          </div>

          <button
            onClick={() => {
              // Store will handle state reset
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded"
          >
            Start Next Session
          </button>
        </div>
      </div>
    </div>
  )
}
