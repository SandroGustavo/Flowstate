import { type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { Session } from '../../store/sessionStore'

type Mode = Session['mode']

// Gradientes de fallback quando `image` não é fornecida
const FALLBACK_GRADIENTS: Record<Mode, string> = {
  nature:       'radial-gradient(ellipse 90% 70% at 40% 20%, #007650 0%, #0d2016 50%, #131315 100%)',
  ocean:        'radial-gradient(ellipse 90% 70% at 60% 15%, #004a55 0%, #0d1f24 50%, #131315 100%)',
  construction: 'radial-gradient(ellipse 90% 70% at 50% 20%, #3f008e 0%, #1a0a2e 50%, #131315 100%)',
}

// Mapa de accentColor (classe texto) → classe bg para o ícone
const ACCENT_BG: Record<string, string> = {
  'text-tertiary':  'bg-tertiary/15',
  'text-secondary': 'bg-secondary/15',
  'text-primary':   'bg-primary/15',
}

export interface ModeCardProps {
  mode:         Mode
  title:        string
  description:  string
  icon:         ReactNode
  image?:       string
  accentColor:  string    // ex.: 'text-tertiary'
  selected:     boolean
  onSelect:     () => void
}

export function ModeCard({
  mode,
  title,
  description,
  icon,
  image,
  accentColor,
  selected,
  onSelect,
}: ModeCardProps) {
  const iconBg = ACCENT_BG[accentColor] ?? 'bg-surface-container-high/80'

  return (
    <motion.button
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.12 }}
      className={cn(
        'relative h-[450px] w-full rounded-xl overflow-hidden border text-left',
        'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
        'transition-[border-color,box-shadow] duration-300',
        selected
          ? 'border-primary/50 shadow-[0_0_0_1px_rgba(210,187,255,0.12),0_0_32px_rgba(124,58,237,0.2)]'
          : 'border-white/5 hover:border-white/15',
      )}
      aria-pressed={selected}
    >
      {/* ── Fundo: imagem ou gradiente ── */}
      {image ? (
        <img
          src={image}
          alt={title}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
            selected ? 'opacity-80' : 'opacity-40',
          )}
          draggable={false}
        />
      ) : (
        <div
          aria-hidden
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            selected ? 'opacity-90' : 'opacity-60',
          )}
          style={{ background: FALLBACK_GRADIENTS[mode] }}
        />
      )}

      {/* ── Gradient overlay ── */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"
      />

      {/* ── Selecionado: check badge top-right ── */}
      <AnimatePresence>
        {selected && (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{   opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className="absolute top-4 right-4 flex items-center justify-center
                       w-7 h-7 rounded-full bg-primary text-on-primary shadow-lg"
          >
            <Check size={14} strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>

      {/* ── Conteúdo bottom ── */}
      <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col gap-3">

        {/* Ícone do modo */}
        <span
          className={cn(
            'flex w-fit items-center justify-center rounded-xl p-2.5',
            iconBg,
            accentColor,
          )}
        >
          {icon}
        </span>

        {/* Texto */}
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-on-surface leading-tight">
            {title}
          </h3>
          <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Indicador selected inline */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key="selected-tag"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{   opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'flex w-fit items-center gap-1.5 rounded-full px-3 py-1',
                'text-xs font-semibold bg-primary/10 text-primary',
              )}
            >
              <span className="size-1.5 rounded-full bg-primary" />
              Selecionado
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  )
}
