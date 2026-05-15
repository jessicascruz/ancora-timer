'use client'

import { useTimerStore } from '@/store/timerStore'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import { useNotification } from '@/hooks/useNotification'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createNote, processAudio } from '@/services/api'
import { useState } from 'react'

const noteSchema = z.object({
  doing_now: z.string().optional(),
  next_step: z.string().optional(),
  open_thought: z.string().optional(),
})

type NoteFormData = z.infer<typeof noteSchema>

export function NoteModal() {
  const { showNoteModal, closeNoteModal, currentSessionId, currentNoteId, setCurrentNoteId, setAiSummary } = useTimerStore()
  const { audioBlob, isRecording, startRecording, stopRecording } = useAudioRecorder()
  const notification = useNotification()
  const [isSaving, setIsSaving] = useState(false)

  const { register, handleSubmit, reset, watch } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
  })

  const onSubmit = async (data: NoteFormData) => {
    if (!currentSessionId) {
      notification.error('No active session')
      return
    }

    setIsSaving(true)

    try {
      const noteData = await createNote({
        session_id: currentSessionId,
        ...data,
      })

      setCurrentNoteId(noteData.id)

      if (audioBlob) {
        const audioData = await processAudio(noteData.id, audioBlob)
        setAiSummary(audioData.ai_summary)
      }

      notification.success('Note saved successfully')
      reset()
      closeNoteModal()
    } catch (error) {
      notification.error('Failed to save note')
    } finally {
      setIsSaving(false)
    }
  }

  if (!showNoteModal) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Session Notes</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">What are you doing?</label>
            <textarea
              {...register('doing_now')}
              className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe your current task..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">What's next?</label>
            <textarea
              {...register('next_step')}
              className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="What's your next step?"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Open thought</label>
            <textarea
              {...register('open_thought')}
              className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Any thoughts or ideas?"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm font-semibold mb-3">Audio Recording</p>
            {isRecording && <div className="text-red-600 font-semibold mb-2">● Recording...</div>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={startRecording}
                disabled={isRecording}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
              >
                Start Recording
              </button>
              <button
                type="button"
                onClick={stopRecording}
                disabled={!isRecording}
                className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
              >
                Stop Recording
              </button>
            </div>
            {audioBlob && <p className="text-green-600 text-sm mt-2">Audio recorded ✓</p>}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={closeNoteModal}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded font-semibold"
            >
              {isSaving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
