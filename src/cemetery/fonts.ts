/**
 * Troika (drei Text) nie obsługuje WOFF2 — tylko m.in. WOFF / TTF.
 * @see https://github.com/protectwise/troika/tree/main/packages/troika-three-text
 */
import playfairLatin600 from '@fontsource/playfair-display/files/playfair-display-latin-600-normal.woff?url'
import robotoMonoLatin400 from '@fontsource/roboto-mono/files/roboto-mono-latin-400-normal.woff?url'

/** Elegancki szeryf na nazwę usługi (troika / drei Text). */
export const FONT_HEADSTONE_TITLE = playfairLatin600

/** Retro monospace na rok (systemowy „terminal”). */
export const FONT_HEADSTONE_DATE = robotoMonoLatin400
