import { Edges, Float, Text } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useGraveSelection } from '../context/GraveSelectionContext'
import { FONT_HEADSTONE_DATE, FONT_HEADSTONE_TITLE } from './fonts'
import type { TombstoneData } from './types'

/** Unscaled tombstone top (body height + cap). */
const TOMBSTONE_TOP = 1.1
const PANEL_W = 5
const PANEL_H = 3.4
const PANEL_D = 0.1

type GhostPortalProps = {
  service: TombstoneData
  visible: boolean
}

/* ── Tiny Web Audio tick (no external files needed) ── */
let audioCtx: AudioContext | null = null
function playTick() {
  try {
    if (!audioCtx) audioCtx = new AudioContext()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'square'
    osc.frequency.value = 1800 + Math.random() * 600
    gain.gain.value = 0.012
    osc.connect(gain).connect(audioCtx.destination)
    const t = audioCtx.currentTime
    osc.start(t)
    osc.stop(t + 0.025)
  } catch { /* audio unavailable — silent fallback */ }
}

/* ── Typewriter hook ── */
function useTypewriter(text: string, active: boolean, speed = 28) {
  const [index, setIndex] = useState(0)
  const rafId = useRef(0)
  const lastTick = useRef(0)

  useEffect(() => {
    setIndex(0)
    lastTick.current = 0
  }, [text, active])

  const step = useCallback(
    (time: number) => {
      if (!lastTick.current) lastTick.current = time
      if (time - lastTick.current >= speed) {
        lastTick.current = time
        setIndex((prev) => {
          if (prev < text.length) {
            playTick()
            return prev + 1
          }
          return prev
        })
      }
      rafId.current = requestAnimationFrame(step)
    },
    [text, speed],
  )

  useEffect(() => {
    if (!active) return
    rafId.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId.current)
  }, [step, active])

  return { visibleText: text.slice(0, index), done: index >= text.length }
}

/* ── Cursor blink ── */
function useCursorBlink(interval = 530) {
  const [on, setOn] = useState(true)
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), interval)
    return () => clearInterval(id)
  }, [interval])
  return on
}

export function GhostPortal({ service, visible }: GhostPortalProps) {
  const { setSelectedService } = useGraveSelection()
  const { visibleText, done } = useTypewriter(service.longDescription, visible)
  const cursorOn = useCursorBlink()

  const tombScale = 1 + (service.popularity / 100) * 1.2
  // panel bottom = tombstoneTop * scale + 0.3 gap (never overlaps)
  const panelY = TOMBSTONE_TOP * tombScale + PANEL_H / 2 + 0.3

  if (!visible) return null

  const handleClose = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    setSelectedService(null)
  }

  const faceZ = PANEL_D / 2 + 0.01

  return (
    <Float speed={1.8} floatIntensity={0.45} rotationIntensity={0.12}>
      <group position={[0, panelY, 0]}>
        {/* Dark panel background */}
        <mesh>
          <boxGeometry args={[PANEL_W, PANEL_H, PANEL_D]} />
          <meshStandardMaterial
            color="#040412"
            transparent
            opacity={0.85}
            emissive="#00ffff"
            emissiveIntensity={0.03}
          />
          <Edges color="#00ffff" />
        </mesh>

        {/* Close button */}
        <Text
          position={[PANEL_W / 2 - 0.25, PANEL_H / 2 - 0.22, faceZ]}
          fontSize={0.2}
          font={FONT_HEADSTONE_DATE}
          color="#00ffff"
          anchorX="center"
          anchorY="middle"
          onClick={handleClose}
        >
          ×
        </Text>

        {/* Service name */}
        <Text
          font={FONT_HEADSTONE_TITLE}
          position={[0, 1.07, faceZ]}
          fontSize={0.26}
          maxWidth={4.6}
          color="#00ffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.006}
          outlineColor="#003333"
        >
          {service.name}
        </Text>

        {/* Dates */}
        <Text
          font={FONT_HEADSTONE_DATE}
          position={[0, 0.82, faceZ]}
          fontSize={0.11}
          maxWidth={4.6}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.45}
          letterSpacing={0.06}
        >
          {service.originDate} — {service.deathDate}
        </Text>

        {/* CAUSE OF DEATH label */}
        <Text
          font={FONT_HEADSTONE_DATE}
          position={[0, 0.60, faceZ]}
          fontSize={0.08}
          maxWidth={4.6}
          color="#00ffff"
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.6}
          letterSpacing={0.18}
        >
          CAUSE OF DEATH
        </Text>

        {/* Description — typewriter */}
        <Text
          font={FONT_HEADSTONE_DATE}
          position={[0, 0.42, faceZ]}
          fontSize={0.18}
          maxWidth={4.6}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          fillOpacity={0.82}
          lineHeight={1.5}
        >
          {visibleText + (!done && cursorOn ? '_' : !done ? '\u00A0' : '')}
        </Text>
      </group>
    </Float>
  )
}
