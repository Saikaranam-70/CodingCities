import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RoadsAndTrafficProps {
  districtCount: number;
}

export const RoadsAndTraffic: React.FC<RoadsAndTrafficProps> = ({ districtCount }) => {
  const carsRef = useRef<THREE.Group>(null);

  // Generate car data traveling along road grid lines
  const cars = [
    { id: 1, axis: 'x', fixedPos: 0, startPos: -30, speed: 8, color: '#EF4444' },
    { id: 2, axis: 'x', fixedPos: 12, startPos: 30, speed: -6, color: '#3B82F6' },
    { id: 3, axis: 'z', fixedPos: -12, startPos: -28, speed: 7, color: '#F59E0B' },
    { id: 4, axis: 'z', fixedPos: 12, startPos: 28, speed: -9, color: '#10B981' },
    { id: 5, axis: 'x', fixedPos: -12, startPos: -25, speed: 6, color: '#8B5CF6' }
  ];

  useFrame((_, delta) => {
    if (carsRef.current) {
      carsRef.current.children.forEach((carMesh, idx) => {
        const carData = cars[idx];
        if (carData.axis === 'x') {
          carMesh.position.x += carData.speed * delta;
          if (carMesh.position.x > 32) carMesh.position.x = -32;
          if (carMesh.position.x < -32) carMesh.position.x = 32;
        } else {
          carMesh.position.z += carData.speed * delta;
          if (carMesh.position.z > 32) carMesh.position.z = -32;
          if (carMesh.position.z < -32) carMesh.position.z = 32;
        }
      });
    }
  });

  return (
    <group>
      {/* 1. Road Avenues Network (Asphalt Strips) */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[72, 4.0]} />
        <meshStandardMaterial color="#0F172A" roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} receiveShadow>
        <planeGeometry args={[72, 4.0]} />
        <meshStandardMaterial color="#0F172A" roughness={0.9} />
      </mesh>

      <mesh position={[0, -0.01, 24]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[72, 3.5]} />
        <meshStandardMaterial color="#0F172A" roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.01, -24]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[72, 3.5]} />
        <meshStandardMaterial color="#0F172A" roughness={0.9} />
      </mesh>

      {/* 2. Road Dashed Centerlines */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[68, 0.2]} />
        <meshBasicMaterial color="#FACC15" opacity={0.6} transparent />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[68, 0.2]} />
        <meshBasicMaterial color="#FACC15" opacity={0.6} transparent />
      </mesh>

      {/* 3. Street Lamps at Intersections */}
      {[-24, 0, 24].map((x) =>
        [-24, 0, 24].map((z) => (
          <group key={`lamp-${x}-${z}`} position={[x + 2.5, 0, z + 2.5]}>
            <mesh position={[0, 1.2, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.08, 2.4, 8]} />
              <meshStandardMaterial color="#64748B" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0, 2.4, 0]}>
              <sphereGeometry args={[0.2, 12, 12]} />
              <meshBasicMaterial color="#FDE047" />
            </mesh>
          </group>
        ))
      )}

      {/* 4. Animated Vehicles (Cars driving along roads) */}
      <group ref={carsRef}>
        {cars.map((car) => {
          const posX = car.axis === 'x' ? car.startPos : car.fixedPos;
          const posZ = car.axis === 'z' ? car.startPos : car.fixedPos;
          const rotY = car.axis === 'x' ? (car.speed > 0 ? 0 : Math.PI) : (car.speed > 0 ? Math.PI / 2 : -Math.PI / 2);

          return (
            <group key={car.id} position={[posX, 0.25, posZ]} rotation={[0, rotY, 0]}>
              {/* Car Body */}
              <mesh castShadow>
                <boxGeometry args={[1.2, 0.4, 0.6]} />
                <meshStandardMaterial color={car.color} roughness={0.2} metalness={0.7} />
              </mesh>
              {/* Car Cabin */}
              <mesh position={[-0.1, 0.3, 0]} castShadow>
                <boxGeometry args={[0.6, 0.3, 0.5]} />
                <meshStandardMaterial color="#0F172A" roughness={0.1} />
              </mesh>
              {/* Glowing Headlights */}
              <mesh position={[0.6, 0.05, 0.18]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshBasicMaterial color="#FDE047" />
              </mesh>
              <mesh position={[0.6, 0.05, -0.18]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshBasicMaterial color="#FDE047" />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};
