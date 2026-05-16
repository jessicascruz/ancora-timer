'use client'

import { useState, useEffect } from 'react'
import { useTimerStore } from '@/store/timerStore'

export default function Home() {
  const { duration, breakDuration, setDuration } = useTimerStore()
  const [mode, setMode] = useState<'focus' | 'break'>('focus')
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [isReflectionOpen, setIsReflectionOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [customDuration, setCustomDuration] = useState(duration)
  const [timerDisplay, setTimerDisplay] = useState('25:00')

  const currentDuration = mode === 'focus' ? duration : breakDuration
  const primaryColor = mode === 'focus' ? '#c4c1fb' : '#4edea3'

  useEffect(() => {
    setTimerDisplay(`${currentDuration}:00`)
    setCustomDuration(currentDuration)
  }, [currentDuration])

  const handleSetTimer = (minutes: number) => {
    setDuration(minutes)
    setTimerDisplay(`${minutes}:00`)
  }

  const handleConfigApply = () => {
    setDuration(customDuration)
    setIsConfigOpen(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-2 md:hidden bg-surface/10 backdrop-blur-xl border-b border-white/10 shadow-sm">
        <div className="text-2xl font-bold text-secondary">DeepFlow AI</div>
        <span className="material-symbols-outlined text-secondary">account_circle</span>
      </header>

      <nav className="hidden md:flex flex-col h-screen p-6 bg-surface/5 backdrop-blur-2xl border-r border-white/5 w-64 fixed left-0 top-0">
        <div className="mb-16">
          <div className="text-2xl font-bold text-secondary">DeepFlow</div>
          <div className="text-xs uppercase tracking-widest text-on-surface-variant mt-1">Deep Work Mode</div>
        </div>
        <div className="flex flex-col gap-2 flex-grow">
          <a className="flex items-center gap-4 bg-secondary-container/20 text-secondary rounded-xl p-4 hover:bg-secondary-container/30 transition-all" href="#">
            <span className="material-symbols-outlined">timer</span>
            <span>Timer</span>
          </a>
          <a className="flex items-center gap-4 text-on-surface-variant p-4 hover:bg-white/5 rounded-xl transition-all" href="#">
            <span className="material-symbols-outlined">history</span>
            <span>History</span>
          </a>
          <a className="flex items-center gap-4 text-on-surface-variant p-4 hover:bg-white/5 rounded-xl transition-all" href="#">
            <span className="material-symbols-outlined">bar_chart</span>
            <span>Reports</span>
          </a>
          <a className="flex items-center gap-4 text-on-surface-variant p-4 hover:bg-white/5 rounded-xl transition-all" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </a>
        </div>
        <button className="w-full bg-secondary text-on-secondary-fixed font-bold py-4 rounded-xl hover:opacity-90 transition-all">
          Start Session
        </button>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center relative p-6 md:ml-64 md:pt-0 pt-16">
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-surface via-primary-container/20 to-surface overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="glass-panel flex p-1 rounded-full mb-16">
          <button
            onClick={() => setMode('focus')}
            className={`px-6 py-2 rounded-full font-body-md transition-all ${
              mode === 'focus'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Focus
          </button>
          <button
            onClick={() => setMode('break')}
            className={`px-6 py-2 rounded-full font-body-md transition-all ${
              mode === 'break'
                ? 'bg-secondary text-on-secondary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Break
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-32">
          <svg className="w-72 h-72 md:w-96 md:h-96 -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="12"
              className="text-white/5"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="transparent"
              stroke={primaryColor}
              strokeWidth="12"
              strokeDasharray="565"
              strokeDashoffset="100"
              className="transition-all duration-500 ease-linear"
            />
          </svg>
          <div className="absolute flex flex-col items-center text-center">
            <span className="text-6xl md:text-8xl font-bold tracking-tight text-on-background leading-none">
              {timerDisplay}
            </span>
            <span className="text-xs uppercase tracking-widest text-on-surface-variant mt-2">
              {mode === 'focus' ? 'Stay Focused' : 'Taking a Break'}
            </span>
          </div>
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-between items-center gap-2">
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
              {[25, 45, 50, 90].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => handleSetTimer(minutes)}
                  className={`px-4 py-2 rounded-lg transition-all font-body-md text-sm ${
                    currentDuration === minutes
                      ? 'bg-white/20 text-on-background'
                      : 'hover:bg-white/10 text-on-surface-variant'
                  }`}
                >
                  {minutes}m
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsConfigOpen(true)}
              className="glass-panel p-4 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all"
            >
              <span className="material-symbols-outlined text-secondary">tune</span>
            </button>
          </div>

          <div className="flex justify-center items-center gap-16">
            <button className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all">
              <span className="material-symbols-outlined">replay</span>
            </button>
            <button className="w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-5xl">play_arrow</span>
            </button>
            <button className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all">
              <span className="material-symbols-outlined">skip_next</span>
            </button>
          </div>
        </div>
      </main>

      {isConfigOpen && (
        <div className="fixed inset-0 z-60 bg-surface/80 backdrop-blur-md flex items-center justify-center">
          <div className="glass-panel p-8 rounded-2xl w-full max-w-sm mx-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-on-background">Custom Session</h3>
              <button onClick={() => setIsConfigOpen(false)} className="material-symbols-outlined">
                close
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant">Duration</label>
                  <span className="text-secondary font-bold">{customDuration} min</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="180"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-secondary"
                />
              </div>
              <button
                onClick={handleConfigApply}
                className="w-full bg-secondary text-on-secondary-fixed py-4 rounded-xl font-bold hover:opacity-90 transition-all"
              >
                Apply Config
              </button>
            </div>
          </div>
        </div>
      )}

      {isReflectionOpen && (
        <div className="fixed inset-0 z-70 bg-surface/90 backdrop-blur-xl flex items-center justify-center">
          <div className="w-full max-w-lg mx-6 p-8 glass-panel rounded-3xl space-y-6">
            <header className="text-center">
              <div className="inline-block px-4 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold mb-2">
                REFLEXÃO DE SESSÃO
              </div>
              <h2 className="text-3xl font-bold text-on-background">Flow Checkpoint</h2>
              <p className="text-on-surface-variant text-sm mt-2">Reserve 90 segundos para consolidar sua jornada.</p>
            </header>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-secondary text-xs font-bold uppercase">O QUE ESTOU FAZENDO</label>
                <input
                  type="text"
                  placeholder="Ex: Refatorando o módulo de autenticação"
                  className="w-full bg-white/5 border-b border-white/20 focus:outline-none focus:border-secondary py-2 text-on-background placeholder:text-white/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-secondary text-xs font-bold uppercase">Próximo Passo</label>
                <input
                  type="text"
                  placeholder="Ex: Implementar testes unitários"
                  className="w-full bg-white/5 border-b border-white/20 focus:outline-none focus:border-secondary py-2 text-on-background placeholder:text-white/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-secondary text-xs font-bold uppercase">Pensamento Aberto</label>
                <textarea
                  placeholder="Qualquer distração ou ideia que surgiu..."
                  rows={2}
                  className="w-full bg-white/5 border-b border-white/20 focus:outline-none focus:border-secondary py-2 text-on-background placeholder:text-white/20 transition-all resize-none"
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`flex items-center gap-4 px-8 py-4 rounded-full transition-all font-bold ${
                  isRecording
                    ? 'bg-secondary/20 border border-secondary/50 text-on-background'
                    : 'bg-white/10 text-on-background hover:bg-white/20'
                }`}
              >
                <span className="material-symbols-outlined text-secondary">mic</span>
                <span>{isRecording ? 'Gravando...' : 'Gravar Áudio'}</span>
              </button>
              <button
                onClick={() => setIsReflectionOpen(false)}
                className="text-on-surface-variant text-xs font-bold hover:text-white transition-colors"
              >
                IGNORAR POR ENQUANTO
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
