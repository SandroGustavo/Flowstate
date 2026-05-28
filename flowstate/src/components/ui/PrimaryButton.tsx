import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

type Size = 'sm' | 'md' | 'lg'

const sizeClass: Record<Size, string> = {
  sm: 'h-8  px-3 text-xs gap-1.5',
  md: 'h-10 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-base gap-2.5',
}

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size
  loading?: boolean
  fullWidth?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export function PrimaryButton({
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className,
  children,
  disabled,
  ...rest
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.12 }}
      className={cn(
        'btn-primary-glow font-semibold',
        sizeClass[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={isDisabled}
      {...(rest as object)}
    >
      {loading ? (
        <Loader2 className="animate-spin shrink-0" size={size === 'sm' ? 14 : 16} />
      ) : (
        icon && iconPosition === 'left' && (
          <span className="shrink-0">{icon}</span>
        )
      )}

      {children && (
        <span className={cn(fullWidth && 'flex-1 text-center')}>{children}</span>
      )}

      {!loading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </motion.button>
  )
}
