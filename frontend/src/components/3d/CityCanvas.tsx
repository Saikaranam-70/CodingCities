import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CityScene } from '../../types/city';
import { District } from './District';
import { Building } from './Building';
import { DailyContributionGrid } from './DailyContributionGrid';
import { Windmill } from './Windmill';
import { LandmarkTower } from './LandmarkTower';
import { Coastline } from './Coastline';
import { RoadsAndTraffic } from './RoadsAndTraffic';
import { Clouds } from './Clouds';
import { CityViewMode, AestheticTheme } from '../hud/WelcomeModal';

interface CityCanvasProps {
  scene: CityScene;
  mode: CityViewMode;
  theme: AestheticTheme;
  shadowsEnabled: boolean;
  isNightMode: boolean;
  showTraffic: boolean;
  showClouds: boolean;
}

export const CityCanvas: React.FC<CityCanvasProps> = ({
  scene,
  mode,
  theme,
  shadowsEnabled,
  isNightMode,
  showTraffic,
  showClouds
}) => {
  const { districts, buildings, dailyTowers, streak, contestRating, activityDensity } = scene;

  // Theme Colors
  const themeColors = {
    cyberpunk: {
      bg: isNightMode ? '#070C18' : '#0F172A',
      fogNear: 45,
      fogFar: 170,
      sunLight: isNightMode ? '#818CF8' : '#FFFBEB'
    },
    eco: {
      bg: isNightMode ? '#064E3B' : '#047857',
      fogNear: 40,
      fogFar: 160,
      sunLight: isNightMode ? '#34D399' : '#FDE047'
    },
    sunset: {
      bg: isNightMode ? '#311042' : '#881337',
      fogNear: 35,
      fogFar: 150,
      sunLight: isNightMode ? '#F43F5E' : '#F59E0B'
    }
  }[theme];

  // Spawn points for renewable windmills
  const windmillCount = Math.min(Math.floor((streak?.current || 0) / 5) + 1, 6);
  const windmills = Array.from({ length: windmillCount }).map((_, idx) => {
    const angle = (idx / windmillCount) * Math.PI * 2;
    const r = 28 + (idx % 2) * 4;
    return {
      x: Math.cos(angle) * r,
      z: Math.sin(angle) * r
    };
  });

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        shadows={shadowsEnabled}
        camera={{ position: [42, 34, 52], fov: 40 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Theme Background & Atmospheric Fog */}
        <color attach="background" args={[themeColors.bg]} />
        <fog attach="fog" args={[themeColors.bg, themeColors.fogNear, themeColors.fogFar]} />

        {/* Ambient & Directional Sun/Moon Lighting */}
        <ambientLight intensity={isNightMode ? 0.35 : 0.7} />
        <directionalLight
          position={[55, 65, 35]}
          intensity={isNightMode ? 0.45 : 1.35}
          color={themeColors.sunLight}
          castShadow={shadowsEnabled}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={200}
          shadow-camera-left={-70}
          shadow-camera-right={70}
          shadow-camera-top={70}
          shadow-camera-bottom={-70}
        />

        <hemisphereLight
          args={[
            isNightMode ? '#1E1B4B' : '#38BDF8',
            isNightMode ? '#0F172A' : '#1E293B',
            0.55
          ]}
        />

        {/* Orbit Camera Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.05}
          minDistance={15}
          maxDistance={140}
          target={[0, 2, 0]}
        />

        {/* 1. Surrounding Ocean Water & Island Coastline */}
        <Coastline activityDaysCount={activityDensity.length} />

        {/* 2. Floating Clouds (Optional toggle) */}
        {showClouds && <Clouds />}

        {/* 3. Asphalt Roads & Animated Vehicles (Optional toggle) */}
        {showTraffic && <RoadsAndTraffic districtCount={districts.length} />}

        {/* 4. Render City Mode (Topics Districts vs 365 Daily Contribution Grid) */}
        {mode === 'topics' ? (
          <>
            {/* Topic District Platforms */}
            {districts.map((district) => (
              <District key={district.id} district={district} />
            ))}

            {/* Architectural Buildings */}
            {buildings.map((building) => (
              <Building key={building.id} building={building} />
            ))}
          </>
        ) : (
          /* 365-Day Daily Contribution Grid */
          <DailyContributionGrid towers={dailyTowers || []} />
        )}

        {/* 5. Sustainable Energy Windmills */}
        {windmills.map((w, idx) => (
          <Windmill
            key={idx}
            position={[w.x, 0, w.z]}
            streak={streak?.current || 1}
          />
        ))}

        {/* 6. Landmark Skyscraper (Contest Rating / Star Achievements) */}
        {contestRating && contestRating.rating > 0 && (
          <LandmarkTower
            rating={contestRating.rating}
            globalRanking={contestRating.globalRanking}
          />
        )}
      </Canvas>
    </div>
  );
};
