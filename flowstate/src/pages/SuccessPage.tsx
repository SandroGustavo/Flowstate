import { useEffect } from 'react'
import { useNavigate }  from 'react-router-dom'
import { motion }       from 'framer-motion'
import { Flower2, Timer, Target, Flame, Plus, History } from 'lucide-react'
import { useSessionStore } from '../store/sessionStore'
import { AmbientGlow }     from '../components/session/AmbientGlow'
import { StatCard }        from '../components/ui/StatCard'
import { PrimaryButton }   from '../components/ui/PrimaryButton'
import { GhostButton }     from '../components/ui/GhostButton'
import type { Session }    from '../store/sessionStore'

type Mode = Session['mode']

// ─── helpers ───────────────────────────────────────────────────────────────���──

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

const MODE_LABELS: Record<Mode, string> = {
  nature:       'Nature Mode',
  ocean:        'Ocean Mode',
  construction: 'Construction Mode',
}

// ─── Animação ─────────────────────────────────────────────────────────────────

const container = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

const bloom = {
  hidden:  { scale: 0, opacity: 0 },
  visible: {
    scale: 1, opacity: 1,
    transition: { type: 'spring', stiffness: 180, damping: 14, delay: 0.05 },
  },
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function SuccessPage() {
  const navigate = useNavigate()
  const history  = useSessionStore((s) => s.history)
  const streak   = useSessionStore((s) => s.streak)

  // Guard: sem sessão concluída → redireciona
  useEffect(() => {
    if (history.length === 0) navigate('/', { replace: true })
  }, [history.length, navigate])

  const last = history[0]
  if (!last) return null

  const subtitle = `${MODE_LABELS[last.mode]} · ${formatDuration(last.duration)}`
  const scoreLabel = `${last.focusScore}%`

  return (
    <div className="relative bg-background overflow-hidden">

      {/* Glow forte de fundo */}
      <AmbientGlow
        color="primary-container"
        size={700}
        opacity={0.3}
        blur={200}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />
      <AmbientGlow
        color="secondary"
        size={400}
        opacity={0.1}
        blur={150}
        delay={-3}
        className="fixed left-[60%] top-[30%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      <motion.main
        className="relative z-10 flex flex-col items-center justify-center
                   min-h-screen px-6 text-center gap-8"
        variants={container}
        initial="hidden"
        animate="visible"
      >

        {/* ── Ícone flor ── */}
        <motion.div variants={fadeUp} className="relative flex items-center justify-center">
          {/* Glow atrás do círculo */}
          <div
            aria-hidden
            className="absolute rounded-full pointer-events-none"
            style={{
              width:      200,
              height:     200,
              background: '#7c3aed',
              opacity:    0.2,
              filter:     'blur(40px)',
            }}
          />

          {/* Círculo com a flor */}
          <motion.div
            variants={bloom}
            className="relative w-32 h-32 rounded-full border-2 border-primary
                       glass-panel flex items-center justify-center"
          >
            <Flower2
              size={48}
              className="text-primary"
              fill="currentColor"
              strokeWidth={1}
            />
          </motion.div>
        </motion.div>

        {/* ── Título + subtítulo ── */}
        <motion.div variants={fadeUp} className="flex flex-col gap-2">
          <h1 className="text-display-lg text-primary tracking-tighter">
            Session Complete
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            {subtitle}
          </p>
        </motion.div>

        {/* ── Grid de stats ── */}
        <motion.div
          variants={fadeUp}
          className="w-full max-w-sm flex flex-col gap-3"
        >
          {/* Full width — Focused Time */}
          <StatCard
            icon={<Timer size={20} />}
            label="Focused Time"
            value={formatDuration(last.duration)}
            valueSize="display-lg"
            accent="primary"
            subtext="Keep this up every day."
          />

          {/* Half + Half */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<Target size={18} />}
              label="Focus Score"
              value={scoreLabel}
              valueSize="headline-lg"
              accent="secondary"
            />
            <StatCard
              icon={<Flame size={18} />}
              label="Streak"
              value={streak > 0 ? `${streak}d` : '—'}
              valueSize="headline-lg"
              accent="tertiary"
              subtext={streak > 1 ? `${streak} days` : undefined}
            />
          </div>
        </motion.div>

        {/* ── Botões ── */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col gap-3 w-full max-w-sm pb-8"
        >
          <PrimaryButton
            fullWidth
            size="lg"
            icon={<Plus size={18} />}
            onClick={() => navigate('/mode')}
          >
            New Session
          </PrimaryButton>

          <GhostButton
            fullWidth
            size="md"
            icon={<History size={16} />}
            onClick={() => navigate('/history')}
            className="uppercase tracking-widest text-xs"
          >
            View History
          </GhostButton>
        </motion.div>

      </motion.main>
    </div>
  )
}
