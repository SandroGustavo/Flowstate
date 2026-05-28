import { cn } from '../../lib/cn'

// Mapeia tokens do design system para hex — fonte única de verdade para glow via filter:blur
const COLORS: Record<string, string> = {
  'primary':              '#d2bbff',
  'primary-container':    '#7c3aed',
  'secondary':            '#5de6ff',
  'secondary-container':  '#00cbe6',
  'tertiary':             '#4edea3',
  'tertiary-container':   '#007650',
  'error':                '#ffb4ab',
}

interface AmbientGlowProps {
  color?:    keyof typeof COLORS
  size?:     number    // px, default 480
  opacity?:  number    // 0-1, default 0.2
  blur?:     number    // px, default 100
  delay?:    number    // animation-delay em segundos
  className?: string   // posicionamento externo (fixed/absolute + translate)
}

export function AmbientGlow({
  color   = 'primary-container',
  size    = 480,
  opacity = 0.2,
  blur    = 100,
  delay   = 0,
  className,
}: AmbientGlowProps) {
  const hex = COLORS[color as string] ?? COLORS['primary-container']

  return (
    <div
      aria-hidden
      className={cn('rounded-full pointer-events-none select-none animate-breathe', className)}
      style={{
        width:            size,
        height:           size,
        background:       hex,
        opacity,
        filter:           `blur(${blur}px)`,
        animationDelay:   delay !== 0 ? `${delay}s` : undefined,
        willChange:       'transform',
      }}
    />
  )
}
