import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { type ReactNode } from 'react'
import { HomePage }    from './pages/HomePage'
import { ModePage }    from './pages/ModePage'
import { TimePage }    from './pages/TimePage'
import { SessionPage } from './pages/SessionPage'
import { SuccessPage } from './pages/SuccessPage'
import { HistoryPage } from './pages/HistoryPage'

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0,  transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2,  ease: 'easeOut' } },
}

function P({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={PAGE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ background: '#131315', minHeight: '100dvh' }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/"         element={<P><HomePage /></P>} />
        <Route path="/mode"     element={<P><ModePage /></P>} />
        <Route path="/time"     element={<P><TimePage /></P>} />
        <Route path="/session"  element={<P><SessionPage /></P>} />
        <Route path="/success"  element={<P><SuccessPage /></P>} />
        <Route path="/history"  element={<P><HistoryPage /></P>} />
        <Route path="/schedule" element={<Navigate to="/time" replace />} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
