import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { X, Pause, Play, TreePine, Waves, Construction } from 'lucide-react'
import { useSessionStore } from '../store/sessionStore'
import { useTimer }         from '../hooks/useTimer'
import {
  AmbientGlow,
  ModeBackground,
  ProgressRing,
  ExitModal,
} from '../components/session'
import { cn } from '../lib/cn'
import type { Session } from '../store/sessionStore'

type Mode = Session['mode']

const MODE_META: Record<Mode, {
  label:      string
  Icon:       typeof TreePine
  colorClass: string   // text- + bg- token
  bgClass:    string
}> = {
  nature: {
    label:      'NATURE MODE',
    Icon:       TreePine,
    colorClass: 'text-tertiary',
    bgClass:    'bg-tertiary/10',
  },
  ocean: {
    label:      'OCEAN MODE',
    Icon:       Waves,
    colorClass: 'text-secondary',
    bgClass:    'bg-secondary/10',
  },
  construction: {
    label:      'CONSTRUCTION MODE',
    Icon:       Construction,
    colorClass: 'text-primary',
    bgClass:    'bg-primary/10',
  },
}

export function SessionPage() {
  const navigate     = useNavigate()
  const selectedMode = useSessionStore((s) => s.selectedMode)
  const timer        = useTimer()
  const [showExit, setShowExit] = useState(false)
  const started      = useRef(false)

  // Guard: sem modo selecionado → volta ao início
  useEffect(() => {
    if (!selectedMode) {
      navigate('/', { replace: true })
    }
  }, [selectedMode, navigate])

  // Inicia o timer uma única vez ao montar
  useEffect(() => {
    if (!started.current && selectedMode) {
      started.current = true
      timer.start()
    }
  }, [selectedMode, timer])

  // Sessão concluída (timer chegou a 0) → vai para /success
  useEffect(() => {
    if (!timer.isRunning && !timer.isPaused && timer.timeLeft === 0) {
      const id = setTimeout(() => navigate('/success', { replace: true }), 900)
      return () => clearTimeout(id)
    }
  }, [timer.isRunning, timer.isPaused, timer.timeLeft, navigate])

  // Pausa ao abrir o modal de saída
  useEffect(() => {
    if (showExit && timer.isRunning && !timer.isPaused) timer.pause()
  }, [showExit, timer])

  const handleAbandon = () => {
    timer.reset()
    navigate('/', { replace: true })
  }

  const handleContinue = () => {
    setShowExit(false)
    timer.resume()
  }

  if (!selectedMode) return null

  const meta    = MODE_META[selectedMode]
  const ModeIcon = meta.Icon

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background de modo */}
      <ModeBackground mode={selectedMode} />

      {/* Conteúdo — fullscreen sem nav */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 gap-8">

        {/* Badge do modo */}
        <motion.div
          className={cn(
            'glass-panel rounded-full px-4 py-2 flex items-center gap-2',
            'transition-colors duration-300',
          )}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <ModeIcon size={14} className={meta.colorClass} strokeWidth={2.5} />
          <span className={cn(
            'text-xs font-semibold tracking-widest uppercase',
            meta.colorClass,
          )}>
            {meta.label}
          </span>
        </motion.div>

        {/* Ring + AmbientGlow central */}
        <motion.div
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.34, 1.2, 0.64, 1] }}
        >
          {/* Blob pulsante atrás do anel */}
          <AmbientGlow
            color="primary-container"
            size={400}
            opacity={0.2}
            blur={100}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />

          <ProgressRing
            progress={timer.progress}
            timeLeft={timer.timeLeft}
            isPaused={timer.isPaused}
            ambientIcon={
              <ModeIcon
                size={80}
                strokeWidth={1}
                style={{ color: '#e5e1e4' }}
              />
            }
          />
        </motion.div>

        {/* Controles */}
        <motion.div
          className="flex items-center gap-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          {/* X — abre ExitModal */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.12 }}
            onClick={() => setShowExit(true)}
            className="w-16 h-16 rounded-full flex items-center justify-center
                       glass-panel border-outline-variant/40
                       text-on-surface-variant hover:text-on-surface
                       transition-colors duration-300 focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-primary/60"
            aria-label="Sair da sessão"
          >
            <X size={22} strokeWidth={2} />
          </motion.button>

          {/* Pause / Play */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.12 }}
            onClick={timer.isPaused ? timer.resume : timer.pause}
            className="btn-primary-glow w-20 h-20 rounded-full flex items-center justify-center"
            aria-label={timer.isPaused ? 'Retomar' : 'Pausar'}
          >
            {timer.isPaused
              ? <Play  size={28} strokeWidth={2} fill="currentColor" />
              : <Pause size={28} strokeWidth={2} fill="currentColor" />
            }
          </motion.button>
        </motion.div>

      </div>

      <ExitModal
        open={showExit}
        onContinue={handleContinue}
        onAbandon={handleAbandon}
      />
    </div>
  )
}
