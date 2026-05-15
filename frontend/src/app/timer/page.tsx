'use client'

import {
  TimerDisplay,
  TimerControls,
  DurationPicker,
  BreakPicker,
  NoteModal,
  BreakSummary,
} from '@/components'
import { useTimer } from '@/hooks'

export default function TimerPage() {
  useTimer()

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TimerDisplay />
          <TimerControls />
        </div>

        <div className="space-y-4">
          <DurationPicker />
          <BreakPicker />
        </div>
      </div>

      <NoteModal />
      <BreakSummary />
    </div>
  )
}
