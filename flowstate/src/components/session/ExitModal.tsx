import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { PrimaryButton } from '../ui/PrimaryButton'
import { GhostButton }   from '../ui/GhostButton'

interface ExitModalProps {
  open:        boolean
  onContinue:  () => void
  onAbandon:   () => void
}

export function ExitModal({ open, onContinue, onAbandon }: ExitModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-6 pb-8 sm:pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{
              backdropFilter:         'blur(12px) saturate(1.2)',
              WebkitBackdropFilter:   'blur(12px) saturate(1.2)',
              background:             'rgba(19, 19, 21, 0.65)',
            }}
            onClick={onContinue}
          />

          {/* Card */}
          <motion.div
            className="glass-panel-elevated relative z-10 w-full max-w-sm p-6 flex flex-col gap-5"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{   opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* Ícone de aviso */}
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center rounded-xl bg-error/10 p-2.5">
                <AlertTriangle size={20} className="text-error" />
              </span>
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  Encerrar sessão?
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Seu progresso não será salvo.
                </p>
              </div>
            </div>

            <div className="divider" />

            {/* Botões */}
            <div className="flex flex-col gap-2.5">
              <PrimaryButton
                fullWidth
                onClick={onContinue}
              >
                Continuar sessão
              </PrimaryButton>
              <GhostButton
                fullWidth
                className="text-error hover:bg-error/10 hover:text-error"
                onClick={onAbandon}
              >
                Encerrar mesmo assim
              </GhostButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
