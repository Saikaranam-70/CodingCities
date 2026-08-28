import React from 'react';
import { BuildingData } from '../../types/city';
import { Star, GitCommit, Calendar, Code, Sparkles, Focus } from 'lucide-react';

interface BuildingTooltipProps {
  building: BuildingData;
}

export const BuildingTooltip: React.FC<BuildingTooltipProps> = ({ building }) => {
  const {
    repoName,
    topic,
    language = 'TypeScript',
    stars = 12,
    commitsCount = 48,
    lastActiveDate = '2026-08-25',
    archetype = 'gabled_house',
    colorHex = '#10B981',
    litWindowsRatio = 0.8
  } = building;

  const archetypeMap: Record<string, string> = {
    glass_tower: 'Production Tower',
    retail_row: 'Open-Source Shop',
    gabled_house: 'Personal Project',
    warehouse: 'Archived Storage',
    landmark_tower: 'Flagship Skyscraper',
    apartment_block: 'Team Block'
  };
  const archetypeLabel = (archetype && archetypeMap[archetype]) || 'Repository Building';

  return (
    <div className="pointer-events-none z-50 min-w-[220px] max-w-[280px] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl text-slate-100 font-sans transform -translate-y-2 transition-all duration-200">
      {/* Header Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full text-slate-900"
          style={{ backgroundColor: colorHex }}
        >
          {language}
        </span>
        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-pink-400" />
          {archetypeLabel}
        </span>
      </div>

      {/* Repo Title */}
      <h4 className="text-sm font-bold text-white truncate mb-1">
        {repoName || topic}
      </h4>

      <p className="text-[11px] text-slate-400 mb-3 truncate flex items-center gap-1">
        <Code className="w-3 h-3 text-blue-400" />
        Topic: <span className="text-slate-200 font-medium">{topic}</span>
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 bg-slate-800/60 p-2 rounded-xl border border-slate-700/50 mb-2.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="font-semibold text-white">{stars}</span> stars
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-white">{commitsCount}</span> commits
        </div>
      </div>

      {/* Footer Info & Click Focus Badge */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-2 mb-1.5">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-indigo-400" />
          <span>{lastActiveDate}</span>
        </div>

        <div className="flex items-center gap-1 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{Math.round(litWindowsRatio * 100)}% Active</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 text-[10px] text-cyan-400 bg-cyan-500/10 py-1 rounded-lg border border-cyan-500/20">
        <Focus className="w-3 h-3 animate-spin" /> Click to Focus Camera
      </div>
    </div>
  );
};
