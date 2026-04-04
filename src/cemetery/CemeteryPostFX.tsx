import { Bloom, EffectComposer, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

/**
 * Bloom: delikatna poświata na jasnych pikselach (napisy, emissive nagrobków).
 * Noise: ziarno filmowe / monitor CRT.
 */
export function CemeteryPostFX() {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
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
