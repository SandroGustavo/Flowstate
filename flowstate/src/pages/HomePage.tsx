import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Play, Clock, Flame, Timer } from 'lucide-react'
import { useSessionStore } from '../store/sessionStore'
import { AmbientGlow }    from '../components/session/AmbientGlow'
import { StatCard }       from '../components/ui/StatCard'
import { PrimaryButton }  from '../components/ui/PrimaryButton'
import { GhostButton }    from '../components/ui/GhostButton'
import { formatLocalDateKey } from '../lib/date'

// ─── helpers ──────────────────────────────────────────────────────────────────

function todayMinutes(history: ReturnType<typeof useSessionStore.getState>['history']): number {
  const today = formatLocalDateKey(new Date())
  return history
    .filter((s) => formatLocalDateKey(s.completedAt) === today)
    .reduce((sum, s) => sum + s.duration, 0)
}

function formatMinutes(total: number): string {
  if (total === 0) return '—'
  if (total < 60)  return `${total}m`
  const h = Math.floor(total / 60)
  const m = total % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

// ─── Animação de entrada escalonada ──────────────────────────────────────────

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
}

const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function HomePage() {
  const navigate   = useNavigate()
  const history    = useSessionStore((s) => s.history)
  const streak     = useSessionStore((s) => s.streak)
  const todayMins  = todayMinutes(history)

  return (
    <div className="relative overflow-hidden bg-background min-h-screen">

      {/* ── Ambient glows fixos ── */}
      <AmbientGlow
        color="primary-container"
        size={520}
        opacity={0.2}
        blur={130}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />
      <AmbientGlow
        color="secondary"
        size={340}
        opacity={0.1}
        blur={120}
        delay={-4}
        className="fixed left-[35%] top-[30%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      {/* ── Conteúdo ── */}
      <motion.main
        className="relative z-10 flex flex-col items-center justify-center
                   min-h-screen px-6 gap-8"
        variants={container}
        initial="hidden"
        animate="visible"
      >

        {/* Logo */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center gap-2"
        >
          <span className="flex items-center justify-center
                           rounded-2xl bg-primary/10 p-4 mb-1">
            <Zap size={32} className="text-primary" strokeWidth={2.5} />
          </span>
          <h1 className="text-display-lg gradient-text-primary tracking-tighter leading-none">
            FlowState
          </h1>
        </motion.div>

        {/* Subtítulo */}
        <motion.p
          variants={fadeUp}
          className="text-body-sm text-on-surface-variant text-center
                     max-w-[240px] leading-relaxed"
        >
          Enter the void.{' '}
          <span className="text-on-surface">Find your flow.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center gap-3 w-full max-w-xs"
        >
          <PrimaryButton
            fullWidth
            size="lg"
            icon={<Play size={18} fill="currentColor" strokeWidth={0} />}
            onClick={() => navigate('/mode')}
          >
            Iniciar Foco
          </PrimaryButton>

          <GhostButton
            fullWidth
            size="md"
            icon={<Clock size={16} />}
            onClick={() => navigate('/history')}
          >
            Histórico
          </GhostButton>
        </motion.div>

        {/* Stats grid 2 colunas */}
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-2 gap-3 w-full max-w-xs"
        >
          <StatCard
            icon={<Timer size={18} />}
            label="Hoje"
            value={formatMinutes(todayMins)}
            accent="secondary"
            subtext={todayMins > 0 ? 'tempo em foco' : 'nenhuma sessão ainda'}
          />
          <StatCard
            icon={<Flame size={18} />}
            label="Sequência"
            value={streak > 0 ? `${streak}d` : '—'}
            accent="tertiary"
            subtext={streak > 1
              ? `${streak} dias seguidos`
              : streak === 1
              ? 'começou hoje'
              : 'comece agora'}
          />
        </motion.div>

      </motion.main>
    </div>
  )
}
