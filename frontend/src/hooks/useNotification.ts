'use client'
import { useCallback } from 'react'
import toast from 'react-hot-toast'

export function useNotification() {
  const success = useCallback((message: string) => {
    toast.success(message)
  }, [])

  const error = useCallback((message: string) => {
    toast.error(message)
  }, [])

  const info = useCallback((message: string) => {
    toast(message)
  }, [])

  return { success, error, info }
}
