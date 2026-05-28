import { type ElementType, type ComponentPropsWithoutRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '../../lib/cn'

type Variant = 'default' | 'elevated' | 'inset' | 'active'

const variantClass: Record<Variant, string> = {
  default:  'glass-panel',
  elevated: 'glass-panel-elevated',
  inset:    'glass-panel-inset',
  active:   'glass-panel-active',
}

interface GlassPanelOwnProps {
  variant?: Variant
  padding?: boolean
  animate?: boolean
  className?: string
  children?: React.ReactNode
}

// Polymorphic: usa 'div' por padrão, mas aceita qualquer elemento HTML
type GlassPanelProps<T extends ElementType = 'div'> =
  GlassPanelOwnProps & { as?: T } & Omit<ComponentPropsWithoutRef<T>, keyof GlassPanelOwnProps | 'as'>

export function GlassPanel<T extends ElementType = 'div'>({
  as,
  variant = 'default',
  padding = true,
  animate = false,
  className,
  children,
  ...rest
}: GlassPanelProps<T>) {
  const Tag = (as ?? 'div') as ElementType

  const classes = cn(
    variantClass[variant],
    padding && 'p-5',
    className,
  )

  if (animate) {
    return (
      <motion.div
        className={classes}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        {...(rest as HTMLMotionProps<'div'>)}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  )
}
