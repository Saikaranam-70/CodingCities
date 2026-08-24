import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WindmillProps {
  position: [number, number, number];
  streak: number;
}

export const Windmill: React.FC<WindmillProps> = ({ position, streak }) => {
  const bladesRef = useRef<THREE.Group>(null);

  // Rotation speed proportional to streak count
  const spinSpeed = Math.min(Math.max(streak, 1), 30) * 0.04;

  useFrame((_, delta) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z += delta * spinSpeed * 5;
    }
  });

  return (
    <group position={position}>
      {/* Tower Pole */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.25, 5, 12]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Generator Hub */}
      <mesh position={[0, 5, 0]} castShadow>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={0.5} />
      </mesh>

      {/* Rotating Blades */}
      <group position={[0, 5, 0.3]} ref={bladesRef}>
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, idx) => (
          <group key={idx} rotation={[0, 0, angle]}>
            <mesh position={[0, 1.2, 0]} castShadow>
              <boxGeometry args={[0.15, 2.2, 0.04]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Solar Panel Base Array */}
      <group position={[1.2, 0.1, 0]} rotation={[Math.PI / 8, 0, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[1.5, 0.1, 1.0]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.1} metalness={0.9} emissive="#1D4ED8" emissiveIntensity={0.2} />
        </mesh>
      </group>
    </group>
  );
};
