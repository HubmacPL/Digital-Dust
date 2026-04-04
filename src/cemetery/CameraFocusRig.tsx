import { useFrame, useThree } from '@react-three/fiber'
import { damp3 } from 'maath/easing'
import { useEffect, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { useGraveSelection } from '../context/GraveSelectionContext'

const DEFAULT_CAM = new THREE.Vector3(5.5, 3.8, 9.2)
const DEFAULT_TARGET = new THREE.Vector3(0, 0.4, 0)
const Y_AXIS = new THREE.Vector3(0, 1, 0)

const _offset = new THREE.Vector3()
const _goalCam = new THREE.Vector3()
const _goalTarget = new THREE.Vector3()

type CameraFocusRigProps = {
  controlsRef: RefObject<{ target: THREE.Vector3; update: () => void } | null>
}

/**
 * Płynne zbliżenie do nagrobka / powrót — maath damp3.
 * Rig dezaktywuje się gdy kamera dojdzie do celu, oddając kontrolę OrbitControls.
 */
export function CameraFocusRig({ controlsRef }: CameraFocusRigProps) {
  const { selectedService } = useGraveSelection()
  const { camera } = useThree()
  // First frame: snap to start without animation
  const ready = useRef(false)
  // Whether rig should override camera this frame
  const rigActive = useRef(true)
  // Track last selected id to detect changes
  const prevId = useRef<string | null>(null)

  // Block wheel zoom while rig is animating; cancel rig on pointer drag
  useEffect(() => {
    const blockWheel = (e: WheelEvent) => {
      if (rigActive.current) e.preventDefault()
    }
    const cancelOnPointer = () => { rigActive.current = false }
    window.addEventListener('wheel', blockWheel, { passive: false })
    window.addEventListener('pointerdown', cancelOnPointer, { passive: true })
    return () => {
      window.removeEventListener('wheel', blockWheel)
      window.removeEventListener('pointerdown', cancelOnPointer)
    }
  }, [])

  useFrame((_, dt) => {
    const ctr = controlsRef.current
    if (!ctr) return

    // Re-activate rig on any selection change (including null → null is a no-op)
    const currentId = selectedService?.id ?? null
    if (currentId !== prevId.current) {
      prevId.current = currentId
      rigActive.current = true
    }

    // First frame: snap immediately, then hand off to OrbitControls
    if (!ready.current) {
      ready.current = true
      camera.position.copy(DEFAULT_CAM)
      ctr.target.copy(DEFAULT_TARGET)
      ctr.update()
      rigActive.current = false
      return
    }

    // Rig idle — OrbitControls has full control
    if (!rigActive.current) return

    if (selectedService) {
      const [px, , pz] = selectedService.worldPosition
      const ry = selectedService.rotationY
      // Panel Y = tombstoneTop * scale + 1.2; camera targets midpoint
      const pop = selectedService.popularity ?? 50
      const tombScale = 1 + (pop / 100) * 1.2
      // PANEL_H=3.4, gap=0.3 — must match GhostPortal constants
      const panelY = 1.1 * tombScale + 3.4 / 2 + 0.3
      _goalTarget.set(px, panelY / 2, pz)
      _offset.set(0, 2.5, 6.0)
      _offset.applyAxisAngle(Y_AXIS, ry)
      _goalCam.set(px + _offset.x, _offset.y, pz + _offset.z)
    } else {
      _goalCam.copy(DEFAULT_CAM)
      _goalTarget.copy(DEFAULT_TARGET)
    }

    damp3(camera.position, _goalCam, selectedService ? 8.0 : 4.5, dt)
    damp3(ctr.target, _goalTarget, selectedService ? 8.0 : 4.5, dt)
    ctr.update()

    // Deactivate once camera reaches goal — hands control back to OrbitControls (zoom, rotate, pan)
    if (
      camera.position.distanceToSquared(_goalCam) < 0.01 &&
      ctr.target.distanceToSquared(_goalTarget) < 0.01
    ) {
      camera.position.copy(_goalCam)
      ctr.target.copy(_goalTarget)
      ctr.update()
      rigActive.current = false
    }
  })

  return null
}
