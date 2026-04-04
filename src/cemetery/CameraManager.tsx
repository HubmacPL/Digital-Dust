import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'
import { useGraveSelection } from '../context/GraveSelectionContext'

/* ── Constants ── */
const DEFAULT_CAM = new THREE.Vector3(5.5, 3.8, 9.2)
const DEFAULT_TARGET = new THREE.Vector3(0, 0.4, 0)
const Y_AXIS = new THREE.Vector3(0, 1, 0)
const MAX_POLAR = Math.PI * 0.48
const ARRIVE_THRESHOLD = 0.02
const MAX_PAN_DRIFT = 1.8

/* ── Scratch vectors (reused per frame, zero GC) ── */
const _offset = new THREE.Vector3()
const _goal = new THREE.Vector3()
const _goalTarget = new THREE.Vector3()
const _focusTarget = new THREE.Vector3()

type CameraMode = 'free' | 'animating' | 'focus'

export function CameraManager() {
  const controlsRef = useRef<OrbitControlsType>(null)
  const { selectedService } = useGraveSelection()
  const { camera } = useThree()

  /*
   * mode lives in BOTH ref (for useFrame reads, 60fps, no re-render)
   * and state (for OrbitControls prop changes, only on transitions).
   * We only call setMode at transition boundaries, never mid-animation.
   */
  const [mode, setMode] = useState<CameraMode>('free')
  const modeRef = useRef<CameraMode>('free')

  const prevId = useRef<string | null>(null)
  const ready = useRef(false)
  const lerpT = useRef(0)
  const startCam = useRef(new THREE.Vector3())
  const startTarget = useRef(new THREE.Vector3())

  // Batched mode setter — safe to call from useFrame, batches React update
  const commitMode = useCallback((m: CameraMode) => {
    if (modeRef.current === m) return
    modeRef.current = m
    setMode(m)
  }, [])

  /* ── Block wheel during animation ── */
  useEffect(() => {
    const block = (e: WheelEvent) => {
      if (modeRef.current === 'animating') e.preventDefault()
    }
    window.addEventListener('wheel', block, { passive: false })
    return () => window.removeEventListener('wheel', block)
  }, [])

  /* ── Per-frame logic ── */
  useFrame((_, dt) => {
    const ctr = controlsRef.current
    if (!ctr) return

    // First frame: snap to default position
    if (!ready.current) {
      ready.current = true
      camera.position.copy(DEFAULT_CAM)
      ctr.target.copy(DEFAULT_TARGET)
      ctr.update()
      return
    }

    /* ── Detect selection change ── */
    const currentId = selectedService?.id ?? null
    if (currentId !== prevId.current) {
      prevId.current = currentId
      startCam.current.copy(camera.position)
      startTarget.current.copy(ctr.target)
      lerpT.current = 0
      // Only update ref for immediate use; React state follows at transition end
      modeRef.current = 'animating'
      setMode('animating')
    }

    /* ── Compute goal ── */
    if (selectedService) {
      const [px, , pz] = selectedService.worldPosition
      const ry = selectedService.rotationY
      const pop = selectedService.popularity ?? 50
      const tombScale = 1 + (pop / 100) * 1.2
      const panelY = 1.1 * tombScale + 3.4 / 2 + 0.3
      _goalTarget.set(px, panelY / 2, pz)
      _offset.set(0, 2.5, 6.0).applyAxisAngle(Y_AXIS, ry)
      _goal.set(px + _offset.x, _offset.y, pz + _offset.z)
      _focusTarget.copy(_goalTarget)
    } else {
      _goal.copy(DEFAULT_CAM)
      _goalTarget.copy(DEFAULT_TARGET)
    }

    /* ── Animating ── */
    if (modeRef.current === 'animating') {
      lerpT.current = Math.min(1, lerpT.current + dt * 2.2)
      const t = 1 - Math.pow(1 - lerpT.current, 3)

      camera.position.lerpVectors(startCam.current, _goal, t)
      ctr.target.lerpVectors(startTarget.current, _goalTarget, t)
      ctr.update()

      if (
        camera.position.distanceToSquared(_goal) < ARRIVE_THRESHOLD &&
        ctr.target.distanceToSquared(_goalTarget) < ARRIVE_THRESHOLD
      ) {
        camera.position.copy(_goal)
        ctr.target.copy(_goalTarget)
        ctr.update()
        // Commit mode ONCE at the end of animation → single re-render
        commitMode(selectedService ? 'focus' : 'free')
      }
      return
    }

    /* ── Focus: clamp pan drift ── */
    if (modeRef.current === 'focus' && selectedService) {
      const drift = ctr.target.distanceTo(_focusTarget)
      if (drift > MAX_PAN_DRIFT) {
        ctr.target.lerp(_focusTarget, 0.15)
        ctr.update()
      }
    }
  })

  const isFree = mode === 'free'
  const isFocus = mode === 'focus'
  const isAnimating = mode === 'animating'

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={MAX_POLAR}
      /* NO target prop — we manage target imperatively via ctr.target */
      enabled={!isAnimating}
      enableZoom={!isAnimating}
      minDistance={isFocus ? 4 : 3}
      maxDistance={isFocus ? 9 : 22}
      enableRotate={isFree}
      enablePan={isFree || isFocus}
    />
  )
}
