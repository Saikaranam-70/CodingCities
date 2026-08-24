import React from 'react';
import { Html } from '@react-three/drei';
import { DistrictData } from '../../types/city';

interface DistrictProps {
  district: DistrictData;
}

export const District: React.FC<DistrictProps> = ({ district }) => {
  const [posX, posZ] = district.position;
  const platformSize = 18;

  return (
    <group position={[posX, 0, posZ]}>
      {/* Ground platform tile */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[platformSize, 0.4, platformSize]} />
        <meshStandardMaterial
          color="#1E293B"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* District Border Glow Line */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[platformSize - 0.4, platformSize - 0.4]} />
        <meshBasicMaterial
          color={district.color}
          wireframe
          opacity={0.35}
          transparent
        />
      </mesh>

      {/* District Center Banner Label */}
      <Html position={[0, 0.5, platformSize / 2 - 1]} center distanceFactor={40}>
        <div
          className="px-2.5 py-1 rounded-md text-[11px] font-bold shadow-lg border backdrop-blur-md whitespace-nowrap pointer-events-none"
          style={{
            backgroundColor: `${district.color}22`,
            borderColor: `${district.color}66`,
            color: '#F8FAFC'
          }}
        >
          <span>{district.topic}</span>
          <span className="ml-1.5 opacity-75 font-mono text-[10px]">
            ({district.buildingCount})
          </span>
        </div>
      </Html>
    </group>
  );
};
