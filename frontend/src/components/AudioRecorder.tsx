'use client'

import { useAudioRecorder } from '@/hooks/useAudioRecorder'

export function AudioRecorder() {
  const { isRecording, audioBlob, startRecording, stopRecording, clearAudio } = useAudioRecorder()

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Audio Recording</h3>

      {isRecording && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
          <span className="text-red-700 font-semibold">Recording in progress...</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition"
        >
          Start Recording
        </button>
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition"
        >
          Stop Recording
        </button>
        {audioBlob && (
          <button
            onClick={clearAudio}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Clear
          </button>
        )}
      </div>

      {audioBlob && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-700 font-semibold flex items-center gap-2">
            ✓ Audio recorded ({(audioBlob.size / 1024).toFixed(1)} KB)
          </p>
        </div>
      )}
    </div>
  )
}
