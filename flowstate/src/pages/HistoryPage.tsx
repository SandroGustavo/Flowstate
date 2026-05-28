import { useNavigate }  from 'react-router-dom'
import { motion }       from 'framer-motion'
import {
  Clock, TreePine, Waves, Hammer,
  Zap, InboxIcon, ArrowLeft,
} from 'lucide-react'
import { useSessionStore }  from '../store/sessionStore'
import { TopNav, TopNavSpacer } from '../components/layout'
import { StatCard }         from '../components/ui/StatCard'
import { GhostButton }      from '../components/ui/GhostButton'
import { WeeklyBarChart } from '../components/ui/WeeklyBarChart'
import { buildWeeklyData } from '../components/ui/weeklyData'
import { AmbientGlow }      from '../components/session/AmbientGlow'
import { cn }               from '../lib/cn'
import { diffLocalCalendarDays } from '../lib/date'
import type { Session }     from '../store/sessionStore'

type Mode = Session['mode']

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatTotalHours(minutes: number): string {
  if (minutes === 0) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

function formatSessionDate(iso: string): string {
  if (!iso) return ''
  const diffDays = diffLocalCalendarDays(new Date(), iso)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatDuration(min: number): string {
  if (min < 60) return `${min}m`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

// ─── Config de modo ────────────────────────────────────────────────────────────

const MODE_CFG: Record<Mode, {
  label:   string
  Icon:    typeof TreePine
  color:   string
  bgColor: string
}> = {
  nature: {
    label:   'Nature',
    Icon:    TreePine,
    color:   'text-tertiary',
    bgColor: 'bg-tertiary/10',
  },
  ocean: {
    label:   'Ocean',
    Icon:    Waves,
    color:   'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  construction: {
    label:   'Construction',
    Icon:    Hammer,
    color:   'text-primary',
    bgColor: 'bg-primary/10',
  },
}

function scoreAccent(score: number): string {
  if (score >= 90) return 'text-secondary bg-secondary/10'
  if (score >= 70) return 'text-primary bg-primary/10'
  return 'text-error bg-error/10'
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar() {
  return (
    <button
      className="w-8 h-8 rounded-full flex items-center justify-center
                 text-[11px] font-bold text-on-primary shrink-0
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                 active:scale-95 transition-transform duration-150"
      style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #5de6ff 100%)' }}
      aria-label="Perfil"
    >
      FS
    </button>
  )
}

// ─── Item do histórico ────────────────────────────────────────────────────────

function SessionItem({ session, index }: { session: Session; index: number }) {
  const cfg  = MODE_CFG[session.mode]
  const Icon = cfg.Icon

  return (
    <motion.div
      className={cn(
        'glass-panel rounded-xl p-4 flex items-center gap-3',
        'hover:bg-primary-container/5 transition-colors duration-300 cursor-default',
      )}
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: index * 0.05 }}
    >
      {/* Ícone do modo */}
      <span
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-xl shrink-0',
          cfg.bgColor,
          cfg.color,
        )}
      >
        <Icon size={20} strokeWidth={2} />
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-on-surface truncate">
          {cfg.label}
          <span className="text-on-surface-variant font-normal"> · {formatDuration(session.duration)}</span>
        </p>
        <p className="text-xs text-on-surface-variant/60 mt-0.5">
          {formatSessionDate(session.completedAt)}
        </p>
      </div>

      {/* Focus score */}
      <span
        className={cn(
          'flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1 shrink-0',
          scoreAccent(session.focusScore),
        )}
      >
        <Zap size={10} strokeWidth={2.5} />
        {session.focusScore}%
      </span>
    </motion.div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  const navigate = useNavigate()
  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-4 py-16 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <span className="flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-container-high">
        <InboxIcon size={28} className="text-on-surface-variant/40" />
      </span>
      <div>
        <p className="text-sm font-semibold text-on-surface">No sessions yet</p>
        <p className="text-xs text-on-surface-variant mt-1">
          Complete your first session to see your history.
        </p>
      </div>
      <button
        onClick={() => navigate('/mode')}
        className="btn-ghost text-primary text-sm font-semibold
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                   active:scale-95 transition-all duration-300"
      >
        Start a session →
      </button>
    </motion.div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

export function HistoryPage() {
  const navigate          = useNavigate()
  const history           = useSessionStore((s) => s.history)
  const totalFocusMinutes = useSessionStore((s) => s.totalFocusMinutes)

  const weeklyData = buildWeeklyData(history)

  return (
    <div className="relative bg-background min-h-screen">

      {/* Glow sutil */}
      <AmbientGlow
        color="primary-container"
        size={500}
        opacity={0.1}
        blur={180}
        className="fixed left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      {/* Nav com back + avatar */}
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
        rightSlot={<Avatar />}
        onLogoClick={() => navigate('/')}
      />
      <TopNavSpacer />

      {/* Conteúdo */}
      <main className="flex flex-col min-h-[calc(100vh-52px)] px-6 pt-6 pb-16 gap-6">

        {/* Título */}
        <motion.h1
          className="text-headline-lg text-on-surface tracking-tight"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          Your Journey
        </motion.h1>

        {/* ── Stats hero ── */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
        >
          {/* Total focus - full width */}
          <StatCard
            icon={<Clock size={20} />}
            label="Total Focus"
            value={formatTotalHours(totalFocusMinutes)}
            valueSize="display-lg"
            accent="primary"
            subtext={totalFocusMinutes > 0 ? `${history.length} session${history.length !== 1 ? 's' : ''} completed` : 'Start your first session'}
          />

          {/* Weekly progress card */}
          <div className="glass-panel p-5">
            <WeeklyBarChart data={weeklyData} />
          </div>
        </motion.div>

        {/* ── Lista de sessões ── */}
        <div className="flex flex-col gap-1">
          <motion.p
            className="text-[10px] font-semibold uppercase tracking-[0.18em]
                       text-on-surface-variant/50 mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            Sessions
          </motion.p>

          {history.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-2">
              {history.map((session, i) => (
                <SessionItem key={session.id} session={session} index={i} />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
