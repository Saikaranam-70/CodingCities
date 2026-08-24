import React, { useState } from 'react';
import { Search, Sparkles, History, Code2, Github } from 'lucide-react';

export type PlatformType = 'leetcode' | 'github';

interface HeaderControlsProps {
  currentUsername: string;
  activePlatform: PlatformType;
  onPlatformChange: (platform: PlatformType) => void;
  onSearch: (username: string, platform?: PlatformType) => void;
  isLoading: boolean;
  history: string[];
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({
  currentUsername,
  activePlatform,
  onPlatformChange,
  onSearch,
  isLoading,
  history
}) => {
  const [inputVal, setInputVal] = useState(currentUsername);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() && !isLoading) {
      onSearch(inputVal.trim());
    }
  };

  const presetProfiles: Record<PlatformType, string[]> = {
    leetcode: ['leetcode', 'neal_wu', 'awice'],
    github: ['torvalds', 'gaearon', 'yyx990803']
  };

  return (
    <header className="absolute top-4 left-4 right-4 z-40 flex flex-col md:flex-row items-center justify-between gap-3 pointer-events-none">
      {/* Brand Title & Platform Switcher Tabs */}
      <div className="glass-panel px-4 py-2 rounded-2xl flex items-center gap-4 pointer-events-auto shadow-xl">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
          🏙️
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
            Coding Cities
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              3D Metropolis
            </span>
          </h1>
          <p className="text-[10px] text-slate-400 font-medium">
            3D Developer Stats Visualizer
          </p>
        </div>

        {/* Platform Selector Tabs & New Search button */}
        <div className="flex items-center gap-2 ml-2">
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                onPlatformChange('leetcode');
                const firstPreset = presetProfiles.leetcode[0];
                setInputVal(firstPreset);
                onSearch(firstPreset, 'leetcode');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activePlatform === 'leetcode'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>LeetCode</span>
            </button>

            <button
              onClick={() => {
                onPlatformChange('github');
                const firstPreset = presetProfiles.github[0];
                setInputVal(firstPreset);
                onSearch(firstPreset, 'github');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activePlatform === 'github'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </button>
          </div>

          <button
            onClick={() => onSearch('')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-[11px] font-bold text-blue-400 border border-blue-500/30 transition-all flex items-center gap-1 shadow-lg"
            title="Change City / Open Portal"
          >
            <Sparkles className="w-3.5 h-3.5" /> New Search
          </button>
        </div>
      </div>

      {/* Username Search Input & Presets */}
      <div className="flex flex-col sm:flex-row items-center gap-2 pointer-events-auto w-full md:w-auto">
        <form onSubmit={handleSubmit} className="relative w-full sm:w-72">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Enter ${activePlatform === 'leetcode' ? 'LeetCode' : 'GitHub'} username...`}
            className="w-full pl-10 pr-24 py-2.5 rounded-xl glass-panel text-xs text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1 transition-all shadow-md"
          >
            {isLoading ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Build <Sparkles className="w-3 h-3" />
              </>
            )}
          </button>
        </form>

        {/* Preset quick buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
          {presetProfiles[activePlatform].map((user) => (
            <button
              key={user}
              onClick={() => {
                setInputVal(user);
                onSearch(user);
              }}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg glass-panel-light hover:bg-slate-700/80 text-[11px] font-medium text-slate-300 transition-all border border-white/5 whitespace-nowrap"
            >
              @{user}
            </button>
          ))}

          {history.length > 0 && (
            <div className="relative group">
              <button
                className="p-1.5 rounded-lg glass-panel-light hover:bg-slate-700/80 text-slate-300 transition-all border border-white/5"
                title="Recent Searches"
              >
                <History className="w-3.5 h-3.5" />
              </button>
              <div className="absolute right-0 top-full mt-1.5 hidden group-hover:flex flex-col gap-1 glass-panel p-2 rounded-xl w-40 z-50 shadow-2xl">
                <div className="text-[10px] font-semibold text-slate-400 px-2 py-0.5">Recent Search</div>
                {history.map((histUser) => (
                  <button
                    key={histUser}
                    onClick={() => {
                      setInputVal(histUser);
                      onSearch(histUser);
                    }}
                    className="text-left px-2 py-1 text-xs text-slate-200 hover:bg-white/10 rounded-lg truncate"
                  >
                    @{histUser}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
