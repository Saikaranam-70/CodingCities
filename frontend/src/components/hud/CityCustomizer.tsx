import React, { useState } from 'react';
import { CityViewMode, AestheticTheme } from './WelcomeModal';
import { Sliders, Building2, Calendar, Palette, Car, Cloud, Moon, Sun, Eye } from 'lucide-react';

interface CityCustomizerProps {
  currentMode: CityViewMode;
  onModeChange: (mode: CityViewMode) => void;
  currentTheme: AestheticTheme;
  onThemeChange: (theme: AestheticTheme) => void;
  shadowsEnabled: boolean;
  onToggleShadows: () => void;
  isNightMode: boolean;
  onToggleNightMode: () => void;
  showTraffic: boolean;
  onToggleTraffic: () => void;
  showClouds: boolean;
  onToggleClouds: () => void;
}

export const CityCustomizer: React.FC<CityCustomizerProps> = ({
  currentMode,
  onModeChange,
  currentTheme,
  onThemeChange,
  shadowsEnabled,
  onToggleShadows,
  isNightMode,
  onToggleNightMode,
  showTraffic,
  onToggleTraffic,
  showClouds,
  onToggleClouds
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-32 lg:top-20 right-2 sm:right-4 z-40 flex flex-col items-end pointer-events-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-slate-200 hover:text-white shadow-xl border border-white/20 transition-all"
      >
        <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
        <span>City Options</span>
      </button>

      {isOpen && (
        <div className="glass-panel mt-2 p-3.5 sm:p-4 rounded-3xl w-[calc(100vw-1.5rem)] max-w-xs sm:w-64 max-h-[calc(100vh-10rem)] overflow-y-auto no-scrollbar shadow-2xl border border-white/15 flex flex-col gap-3.5 sm:gap-4">
          {/* Mode Selector */}
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" /> View Mode
            </div>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => onModeChange('topics')}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  currentMode === 'topics'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Topics
              </button>

              <button
                onClick={() => onModeChange('daily')}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  currentMode === 'daily'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Daily 365
              </button>
            </div>
          </div>

          {/* Aesthetic Theme */}
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-400" /> Aesthetic Theme
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
              {[
                { id: 'cyberpunk', label: 'Cyber', color: 'bg-indigo-600' },
                { id: 'eco', label: 'Eco', color: 'bg-emerald-600' },
                { id: 'sunset', label: 'Sunset', color: 'bg-rose-600' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => onThemeChange(t.id as AestheticTheme)}
                  className={`py-1.5 rounded-lg text-center border transition-all ${
                    currentTheme === t.id
                      ? `${t.color} text-white border-white/40 shadow-md`
                      : 'bg-slate-900/50 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Environment Toggles */}
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">
              Environment
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={onToggleNightMode}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-[11px] font-medium transition-all ${
                  isNightMode
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {isNightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                <span>{isNightMode ? 'Night' : 'Day'}</span>
              </button>

              <button
                onClick={onToggleShadows}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-[11px] font-medium transition-all ${
                  shadowsEnabled
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                    : 'bg-slate-800/60 text-slate-400 border-white/5'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Shadows</span>
              </button>

              <button
                onClick={onToggleTraffic}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-[11px] font-medium transition-all ${
                  showTraffic
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                    : 'bg-slate-800/60 text-slate-400 border-white/5'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Cars</span>
              </button>

              <button
                onClick={onToggleClouds}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-[11px] font-medium transition-all ${
                  showClouds
                    ? 'bg-sky-600/30 text-sky-300 border border-sky-500/40'
                    : 'bg-slate-800/60 text-slate-400 border-white/5'
                }`}
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Clouds</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
