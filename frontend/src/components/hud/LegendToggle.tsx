import React from 'react';
import { Sun, Moon, Eye, ShieldAlert } from 'lucide-react';

interface LegendToggleProps {
  shadowsEnabled: boolean;
  onToggleShadows: () => void;
  isNightMode: boolean;
  onToggleNightMode: () => void;
}

export const LegendToggle: React.FC<LegendToggleProps> = ({
  shadowsEnabled,
  onToggleShadows,
  isNightMode,
  onToggleNightMode
}) => {
  return (
    <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 z-30 flex flex-col sm:flex-row lg:flex-col items-end gap-2 sm:gap-3 pointer-events-auto max-w-[calc(100vw-1rem)]">
      {/* Visual Controls Panel */}
      <div className="glass-panel p-2 sm:p-3 rounded-2xl shadow-xl flex items-center gap-1.5 sm:gap-2">
        {/* Day / Night Toggle */}
        <button
          onClick={onToggleNightMode}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all ${
            isNightMode
              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
          }`}
        >
          {isNightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          <span>{isNightMode ? 'Night' : 'Day'}</span>
        </button>

        {/* Shadows Toggle */}
        <button
          onClick={onToggleShadows}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all ${
            shadowsEnabled
              ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
              : 'bg-slate-700/50 text-slate-400 border border-white/5'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{shadowsEnabled ? 'Shadows' : 'No Shadow'}</span>
        </button>
      </div>

      {/* Difficulty Legend */}
      <div className="glass-panel px-3 sm:px-3.5 py-1.5 sm:py-2.5 rounded-2xl shadow-xl flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-medium text-slate-300">
        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 hidden xs:inline">Legend:</span>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <span>Easy</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
          <span>Med</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
          <span>Hard</span>
        </div>
      </div>
    </div>
  );
};
