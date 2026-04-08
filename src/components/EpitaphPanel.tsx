import { AnimatePresence, motion } from 'framer-motion'
import type { SelectedService } from '../cemetery/types'
import { useTranslation } from '../context/LanguageContext'

type EpitaphPanelProps = {
  selectedService: SelectedService | null
  onClose: () => void
}

export function EpitaphPanel({ selectedService, onClose }: EpitaphPanelProps) {
  const s = selectedService
  const { t } = useTranslation()

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
          <button type="button" className="epitaph-close" onClick={onClose} aria-label={t('ui.close')}>
            ×
          </button>
          <h2 id="epitaph-title" className="epitaph-name">
            {t(`tombstones.${s.translationKey}.name`)}
          </h2>
          <p className="epitaph-dates">
            {s.originDate} — {s.deathDate}
          </p>
          <div className="epitaph-section">
            <h3 className="epitaph-label">{t('ui.causeOfDeath')}</h3>
            <p className="epitaph-body">{t(`tombstones.${s.translationKey}.description`)}</p>
          </div>
          <p className="epitaph-hint">Hologram nad nagrobkiem: screenshot z Microlink API (archiwum Wayback Machine).</p>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
