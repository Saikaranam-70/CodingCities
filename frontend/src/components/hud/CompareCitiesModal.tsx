import React, { useState } from 'react';
import { CityScene } from '../../types/city';
import { X, Search, Trophy, Code2, Flame, Building2, Sparkles, ArrowRightLeft } from 'lucide-react';

interface CompareCitiesModalProps {
  currentScene: CityScene;
  activePlatform: 'leetcode' | 'github';
  onClose: () => void;
  apiBase: string;
}

export const CompareCitiesModal: React.FC<CompareCitiesModalProps> = ({
  currentScene,
  activePlatform,
  onClose,
  apiBase
}) => {
  const [targetUser, setTargetUser] = useState('');
  const [compareScene, setCompareScene] = useState<CityScene | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const endpoint = activePlatform === 'github'
        ? `${apiBase}/city/github/${encodeURIComponent(targetUser.trim())}`
        : `${apiBase}/city/leetcode/${encodeURIComponent(targetUser.trim())}`;

      const res = await fetch(endpoint);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch rival developer city profile.');
      }

      setCompareScene(data);
    } catch (err: any) {
      setError(err.message || 'Could not load target user data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20 shrink-0">
              <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5 sm:gap-2">
                Compare Coding Cities <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400" />
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Compare two developers' generative isometric cities side-by-side.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar for Rival User */}
        <form onSubmit={handleFetchCompare} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-4 sm:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder={`Enter rival LeetCode handle...`}
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 sm:px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-pink-500/25 transition disabled:opacity-50"
          >
            {loading ? 'Comparing...' : 'Compare'}
          </button>
        </form>

        {error && (
          <div className="p-3 mb-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs text-center">
            {error}
          </div>
        )}

        {/* Comparison Side-by-Side Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User A (Current User) */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase rounded-bl-xl">
              You
            </div>
            <h3 className="text-base font-extrabold text-white mb-4">
              @{currentScene.username}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-cyan-400" /> Total Repos / Solved
                </span>
                <span className="font-bold text-white text-sm">{currentScene.totalSolved}</span>
              </div>

              <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" /> Active Streak
                </span>
                <span className="font-bold text-amber-400 text-sm">{currentScene.streak?.current || 0} days</span>
              </div>

              <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-pink-400" /> Rating / Stars
                </span>
                <span className="font-bold text-pink-400 text-sm">{currentScene.contestRating?.rating || 1200}</span>
              </div>

              <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-purple-400" /> Districts Unlocked
                </span>
                <span className="font-bold text-purple-300 text-sm">{currentScene.districts.length}</span>
              </div>
            </div>
          </div>

          {/* User B (Compare Rival) */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-center">
            {compareScene ? (
              <>
                <div className="absolute top-0 right-0 px-3 py-1 bg-pink-500/20 text-pink-400 text-[10px] font-bold uppercase rounded-bl-xl">
                  Rival
                </div>
                <h3 className="text-base font-extrabold text-white mb-4">
                  @{compareScene.username}
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-cyan-400" /> Total Repos / Solved
                    </span>
                    <span className="font-bold text-white text-sm">{compareScene.totalSolved}</span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-400" /> Active Streak
                    </span>
                    <span className="font-bold text-amber-400 text-sm">{compareScene.streak?.current || 0} days</span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-pink-400" /> Rating / Stars
                    </span>
                    <span className="font-bold text-pink-400 text-sm">{compareScene.contestRating?.rating || 1200}</span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-purple-400" /> Districts Unlocked
                    </span>
                    <span className="font-bold text-purple-300 text-sm">{compareScene.districts.length}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-6 text-slate-500">
                <ArrowRightLeft className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Search a developer username above to trigger city comparison stats.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
