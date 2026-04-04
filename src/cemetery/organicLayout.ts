/**
 * Deterministyczne, „organiczne” rozmieszczenie (spirala + sinusy + seed z id),
 * żeby układ był powtarzalny bez Math.random() przy każdym renderze.
 */
function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function seeded01(seed: number, salt: number): number {
  const x = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

const MIN_DIST_SQ = 2.5 * 2.5 // min allowed squared distance between tombstones

/**
 * Popularity-based layout: popular services are closer to the center.
 * Includes collision resolution: up to 8 angular nudges per tombstone.
 */
export function getOrganicTransforms(
  services: Array<{ id: string; popularity: number }>,
): Array<{ position: [number, number, number]; rotationY: number }> {
  const total = services.length
  const golden = 2.399963229728653
  const results: Array<{ position: [number, number, number]; rotationY: number }> = []

  for (let index = 0; index < total; index++) {
    const { id, popularity } = services[index]
    const seed = hashString(id)

    // Higher popularity → closer to center
    const baseRadius = 15 - (popularity / 100) * 12
    const jitter = (seeded01(seed, 1) - 0.5) * 1.5
    const radius = Math.max(1.5, baseRadius + jitter)

    let angle = index * golden + (seeded01(seed, 3) - 0.5) * 0.5

    let x = Math.cos(angle) * radius
    let z = Math.sin(angle) * radius

    // Collision resolution: nudge along circle until clear
    for (let attempt = 0; attempt < 8; attempt++) {
      let tooClose = false
      for (const prev of results) {
        const dx = x - prev.position[0]
        const dz = z - prev.position[2]
        if (dx * dx + dz * dz < MIN_DIST_SQ) { tooClose = true; break }
      }
      if (!tooClose) break
      angle += 0.42
      x = Math.cos(angle) * radius
      z = Math.sin(angle) * radius
    }

    // Face outward from center (+small jitter so not perfectly uniform)
    const rotationY = Math.atan2(x, z) + (seeded01(seed, 2) - 0.5) * 0.3
    results.push({ position: [x, 0, z], rotationY })
  }

  return results
}

/** Legacy single-item helper retained for backward compat. */
export function getOrganicTransform(
  index: number,
  total: number,
  id: string,
): { position: [number, number, number]; rotationY: number } {
  const seed = hashString(id)
  const t = total > 1 ? index / (total - 1) : 0
  const golden = 2.399963229728653

  const angle = index * golden + Math.sin(index * 0.73 + seed * 0.001) * 0.4
  const radiusBase = 1.1 + index * 0.42
  const radiusJitter = (seeded01(seed, 1) - 0.5) * 0.55
  const radius = radiusBase + radiusJitter + 0.15 * Math.sin(index * 1.1)

  const squash = 1 + 0.12 * Math.cos(index * 0.91 + t * Math.PI)
  const x = Math.cos(angle) * radius * squash
  const z = Math.sin(angle) * radius * (1.02 + 0.08 * Math.sin(index * 0.88))

  const rotationY = angle * 0.35 + (seeded01(seed, 2) - 0.5) * 0.25

  return { position: [x, 0, z], rotationY }
}
