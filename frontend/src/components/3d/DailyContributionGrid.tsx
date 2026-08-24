import React, { useState, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DailyTowerData } from '../../types/city';

interface DailyContributionGridProps {
  towers: DailyTowerData[];
}

export const DailyContributionGrid: React.FC<DailyContributionGridProps> = ({ towers }) => {
  const [hoveredTower, setHoveredTower] = useState<DailyTowerData | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);

  useFrame((_, delta) => {
    if (progressRef.current < 1) {
      progressRef.current = Math.min(progressRef.current + delta * 1.5, 1);
      if (groupRef.current) {
        const ease = 1 - Math.pow(1 - progressRef.current, 3);
        groupRef.current.scale.y = ease;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 52-Week Contribution Matrix Ground Bed */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[64, 0.3, 10]} />
        <meshStandardMaterial color="#0F172A" roughness={0.8} />
      </mesh>

      {/* 365 Daily Contribution Towers */}
      {towers.map((tower) => {
        const [x, y, z] = tower.position;
        const isHovered = hoveredTower?.id === tower.id;

        return (
          <group key={tower.id} position={[x, y, z]}>
            <mesh
              castShadow
              receiveShadow
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredTower(tower);
              }}
              onPointerOut={() => setHoveredTower(null)}
            >
              <boxGeometry args={[0.9, tower.height, 0.9]} />
              <meshStandardMaterial
                color={isHovered ? '#FFFFFF' : tower.colorHex}
                roughness={0.2}
                metalness={0.4}
                emissive={tower.colorHex}
                emissiveIntensity={isHovered ? 0.8 : (tower.count > 0 ? 0.35 : 0.05)}
              />
            </mesh>

            {/* Glowing top cap for active days */}
            {tower.count > 0 && (
              <mesh position={[0, tower.height / 2 + 0.04, 0]}>
                <boxGeometry args={[0.8, 0.08, 0.8]} />
                <meshStandardMaterial
                  color={tower.colorHex}
                  emissive={tower.colorHex}
                  emissiveIntensity={0.9}
                />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Interactive Tooltip Card */}
      {hoveredTower && (
        <Html
          position={[hoveredTower.position[0], hoveredTower.height + 1.2, hoveredTower.position[2]]}
          center
          distanceFactor={30}
        >
          <div className="glass-panel px-3 py-2 rounded-xl text-xs whitespace-nowrap pointer-events-none shadow-2xl border border-white/20 z-50">
            <div className="font-extrabold text-white mb-0.5">{hoveredTower.date}</div>
            <div className="flex items-center gap-2 text-[10px] text-slate-300">
              <span className="font-mono text-emerald-400 font-bold">
                {hoveredTower.count} {hoveredTower.count === 1 ? 'contribution' : 'contributions'}
              </span>
              <span className="opacity-60 font-mono">Week #{hoveredTower.weekIndex + 1}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};
