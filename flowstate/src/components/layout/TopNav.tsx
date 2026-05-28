import { Zap, Flame, Waves, Construction, TreePine } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSessionStore } from '../../store/sessionStore'
import { GhostButton } from '../ui/GhostButton'
import { cn } from '../../lib/cn'

const modeConfig = {
  nature:       { label: 'Nature',       icon: TreePine,     color: 'text-tertiary  bg-tertiary/10' },
  ocean:        { label: 'Ocean',        icon: Waves,        color: 'text-secondary bg-secondary/10' },
  construction: { label: 'Construction', icon: Construction, color: 'text-primary   bg-primary/10' },
} as const

interface TopNavProps {
  onLogoClick?:  () => void
  leftSlot?:     React.ReactNode   // slot antes do logo (ex.: back arrow)
  rightSlot?:    React.ReactNode
  hideStreak?:   boolean
  hideModeBadge?: boolean
}

export function TopNav({
  onLogoClick,
  leftSlot,
  rightSlot,
  hideStreak    = false,
  hideModeBadge = false,
}: TopNavProps) {
  const selectedMode    = useSessionStore((s) => s.selectedMode)
  const currentSession  = useSessionStore((s) => s.currentSession)
  const streak          = useSessionStore((s) => s.streak)

  const activeMode = hideModeBadge ? null : (currentSession?.mode ?? selectedMode)

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50',
        'px-6 py-3',
        'border-b border-outline-variant/30',
      )}
      style={{
        background: 'color-mix(in srgb, #131315 85%, transparent)',
        backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
      }}
    >
      <nav className="mx-auto flex max-w-3xl items-center justify-between gap-3">

        {/* Left — optional back arrow + logo */}
        <div className="flex items-center gap-1">
          {leftSlot}
          <motion.button
            onClick={onLogoClick}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-primary/60 rounded-lg transition-opacity duration-300
                       hover:opacity-80"
          >
            <span className="flex items-center justify-center rounded-lg bg-primary/10 p-1.5">
              <Zap size={16} className="text-primary" />
            </span>
            <span className="text-base font-bold tracking-tight text-on-surface">
              Flow<span className="text-primary">State</span>
            </span>
          </motion.button>
        </div>

        {/* Center — mode badge */}
        {activeMode && (
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex-1 flex justify-center"
          >
            {(() => {
              const cfg = modeConfig[activeMode]
              const Icon = cfg.icon
              return (
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1',
                    'text-xs font-semibold transition-colors duration-300',
                    cfg.color,
                  )}
                >
                  <Icon size={12} strokeWidth={2.5} />
                  {cfg.label}
                  {currentSession && (
                    <span className="ml-0.5 size-1.5 rounded-full bg-current animate-pulse" />
                  )}
                </span>
              )
            })()}
          </motion.div>
        )}

        {/* Right — streak + slot */}
        <div className="flex items-center gap-2">
          {!hideStreak && streak > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-1 rounded-full bg-error/10 px-2.5 py-1
                         text-xs font-semibold text-error transition-colors duration-300"
              title={`${streak} dia${streak !== 1 ? 's' : ''} seguido${streak !== 1 ? 's' : ''}`}
            >
              <Flame size={12} strokeWidth={2.5} />
              {streak}
            </motion.div>
          )}

          {rightSlot ?? (
            <GhostButton
              size="sm"
              iconOnly
              icon={
                <span className="text-xs font-bold text-on-surface-variant">•••</span>
              }
              aria-label="Menu"
            />
          )}
        </div>

      </nav>
    </header>
  )
}

/** Spacer que compensa a altura do TopNav fixo (52px) */
export function TopNavSpacer() {
  return <div className="h-[52px]" aria-hidden />
}
