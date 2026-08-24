import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Clouds: React.FC = () => {
  const cloudsGroupRef = useRef<THREE.Group>(null);

  const cloudClusters = [
    { pos: [-35, 22, -20], scale: 1.2, speed: 0.8 },
    { pos: [10, 26, -35], scale: 1.5, speed: 0.5 },
    { pos: [30, 20, 15], scale: 1.0, speed: 1.0 },
    { pos: [-20, 24, 25], scale: 1.3, speed: 0.7 }
  ];

  useFrame((_, delta) => {
    if (cloudsGroupRef.current) {
      cloudsGroupRef.current.children.forEach((cloud, idx) => {
        cloud.position.x += delta * cloudClusters[idx].speed * 2.5;
        if (cloud.position.x > 60) {
          cloud.position.x = -60;
        }
      });
    }
  });

  return (
    <group ref={cloudsGroupRef}>
      {cloudClusters.map((cluster, idx) => (
        <group key={idx} position={cluster.pos as [number, number, number]} scale={[cluster.scale, cluster.scale, cluster.scale]}>
          {/* Main cloud sphere puff */}
          <mesh castShadow>
            <sphereGeometry args={[3.2, 12, 12]} />
            <meshStandardMaterial color="#F8FAFC" opacity={0.85} transparent roughness={0.9} />
          </mesh>
          {/* Secondary puffs */}
          <mesh position={[2.2, -0.4, 0.8]} castShadow>
            <sphereGeometry args={[2.2, 10, 10]} />
            <meshStandardMaterial color="#F8FAFC" opacity={0.85} transparent roughness={0.9} />
          </mesh>
          <mesh position={[-2.4, -0.6, -0.5]} castShadow>
            <sphereGeometry args={[2.5, 10, 10]} />
            <meshStandardMaterial color="#F8FAFC" opacity={0.85} transparent roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
