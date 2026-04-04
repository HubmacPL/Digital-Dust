import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const COUNT = 25
const SPREAD = 12
const LIGHT_COUNT = 4 // only a few carry actual point lights

/** Circular alpha texture for soft glow. */
function makeCircleTexture(): THREE.Texture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.6)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

type Firefly = {
  cx: number
  cy: number
  cz: number
  freqX: number
  freqY: number
  freqZ: number
  ampX: number
  ampY: number
  ampZ: number
  phaseX: number
  phaseY: number
  phaseZ: number
  pulseFreq: number
  pulsePhase: number
}

function makeFireflies(): Firefly[] {
  const out: Firefly[] = []
  for (let i = 0; i < COUNT; i++) {
    out.push({
      cx: (Math.random() - 0.5) * SPREAD * 2,
      cy: 0.5 + Math.random() * 2.5,
      cz: (Math.random() - 0.5) * SPREAD * 2,
      freqX: 0.15 + Math.random() * 0.25,
      freqY: 0.1 + Math.random() * 0.2,
      freqZ: 0.15 + Math.random() * 0.25,
      ampX: 0.4 + Math.random() * 0.8,
      ampY: 0.2 + Math.random() * 0.5,
      ampZ: 0.4 + Math.random() * 0.8,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      phaseZ: Math.random() * Math.PI * 2,
      pulseFreq: 0.5 + Math.random() * 1.5,
      pulsePhase: Math.random() * Math.PI * 2,
    })
  }
  return out
}

/**
 * Rzadkie, pulsujące świetliki rozsiane po całym cmentarzu.
 */
export function CyberFireflies() {
  const pointsRef = useRef<THREE.Points>(null)
  const lightsRef = useRef<(THREE.PointLight | null)[]>([])

  const fireflies = useMemo(makeFireflies, [])
  const alphaMap = useMemo(makeCircleTexture, [])

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    const pos = new Float32Array(COUNT * 3)
    // initialize positions
    for (let i = 0; i < COUNT; i++) {
      const f = fireflies[i]
      pos[i * 3] = f.cx
      pos[i * 3 + 1] = f.cy
      pos[i * 3 + 2] = f.cz
    }
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return geom
  }, [fireflies])

  useFrame(({ clock }) => {
    const pts = pointsRef.current
    if (!pts) return
    const t = clock.elapsedTime
    const attr = pts.geometry.getAttribute('position') as THREE.BufferAttribute
    const arr = attr.array as Float32Array

    for (let i = 0; i < COUNT; i++) {
      const f = fireflies[i]
      const x = f.cx + Math.sin(t * f.freqX + f.phaseX) * f.ampX
      const y = f.cy + Math.sin(t * f.freqY + f.phaseY) * f.ampY
      const z = f.cz + Math.sin(t * f.freqZ + f.phaseZ) * f.ampZ

      arr[i * 3] = x
      arr[i * 3 + 1] = y
      arr[i * 3 + 2] = z

      // Update attached point lights (first LIGHT_COUNT fireflies)
      if (i < LIGHT_COUNT) {
        const light = lightsRef.current[i]
        if (light) {
          light.position.set(x, y, z)
          const pulse = 0.5 + 0.5 * Math.sin(t * f.pulseFreq + f.pulsePhase)
          light.intensity = pulse * 1.8
        }
      }
    }

    attr.needsUpdate = true

    // Global pulse for the particle material opacity
    const mat = pts.material as THREE.PointsMaterial
    mat.opacity = 0.55 + 0.35 * Math.sin(t * 0.8)
  })

  return (
    <group>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          color="#60ffe0"
          size={0.08}
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          alphaMap={alphaMap}
        />
      </points>

      {/* A few point lights that follow the brightest fireflies */}
      {fireflies.slice(0, LIGHT_COUNT).map((f, i) => (
        <pointLight
          key={i}
          ref={(el) => { lightsRef.current[i] = el }}
          color="#50ffe8"
          intensity={1}
          distance={3}
          decay={2}
          position={[f.cx, f.cy, f.cz]}
        />
      ))}
    </group>
  )
}
