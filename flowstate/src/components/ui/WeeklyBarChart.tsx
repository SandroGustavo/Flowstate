import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

const MAX_H = 64

export interface BarDay {
  dayIndex: number
  label: string
  minutes: number
  isToday: boolean
}

interface WeeklyBarChartProps {
  data: BarDay[]
  className?: string
}

export function WeeklyBarChart({ data, className }: WeeklyBarChartProps) {
  const maxMinutes = Math.max(...data.map((day) => day.minutes), 1)

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant/60">
        Weekly Progress
      </p>

      <div className="flex items-end gap-1.5" style={{ height: MAX_H }}>
        {data.map((day, index) => {
          const barH = day.minutes > 0
            ? Math.max(Math.round((day.minutes / maxMinutes) * MAX_H), 8)
            : 3

          const barClass = day.isToday
            ? 'bg-secondary shadow-[0_0_8px_2px_rgba(93,230,255,0.4)]'
            : day.minutes > 0
            ? 'bg-primary/50'
            : 'bg-outline-variant/20'

          return (
            <div key={index} className="flex flex-1 items-end">
              <motion.div
                className={cn('w-full rounded-t-sm', barClass)}
                initial={{ height: 0 }}
                animate={{ height: barH }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.06 }}
              />
            </div>
          )
        })}
      </div>

      <div className="flex gap-1.5">
        {data.map((day, index) => (
          <span
            key={index}
            className={cn(
              'flex-1 select-none text-center text-[10px] font-medium',
              day.isToday ? 'text-secondary' : 'text-on-surface-variant/40',
            )}
          >
            {day.label}
          </span>
        ))}
      </div>
    </div>
  )
}
