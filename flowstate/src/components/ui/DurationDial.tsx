import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../lib/cn'

// ─── Medidas do dial ─────────────────────────────────────────────────────────
const SIZE   = 256          // w-64 h-64
const CX     = SIZE / 2     // 128
const CY     = SIZE / 2     // 128
const R_DASH = 118          // raio do anel tracejado

interface DurationDialProps {
  value:      number    // minutos atuais
  className?: string
}

export function DurationDial({ value, className }: DurationDialProps) {
  return (
    <div className={cn('relative w-64 h-64 flex-shrink-0', className)}>

      {/* ── Anel externo estático ── */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full border border-white/5"
      />

      {/* ── Anel tracejado girando 360° em 60 s ── */}
      <motion.svg
        className="absolute inset-0 pointer-events-none"
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-hidden
        style={{ transformOrigin: `${CX}px ${CY}px` }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, repeatType: 'loop', duration: 60, ease: 'linear' }}
      >
        <circle
          cx={CX}
          cy={CY}
          r={R_DASH}
          fill="none"
          stroke="white"
          strokeWidth={1.5}
          strokeDasharray="6 9"
          opacity={0.3}
        />
      </motion.svg>

      {/* ── Ponto indicador cyan — topo do anel ── */}
      <span
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 z-10"
        style={{ top: -6 }}
      >
        <span
          className="block w-3 h-3 rounded-full bg-secondary"
          style={{
            boxShadow: '0 0 10px 3px rgba(93, 230, 255, 0.75), 0 0 4px 1px rgba(93, 230, 255, 0.5)',
          }}
        />
      </span>

      {/* ── Centro: glass-panel circular ── */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="glass-panel rounded-full w-40 h-40 flex flex-col
                     items-center justify-center gap-1 overflow-hidden"
        >
          {/* Número animado quando value muda */}
          <AnimatePresence mode="wait">
            <motion.span
              key={value}
              className="text-display-lg text-primary tabular-nums leading-none"
              initial={{ opacity: 0, y: 10,  scale: 0.8  }}
              animate={{ opacity: 1, y: 0,   scale: 1    }}
              exit={{   opacity: 0, y: -10, scale: 1.15  }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {value}
            </motion.span>
          </AnimatePresence>

          <span
            className="text-[10px] font-semibold tracking-[0.22em] uppercase
                       text-on-surface-variant select-none"
          >
            MINUTES
          </span>
        </div>
      </div>

    </div>
  )
}
