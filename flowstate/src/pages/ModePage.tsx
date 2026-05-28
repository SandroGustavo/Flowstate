import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Leaf, Waves, Hammer, ArrowRight } from 'lucide-react'
import { useSessionStore } from '../store/sessionStore'
import { TopNav, TopNavSpacer } from '../components/layout'
import { ModeCard }             from '../components/ui/ModeCard'
import { PrimaryButton }        from '../components/ui/PrimaryButton'
import { GhostButton }          from '../components/ui/GhostButton'
import { AmbientGlow }          from '../components/session/AmbientGlow'
import type { Session }         from '../store/sessionStore'

type Mode = Session['mode']

// ─── Dados dos modos ──────────────────────────────────────────────────────────

const MODES: {
  mode:        Mode
  title:       string
  description: string
  icon:        React.ReactNode
  image:       string
  accentColor: string
}[] = [
  {
    mode:        'nature',
    title:       'The Living Forest',
    description: 'Immerse in the calming rhythms of ancient trees. Let the living forest guide your mind into deep focus.',
    icon:        <Leaf size={22} strokeWidth={2} />,
    image:       'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
    accentColor: 'text-tertiary',
  },
  {
    mode:        'ocean',
    title:       'The Deep Abyss',
    description: 'Dive beneath the surface. Let the endless blue carry your thoughts into the flow state.',
    icon:        <Waves size={22} strokeWidth={2} />,
    image:       'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80',
    accentColor: 'text-secondary',
  },
  {
    mode:        'construction',
    title:       'The Forge',
    description: 'Harness the relentless drive of creation. Build without limits. Focus without mercy.',
    icon:        <Hammer size={22} strokeWidth={2} />,
    image:       'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    accentColor: 'text-primary',
  },
]

// ─── Animação de entrada ──────────────────────────────────────────────────────

const container = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function ModePage() {
  const navigate     = useNavigate()
  const selectedMode = useSessionStore((s) => s.selectedMode)
  const setMode      = useSessionStore((s) => s.setMode)

  return (
    <div className="relative bg-background min-h-screen">

      {/* Glow ambiente sutil */}
      <AmbientGlow
        color="primary-container"
        size={600}
        opacity={0.12}
        blur={160}
        className="fixed left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      {/* Nav com back arrow */}
      <TopNav
        hideModeBadge
        hideStreak
        leftSlot={
          <GhostButton
            size="sm"
            iconOnly
            icon={<ArrowLeft size={18} />}
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="-ml-1 mr-1"
          />
        }
        onLogoClick={() => navigate('/')}
      />
      <TopNavSpacer />

      {/* Conteúdo */}
      <motion.main
        className="flex flex-col min-h-[calc(100vh-52px)] px-6 pt-8 pb-36"
        variants={container}
        initial="hidden"
        animate="visible"
      >

        {/* Título */}
        <motion.div variants={fadeUp} className="mb-8">
          <h1 className="text-display-md text-on-surface tracking-tighter leading-none">
            Choose Your
          </h1>
          <h1 className="text-display-md gradient-text-primary tracking-tighter leading-none">
            Experience
          </h1>
          <p className="mt-3 text-body-sm text-on-surface-variant">
            Each environment shapes your focus differently.
          </p>
        </motion.div>

        {/* Grid de ModeCards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MODES.map(({ mode, title, description, icon, image, accentColor }) => (
            <motion.div key={mode} variants={fadeUp}>
              <ModeCard
                mode={mode}
                title={title}
                description={description}
                icon={icon}
                image={image}
                accentColor={accentColor}
                selected={selectedMode === mode}
                onSelect={() => setMode(mode)}
              />
            </motion.div>
          ))}
        </div>

      </motion.main>

      {/* ── CTA sticky bottom ── */}
      <div
        className="fixed bottom-0 inset-x-0 z-40 px-6 pb-8 pt-6"
        style={{
          background: 'linear-gradient(to top, #131315 60%, transparent)',
        }}
      >
        <div className="mx-auto max-w-sm">
          <PrimaryButton
            fullWidth
            size="lg"
            disabled={!selectedMode}
            icon={<ArrowRight size={18} />}
            iconPosition="right"
            onClick={() => navigate('/time')}
          >
            Continue
          </PrimaryButton>

          {!selectedMode && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-center text-xs text-on-surface-variant"
            >
              Select a mode to continue
            </motion.p>
          )}
        </div>
      </div>

    </div>
  )
}
