import * as THREE from 'three'

const vertexShader = /* glsl */ `
varying vec3 vWorldPosition;
void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = /* glsl */ `
varying vec3 vWorldPosition;
void main() {
  vec3 dir = normalize(vWorldPosition);
  float t = smoothstep(-0.45, 0.55, dir.y);
  vec3 nadir = vec3(0.01, 0.008, 0.018);
  vec3 horizon = vec3(0.04, 0.02, 0.07);
  vec3 zenith = vec3(0.09, 0.035, 0.14);
  vec3 col = mix(nadir, horizon, smoothstep(-0.2, 0.15, dir.y));
  col = mix(col, zenith, t);
  gl_FragColor = vec4(col, 1.0);
}
`

/** Wewnętrzna kopuła — gradient fiolet–czerń. */
export function GradientSky() {
  return (
    <mesh renderOrder={-1000}>
      <sphereGeometry args={[120, 48, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.BackSide}
        depthWrite={false}
        depthTest
        fog={false}
      />
    </mesh>
  )
}
