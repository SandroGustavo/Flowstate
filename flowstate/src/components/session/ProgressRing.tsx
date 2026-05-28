import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { TimerDisplay } from './TimerDisplay'
import { cn } from '../../lib/cn'

// Medidas do anel (base = 288px = w-72)
const SIZE   = 288
const CX     = SIZE / 2         // 144
const CY     = SIZE / 2         // 144
const R      = 118              // raio do círculo
const SW     = 12               // strokeWidth
const CIRC   = 2 * Math.PI * R  // circunferência ≈ 741.4

// Tokens do design system usados no gradiente SVG
const GRAD_START = '#7c3aed'  // primary-container
const GRAD_END   = '#5de6ff'  // secondary
const TRACK_CLR  = '#4a4455'  // outline-variant

interface ProgressRingProps {
  progress:     number      // 0 a 1
  timeLeft:     number      // segundos (para TimerDisplay)
  isPaused?:    boolean
  ambientIcon?: ReactNode   // ícone sutil no centro (opacity 30%)
  className?:   string
}

export function ProgressRing({
  progress,
  timeLeft,
  isPaused = false,
  ambientIcon,
  className,
}: ProgressRingProps) {
  const dashOffset = CIRC * (1 - Math.min(1, Math.max(0, progress)))

  return (
    <div
      className={cn('relative', className)}
      style={{ width: SIZE, height: SIZE }}
    >
      {/* SVG Ring */}
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="absolute inset-0"
        aria-hidden
      >
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor={GRAD_START} />
            <stop offset="100%" stopColor={GRAD_END} />
          </linearGradient>

          {/* Glow filter no arco */}
          <filter id="ring-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track (trilho do fundo) */}
        <circle
          cx={CX} cy={CY} r={R}
          fill="none"
          stroke={TRACK_CLR}
          strokeWidth={SW}
          opacity={0.35}
        />

        {/* Arco de progresso */}
        <motion.circle
          cx={CX} cy={CY} r={R}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth={SW}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          transform={`rotate(-90 ${CX} ${CY})`}
          filter="url(#ring-glow)"
        />
      </svg>

      {/* Centro — glass panel circular */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* relative aqui garante que o absolute do ícone fica contido no círculo */}
        <div
          className="relative glass-panel rounded-full flex items-center justify-center overflow-hidden"
          style={{ width: 208, height: 208 }}
        >
          {/* Ícone ambiente — fundo sutil 30% */}
          {ambientIcon && (
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none"
            >
              {ambientIcon}
            </div>
          )}

          {/* Timer */}
          <TimerDisplay
            timeLeft={timeLeft}
            isPaused={isPaused}
            className="relative z-10"
          />
        </div>
      </div>
    </div>
  )
}
