import * as THREE from 'three'

/** Deterministyczny szum (bez Math.random) — współdzielona tekstura betonu / kamienia. */
function valueNoise2D(x: number, y: number, seed: number): number {
  const fx = Math.floor(x)
  const fy = Math.floor(y)
  const h = (a: number, b: number) => {
    let t = Math.sin(a * 127.1 + b * 311.7 + seed) * 43758.5453
    return t - Math.floor(t)
  }
  const tx = x - fx
  const ty = y - fy
  const u = tx * tx * (3 - 2 * tx)
  const v = ty * ty * (3 - 2 * ty)
  const n00 = h(fx, fy)
  const n10 = h(fx + 1, fy)
  const n01 = h(fx, fy + 1)
  const n11 = h(fx + 1, fy + 1)
  const nx0 = THREE.MathUtils.lerp(n00, n10, u)
  const nx1 = THREE.MathUtils.lerp(n01, n11, u)
  return THREE.MathUtils.lerp(nx0, nx1, v)
}

function fbm(x: number, y: number, seed: number): number {
  let a = 0
  let amp = 0.5
  let f = 1
  for (let o = 0; o < 5; o++) {
    a += amp * valueNoise2D(x * f, y * f, seed + o * 17)
    f *= 2
    amp *= 0.5
  }
  return a
}

let cached: THREE.CanvasTexture | null = null

export function getStoneNoiseTexture(): THREE.CanvasTexture {
  if (cached) return cached
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2d context unavailable')
  const img = ctx.createImageData(size, size)
  const seed = 42
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const n = fbm(x * 0.06, y * 0.06, seed)
      const fine = fbm(x * 0.35, y * 0.35, seed + 99) * 0.2
      const v = THREE.MathUtils.clamp(90 + (n + fine - 0.5) * 110, 35, 235)
      const g = Math.floor(v)
      img.data[i] = g
      img.data[i + 1] = g
      img.data[i + 2] = g
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.NoColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2.2, 3.4)
  tex.needsUpdate = true
  cached = tex
  return tex
}
