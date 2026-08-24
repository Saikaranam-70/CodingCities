import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LandmarkTowerProps {
  rating: number;
  globalRanking: number;
}

export const LandmarkTower: React.FC<LandmarkTowerProps> = ({ rating, globalRanking }) => {
  const beaconRef = useRef<THREE.Mesh>(null);

  // Height formula scaled by contest rating (min 8.0, max 20.0)
  const height = Math.min(Math.max((rating - 1200) / 75 + 6.0, 8.0), 22.0);

  useFrame(({ clock }) => {
    if (beaconRef.current) {
      const t = clock.getElapsedTime();
      (beaconRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(t * 4) * 0.4;
    }
  });

  return (
    <group position={[0, height / 2, -10]}>
      {/* Central Skyscraper Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.2, height, 3.2]} />
        <meshStandardMaterial
          color="#0EA5E9"
          metalness={0.8}
          roughness={0.1}
          emissive="#0284C7"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Spire Tower Peak */}
      <mesh position={[0, height / 2 + 2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.8, 4, 16]} />
        <meshStandardMaterial color="#38BDF8" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Top Beacon Light Sphere */}
      <mesh position={[0, height / 2 + 4.1, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#38BDF8" />
      </mesh>

      {/* Sky Laser Beam Column */}
      <mesh ref={beaconRef} position={[0, height / 2 + 14, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 20, 16]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.6} />
      </mesh>

      {/* City Hall / Contest Landmark Label */}
      <Html position={[0, height / 2 + 5, 0]} center distanceFactor={45}>
        <div className="glass-panel px-3 py-1.5 rounded-lg border border-sky-400/40 text-center pointer-events-none shadow-2xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400">🏆 City Hall Landmark</div>
          <div className="text-xs font-extrabold text-white">Rating: {rating}</div>
          {globalRanking > 0 && (
            <div className="text-[9px] text-slate-300">Rank #{globalRanking.toLocaleString()}</div>
          )}
        </div>
      </Html>
    </group>
  );
};
