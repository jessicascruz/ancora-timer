'use client'
import { create } from 'zustand'

export type TimerStatus = 'idle' | 'running' | 'pre-warning' | 'break' | 'done'

interface TimerStore {
  duration: number
  breakDuration: number
  timeLeft: number
  status: TimerStatus
  showNoteModal: boolean
  showBreakSummary: boolean
  currentSessionId: string | null
  currentNoteId: string | null
  aiSummary: { doingNow?: string; nextStep?: string; openThought?: string } | null

  setDuration: (min: number) => void
  setBreakDuration: (min: number) => void
  startTimer: () => void
  pauseTimer: () => void
  resumeTimer: () => void
  resetTimer: () => void
  tickTimer: () => void
  triggerPreWarning: () => void
  completeSession: () => void
  startBreak: () => void
  endBreak: () => void
  openNoteModal: () => void
  closeNoteModal: () => void
  setCurrentSessionId: (id: string) => void
  setCurrentNoteId: (id: string) => void
  setAiSummary: (summary: TimerStore['aiSummary']) => void
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  duration:          25,
  breakDuration:     5,
  timeLeft:          25 * 60,
  status:            'idle',
  showNoteModal:     false,
  showBreakSummary:  false,
  currentSessionId:  null,
  currentNoteId:     null,
  aiSummary:         null,

  setDuration:      (min) => set({ duration: min, timeLeft: min * 60, status: 'idle' }),
  setBreakDuration: (min) => set({ breakDuration: min }),

  startTimer:  () => set({ status: 'running' }),
  pauseTimer:  () => set({ status: 'idle' }),
  resumeTimer: () => set({ status: 'running' }),
  resetTimer:  () => set((s) => ({ status: 'idle', timeLeft: s.duration * 60, showNoteModal: false })),

  tickTimer: () => {
    const { timeLeft, status, duration, breakDuration } = get()
    if (status === 'running' || status === 'pre-warning') {
      if (timeLeft === 90) {
        get().triggerPreWarning()
      } else if (timeLeft <= 0) {
        get().completeSession()
      } else {
        set({ timeLeft: timeLeft - 1 })
      }
    } else if (status === 'break') {
      if (timeLeft <= 0) {
        get().endBreak()
      } else {
        set({ timeLeft: timeLeft - 1 })
      }
    }
  },

  triggerPreWarning: () => set({ status: 'pre-warning', showNoteModal: true }),
  completeSession:   () => set({ status: 'break', showNoteModal: false }),
  startBreak:        () => set((s) => ({ timeLeft: s.breakDuration * 60 })),

  endBreak: () => set({
    status:           'idle',
    showBreakSummary: true,
    timeLeft:         get().duration * 60,
  }),

  openNoteModal:  () => set({ showNoteModal: true }),
  closeNoteModal: () => set({ showNoteModal: false }),

  setCurrentSessionId: (id) => set({ currentSessionId: id }),
  setCurrentNoteId:    (id) => set({ currentNoteId: id }),
  setAiSummary:        (s)  => set({ aiSummary: s }),
}))
