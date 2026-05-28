import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Leaf, Minus, Play, Plus, Waves, Hammer } from 'lucide-react'
import { useSessionStore, MAX_DURATION, MIN_DURATION } from '../store/sessionStore'
import { TopNav, TopNavSpacer } from '../components/layout'
import { DurationDial } from '../components/ui/DurationDial'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { GhostButton } from '../components/ui/GhostButton'
import { AmbientGlow } from '../components/session/AmbientGlow'
import { cn } from '../lib/cn'
import type { Session } from '../store/sessionStore'

type Mode = Session['mode']

const MODE_META: Record<Mode, {
  subtitle: string
  Icon: typeof Leaf
  accentClass: string
}> = {
  nature: {
    subtitle: 'Let the forest hold your time.',
    Icon: Leaf,
    accentClass: 'text-tertiary bg-tertiary/10',
  },
  ocean: {
    subtitle: 'Let the tide define your focus.',
    Icon: Waves,
    accentClass: 'text-secondary bg-secondary/10',
  },
  construction: {
    subtitle: 'Set the rhythm of the forge.',
    Icon: Hammer,
    accentClass: 'text-primary bg-primary/10',
  },
}

const PRESETS = [15, 25, 45] as const
const QUICK_STEP = 5

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
}

export function TimePage() {
  const navigate = useNavigate()
  const selectedMode = useSessionStore((state) => state.selectedMode)
  const selectedDuration = useSessionStore((state) => state.selectedDuration)
  const setDuration = useSessionStore((state) => state.setDuration)

  useEffect(() => {
    if (!selectedMode) {
      navigate('/mode', { replace: true })
    }
  }, [selectedMode, navigate])

  const meta = selectedMode ? MODE_META[selectedMode] : null

  if (!selectedMode || !meta) return null

  return (
    <div className="relative min-h-screen bg-background">
      <AmbientGlow
        color={selectedMode === 'ocean' ? 'secondary' : selectedMode === 'nature' ? 'tertiary' : 'primary-container'}
        size={500}
        opacity={0.13}
        blur={150}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      <TopNav
        hideModeBadge
        hideStreak
        leftSlot={
          <GhostButton
            size="sm"
            iconOnly
            icon={<span className="text-on-surface-variant">←</span>}
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="-ml-1 mr-1"
          />
        }
        onLogoClick={() => navigate('/')}
      />
      <TopNavSpacer />

      <motion.main
        className="flex min-h-[calc(100vh-52px)] flex-col items-center gap-8 px-6 pb-36 pt-10"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} className="w-full max-w-xs text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className={cn('flex items-center justify-center rounded-lg p-2', meta.accentClass)}>
              <meta.Icon size={16} strokeWidth={2.5} />
            </span>
            <h1 className="text-display-md tracking-tighter text-on-surface">
              Set your intention
            </h1>
          </div>
          <p className="text-body-sm text-on-surface-variant">
            {meta.subtitle}
          </p>
        </motion.div>

        <motion.div variants={fadeUp}>
          <DurationDial value={selectedDuration} />
        </motion.div>

        <motion.div variants={fadeUp} className="flex w-full max-w-xs gap-3">
          {PRESETS.map((preset) => {
            const active = selectedDuration === preset

            return (
              <motion.button
                key={preset}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.12 }}
                onClick={() => setDuration(preset)}
                className={cn(
                  'flex flex-1 flex-col items-center gap-0.5 rounded-xl py-4 font-semibold transition-all duration-300',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                  active
                    ? 'glass-panel-active text-primary'
                    : 'glass-panel text-on-surface-variant hover:text-on-surface',
                )}
                aria-pressed={active}
              >
                <span className="text-lg leading-none tabular-nums">{preset}</span>
                <span className="text-[10px] uppercase tracking-widest opacity-60">min</span>
              </motion.button>
            )
          })}
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="glass-panel-inset flex w-full max-w-xs flex-col gap-4 rounded-3xl p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant/60">
                Fine tuning
              </p>
              <p className="mt-1 text-sm text-on-surface">
                Choose any duration between {MIN_DURATION} and {MAX_DURATION} minutes.
              </p>
            </div>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {selectedDuration} min
            </span>
          </div>

          <div className="flex items-center gap-3">
            <GhostButton
              size="sm"
              iconOnly
              icon={<Minus size={16} />}
              onClick={() => setDuration(selectedDuration - QUICK_STEP)}
              disabled={selectedDuration <= MIN_DURATION}
              aria-label={`Diminuir ${QUICK_STEP} minutos`}
              className="h-11 w-11 rounded-full border border-outline-variant/30 bg-surface-container-low"
            />

            <input
              type="range"
              min={MIN_DURATION}
              max={MAX_DURATION}
              step={1}
              value={selectedDuration}
              onChange={(event) => setDuration(Number(event.target.value))}
              className="range-slider h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-container-high"
              aria-label="Selecionar duração do timer"
            />

            <GhostButton
              size="sm"
              iconOnly
              icon={<Plus size={16} />}
              onClick={() => setDuration(selectedDuration + QUICK_STEP)}
              disabled={selectedDuration >= MAX_DURATION}
              aria-label={`Aumentar ${QUICK_STEP} minutos`}
              className="h-11 w-11 rounded-full border border-outline-variant/30 bg-surface-container-low"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-on-surface-variant/60">
            <span>{MIN_DURATION} min</span>
            <span>1 min precision</span>
            <span>{MAX_DURATION} min</span>
          </div>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="-mt-2 text-center text-xs text-on-surface-variant/50"
        >
          Use a preset for speed or adjust the slider for a custom session.
        </motion.p>
      </motion.main>

      <div
        className="fixed inset-x-0 bottom-0 z-40 px-6 pb-8 pt-6"
        style={{ background: 'linear-gradient(to top, #131315 60%, transparent)' }}
      >
        <div className="mx-auto max-w-xs">
          <PrimaryButton
            fullWidth
            size="lg"
            icon={<Play size={18} fill="currentColor" strokeWidth={0} />}
            onClick={() => navigate('/session')}
          >
            Start Session
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
