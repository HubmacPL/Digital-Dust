import React, { useEffect, useRef, useState } from 'react'
import translations, { type SupportedLanguage } from '../../i18n/translations'
import { useTranslation } from '../../context/LanguageContext'

export function LanguageSelector() {
  const { t, lang, setLanguage } = useTranslation()
  const langs = Object.keys(translations) as SupportedLanguage[]
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent | TouchEvent) {
      if (!rootRef.current) return
      if (!(e.target instanceof Node)) return
      if (!rootRef.current.contains(e.target)) setIsOpen(false)
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('touchstart', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('touchstart', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation()
    setIsOpen((v) => !v)
  }

  function handleSelect(l: SupportedLanguage) {
    setLanguage(l)
    setIsOpen(false)
  }

  return (
    <div
      ref={rootRef}
      style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, pointerEvents: 'auto' }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={handleToggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen((v) => !v) } }}
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          background: 'rgba(0,0,0,0.8)',
          color: '#ffffff',
          padding: '8px 12px',
          borderRadius: 10,
          border: '1px solid rgba(0,242,255,0.12)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          fontWeight: 700,
          fontSize: 13,
          minWidth: 180,
          cursor: 'pointer',
          fontFamily: '"Roboto Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
          letterSpacing: 0.8,
        }}
      >
        {/* globe icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="10" stroke="#00f2ff" strokeOpacity="0.6" strokeWidth="0.9" />
          <path d="M2 12h20M12 2c3 4 3 16 0 20M12 2c-3 4-3 16 0 20" stroke="#00f2ff" strokeWidth="0.9" strokeOpacity="0.6" />
        </svg>

        <span style={{ color: '#9fffe0', fontSize: 12 }}>{t('ui.changeLanguage')}</span>

        <div style={{ marginLeft: 'auto', color: '#00f2ff', fontSize: 14, fontWeight: 900 }}>{lang.toUpperCase()}</div>

        <div style={{ marginLeft: 8, color: '#00f2ff', fontSize: 12 }}>{isOpen ? '▴' : '▾'}</div>
      </div>

      {/* dropdown */}
      <div
        role="menu"
        aria-hidden={!isOpen}
        style={{
          position: 'absolute',
          right: 0,
          marginTop: 10,
          transformOrigin: 'top right',
          transition: 'opacity 160ms ease, transform 160ms ease',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0)' : 'translateY(-6px)',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: '6px',
            background: 'rgba(0,0,0,0.86)',
            borderRadius: 8,
            border: '1px solid rgba(0,242,255,0.08)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
            minWidth: 160,
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            overflow: 'hidden',
          }}
        >
          {langs.map((l) => (
            <li
              key={l}
              role="menuitemradio"
              aria-checked={l === lang}
              onClick={() => handleSelect(l)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(l) } }}
              style={{
                padding: '8px 10px',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                color: l === lang ? '#00f2ff' : '#e6fff9',
                background: 'transparent',
                transition: 'background 120ms, color 120ms',
                fontFamily: '"Roboto Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
                textTransform: 'uppercase',
                fontSize: 13,
                fontWeight: 800,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(0,242,255,0.04)'
                el.style.color = '#00f2ff'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'transparent'
                el.style.color = l === lang ? '#00f2ff' : '#e6fff9'
              }}
            >
              <span style={{ width: 18, textAlign: 'center' }}>{l === lang ? '✓' : ''}</span>
              <span style={{ marginLeft: 6 }}>{String(l).toUpperCase()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default LanguageSelector
