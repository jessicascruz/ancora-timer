'use client'
import { useState, useRef } from 'react'

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob,   setAudioBlob]   = useState<Blob | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const chunks        = useRef<Blob[]>([])

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder.current = new MediaRecorder(stream)
    chunks.current = []

    mediaRecorder.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data)
    }

    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'audio/webm' })
      setAudioBlob(blob)
      stream.getTracks().forEach((t) => t.stop())
    }

    mediaRecorder.current.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    mediaRecorder.current?.stop()
    setIsRecording(false)
  }

  const clearAudio = () => setAudioBlob(null)

  return { isRecording, audioBlob, startRecording, stopRecording, clearAudio }
}
