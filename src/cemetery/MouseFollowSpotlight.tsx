import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const GROUND_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const HIT = new THREE.Vector3()

/**
 * Delikatny reflektor podążający za kursorem (rzut promienia z pointera na y=0).
 */
export function MouseFollowSpotlight() {
  const lightRef = useRef<THREE.SpotLight>(null)
  const { camera, scene } = useThree()

  useEffect(() => {
    const light = lightRef.current
    if (!light) return
    scene.add(light.target)
    return () => {
      scene.remove(light.target)
    }
  }, [scene])

  useFrame(({ raycaster, pointer }) => {
    const light = lightRef.current
    if (!light) return

    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.ray.intersectPlane(GROUND_PLANE, HIT)
    if (!hit) return

    light.target.position.copy(HIT)
    light.target.updateMatrixWorld()

    // Niżej i bliżej celu = jaśniejsza plama (mniej rozproszenia po drodze).
    light.position.set(HIT.x + 1.4, 5.2, HIT.z + 1.2)
  })

  return (
    <spotLight
      ref={lightRef}
      color="#e8e0ff"
      intensity={420}
      distance={70}
      angle={0.52}
      penumbra={0.72}
      decay={2}
      castShadow
      shadow-mapSize={[1024, 1024]}
      shadow-bias={-0.0002}
    />
  )
}
