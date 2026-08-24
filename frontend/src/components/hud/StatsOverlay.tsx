import React, { useState } from 'react';
import { CityScene } from '../../types/city';
import { PlatformType } from './HeaderControls';
import { Flame, Trophy, Award, Code2, ChevronLeft, ChevronRight, Zap, Github, FolderGit2, Star } from 'lucide-react';

interface StatsOverlayProps {
  scene: CityScene;
  activePlatform: PlatformType;
}

export const StatsOverlay: React.FC<StatsOverlayProps> = ({ scene, activePlatform }) => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    username,
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    acceptanceRate,
    ranking,
    streak,
    contestRating,
    languages,
    badgesCount
  } = scene;

  const totalSum = easySolved + mediumSolved + hardSolved || 1;
  const easyPct = Math.round((easySolved / totalSum) * 100);
  const medPct = Math.round((mediumSolved / totalSum) * 100);
  const hardPct = 100 - easyPct - medPct;

  return (
    <div
      className={`absolute left-4 top-24 z-30 transition-all duration-300 pointer-events-auto ${
        collapsed ? '-translate-x-[calc(100%-2.5rem)]' : 'translate-x-0'
      }`}
    >
      <div className="relative glass-panel rounded-2xl p-4 w-72 max-h-[calc(100vh-8rem)] overflow-y-auto shadow-2xl flex flex-col gap-4">
        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-4 w-6 h-6 rounded-full glass-panel flex items-center justify-center text-slate-300 hover:text-white shadow-lg border border-white/20"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* User Badge Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h2 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
              {activePlatform === 'github' ? <Github className="w-4 h-4 text-purple-400" /> : <Code2 className="w-4 h-4 text-blue-400" />}
              @{username}
            </h2>
            <div className="text-[11px] text-slate-400 font-medium">
              {activePlatform === 'github' ? 'GitHub Developer' : `Rank #${ranking > 0 ? ranking.toLocaleString() : 'N/A'}`}
            </div>
          </div>

          {badgesCount > 0 && (
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-lg text-amber-400 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>{badgesCount} {activePlatform === 'github' ? 'Badges' : 'Badges'}</span>
            </div>
          )}
        </div>

        {/* Platform Specific Breakdown */}
        {activePlatform === 'leetcode' ? (
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-200">Problems Solved</span>
              <span className="text-lg font-black text-white font-mono">{totalSolved}</span>
            </div>

            {/* Progress Segment Bar */}
            <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden flex mb-2.5 shadow-inner">
              <div style={{ width: `${easyPct}%` }} className="bg-emerald-500 transition-all duration-500" title={`Easy: ${easySolved}`} />
              <div style={{ width: `${medPct}%` }} className="bg-amber-500 transition-all duration-500" title={`Medium: ${mediumSolved}`} />
              <div style={{ width: `${hardPct}%` }} className="bg-rose-500 transition-all duration-500" title={`Hard: ${hardSolved}`} />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg py-1">
                <div className="text-emerald-400 font-bold">{easySolved}</div>
                <div className="text-slate-400">Easy</div>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg py-1">
                <div className="text-amber-400 font-bold">{mediumSolved}</div>
                <div className="text-slate-400">Medium</div>
              </div>
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg py-1">
                <div className="text-rose-400 font-bold">{hardSolved}</div>
                <div className="text-slate-400">Hard</div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-purple-400" /> Public Repositories
              </span>
              <span className="text-lg font-black text-white font-mono">{totalSolved}</span>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5 flex items-center justify-between text-xs font-medium">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Star Achievement
              </span>
              <span className="font-bold text-amber-400 font-mono">
                {contestRating?.badge || 'Open Source'}
              </span>
            </div>
          </div>
        )}

        {/* Streak & Eco-Energy Motif Badge */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-2.5 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-mono">{streak?.current || 0} Days</div>
              <div className="text-[9px] text-slate-400">Active Streak</div>
            </div>
          </div>

          <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-2.5 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-mono">{acceptanceRate}%</div>
              <div className="text-[9px] text-slate-400">{activePlatform === 'github' ? 'Impact' : 'Accuracy'}</div>
            </div>
          </div>
        </div>

        {/* Contest Rating Card (if available) */}
        {contestRating && contestRating.rating > 0 && (
          <div className="bg-gradient-to-r from-sky-900/40 to-blue-900/40 border border-sky-500/30 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-sky-300 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> {activePlatform === 'github' ? 'City Hall Rating' : 'Contest Rating'}
              </span>
              <span className="text-xs font-black text-white font-mono">{contestRating.rating}</span>
            </div>
            <div className="text-[10px] text-slate-300 flex justify-between">
              <span>Top {contestRating.topPercentage}%</span>
              <span>Global #{contestRating.globalRanking.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Top Languages */}
        {languages && languages.length > 0 && (
          <div>
            <div className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" /> Top Languages
            </div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {languages.slice(0, 4).map((lang) => (
                <div
                  key={lang.name}
                  className="flex items-center justify-between text-[11px] px-2 py-1 rounded-lg bg-slate-800/50 border border-white/5"
                >
                  <span className="font-medium text-slate-300">{lang.name}</span>
                  <span className="font-mono text-slate-400 text-[10px]">
                    {lang.solvedCount} {activePlatform === 'github' ? 'repos' : 'solved'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
