import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '../../lib/cn'

interface Trend {
  value: number   // positivo = alta, negativo = baixa, 0 = estável
  label?: string
}

type ValueSize = 'default' | 'display-lg' | 'headline-lg'

const valueSizeClass: Record<ValueSize, string> = {
  'default':     'text-2xl',
  'display-lg':  'text-display-lg',
  'headline-lg': 'text-headline-lg',
}

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  subtext?: string
  trend?: Trend
  accent?: 'primary' | 'secondary' | 'tertiary' | 'error'
  valueSize?: ValueSize
  animateDelay?: number
  className?: string
}

const accentClasses = {
  primary:   'text-primary',
  secondary: 'text-secondary',
  tertiary:  'text-tertiary',
  error:     'text-error',
}

const accentIconBg = {
  primary:   'bg-primary/10',
  secondary: 'bg-secondary/10',
  tertiary:  'bg-tertiary/10',
  error:     'bg-error/10',
}

function TrendBadge({ trend }: { trend: Trend }) {
  const isUp     = trend.value > 0
  const isDown   = trend.value < 0
  const isNeutral = trend.value === 0

  const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus
  const colorClass = isUp
    ? 'text-tertiary bg-tertiary/10'
    : isDown
    ? 'text-error bg-error/10'
    : 'text-on-surface-variant bg-surface-container-high'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        'transition-colors duration-300',
        colorClass,
      )}
    >
      <Icon size={11} strokeWidth={2.5} />
      {!isNeutral && `${Math.abs(trend.value)}%`}
      {trend.label && <span className="opacity-70">{trend.label}</span>}
    </span>
  )
}

export function StatCard({
  icon,
  label,
  value,
  subtext,
  trend,
  accent = 'primary',
  valueSize = 'default',
  animateDelay = 0,
  className,
}: StatCardProps) {
  return (
    <motion.div
      className={cn('glass-panel p-5 flex flex-col gap-3', className)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: animateDelay }}
    >
      {/* Icon + trend row */}
      <div className="flex items-start justify-between">
        <span
          className={cn(
            'flex items-center justify-center rounded-xl p-2.5',
            accentIconBg[accent],
            accentClasses[accent],
          )}
        >
          {icon}
        </span>
        {trend && <TrendBadge trend={trend} />}
      </div>

      {/* Value */}
      <div className="flex flex-col gap-0.5">
        <span className={cn(valueSizeClass[valueSize], 'font-bold leading-none tabular-nums', accentClasses[accent])}>
          {value}
        </span>
        <span className="text-xs font-medium text-on-surface-variant tracking-wide uppercase">
          {label}
        </span>
      </div>

      {/* Subtext */}
      {subtext && (
        <p className="text-xs text-on-surface-variant/70 leading-relaxed">{subtext}</p>
      )}
    </motion.div>
  )
}
