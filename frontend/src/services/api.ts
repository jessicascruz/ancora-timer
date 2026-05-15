import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
})

// Sessions
export const createSession = (data: { duration_minutes: number; break_minutes: number }) =>
  api.post('/sessions/', data).then((r) => r.data)

export const updateSession = (id: string, data: object) =>
  api.patch(`/sessions/${id}`, data).then((r) => r.data)

export const listSessions = () =>
  api.get('/sessions/').then((r) => r.data)

export const getSession = (id: string) =>
  api.get(`/sessions/${id}`).then((r) => r.data)

// Notes
export const createNote = (data: object) =>
  api.post('/notes/', data).then((r) => r.data)

export const listNotes = () =>
  api.get('/notes/').then((r) => r.data)

export const listNotesBySession = (sessionId: string) =>
  api.get(`/notes/session/${sessionId}`).then((r) => r.data)

// Audio
export const processAudio = async (noteId: string, audioBlob: Blob) => {
  const form = new FormData()
  form.append('file', audioBlob, 'audio.webm')
  return api.post(`/audio/process/${noteId}`, form).then((r) => r.data)
}

// Reports
export const getReportSummary = () =>
  api.get('/reports/summary').then((r) => r.data)
