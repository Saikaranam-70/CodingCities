import React, { useState } from 'react';
import { PlatformType } from './HeaderControls';
import { Sparkles, Code2, Github, Building2, Calendar, Palette, Flame } from 'lucide-react';

export type CityViewMode = 'topics' | 'daily';
export type AestheticTheme = 'cyberpunk' | 'eco' | 'sunset';

interface WelcomeModalProps {
  onGenerate: (
    username: string,
    platform: PlatformType,
    mode: CityViewMode,
    theme: AestheticTheme
  ) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onGenerate }) => {
  const [platform, setPlatform] = useState<PlatformType>('leetcode');
  const [username, setUsername] = useState<string>('');
  const [mode, setMode] = useState<CityViewMode>('daily');
  const [theme, setTheme] = useState<AestheticTheme>('cyberpunk');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const presetProfiles: Record<PlatformType, string[]> = {
    leetcode: ['leetcode', 'neal_wu', 'awice'],
    github: ['torvalds', 'gaearon', 'yyx990803']
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Please enter a username to build your city.');
      return;
    }
    setErrorMsg('');
    onGenerate(username.trim(), platform, mode, theme);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full shadow-2xl border border-blue-500/30 flex flex-col gap-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center text-3xl mx-auto mb-3 shadow-xl shadow-blue-500/30 animate-pulse">
            🏙️
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            Coding Cities
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              3D Visualizer
            </span>
          </h1>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Transform your developer profile into an interactive 3D metropolis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Step 1: Select Platform */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              1. Choose Developer Platform
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setPlatform('leetcode');
                  setUsername('');
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${platform === 'leetcode'
                    ? 'bg-blue-600/30 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
              >
                <Code2 className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-xs font-bold">LeetCode Coding City</div>
                  <div className="text-[10px] text-slate-400">Problem solving stats</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPlatform('github');
                  setUsername('');
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${platform === 'github'
                    ? 'bg-purple-600/30 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
              >
                <Github className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-xs font-bold">GitHub Coding City</div>
                  <div className="text-[10px] text-slate-400">Repos & commits stats</div>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Username Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              2. Enter Developer Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={`Enter ${platform === 'leetcode' ? 'LeetCode' : 'GitHub'} handle...`}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10"
            />
            {errorMsg && <div className="text-[11px] text-rose-400 mt-1">{errorMsg}</div>}

            {/* Presets */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto">
              <span className="text-[10px] text-slate-400 font-medium">Quick Profiles:</span>
              {presetProfiles[platform].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setUsername(p)}
                  className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-slate-300 border border-white/5"
                >
                  @{p}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Choose City View Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" /> 3. Select City View Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('topics')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${mode === 'topics'
                    ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-blue-400 text-white'
                    : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
              >
                <Building2 className="w-4 h-4 text-blue-400 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">Topic Districts</div>
                  <div className="text-[10px] text-slate-400">Skyscrapers grouped by topics</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('daily')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${mode === 'daily'
                    ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border-emerald-400 text-white'
                    : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
              >
                <Calendar className="w-4 h-4 text-emerald-400 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">365-Day Daily Grid</div>
                  <div className="text-[10px] text-slate-400">Day-by-day contribution skyline</div>
                </div>
              </button>
            </div>
          </div>

          {/* Step 4: Choose Aesthetic Theme */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-400" /> 4. Select Aesthetic Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cyberpunk', label: 'Cyberpunk', color: 'from-blue-600 to-indigo-600' },
                { id: 'eco', label: 'Lush Eco', color: 'from-emerald-600 to-teal-600' },
                { id: 'sunset', label: 'Sunset Dusk', color: 'from-amber-600 to-rose-600' }
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTheme(t.id as AestheticTheme)}
                  className={`py-2 px-2 rounded-xl text-center border text-xs font-bold transition-all ${theme === t.id
                      ? `bg-gradient-to-r ${t.color} text-white border-white/40 shadow-lg`
                      : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 transition-all mt-2"
          >
            Generate My City <Sparkles className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
