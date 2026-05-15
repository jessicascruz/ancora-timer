export function playWarningSound() {
  const ctx = new AudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.setValueAtTime(880, ctx.currentTime)
  osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1)
  osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2)
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.5)
}

export function playCompleteSound() {
  const ctx = new AudioContext()
  ;[523, 659, 784, 1047].forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.4)
    osc.start(ctx.currentTime + i * 0.15)
    osc.stop(ctx.currentTime + i * 0.15 + 0.4)
  })
}

export function playBreakEndSound() {
  const ctx = new AudioContext()
  ;[784, 659, 523].forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.2)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.5)
    osc.start(ctx.currentTime + i * 0.2)
    osc.stop(ctx.currentTime + i * 0.2 + 0.5)
  })
}
