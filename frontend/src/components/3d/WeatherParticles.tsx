import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WeatherParticlesProps {
  count?: number;
}

export const WeatherParticles: React.FC<WeatherParticlesProps> = ({ count = 120 }) => {
  const instancedRef = useRef<THREE.InstancedMesh>(null);

  // Generate particle initial positions, speeds, and wobble phase
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * 110,
        y: Math.random() * 35 + 2,
        z: (Math.random() - 0.5) * 110,
        speedY: 0.8 + Math.random() * 1.5,
        wobbleSpeed: 1 + Math.random() * 2,
        wobbleScale: 0.1 + Math.random() * 0.25,
        size: 0.12 + Math.random() * 0.2
      });
    }
    return data;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!instancedRef.current) return;

    const time = state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      // Drift upwards gently
      p.y += p.speedY * delta;
      if (p.y > 45) {
        p.y = 1;
        p.x = (Math.random() - 0.5) * 110;
        p.z = (Math.random() - 0.5) * 110;
      }

      // Wobble horizontally
      const currentX = p.x + Math.sin(time * p.wobbleSpeed + i) * p.wobbleScale;
      const currentZ = p.z + Math.cos(time * p.wobbleSpeed * 0.8 + i) * p.wobbleScale;

      dummy.position.set(currentX, p.y, currentZ);
      dummy.scale.setScalar(p.size * (1 + 0.2 * Math.sin(time * 3 + i)));
      dummy.updateMatrix();

      instancedRef.current!.setMatrixAt(i, dummy.matrix);
    });

    instancedRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={instancedRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#38BDF8" transparent opacity={0.65} />
    </instancedMesh>
  );
};
