import React from 'react';
import { Html } from '@react-three/drei';
import { Sparkles, GitBranch } from 'lucide-react';

export const EmptyCityState: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Central Empty Plot Glowing Node */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 4.5, 32]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.35} />
      </mesh>

      {/* Blueprint Grid Lines */}
      <gridHelper args={[32, 16, '#38BDF8', '#1E293B']} position={[0, 0.02, 0]} />

      {/* Pulsating Center Marker */}
      <mesh position={[0, 0.6, 0]}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshBasicMaterial color="#EC4899" />
      </mesh>

      {/* HTML Overlay Badge */}
      <Html position={[0, 2.5, 0]} center distanceFactor={20}>
        <div className="pointer-events-none bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 p-4 rounded-2xl shadow-2xl text-center text-slate-100 font-sans min-w-[240px]">
          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <GitBranch className="w-5 h-5 animate-pulse" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1 flex items-center justify-center gap-1.5">
            Awaiting First Commit <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" />
          </h3>
          <p className="text-xs text-slate-400">
            Single empty intersection ready for your first repository or problem submission.
          </p>
        </div>
      </Html>
    </group>
  );
};
