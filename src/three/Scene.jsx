import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { scrollStore } from './scrollStore'
import { skyVertex, skyFragment, xVertex, xFragment, xHaloFragment } from './shaders'

const lerp = THREE.MathUtils.lerp
const damp = THREE.MathUtils.damp

const BLUE = new THREE.Color('#3d6bff')
const VIOLET = new THREE.Color('#7c3aed')
const BASE = new THREE.Color('#000000')

/* ── Smooths the shared scroll/pointer store once per frame ─────── */
function StoreSmoother() {
  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0015, dt)
    scrollStore.progress = lerp(scrollStore.progress, scrollStore.progressTarget, k)
    scrollStore.pointer.x = lerp(scrollStore.pointer.x, scrollStore.pointerTarget.x, k)
    scrollStore.pointer.y = lerp(scrollStore.pointer.y, scrollStore.pointerTarget.y, k)
  })
  return null
}

/* ── Animated nebula background (inside of a large sphere) ──────── */
function Nebula() {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uBase: { value: BASE.clone() },
      uCyan: { value: BLUE.clone() },
      uPurple: { value: VIOLET.clone() },
    }),
    []
  )

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uScroll.value = scrollStore.progress
  })

  return (
    <mesh scale={[40, 40, 40]}>
      <sphereGeometry args={[1, 48, 48]} />
      <shaderMaterial
        vertexShader={skyVertex}
        fragmentShader={skyFragment}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}

/* ── THE HEXTORQ "X" — the logo mark, in 3D, torquing on scroll ── */
function XMark() {
  const group = useRef()

  const uniforms = useMemo(
    () => ({
      uBlue: { value: BLUE.clone() },
      uViolet: { value: VIOLET.clone() },
    }),
    []
  )

  // Two crossing beams form the X. Shared geometry args.
  const beam = [0.62, 3.2, 0.62] // thickness, length, depth

  useFrame((state, dt) => {
    const p = scrollStore.progress
    const t = state.clock.elapsedTime
    const g = group.current
    if (!g) return

    // Drift across the page as you scroll + subtle pointer parallax.
    const targetX = Math.sin(p * Math.PI * 1.4) * 1.9 + scrollStore.pointer.x * 0.5
    const targetY = -p * 1.1 + Math.sin(p * Math.PI * 2.0) * 0.4 + scrollStore.pointer.y * 0.4
    const targetZ = -0.5 + Math.sin(p * Math.PI) * 1.0

    g.position.x = damp(g.position.x, targetX, 3, dt)
    g.position.y = damp(g.position.y, targetY, 3, dt)
    g.position.z = damp(g.position.z, targetZ, 3, dt)

    // TORQUE: continuous spin on Z, accelerated by scroll (the "torq").
    g.rotation.z += dt * (0.25 + p * 1.6)
    // 3D tilt from scroll + pointer for depth.
    g.rotation.y = damp(g.rotation.y, p * Math.PI * 0.9 + scrollStore.pointer.x * 0.5, 2.5, dt)
    g.rotation.x = damp(g.rotation.x, Math.sin(t * 0.4) * 0.12 + scrollStore.pointer.y * 0.3, 2.5, dt)

    const s = 1.0 + Math.sin(p * Math.PI) * 0.18 + Math.sin(t * 0.7) * 0.015
    g.scale.setScalar(damp(g.scale.x || 1, s, 3, dt))
  })

  const Material = (frag, extra = {}) => (
    <shaderMaterial vertexShader={xVertex} fragmentShader={frag} uniforms={uniforms} {...extra} />
  )

  return (
    <group ref={group}>
      {/* solid gradient X */}
      <group rotation={[0, 0, Math.PI * 0.3]}>
        <RoundedBox args={beam} radius={0.16} smoothness={4}>
          {Material(xFragment)}
        </RoundedBox>
      </group>
      <group rotation={[0, 0, -Math.PI * 0.3]}>
        <RoundedBox args={beam} radius={0.16} smoothness={4}>
          {Material(xFragment)}
        </RoundedBox>
      </group>

      {/* slightly larger additive aura, same shape → soft glow */}
      <group rotation={[0, 0, Math.PI * 0.3]} scale={1.16}>
        <RoundedBox args={beam} radius={0.16} smoothness={2}>
          {Material(xHaloFragment, {
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.BackSide,
          })}
        </RoundedBox>
      </group>
      <group rotation={[0, 0, -Math.PI * 0.3]} scale={1.16}>
        <RoundedBox args={beam} radius={0.16} smoothness={2}>
          {Material(xHaloFragment, {
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.BackSide,
          })}
        </RoundedBox>
      </group>
    </group>
  )
}

/* ── Drifting particle field ────────────────────────────────────── */
function Particles({ count = 1400 }) {
  const points = useRef()

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 16
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  useFrame((_, dt) => {
    const pts = points.current
    if (!pts) return
    pts.rotation.y += dt * 0.015
    pts.rotation.x = damp(pts.rotation.x, scrollStore.progress * 0.6, 2, dt)
    pts.position.x = damp(pts.position.x, scrollStore.pointer.x * 0.5, 2, dt)
    pts.position.y = damp(pts.position.y, scrollStore.pointer.y * 0.35, 2, dt)
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        sizeAttenuation
        color={'#7fa0ff'}
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 3, 5]} intensity={30} color={'#3d6bff'} distance={40} />
      <pointLight position={[-5, -2, 4]} intensity={28} color={'#7c3aed'} distance={40} />
    </>
  )
}

/* ── Orbiting satellite shards — small facets circling the X ────── */
function Orbiters({ count = 5 }) {
  const group = useRef()
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        radius: 2.6 + (i % 3) * 0.7,
        speed: 0.15 + (i % 4) * 0.06,
        phase: (i / count) * Math.PI * 2,
        tilt: (i - count / 2) * 0.35,
        size: 0.12 + (i % 3) * 0.05,
      })),
    [count]
  )

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    // The whole ring drifts with the X and tilts with scroll.
    g.rotation.x = damp(g.rotation.x, scrollStore.progress * 1.2, 2.5, dt)
    g.rotation.z += dt * 0.05
    g.children.forEach((m, i) => {
      const s = seeds[i]
      const a = t * s.speed + s.phase
      m.position.set(Math.cos(a) * s.radius, Math.sin(a) * s.radius * 0.5 + s.tilt, Math.sin(a) * s.radius)
      m.rotation.x += dt * 0.6
      m.rotation.y += dt * 0.4
    })
  })

  return (
    <group ref={group}>
      {seeds.map((s, i) => (
        <mesh key={i} scale={s.size}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={i % 2 ? '#7c3aed' : '#3d6bff'}
            emissive={i % 2 ? '#7c3aed' : '#3d6bff'}
            emissiveIntensity={1.6}
            roughness={0.3}
            metalness={0.7}
            flatShading
          />
        </mesh>
      ))}
    </group>
  )
}

/* ── Scroll-driven camera dolly + drift ─────────────────────────── */
function CameraRig() {
  useFrame((state, dt) => {
    const p = scrollStore.progress
    const cam = state.camera
    // Dolly back + rise slightly through the journey; sway with pointer.
    const tx = scrollStore.pointer.x * 0.8
    const ty = 0.4 + scrollStore.pointer.y * 0.6 - p * 0.6
    const tz = 6 + p * 1.6
    cam.position.x = damp(cam.position.x, tx, 2, dt)
    cam.position.y = damp(cam.position.y, ty, 2, dt)
    cam.position.z = damp(cam.position.z, tz, 2, dt)
    cam.lookAt(0, -p * 0.8, 0)
  })
  return null
}

export default function Scene() {
  return (
    <Canvas
      className="webgl-canvas"
      // Inline style overrides R3F's default `position:relative;height:100%`
      // container styles, which otherwise collapse the canvas height.
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
      }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.4, 6], fov: 45 }}
    >
      <StoreSmoother />
      <CameraRig />
      <Nebula />
      <Lights />
      <XMark />
      <Orbiters />
      <Particles />
    </Canvas>
  )
}
