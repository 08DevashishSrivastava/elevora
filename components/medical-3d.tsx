'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { Float, OrbitControls } from '@react-three/drei'

// A rotating, floating DNA helix component
function DnaHelix() {
  const groupRef = useRef<THREE.Group>(null)

  // Generate sphere positions for DNA ladder
  const spheres = useMemo(() => {
    const list = []
    const count = 16
    const radius = 1.2
    const pitch = 0.4

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 4 // two full turns
      const y = (i - count / 2) * pitch

      // Strand A
      const xA = Math.cos(angle) * radius
      const zA = Math.sin(angle) * radius

      // Strand B
      const xB = Math.cos(angle + Math.PI) * radius
      const zB = Math.sin(angle + Math.PI) * radius

      list.push({
        id: `s-${i}`,
        posA: new THREE.Vector3(xA, y, zA),
        posB: new THREE.Vector3(xB, y, zB),
      })
    }
    return list
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle spin
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.4
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {spheres.map((node, i) => (
        <group key={node.id}>
          {/* Strand A Sphere (Cyan) */}
          <mesh position={node.posA}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.1} metalness={0.8} emissive="#083344" emissiveIntensity={0.2} />
          </mesh>

          {/* Strand B Sphere (Purple) */}
          <mesh position={node.posB}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#8b5cf6" roughness={0.1} metalness={0.8} emissive="#2e1065" emissiveIntensity={0.2} />
          </mesh>

          {/* Connecting ladder bar */}
          <mesh 
            position={new THREE.Vector3().addVectors(node.posA, node.posB).multiplyScalar(0.5)}
            rotation={[0, 0, Math.atan2(node.posB.y - node.posA.y, node.posB.x - node.posA.x)]}
          >
            <cylinderGeometry args={[0.03, 0.03, node.posA.distanceTo(node.posB), 8]} />
            <meshStandardMaterial color="#cbd5e1" opacity={0.6} transparent roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// Organic floating node in background
function FloatingSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.2
      meshRef.current.rotation.z += 0.005
      meshRef.current.rotation.y += 0.005
    }
  })

  return (
    <mesh ref={meshRef} position={[-2.5, 1.5, -1]}>
      <octahedronGeometry args={[0.6, 2]} />
      <meshStandardMaterial 
        color="#10b981" 
        wireframe 
        opacity={0.3} 
        transparent
      />
    </mesh>
  )
}

export default function Medical3D() {
  return (
    <div className="relative w-full h-[450px] md:h-[600px] cursor-grab active:cursor-grabbing rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900/40 via-teal-950/10 to-indigo-950/20 backdrop-blur-md border border-slate-800/50 shadow-2xl">
      
      {/* Visual Overlay UI details */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/20 bg-slate-900/60 backdrop-blur-md text-[11px] text-teal-400 font-mono tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
          Interactive 3D Visualizer
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 pointer-events-none text-right font-mono text-[10px] text-slate-500">
        ROTATE TO EXPLORE <br />
        DRAG & SPIN MESH
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        {/* Lights */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <directionalLight position={[0, 5, 0]} intensity={1.0} color="#06b6d4" />
        <directionalLight position={[0, -5, 0]} intensity={1.0} color="#8b5cf6" />

        {/* 3D Elements */}
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.6}>
          <DnaHelix />
        </Float>
        <FloatingSphere />

        {/* Interactive Controls */}
        <OrbitControls enableZoom={false} autoRotate={false} />
      </Canvas>
    </div>
  )
}
