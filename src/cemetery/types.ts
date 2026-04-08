import type { ColorRepresentation } from 'three'

export type TombstoneData = {
  id: string
  /** Rok / data startu (np. pierwsza wersja). */
  originDate: string
  /** Rok / data końca usługi. */
  deathDate: string
  color: ColorRepresentation
  /** Klucz do tłumaczeń (np. 'gadu-gadu') */
  translationKey: string
  waybackUrl: string
  /** Popularność w skali 0–100: wpływa na pozycję, skalę i intensywność efektów. */
  popularity: number
}

export type TombstoneProps = TombstoneData & {
  position?: [number, number, number]
  rotationY?: number
}

/** Stan wyboru: pełne dane + pozycja nagrobka na płaszczyźnie (kamera / portal). */
export type SelectedService = TombstoneData & {
  worldPosition: [number, number, number]
  rotationY: number
}
