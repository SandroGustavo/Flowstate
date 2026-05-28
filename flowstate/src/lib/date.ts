const DAY_IN_MS = 86_400_000

function toDate(value: Date | string): Date {
  return value instanceof Date ? new Date(value) : new Date(value)
}

export function formatLocalDateKey(value: Date | string): string {
  const date = toDate(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function diffLocalCalendarDays(from: Date | string, to: Date | string): number {
  const start = toDate(from)
  const end = toDate(to)

  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)

  return Math.round((start.getTime() - end.getTime()) / DAY_IN_MS)
}
