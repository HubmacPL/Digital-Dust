import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { SelectedService } from '../cemetery/types'

type GraveSelectionValue = {
  selectedService: SelectedService | null
  setSelectedService: (v: SelectedService | null) => void
}

const defaultGraveCtx: GraveSelectionValue = {
  selectedService: null,
  setSelectedService: () => {},
}

export const GraveSelectionContext = createContext<GraveSelectionValue>(defaultGraveCtx)

export function GraveSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null)
  const value = useMemo(
    () => ({ selectedService, setSelectedService }),
    [selectedService],
  )
  return <GraveSelectionContext.Provider value={value}>{children}</GraveSelectionContext.Provider>
}

export function useGraveSelection() {
  return useContext(GraveSelectionContext)
}
