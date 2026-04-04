import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const BASE_COUNT = 40

type DigitalDustProps = {
  position?: [number, number, number]
  popularity?: number
}

/**
 * Cyfrowy pył unoszący się wokół nagrobka — ostre kwadraty, cyjan, additive blending.
 */
export function DigitalDust({ position = [0, 0, 0], popularity = 50 }: DigitalDustProps) {
  const COUNT = Math.round(BASE_COUNT + (popularity / 100) * 120) // 40–160
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, velocities, phases } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const vel = new Float32Array(COUNT)
    const ph = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3
      // Random spread around tombstone
      pos[i3] = (Math.random() - 0.5) * 0.8
      pos[i3 + 1] = Math.random() * 1.6
      pos[i3 + 2] = (Math.random() - 0.5) * 0.8
      vel[i] = 0.08 + Math.random() * 0.12
      ph[i] = Math.random() * Math.PI * 2
    }

    return {
      positions: pos,
      velocities: vel,
      phases: ph,
    }
  }, [COUNT])

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3))
    return geom
  }, [positions])

  useFrame((_, dt) => {
    const pts = pointsRef.current
    if (!pts) return
    const attr = pts.geometry.getAttribute('position') as THREE.BufferAttribute
    const arr = attr.array as Float32Array

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3
      // Drift horizontally with sine wave
      arr[i3] += Math.sin(phases[i] + arr[i3 + 1] * 2) * dt * 0.04
      // Float upward
      arr[i3 + 1] += velocities[i] * dt
      // Slight z drift
      arr[i3 + 2] += Math.cos(phases[i] + arr[i3 + 1] * 1.5) * dt * 0.03
      // Digital jitter — random micro-jump simulating corrupted data transfer
      if (Math.random() < 0.08) {
        arr[i3]     += (Math.random() - 0.5) * 0.012
        arr[i3 + 1] += (Math.random() - 0.5) * 0.008
        arr[i3 + 2] += (Math.random() - 0.5) * 0.012
      }

      // Reset when too high
      if (arr[i3 + 1] > 2.0) {
        arr[i3] = (Math.random() - 0.5) * 0.8
        arr[i3 + 1] = 0
        arr[i3 + 2] = (Math.random() - 0.5) * 0.8
      }
    }

    attr.needsUpdate = true
  })

  return (
    <points ref={pointsRef} position={position} geometry={geometry}>
      <pointsMaterial
        color="#00ffff"
        size={0.05}
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}
