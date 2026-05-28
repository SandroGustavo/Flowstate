import { useCallback, useEffect, useRef, useState } from 'react'
import { useSessionStore } from '../store/sessionStore'

interface TimerState {
  timeLeft: number
  isRunning: boolean
  isPaused: boolean
  progress: number
  start: () => void
  pause: () => void
  resume: () => void
  reset: () => void
}

export function useTimer(): TimerState {
  const selectedDuration = useSessionStore((s) => s.selectedDuration)
  const currentSession = useSessionStore((s) => s.currentSession)
  const completeSession = useSessionStore((s) => s.completeSession)
  const startSession = useSessionStore((s) => s.startSession)
  const abandonSession = useSessionStore((s) => s.abandonSession)

  const totalSeconds = selectedDuration * 60

  const [timeLeft, setTimeLeft] = useState(totalSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // Mantém totalSeconds no ref para o efeito não re-registrar a cada render
  const totalRef = useRef(totalSeconds)
  useEffect(() => {
    totalRef.current = totalSeconds
  }, [totalSeconds])

  // Reseta o timer quando a duração muda e não há sessão ativa
  useEffect(() => {
    if (!isRunning && !isPaused) {
      setTimeLeft(totalSeconds)
    }
  }, [totalSeconds, isRunning, isPaused])

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTick = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    if (!isRunning || isPaused) return

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTick()
          setIsRunning(false)
          setIsPaused(false)
          // Score baseado em quanto tempo sobrou (chegou a 0 = score 100)
          completeSession(100)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return clearTick
  }, [isRunning, isPaused, completeSession])

  const start = useCallback(() => {
    if (isRunning) return
    setTimeLeft(totalRef.current)
    startSession()
    setIsRunning(true)
    setIsPaused(false)
  }, [isRunning, startSession])

  const pause = useCallback(() => {
    if (!isRunning || isPaused) return
    setIsPaused(true)
  }, [isRunning, isPaused])

  const resume = useCallback(() => {
    if (!isRunning || !isPaused) return
    setIsPaused(false)
  }, [isRunning, isPaused])

  const reset = useCallback(() => {
    clearTick()
    if (currentSession) abandonSession()
    setIsRunning(false)
    setIsPaused(false)
    setTimeLeft(totalRef.current)
  }, [currentSession, abandonSession])

  const progress = totalRef.current > 0 ? 1 - timeLeft / totalRef.current : 0

  return { timeLeft, isRunning, isPaused, progress, start, pause, resume, reset }
}
