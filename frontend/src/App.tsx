import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { CityScene } from './types/city';
import { CityCanvas } from './components/3d/CityCanvas';
import { HeaderControls, PlatformType } from './components/hud/HeaderControls';
import { StatsOverlay } from './components/hud/StatsOverlay';
import { LegendToggle } from './components/hud/LegendToggle';
import { ErrorMessage } from './components/hud/ErrorMessage';
import { WelcomeModal, CityViewMode, AestheticTheme } from './components/hud/WelcomeModal';
import { CityCustomizer } from './components/hud/CityCustomizer';
import { CompareCitiesModal } from './components/hud/CompareCitiesModal';
import { Building2, Sparkles } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '')}/api`
  : '/api';

export default function App() {
  const [hasChosenUser, setHasChosenUser] = useState<boolean>(false);

  const [platform, setPlatform] = useState<PlatformType>('leetcode');
  const [username, setUsername] = useState<string>('');

  const [cityMode, setCityMode] = useState<CityViewMode>('daily');
  const [theme, setTheme] = useState<AestheticTheme>('cyberpunk');
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  const [shadowsEnabled, setShadowsEnabled] = useState<boolean>(true);
  const [isNightMode, setIsNightMode] = useState<boolean>(true);
  const [showTraffic, setShowTraffic] = useState<boolean>(true);
  const [showClouds, setShowClouds] = useState<boolean>(true);

  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`coding_cities_history_${platform}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [scene, setScene] = useState<CityScene | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchCity = useCallback(async (targetUsername: string, targetPlatform?: PlatformType) => {
    if (!targetUsername) {
      setHasChosenUser(false);
      return;
    }

    const activePlat = targetPlatform || platform;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const endpoint = activePlat === 'github'
        ? `${API_BASE}/city/github/${encodeURIComponent(targetUsername)}`
        : `${API_BASE}/city/leetcode/${encodeURIComponent(targetUsername)}`;

      const res = await fetch(endpoint);

      let data: any = null;
      try {
        data = await res.json();
      } catch (e) {
        // Body non-JSON proxy fallback
      }

      if (!res.ok) {
        const detail = data?.error || `HTTP ${res.status}: Backend server error. Ensure backend (port 5000) and stats-api (port 3000) are running.`;
        throw new Error(detail);
      }

      if (!data) {
        throw new Error('Received empty or invalid response from backend.');
      }

      setScene(data);
      setUsername(targetUsername);
      setHasChosenUser(true);

      localStorage.setItem('coding_cities_active_user', targetUsername);
      setHistory((prev) => {
        const filtered = prev.filter((u) => u.toLowerCase() !== targetUsername.toLowerCase());
        const updated = [targetUsername, ...filtered].slice(0, 6);
        localStorage.setItem(`coding_cities_history_${activePlat}`, JSON.stringify(updated));
        return updated;
      });

      if (data.totalSolved >= 15) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      console.error('Fetch city failed:', err);
      setErrorMsg(err.message || 'An unexpected error occurred while generating the city scene.');
    } finally {
      setIsLoading(false);
    }
  }, [platform]);

  useEffect(() => {
    if (hasChosenUser && username) {
      fetchCity(username, platform);
    }
  }, [hasChosenUser, platform, fetchCity]);

  const handleGenerateFromLanding = (
    inputUsername: string,
    inputPlatform: PlatformType,
    inputMode: CityViewMode,
    inputTheme: AestheticTheme
  ) => {
    setPlatform(inputPlatform);
    setCityMode(inputMode);
    setTheme(inputTheme);
    fetchCity(inputUsername, inputPlatform);
  };

  return (
    <div className="w-screen h-screen relative bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* 1. Initial Welcome Landing Screen (Prompt for Username & Options) */}
      {!hasChosenUser && (
        <WelcomeModal onGenerate={handleGenerateFromLanding} />
      )}

      {/* 2. Header Navigation & Controls */}
      {hasChosenUser && (
        <HeaderControls
          currentUsername={username}
          activePlatform={platform}
          onPlatformChange={(newPlat) => setPlatform(newPlat)}
          onSearch={(user, plat) => fetchCity(user, plat)}
          onOpenCompare={() => setShowCompareModal(true)}
          isLoading={isLoading}
          history={history}
        />
      )}

      {/* Compare Cities Modal */}
      {showCompareModal && scene && (
        <CompareCitiesModal
          currentScene={scene}
          activePlatform={platform}
          onClose={() => setShowCompareModal(false)}
          apiBase={API_BASE}
        />
      )}

      {/* 3. Top Right City Customizer Options Menu */}
      {hasChosenUser && scene && !isLoading && (
        <CityCustomizer
          currentMode={cityMode}
          onModeChange={setCityMode}
          currentTheme={theme}
          onThemeChange={setTheme}
          shadowsEnabled={shadowsEnabled}
          onToggleShadows={() => setShadowsEnabled(!shadowsEnabled)}
          isNightMode={isNightMode}
          onToggleNightMode={() => setIsNightMode(!isNightMode)}
          showTraffic={showTraffic}
          onToggleTraffic={() => setShowTraffic(!showTraffic)}
          showClouds={showClouds}
          onToggleClouds={() => setShowClouds(!showClouds)}
        />
      )}

      {/* 4. Loading Blueprint Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-8 rounded-3xl flex flex-col items-center max-w-sm text-center shadow-2xl border border-blue-500/30">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center text-3xl mb-4 animate-bounce shadow-xl shadow-blue-500/30">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-extrabold text-white mb-1 flex items-center gap-2">
              Constructing {platform === 'github' ? 'GitHub' : 'LeetCode'} City <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Building 3D skyscrapers, daily 365 contribution towers, roads & traffic...
            </p>
            <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-pulse rounded-full w-full" />
            </div>
          </div>
        </div>
      )}

      {/* 5. Error Modal Overlay */}
      {errorMsg && (
        <ErrorMessage
          message={errorMsg}
          onRetry={() => fetchCity(username, platform)}
        />
      )}

      {/* 6. Main 3D Canvas Scene Viewport */}
      {hasChosenUser && scene && (
        <CityCanvas
          scene={scene}
          mode={cityMode}
          theme={theme}
          shadowsEnabled={shadowsEnabled}
          isNightMode={isNightMode}
          showTraffic={showTraffic}
          showClouds={showClouds}
        />
      )}

      {/* 7. Left Drawer Stats Summary Overlay */}
      {hasChosenUser && scene && !isLoading && !errorMsg && (
        <StatsOverlay scene={scene} activePlatform={platform} />
      )}

      {/* 8. Bottom Right Controls & Legend */}
      {hasChosenUser && (
        <LegendToggle
          shadowsEnabled={shadowsEnabled}
          onToggleShadows={() => setShadowsEnabled(!shadowsEnabled)}
          isNightMode={isNightMode}
          onToggleNightMode={() => setIsNightMode(!isNightMode)}
        />
      )}
    </div>
  );
}
