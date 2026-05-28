import { formatLocalDateKey } from '../../lib/date'
import type { BarDay } from './WeeklyBarChart'

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function buildWeeklyData(
  history: { completedAt: string; duration: number }[],
): BarDay[] {
  const today = new Date()

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - index))

    const dateKey = formatLocalDateKey(date)
    const minutes = history
      .filter((session) => formatLocalDateKey(session.completedAt) === dateKey)
      .reduce((sum, session) => sum + session.duration, 0)

    return {
      dayIndex: date.getDay(),
      label: DAY_LABELS[date.getDay()],
      minutes,
      isToday: index === 6,
    }
  })
}
