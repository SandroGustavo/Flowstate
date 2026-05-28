import { cn } from '../../lib/cn'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

interface TimerDisplayProps {
  timeLeft: number     // segundos restantes
  isPaused?: boolean
  className?: string
}

export function TimerDisplay({ timeLeft, isPaused = false, className }: TimerDisplayProps) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className={cn('flex flex-col items-center gap-1 select-none', className)}>
      <span
        className={cn(
          'text-display-lg tabular-nums font-bold text-on-surface transition-opacity duration-500',
          isPaused && 'opacity-50',
        )}
      >
        {pad(minutes)}
        <span className="opacity-60 mx-0.5 animate-pulse">:</span>
        {pad(seconds)}
      </span>
      {isPaused && (
        <span className="text-xs font-semibold tracking-widest uppercase text-primary animate-fade-in">
          Pausado
        </span>
      )}
    </div>
  )
}
