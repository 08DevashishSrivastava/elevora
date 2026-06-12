'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { Float, OrbitControls, Stars } from '@react-three/drei'

// A glowing central orb representing the brand core
function BrandCore() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      // Rotation and heartbeat pulse
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.03
      meshRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <mesh 
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <icosahedronGeometry args={[1.2, 2]} />
      <meshStandardMaterial 
        color={hovered ? "#3b82f6" : "#7c3aed"} 
        wireframe={true} 
        transparent 
        opacity={0.7}
        emissive={hovered ? "#1d4ed8" : "#5b21b6"}
        emissiveIntensity={1.5}
      />
    </mesh>
  )
}

// Upward-climbing growth column charts in 3D
function GrowthBars() {
  const groupRef = useRef<THREE.Group>(null)

  const bars = useMemo(() => {
    const list = []
    const count = 5
    for (let i = 0; i < count; i++) {
      // Ascending height representing growth
      const height = 0.5 + i * 0.6
      const angle = (i / count) * Math.PI * 2
      const radius = 1.8
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      // Shift base so they stand on a plane
      const y = height / 2 - 1.5
      list.push({ id: i, x, y, z, height })
    }
    return list
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -state.clock.getElapsedTime() * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      {bars.map((bar) => (
        <group key={bar.id} position={[bar.x, bar.y, bar.z]}>
          {/* Main rising column */}
          <mesh>
            <boxGeometry args={[0.25, bar.height, 0.25]} />
            <meshStandardMaterial 
              color="#3b82f6" 
              roughness={0.1}
              metalness={0.9}
              emissive="#1e3a8a"
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Glowing node cap on top */}
          <mesh position={[0, bar.height / 2, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial 
              color="#a78bfa" 
              emissive="#7c3aed"
              emissiveIntensity={2}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// Orbiting channels (satellites) representing Google Search, Social Media, Conversion Engine
function OrbitingChannels() {
  const groupRef = useRef<THREE.Group>(null)

  const channels = useMemo(() => [
    { id: 1, radius: 2.5, speed: 0.8, color: "#f59e0b", size: 0.15, label: 'SEO' },
    { id: 2, radius: 3.2, speed: 0.5, color: "#3b82f6", size: 0.18, label: 'PPC' },
    { id: 3, radius: 2.8, speed: -0.6, color: "#ec4899", size: 0.14, label: 'CRO' },
    { id: 4, radius: 3.6, speed: 0.4, color: "#10b981", size: 0.16, label: 'BRAND' },
  ], [])

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime()
      // Rotate each channel independently
      groupRef.current.children.forEach((child, index) => {
        const chan = channels[index]
        if (chan) {
          const angle = time * chan.speed + (index * Math.PI) / 2
          child.position.x = Math.cos(angle) * chan.radius
          child.position.z = Math.sin(angle) * chan.radius
          child.position.y = Math.sin(time + index) * 0.3 // gentle wave
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {channels.map((chan) => (
        <group key={chan.id}>
          {/* Orbiting sphere */}
          <mesh>
            <sphereGeometry args={[chan.size, 16, 16]} />
            <meshStandardMaterial 
              color={chan.color} 
              emissive={chan.color}
              emissiveIntensity={1.2}
              roughness={0.2}
            />
          </mesh>
          {/* Orbital path ring (faint) */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[chan.radius - 0.01, chan.radius + 0.01, 64]} />
            <meshBasicMaterial color="#ffffff" opacity={0.03} transparent depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function Agency3D() {
  return (
    <div className="relative w-full h-[450px] md:h-[550px] cursor-grab active:cursor-grabbing rounded-3xl overflow-hidden bg-gradient-to-b from-[#0a0a0a]/80 via-[#120b24]/40 to-[#0b1329]/50 border border-white/10 shadow-2xl">
      
      {/* HUD Metrics Overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none font-mono">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/20 bg-[#0a0a0a]/80 backdrop-blur-md text-[10px] text-purple-400 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping"></span>
          ELEVORA SCALING ENGINE v1.2
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-10 pointer-events-none font-mono text-[10px] text-zinc-400 space-y-1 bg-[#0a0a0a]/50 p-3 rounded-lg backdrop-blur-sm border border-white/5">
        <div>CORE: <span className="text-purple-400">ACTIVE</span></div>
        <div>TRAFFIC LIFT: <span className="text-emerald-400">+340%</span></div>
        <div>ACQUISITION COST: <span className="text-sky-400">-45%</span></div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 pointer-events-none text-right font-mono text-[9px] text-zinc-500">
        DRAG TO ROTATE DATA MATRIX <br />
        SCROLL TO ADJUST CAMERA
      </div>

      <Canvas camera={{ position: [0, 1.5, 6.5], fov: 40 }}>
        {/* Lights */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#7c3aed" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        <directionalLight position={[0, 5, 5]} intensity={1.0} color="#3b82f6" />
        <directionalLight position={[0, -5, -5]} intensity={0.8} color="#7c3aed" />

        {/* Ambient Star particles */}
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0.5} fade speed={1.5} />

        {/* 3D Elements */}
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
          <BrandCore />
          <GrowthBars />
          <OrbitingChannels />
        </Float>

        {/* Interactive Controls */}
        <OrbitControls enableZoom={true} maxDistance={10} minDistance={4} autoRotate={false} />
      </Canvas>
    </div>
  )
}
