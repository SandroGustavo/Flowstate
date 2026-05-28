import { motion, AnimatePresence } from 'framer-motion'
import { TreePine, Waves, Construction } from 'lucide-react'
import type { Session } from '../../store/sessionStore'

type Mode = Session['mode']

const MODES: Record<Mode, {
  blobs: { color: string; size: number; opacity: number; blur: number; x: string; y: string; delay: number }[]
  Icon: typeof TreePine
  iconColor: string
}> = {
  nature: {
    blobs: [
      { color: '#4edea3', size: 700, opacity: 0.07, blur: 160, x: '-10%',  y: '-5%',  delay: 0 },
      { color: '#007650', size: 480, opacity: 0.05, blur: 130, x: '65%',   y: '55%',  delay: -2 },
      { color: '#4edea3', size: 300, opacity: 0.04, blur: 100, x: '80%',   y: '5%',   delay: -4 },
    ],
    Icon: TreePine,
    iconColor: '#4edea3',
  },
  ocean: {
    blobs: [
      { color: '#5de6ff', size: 700, opacity: 0.07, blur: 160, x: '60%',   y: '-10%', delay: 0 },
      { color: '#00cbe6', size: 480, opacity: 0.05, blur: 130, x: '-5%',   y: '55%',  delay: -3 },
      { color: '#5de6ff', size: 320, opacity: 0.04, blur: 100, x: '30%',   y: '80%',  delay: -1 },
    ],
    Icon: Waves,
    iconColor: '#5de6ff',
  },
  construction: {
    blobs: [
      { color: '#d2bbff', size: 700, opacity: 0.06, blur: 160, x: '10%',   y: '5%',   delay: 0 },
      { color: '#7c3aed', size: 550, opacity: 0.05, blur: 140, x: '60%',   y: '45%',  delay: -2 },
      { color: '#d2bbff', size: 300, opacity: 0.04, blur: 100, x: '70%',   y: '-5%',  delay: -4 },
    ],
    Icon: Construction,
    iconColor: '#d2bbff',
  },
}

interface ModeBackgroundProps {
  mode: Mode
}

export function ModeBackground({ mode }: ModeBackgroundProps) {
  const cfg = MODES[mode]
  const { Icon, iconColor } = cfg

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Ambient blobs */}
        {cfg.blobs.map((b, i) => (
          <div
            key={i}
            aria-hidden
            className="absolute rounded-full animate-breathe"
            style={{
              width:          b.size,
              height:         b.size,
              left:           b.x,
              top:            b.y,
              background:     b.color,
              opacity:        b.opacity,
              filter:         `blur(${b.blur}px)`,
              animationDelay: `${b.delay}s`,
              willChange:     'transform',
            }}
          />
        ))}

        {/* Mega icon — textura decorativa */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0.025 }}
        >
          <Icon
            style={{ color: iconColor, width: '60vmin', height: '60vmin' }}
            strokeWidth={0.6}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
