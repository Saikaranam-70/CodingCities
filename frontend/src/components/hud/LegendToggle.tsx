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
    <div className="absolute bottom-4 right-4 z-30 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Visual Controls Panel */}
      <div className="glass-panel p-3 rounded-2xl shadow-xl flex items-center gap-2">
        {/* Day / Night Toggle */}
        <button
          onClick={onToggleNightMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            isNightMode
              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
          }`}
        >
          {isNightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          <span>{isNightMode ? 'Night Mode' : 'Day Mode'}</span>
        </button>

        {/* Shadows Toggle */}
        <button
          onClick={onToggleShadows}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            shadowsEnabled
              ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
              : 'bg-slate-700/50 text-slate-400 border border-white/5'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{shadowsEnabled ? 'Shadows On' : 'Shadows Off'}</span>
        </button>
      </div>

      {/* Difficulty Legend */}
      <div className="glass-panel px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center gap-4 text-xs font-medium text-slate-300">
        <span className="text-[10px] uppercase font-bold text-slate-400">Difficulty Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <span>Easy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
          <span>Hard</span>
        </div>
      </div>
    </div>
  );
};
