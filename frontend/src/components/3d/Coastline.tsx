import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CoastlineProps {
  activityDaysCount: number;
}

export const Coastline: React.FC<CoastlineProps> = ({ activityDaysCount }) => {
  const waterRef = useRef<THREE.Mesh>(null);

  // Animate water subtle wave motion
  useFrame(({ clock }) => {
    if (waterRef.current) {
      const t = clock.getElapsedTime();
      waterRef.current.position.y = -0.6 + Math.sin(t * 0.8) * 0.08;
    }
  });

  // Calculate forest tree density around city border based on active submission days
  const treeCount = Math.min(Math.max(Math.floor(activityDaysCount / 4), 16), 64);
  const islandRadius = 38;

  // Generate tree coordinates around circular perimeter
  const trees = Array.from({ length: treeCount }).map((_, idx) => {
    const angle = (idx / treeCount) * Math.PI * 2;
    const r = islandRadius - 2 + (idx % 3) * 1.5;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const scale = 0.7 + ((idx * 3) % 5) * 0.15;
    return { x, z, scale };
  });

  return (
    <group>
      {/* Central Island Base Ground */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <cylinderGeometry args={[islandRadius, islandRadius + 3, 0.8, 64]} />
        <meshStandardMaterial color="#0F172A" roughness={0.9} />
      </mesh>

      {/* Coastal Sandy Beach Shoreline */}
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[islandRadius + 3, islandRadius + 8, 0.4, 64]} />
        <meshStandardMaterial color="#1E293B" roughness={0.95} />
      </mesh>

      {/* Surrounding Animated Ocean Water */}
      <mesh ref={waterRef} position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial
          color="#0284C7"
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Coastal Trees (Submission Activity Density) */}
      {trees.map((tree, idx) => (
        <group key={idx} position={[tree.x, 0, tree.z]} scale={[tree.scale, tree.scale, tree.scale]}>
          {/* Trunk */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.14, 0.8, 8]} />
            <meshStandardMaterial color="#78350F" roughness={0.9} />
          </mesh>
          {/* Foliage Cone */}
          <mesh position={[0, 1.1, 0]} castShadow>
            <coneGeometry args={[0.5, 1.2, 8]} />
            <meshStandardMaterial color="#10B981" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
