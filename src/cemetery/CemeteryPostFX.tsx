import { Bloom, DepthOfField, EffectComposer, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useGraveSelection } from '../context/GraveSelectionContext'
import { useMemo } from 'react'
import * as THREE from 'three'

export function CemeteryPostFX() {
  const { selectedService } = useGraveSelection()

  // target = undefined gdy brak wyboru → wyłącza tryb autofokus
  // target = Vector3 → postprocessing sam wylicza odległość kamery od punktu każdą klatkę
  const focusTarget = useMemo(() => {
    if (!selectedService) return undefined
    const [x, , z] = selectedService.worldPosition
    return new THREE.Vector3(x, 1.5, z)
  }, [selectedService])

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <DepthOfField
        target={focusTarget}

        // focusRange: strefa ostrości w JEDNOSTKACH ŚWIATA (nowe API postprocessing v6.39+)
        // focalLength było deprecated i ignorowane — stąd efekt nie działał.
        // focusRange=5 → obiekty w promieniu ±5 jednostek od nagrobka są ostre.
        // Nagrobek ~7j od kamery, tło ~20-30j → tło wyraźnie rozmyte.
        focusRange={5}

        bokehScale={selectedService ? 5 : 0}
      />

      <Bloom
        luminanceThreshold={0.28}
        luminanceSmoothing={0.45}
        intensity={1.05}
        mipmapBlur
        radius={0.72}
        levels={7}
      />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.07} />
    </EffectComposer>
  )
}