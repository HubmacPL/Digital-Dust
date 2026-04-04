import { AnimatePresence, motion } from 'framer-motion'
import type { SelectedService } from '../cemetery/types'

type EpitaphPanelProps = {
  selectedService: SelectedService | null
  onClose: () => void
}

export function EpitaphPanel({ selectedService, onClose }: EpitaphPanelProps) {
  const s = selectedService

  return (
    <AnimatePresence>
      {s && (
        <motion.aside
          key={s.id}
          className="epitaph-panel"
          role="dialog"
          aria-labelledby="epitaph-title"
          aria-modal="true"
          initial={{ x: '100%', opacity: 0.85 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0.85 }}
          transition={{ type: 'spring', damping: 30, stiffness: 320, mass: 0.85 }}
        >
          <button type="button" className="epitaph-close" onClick={onClose} aria-label="Zamknij panel">
            ×
          </button>
          <h2 id="epitaph-title" className="epitaph-name">
            {s.name}
          </h2>
          <p className="epitaph-dates">
            {s.originDate} — {s.deathDate}
          </p>
          <div className="epitaph-section">
            <h3 className="epitaph-label">CAUSE OF DEATH</h3>
            <p className="epitaph-body">{s.longDescription}</p>
          </div>
          <p className="epitaph-hint">Hologram nad nagrobkiem: screenshot z Microlink API (archiwum Wayback Machine).</p>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
