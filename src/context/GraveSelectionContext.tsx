import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { SelectedService } from '../cemetery/types'

type GraveSelectionValue = {
  selectedService: SelectedService | null
  setSelectedService: (v: SelectedService | null) => void
}

const GraveSelectionContext = createContext<GraveSelectionValue | null>(null)

export function GraveSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null)
  const value = useMemo(
    () => ({ selectedService, setSelectedService }),
    [selectedService],
  )
  return <GraveSelectionContext.Provider value={value}>{children}</GraveSelectionContext.Provider>
}

export function useGraveSelection() {
  const ctx = useContext(GraveSelectionContext)
  if (!ctx) throw new Error('useGraveSelection must be used within GraveSelectionProvider')
  return ctx
}
