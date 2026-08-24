import React, { useState, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BuildingData } from '../../types/city';

interface BuildingProps {
  building: BuildingData;
}

export const Building: React.FC<BuildingProps> = ({ building }) => {
  const [hovered, setHovered] = useState(false);
  const meshGroupRef = useRef<THREE.Group>(null);
  
  // Animated height growth state (0 to 1) for building rise entrance
  const progressRef = useRef(0);

  const [x, targetY, z] = building.position;
  const { width, height, depth, colorHex, difficulty, topic } = building;

  useFrame((_, delta) => {
    if (progressRef.current < 1) {
      progressRef.current = Math.min(progressRef.current + delta * 1.5, 1);
      if (meshGroupRef.current) {
        // Smooth ease-out cubic growth animation
        const ease = 1 - Math.pow(1 - progressRef.current, 3);
        meshGroupRef.current.scale.y = ease;
        meshGroupRef.current.position.y = (height * ease) / 2;
      }
    }
  });

  return (
    <group position={[x, targetY, z]}>
      <group ref={meshGroupRef}>
        {/* 1. Base Podium Step */}
        <mesh position={[0, -height / 2 + 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width + 0.3, 0.4, depth + 0.3]} />
          <meshStandardMaterial color="#1E293B" roughness={0.7} metalness={0.3} />
        </mesh>

        {/* 2. Main Architectural Tower Body */}
        <mesh
          castShadow
          receiveShadow
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        >
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial
            color={hovered ? '#FFFFFF' : colorHex}
            roughness={0.15}
            metalness={0.5}
            emissive={colorHex}
            emissiveIntensity={hovered ? 0.7 : 0.3}
          />
        </mesh>

        {/* 3. Glass Window Grid Strips */}
        <mesh position={[0, 0, depth / 2 + 0.01]}>
          <planeGeometry args={[width * 0.8, height * 0.85]} />
          <meshBasicMaterial color="#0F172A" transparent opacity={0.5} />
        </mesh>
        <mesh position={[0, 0, -depth / 2 - 0.01]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[width * 0.8, height * 0.85]} />
          <meshBasicMaterial color="#0F172A" transparent opacity={0.5} />
        </mesh>

        {/* 4. Upper Recessed Setback Shaft (For tall buildings > 5.0m) */}
        {height > 5.0 && (
          <mesh position={[0, height / 2 + 0.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[width * 0.7, 1.6, depth * 0.7]} />
            <meshStandardMaterial
              color={colorHex}
              emissive={colorHex}
              emissiveIntensity={0.6}
              roughness={0.1}
            />
          </mesh>
        )}

        {/* 5. Roof Helipad / Crown Accent */}
        <mesh position={[0, height / 2 + (height > 5.0 ? 1.65 : 0.05), 0]}>
          <cylinderGeometry args={[width * 0.35, width * 0.35, 0.1, 16]} />
          <meshStandardMaterial color="#0284C7" emissive="#38BDF8" emissiveIntensity={0.8} />
        </mesh>

        {/* 6. Spire Antenna (For hard/tall buildings) */}
        {height > 7.0 && (
          <mesh position={[0, height / 2 + 2.6, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.1, 1.8, 8]} />
            <meshStandardMaterial color="#F8FAFC" metalness={0.9} />
          </mesh>
        )}
      </group>

      {/* Hover Tooltip Card */}
      {hovered && (
        <Html position={[0, height + 1.2, 0]} center distanceFactor={26}>
          <div className="glass-panel px-3.5 py-2 rounded-xl text-xs whitespace-nowrap pointer-events-none shadow-2xl border border-white/20 z-50">
            <div className="font-extrabold text-white mb-0.5">{topic}</div>
            <div className="flex items-center gap-2 text-[10px] text-slate-300">
              <span
                className={`uppercase font-mono px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  difficulty === 'easy'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : difficulty === 'medium'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {difficulty}
              </span>
              <span>Height: {height.toFixed(1)}m</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};
