import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import translations, { lookup, type SupportedLanguage, type TranslationMap } from '../i18n/translations'

type LanguageContextValue = {
  currentLanguage: SupportedLanguage
  setLanguage: (l: SupportedLanguage) => void
}

const defaultLangCtx: LanguageContextValue = {
  currentLanguage: 'en',
  setLanguage: () => {},
}

export const LanguageContext = createContext<LanguageContextValue>(defaultLangCtx)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    try {
      const stored = localStorage.getItem('dd.lang') as SupportedLanguage | null
      if (stored && Object.keys(translations).includes(stored)) return stored
    } catch {
      /* ignore */
    }
    return 'en'
  })

  const value = useMemo(
    () => ({
      currentLanguage,
      setLanguage: (l: SupportedLanguage) => {
        setCurrentLanguage(l)
        try {
          localStorage.setItem('dd.lang', l)
        } catch {}
      },
    }),
    [currentLanguage],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}

/**
 * Hook exposed to components for fetching translations.
 * - `t(path)` — dot-path lookup, e.g. `t('tombstones.gadu-gadu.name')`
 * - `lang` — current language
 * - `strings` — full translation map for current language
 */
export function useTranslation() {
  const { currentLanguage, setLanguage } = useLanguage()

  const t = (path: string) => lookup(currentLanguage, path)

  const strings: TranslationMap = translations[currentLanguage]

  return { t, lang: currentLanguage, setLanguage, strings }
}

export default LanguageContext
