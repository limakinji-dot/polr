"use client";
import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Stars, Trail } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/lib/store";

function CoreSphere({
  isProfit,
  phase,
  spinning,
}: {
  isProfit: boolean;
  phase: number; // 0=calm, 1=excited, 2=spinning
  spinning: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringRef  = useRef<THREE.Mesh>(null);

  const colorProfit = new THREE.Color("#00d4ff");
  const colorLoss   = new THREE.Color("#ff4d6d");
  const baseColor   = isProfit ? colorProfit : colorLoss;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    // Rotation speed by phase
    const rotSpeed = spinning ? 3 : phase === 1 ? 0.6 : 0.15;
    meshRef.current.rotation.y += 0.005 * rotSpeed;
    meshRef.current.rotation.x  = Math.sin(t * 0.3) * 0.1;

    // Float
    meshRef.current.position.y = Math.sin(t * 0.7) * 0.08;

    // Ring rotation
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.003 * rotSpeed;
      ringRef.current.rotation.x  = Math.PI / 2 + Math.sin(t * 0.2) * 0.1;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= 0.008;
    }
  });

  const ringGeom = useMemo(() => new THREE.TorusGeometry(1.45, 0.015, 8, 100), []);

  return (
    <group>
      {/* Outer halo ring */}
      <mesh ref={ringRef} geometry={ringGeom}>
        <meshBasicMaterial color={baseColor} transparent opacity={0.4} />
      </mesh>

      {/* Second ring */}
      <mesh rotation={[Math.PI / 3, 0, Math.PI / 4]}>
        <torusGeometry args={[1.7, 0.008, 8, 100]} />
        <meshBasicMaterial color={baseColor} transparent opacity={0.18} />
      </mesh>

      {/* Main orb */}
      <Sphere ref={meshRef} args={[1, 80, 80]}>
        <MeshDistortMaterial
          color={baseColor}
          distort={spinning ? 0.6 : phase === 1 ? 0.35 : 0.2}
          speed={spinning ? 8 : phase === 1 ? 3 : 1.5}
          roughness={0}
          metalness={0.3}
          emissive={baseColor}
          emissiveIntensity={spinning ? 0.8 : 0.3}
          transparent
          opacity={0.85}
        />
      </Sphere>

      {/* Inner core glow */}
      <Sphere ref={innerRef} args={[0.55, 32, 32]}>
        <meshBasicMaterial color={baseColor} transparent opacity={0.25} />
      </Sphere>

      {/* Point light */}
      <pointLight color={baseColor} intensity={spinning ? 8 : 3} distance={6} decay={2} />
    </group>
  );
}

function Particles({ count = 200, isProfit }: { count?: number; isProfit: boolean }) {
  const pts = useRef<THREE.Points>(null);
  const color = isProfit ? "#00d4ff" : "#ff4d6d";

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (pts.current) {
      pts.current.rotation.y = state.clock.elapsedTime * 0.04;
    }
  });

  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.025} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export default function TradingCore({
  phase = 0,
  className = "",
}: {
  phase?: number;
  className?: string;
}) {
  const isProfit = useStore((s) => s.isProfit);
  const spinning = phase === 2;

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <Stars radius={40} depth={20} count={1000} factor={0.5} fade speed={0.5} />
          <Particles isProfit={isProfit} />
          <CoreSphere isProfit={isProfit} phase={phase} spinning={spinning} />
        </Suspense>
      </Canvas>
    </div>
  );
}
