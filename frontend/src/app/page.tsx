'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto py-16">
      <div className="text-center space-y-8">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Ancora Timer ⏱️
          </h1>
          <p className="text-xl text-gray-600">
            Intelligent Pomodoro timer with AI-powered note extraction
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-4xl mb-4">⏰</div>
            <h3 className="text-lg font-semibold mb-2">Focus Timer</h3>
            <p className="text-gray-600 text-sm">
              Customizable Pomodoro sessions with audio notifications
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-lg font-semibold mb-2">Voice Notes</h3>
            <p className="text-gray-600 text-sm">
              Record audio notes and let AI extract key insights
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600 text-sm">
              Track productivity and visualize your progress
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href="/timer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition"
          >
            Start Timer
          </Link>

          <div className="flex gap-4 justify-center">
            <Link
              href="/historico"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              View History →
            </Link>
            <Link
              href="/relatorios"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              See Reports →
            </Link>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-12">
          <p className="text-blue-900">
            💡 Tip: Start a session, take notes during your focus time, record voice memos, and get AI-generated summaries of your work!
          </p>
        </div>
      </div>
    </div>
  )
}
