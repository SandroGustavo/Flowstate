import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

type Size = 'sm' | 'md' | 'lg'

const sizeClass: Record<Size, string> = {
  sm: 'h-8  px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
}

interface GhostButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  iconOnly?: boolean
  fullWidth?: boolean
}

export function GhostButton({
  size = 'md',
  icon,
  iconPosition = 'left',
  iconOnly = false,
  fullWidth = false,
  className,
  children,
  ...rest
}: GhostButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.12 }}
      className={cn(
        'btn-ghost transition-colors duration-300',
        sizeClass[size],
        iconOnly && 'px-0 aspect-square',
        fullWidth && 'w-full',
        className,
      )}
      {...(rest as object)}
    >
      {icon && iconPosition === 'left' && (
        <span className="shrink-0">{icon}</span>
      )}

      {!iconOnly && children && (
        <span>{children}</span>
      )}

      {icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </motion.button>
  )
}
