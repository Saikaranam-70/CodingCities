import React, { useMemo, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { BuildingData, BuildingArchetype } from '../../types/city';
import { BuildingTooltip } from '../hud/BuildingTooltip';

interface BuildingLibraryProps {
  building: BuildingData;
  index?: number;
  onSelect?: (building: BuildingData) => void;
}

export function adjustColorBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return '#' + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}

export const BuildingLibrary: React.FC<BuildingLibraryProps> = ({
  building,
  index = 0,
  onSelect
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const smokeRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Growth & Hover Animation States
  const growthProgress = useRef(0);
  const currentFloat = useRef(0);

  const {
    position,
    width,
    height,
    depth,
    colorHex,
    archetype = 'gabled_house',
    litWindowsRatio = 0.7
  } = building;

  // Compute tonal color steps
  const faceColors = useMemo(() => {
    const base = colorHex || '#10B981';
    const sideColor = adjustColorBrightness(base, -20);
    const roofColor = adjustColorBrightness(base, 25);
    const accentColor = '#EC4899'; // Hot pink accent
    return { base, sideColor, roofColor, accentColor };
  }, [colorHex]);

  // Frame animation loop: Growth Lerp & Micro Float/Tilt
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    const startDelay = (index % 12) * 0.08;

    // 1. Growth lerp from 0 to 1
    if (time > startDelay && growthProgress.current < 1) {
      growthProgress.current = THREE.MathUtils.lerp(growthProgress.current, 1, delta * 4);
      groupRef.current.scale.y = Math.max(0.001, growthProgress.current);
    }

    // 2. Hover micro-float lift animation
    const targetFloat = hovered ? 0.35 : 0;
    currentFloat.current = THREE.MathUtils.lerp(currentFloat.current, targetFloat, delta * 8);
    groupRef.current.position.y = position[1] + currentFloat.current;

    // 3. Rotating energy ring on Landmark Tower
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 1.5;
      ringRef.current.position.y = height / 2 + 0.3 + Math.sin(time * 2) * 0.15;
    }

    // 4. Chimney smoke particle drift
    if (smokeRef.current) {
      smokeRef.current.children.forEach((p, pIdx) => {
        p.position.y += delta * (0.4 + pIdx * 0.1);
        p.position.x += Math.sin(time * 3 + pIdx) * 0.01;
        if (p.position.y > 1.2) p.position.y = 0;
      });
    }
  });

  const litCount = Math.max(1, Math.floor(5 * litWindowsRatio));

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect(building);
      }}
    >
      {/* 1. ARCHETYPE: Organic Curved Glass Tower */}
      {archetype === 'glass_tower' && (
        <group>
          {/* Main Glass Tower Body */}
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[width, height, depth]} />
            <meshLambertMaterial color={hovered ? '#60A5FA' : faceColors.base} />
          </mesh>

          {/* Curved Facade Panels */}
          <mesh position={[0, 0, depth / 2 + 0.02]}>
            <cylinderGeometry args={[width * 0.45, width * 0.45, height * 0.9, 16]} />
            <meshLambertMaterial color={faceColors.roofColor} transparent opacity={0.7} />
          </mesh>

          {/* Rooftop Garden Terrace & Trees */}
          <mesh position={[0, height / 2 + 0.1, 0]}>
            <boxGeometry args={[width * 0.85, 0.2, depth * 0.85]} />
            <meshLambertMaterial color="#059669" />
          </mesh>

          {[-width * 0.25, width * 0.25].map((xTree, i) => (
            <mesh key={`tree-${i}`} position={[xTree, height / 2 + 0.4, 0]}>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshLambertMaterial color="#10B981" />
            </mesh>
          ))}

          {/* Roof Spire Antenna */}
          <mesh position={[0, height / 2 + 1.0, 0]}>
            <coneGeometry args={[0.08, 1.4, 8]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>
        </group>
      )}

      {/* 2. ARCHETYPE: Organic Retail Shop Row */}
      {archetype === 'retail_row' && (
        <group>
          {/* Two-story building base */}
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[width, height, depth]} />
            <meshLambertMaterial color={hovered ? '#F472B6' : faceColors.base} />
          </mesh>

          {/* Curved Rounded Awning */}
          <mesh position={[0, -height * 0.15, depth / 2 + 0.2]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[width * 0.52, width * 0.52, 0.4, 12, 1, false, 0, Math.PI]} />
            <meshLambertMaterial color="#EC4899" />
          </mesh>

          {/* Glowing Storefront Entrance */}
          <mesh position={[0, -height * 0.35, depth / 2 + 0.03]}>
            <planeGeometry args={[width * 0.7, height * 0.25]} />
            <meshBasicMaterial color="#FDE047" />
          </mesh>
        </group>
      )}

      {/* 3. ARCHETYPE: Organic Gabled Cottage */}
      {archetype === 'gabled_house' && (
        <group>
          {/* Residential Base */}
          <mesh castShadow receiveShadow position={[0, -0.15, 0]}>
            <boxGeometry args={[width, height * 0.75, depth]} />
            <meshLambertMaterial color={hovered ? '#34D399' : faceColors.base} />
          </mesh>

          {/* Pitch Gabled Roof */}
          <mesh position={[0, height * 0.38 - 0.15, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[width * 0.88, height * 0.5, 4]} />
            <meshLambertMaterial color={faceColors.roofColor} />
          </mesh>

          {/* Brick Chimney */}
          <group position={[width * 0.28, height * 0.35, depth * 0.2]}>
            <mesh>
              <boxGeometry args={[0.25, 0.6, 0.25]} />
              <meshLambertMaterial color="#78350F" />
            </mesh>
            {/* Animated Chimney Smoke */}
            <group ref={smokeRef} position={[0, 0.35, 0]}>
              {[0, 1, 2].map((sIdx) => (
                <mesh key={sIdx} position={[0, sIdx * 0.3, 0]}>
                  <sphereGeometry args={[0.08 + sIdx * 0.03, 6, 6]} />
                  <meshBasicMaterial color="#E2E8F0" transparent opacity={0.4 - sIdx * 0.1} />
                </mesh>
              ))}
            </group>
          </group>
        </group>
      )}

      {/* 4. ARCHETYPE: Industrial Warehouse */}
      {archetype === 'warehouse' && (
        <group>
          {/* Low-rise Metallic Body */}
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[width * 1.25, height, depth * 1.1]} />
            <meshLambertMaterial color={hovered ? '#94A3B8' : faceColors.sideColor} />
          </mesh>

          {/* Ribbed Barrel Roof */}
          <mesh position={[0, height / 2 + 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[height * 0.32, height * 0.32, width * 1.2, 14]} />
            <meshLambertMaterial color={faceColors.roofColor} />
          </mesh>

          {/* Illuminated Glass Skylights */}
          <mesh position={[0, height / 2 + 0.45, 0]}>
            <boxGeometry args={[width * 0.6, 0.08, depth * 0.5]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.8} />
          </mesh>

          {/* Loading Bay Bay Doors */}
          <mesh position={[0, -height * 0.22, depth * 0.56]}>
            <planeGeometry args={[width * 0.55, height * 0.48]} />
            <meshBasicMaterial color="#334155" />
          </mesh>
        </group>
      )}

      {/* 5. ARCHETYPE: Landmark Skyscraper (Energy Ring + Spire) */}
      {archetype === 'landmark_tower' && (
        <group>
          {/* Octagonal High-rise Shaft */}
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <cylinderGeometry args={[width * 0.5, width * 0.55, height, 8]} />
            <meshLambertMaterial color={faceColors.base} />
          </mesh>

          {/* Rotating Energy Ring */}
          <mesh ref={ringRef} position={[0, height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[width * 0.75, 0.08, 12, 24]} />
            <meshBasicMaterial color="#EC4899" />
          </mesh>

          {/* Crown & Clock Beacons */}
          <mesh position={[0, height / 2 + 0.4, 0]}>
            <boxGeometry args={[width * 0.95, 0.5, depth * 0.95]} />
            <meshLambertMaterial color={faceColors.accentColor} />
          </mesh>

          {/* Laser Beacon Spire */}
          <mesh position={[0, height / 2 + 1.4, 0]}>
            <coneGeometry args={[0.12, 1.8, 8]} />
            <meshBasicMaterial color="#EC4899" />
          </mesh>
        </group>
      )}

      {/* 6. ARCHETYPE: Apartment Block (Magenta Facade & Balconies) */}
      {archetype === 'apartment_block' && (
        <group>
          {/* Main Apartment Body */}
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[width, height, depth]} />
            <meshLambertMaterial color={hovered ? '#A855F7' : faceColors.base} />
          </mesh>

          {/* Bold Hot-Pink Facade Wall Accent */}
          <mesh position={[width / 2 + 0.02, 0, 0]}>
            <planeGeometry args={[depth * 0.88, height * 0.92]} />
            <meshLambertMaterial color="#EC4899" />
          </mesh>

          {/* Staggered Glass Balconies */}
          {[-0.2, 0.2].map((yOff, bIdx) => (
            <mesh key={`balc-${bIdx}`} position={[0, yOff * height, depth / 2 + 0.15]}>
              <boxGeometry args={[width * 0.8, 0.1, 0.3]} />
              <meshBasicMaterial color="#38BDF8" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      )}

      {/* Lit Window Matrix Grid Overlay */}
      {Array.from({ length: 4 }).map((_, row) => {
        const yOffset = (row - 1.5) * (height / 5);
        const isLit = row < litCount;
        return (
          <mesh key={row} position={[0, yOffset, depth / 2 + 0.02]}>
            <planeGeometry args={[width * 0.6, height * 0.12]} />
            <meshBasicMaterial color={isLit ? '#FDE047' : '#1E293B'} />
          </mesh>
        );
      })}

      {/* Contact Shadow Plane */}
      <mesh position={[0, -height / 2 - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * 1.35, depth * 1.35]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>

      {/* Hover Tooltip Overlay */}
      {hovered && (
        <Html position={[0, height / 2 + 1.8, 0]} center distanceFactor={25}>
          <BuildingTooltip building={building} />
        </Html>
      )}
    </group>
  );
};
