import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { diffLocalCalendarDays, formatLocalDateKey } from '../lib/date'

export interface Session {
  id: string
  mode: 'nature' | 'ocean' | 'construction'
  duration: number
  completedAt: string
  focusScore: number
}

interface SessionStore {
  selectedMode: Session['mode'] | null
  selectedDuration: number
  currentSession: Session | null
  history: Session[]
  totalFocusMinutes: number
  streak: number
  setMode: (mode: Session['mode']) => void
  setDuration: (minutes: number) => void
  startSession: () => void
  completeSession: (score: number) => void
  abandonSession: () => void
}

export const MIN_DURATION = 5
export const MAX_DURATION = 120
const DEFAULT_DURATION = 25

function clampDuration(minutes: number): number {
  return Math.max(MIN_DURATION, Math.min(MAX_DURATION, Math.round(minutes)))
}

function calcStreak(history: Session[]): number {
  if (history.length === 0) return 0

  const sorted = [...history].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
  )

  const today = formatLocalDateKey(new Date())
  const mostRecent = formatLocalDateKey(sorted[0].completedAt)

  if (diffLocalCalendarDays(today, mostRecent) > 1) return 0

  const uniqueDays = [...new Set(sorted.map((session) => formatLocalDateKey(session.completedAt)))]
  let streak = 1

  for (let i = 1; i < uniqueDays.length; i++) {
    if (diffLocalCalendarDays(uniqueDays[i - 1], uniqueDays[i]) === 1) {
      streak++
      continue
    }

    break
  }

  return streak
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      selectedMode: null,
      selectedDuration: DEFAULT_DURATION,
      currentSession: null,
      history: [],
      totalFocusMinutes: 0,
      streak: 0,

      setMode(mode) {
        set({ selectedMode: mode })
      },

      setDuration(minutes) {
        set({ selectedDuration: clampDuration(minutes) })
      },

      startSession() {
        const { selectedMode, selectedDuration } = get()
        if (!selectedMode) return

        const session: Session = {
          id: crypto.randomUUID(),
          mode: selectedMode,
          duration: selectedDuration,
          completedAt: '',
          focusScore: 0,
        }

        set({ currentSession: session })
      },

      completeSession(score) {
        const { currentSession, history, totalFocusMinutes } = get()
        if (!currentSession) return

        const completed: Session = {
          ...currentSession,
          completedAt: new Date().toISOString(),
          focusScore: Math.max(0, Math.min(100, score)),
        }

        const newHistory = [completed, ...history]

        set({
          currentSession: null,
          history: newHistory,
          totalFocusMinutes: totalFocusMinutes + completed.duration,
          streak: calcStreak(newHistory),
        })
      },

      abandonSession() {
        set({ currentSession: null })
      },
    }),
    {
      name: 'flowstate-sessions',
      partialize: (state) => ({
        selectedMode: state.selectedMode,
        selectedDuration: state.selectedDuration,
        history: state.history,
        totalFocusMinutes: state.totalFocusMinutes,
        streak: state.streak,
      }),
    },
  ),
)
