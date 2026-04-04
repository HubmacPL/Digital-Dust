import { MeshReflectorMaterial, Stars } from '@react-three/drei'
import { CameraManager } from './CameraManager'
import { CemeteryPostFX } from './CemeteryPostFX'
import { CyberFireflies } from './CyberFireflies'
import { DigitalDust } from './DigitalDust'
import { GradientSky } from './GradientSky'
import { MouseFollowSpotlight } from './MouseFollowSpotlight'
import { Tombstone } from './Tombstone'
import { getOrganicTransforms } from './organicLayout'
import type { TombstoneData } from './types'

type CemeterySceneProps = {
  services: TombstoneData[]
}

export function CemeteryScene({ services }: CemeterySceneProps) {
  const transforms = getOrganicTransforms(services)

  return (
    <>
      <color attach="background" args={['#020108']} />
      <fog attach="fog" args={['#080510', 9, 36]} />

      <GradientSky />
      <Stars
        radius={95}
        depth={52}
        count={550}
        factor={2.2}
        saturation={0.12}
        fade
        speed={0.08}
      />

      <ambientLight intensity={0.06} color="#4a4580" />
      <directionalLight
        position={[-6, 10, -4]}
        intensity={0.18}
        color="#8890b0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={40}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />

      <MouseFollowSpotlight />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[56, 56]} />
        <MeshReflectorMaterial
          blur={[340, 110]}
          resolution={1024}
          mixBlur={1}
          mixStrength={0.82}
          mirror={0.38}
          reflectorOffset={0.015}
          minDepthThreshold={0.22}
          maxDepthThreshold={1.4}
          depthScale={0.65}
          metalness={0.12}
          roughness={0.94}
          color="#030204"
        />
      </mesh>

      {services.map((svc, i) => {
        const { position, rotationY } = transforms[i]
        return (
          <Tombstone
            key={svc.id}
            {...svc}
            position={position}
            rotationY={rotationY}
          />
        )
      })}

      {/* Cyfrowy pył wokół każdego nagrobka */}
      {services.map((svc, i) => (
        <DigitalDust
          key={`dust-${svc.id}`}
          position={transforms[i].position}
          popularity={svc.popularity}
        />
      ))}

      {/* Świetliki rozrzucone po scenie */}
      <CyberFireflies />

      <CameraManager />

      <CemeteryPostFX />
    </>
  )
}
