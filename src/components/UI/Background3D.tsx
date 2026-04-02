/* eslint-disable react-hooks/purity */
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sphere, Torus, Octahedron } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

export function FloatingMeshes() {
  const groupRef = useRef<THREE.Group>(null);
  const { theme } = useStore();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * Math.PI;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.5;
    }
  });

  const materialColor = theme === 'dark' ? '#3b82f6' : '#14b8a6'; // Indigo vs Teal
  const materialSecondary = theme === 'dark' ? '#ec4899' : '#f59e0b'; // Pink vs Amber

  const geometries = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      speed: 1.2 + Math.random() * 2,
      pos: [
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 25 - 5
      ] as [number, number, number],
      type: i % 3,
      materialVariant: i % 2 === 0,
      wireframe: i % 5 === 0,
      transmission: i % 4 !== 0 ? 0.9 : 0,
      sphereArgs: [0.5 + Math.random() * 1.2, 32, 32] as [number, number, number],
      torusArgs: [0.4 + Math.random() * 0.6, 0.15 + Math.random() * 0.1, 16, 32] as [number, number, number, number],
      octaArgs: [0.6 + Math.random() * 0.8] as [number]
    }));
  }, []);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={theme === 'dark' ? 0.2 : 0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color={materialColor} />
      <pointLight position={[-10, -10, -5]} intensity={2} color={materialSecondary} />
      <hemisphereLight intensity={0.5} groundColor={theme === 'dark' ? '#0f172a' : '#ffffff'} />
      
      {geometries.map((geom) => (
        <Float 
          key={geom.id} 
          speed={geom.speed} 
          rotationIntensity={1.5} 
          floatIntensity={2} 
          position={geom.pos}
        >
           {geom.type === 0 ? (
             <Sphere args={geom.sphereArgs}>
               <meshPhysicalMaterial 
                 color={geom.materialVariant ? materialColor : materialSecondary} 
                 wireframe={geom.wireframe} 
                 roughness={0.1} 
                 metalness={0.8}
                 transmission={geom.transmission} 
                 thickness={1}
               />
             </Sphere>
           ) : geom.type === 1 ? (
             <Torus args={geom.torusArgs}>
               <meshPhysicalMaterial 
                 color={geom.materialVariant ? materialColor : materialSecondary} 
                 wireframe={geom.wireframe} 
                 roughness={0.2} 
                 metalness={0.9} 
                 transmission={0.4}
               />
             </Torus>
           ) : (
             <Octahedron args={geom.octaArgs}>
               <meshStandardMaterial 
                 color={geom.materialVariant ? materialColor : materialSecondary} 
                 wireframe={geom.wireframe} 
                 roughness={0.4} 
                 metalness={0.6} 
               />
             </Octahedron>
           )}
        </Float>
      ))}
    </group>
  );
}

export function Background3D() {
  const { theme } = useStore();
  
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none transition-colors duration-1000 bg-slate-50 dark:bg-[#080B14]">
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }} dpr={[1, 2]}>
        <Environment preset={theme === 'dark' ? "city" : "apartment"} />
        <FloatingMeshes />
      </Canvas>
      {/* Fog/Blur Overlay targeting the exact effect of mixing colors organically */}
      <div className="absolute inset-0 bg-white/20 dark:bg-slate-950/60 backdrop-blur-[6px] pointer-events-none transition-colors duration-1000" />
    </div>
  );
}
