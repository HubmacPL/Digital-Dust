import type { ThreeEvent } from '@react-three/fiber'
import { useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useGraveSelection } from '../context/GraveSelectionContext'
import { FONT_HEADSTONE_DATE, FONT_HEADSTONE_TITLE } from './fonts'
import { GhostPortal } from './GhostPortal'
import type { TombstoneProps } from './types'
import { getStoneNoiseTexture } from './textures/stoneNoiseTexture'
import { useTombstoneHoverSound } from './useTombstoneHoverSound'

const BODY = { w: 0.55, h: 1.05, d: 0.14 }
const CAP_R = BODY.w * 0.52

const INTERACTION_RANGE = 12

const _tombPos = new THREE.Vector3()

export function Tombstone({
  id,
  name,
  originDate,
  deathDate,
  color,
  longDescription,
  waybackUrl,
  popularity = 50,
  position = [0, 0, 0],
  rotationY = 0,
}: TombstoneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const bodyMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const capMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const [hovered, setHovered] = useState(false)
  const { selectedService, setSelectedService } = useGraveSelection()
  const { start: playHoverSound, stop: stopHoverSound } = useTombstoneHoverSound(id)
  const { camera } = useThree()

  const selected = selectedService?.id === id

  const baseColor = useMemo(() => new THREE.Color(color), [color])
  const stoneNoise = useMemo(() => getStoneNoiseTexture(), [])
  const noiseOffset = useMemo(() => Math.random() * 100, [])
  const targetEmissiveColor = useRef(new THREE.Color('#a8d8ff'))

  const isInRange = () => {
    _tombPos.set(position[0], position[1], position[2])
    return camera.position.distanceTo(_tombPos) <= INTERACTION_RANGE
  }

  useEffect(() => {
    stopHoverSound()
  }, [selected])

  useFrame((state, delta) => {
    const g = groupRef.current
    const bodyM = bodyMatRef.current
    const capM = capMatRef.current
    const time = state.clock.elapsedTime + noiseOffset
    if (!g || !bodyM || !capM) return

    const emissiveTarget = hovered || selected ? 0.82 : 0
    bodyM.emissiveIntensity = THREE.MathUtils.lerp(
      bodyM.emissiveIntensity,
      emissiveTarget,
      1 - Math.exp(-12 * delta),
    )
    capM.emissiveIntensity = bodyM.emissiveIntensity

    if (hovered && !selected) {
      const intensity = 0.004
      g.position.x = Math.sin(time * 17.3) * intensity + Math.sin(time * 31.7) * intensity * 0.5
      g.position.z = Math.sin(time * 23.1) * intensity + Math.sin(time * 41.9) * intensity * 0.5
    } else {
      g.position.x = THREE.MathUtils.lerp(g.position.x, 0, 1 - Math.exp(-10 * delta))
      g.position.z = THREE.MathUtils.lerp(g.position.z, 0, 1 - Math.exp(-10 * delta))
    }

    const targetEmissive = hovered ? targetEmissiveColor.current : baseColor
    bodyM.emissive.lerp(targetEmissive, 1 - Math.exp(-8 * delta))
    capM.emissive.copy(bodyM.emissive)
  })

  const handlePointerEnter = (e: ThreeEvent<PointerEvent>) => {
    if (!isInRange()) return
    if(selectedService !== null) return
    e.stopPropagation()
    setHovered(true)
    if (!selectedService) playHoverSound()
  }

  const handlePointerLeave = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(false)
    stopHoverSound()
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!isInRange()) return
    e.stopPropagation()

    if (selectedService?.id === id) {
      // Odznaczamy ten sam nagrobek — zawsze ok
      stopHoverSound()
      setSelectedService(null)
      return
    }

    // Inny nagrobek jest wybrany (tryb focused) — blokuj przeskoczenie
    if (selectedService !== null) return

    stopHoverSound()
    setSelectedService({
      id,
      name,
      originDate,
      deathDate,
      color,
      longDescription,
      waybackUrl,
      popularity,
      worldPosition: position,
      rotationY,
    })
  }

  const capY = BODY.h / 2 + CAP_R * 0.92

  const servicePayload = useMemo(
    () => ({ id, name, originDate, deathDate, color, longDescription, waybackUrl, popularity }),
    [id, name, originDate, deathDate, color, longDescription, waybackUrl, popularity],
  )

  const scale = 1 + (popularity / 100) * 1.2

  return (
    <>
      <group position={position} rotation-y={rotationY}>
        <GhostPortal service={servicePayload} visible={selected} />
      </group>
      <group position={position} rotation-y={rotationY} scale={scale}>
        <group
          ref={groupRef}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
        >
          <mesh castShadow receiveShadow position={[0, BODY.h / 2, 0]}>
            <boxGeometry args={[BODY.w, BODY.h, BODY.d]} />
            <meshStandardMaterial
              ref={bodyMatRef}
              color={baseColor}
              emissive={baseColor}
              emissiveIntensity={0}
              metalness={0.06}
              roughness={0.82}
              roughnessMap={stoneNoise}
              bumpMap={stoneNoise}
              bumpScale={0.038}
            />
          </mesh>
          <mesh castShadow receiveShadow position={[0, capY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <sphereGeometry args={[CAP_R, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              ref={capMatRef}
              color={baseColor}
              emissive={baseColor}
              emissiveIntensity={0}
              metalness={0.05}
              roughness={0.84}
              roughnessMap={stoneNoise}
              bumpMap={stoneNoise}
              bumpScale={0.032}
            />
          </mesh>
          <Text
            font={FONT_HEADSTONE_TITLE}
            position={[0, BODY.h * 0.55, BODY.d / 2 + 0.01]}
            fontSize={0.1}
            maxWidth={BODY.w - 0.08}
            color="#f2ecff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.018}
            outlineColor="#0a0610"
            outlineOpacity={1}
            fillOpacity={1}
          >
            {name}
          </Text>
          <Text
            font={FONT_HEADSTONE_DATE}
            position={[0, BODY.h * 0.28, BODY.d / 2 + 0.01]}
            fontSize={0.056}
            maxWidth={BODY.w - 0.08}
            color="#c5bdd8"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.012}
            outlineColor="#050308"
            outlineOpacity={0.95}
            letterSpacing={0.04}
          >
            {originDate} – {deathDate}
          </Text>
        </group>
      </group>
    </>
  )
}