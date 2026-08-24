import React from 'react';
import { AlertTriangle, RefreshCw, HelpCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
      <div className="glass-panel p-6 rounded-3xl max-w-md w-full text-center shadow-2xl border border-rose-500/30">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-2">City Blueprint Build Failed</h3>

        <p className="text-xs text-slate-300 mb-6 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-white/5 font-mono">
          {message}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onRetry}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>

        <div className="mt-4 text-[10px] text-slate-400 flex items-center justify-center gap-1">
          <HelpCircle className="w-3 h-3" />
          <span>If using Render Free Tier, backend/stats API cold start takes ~15 seconds.</span>
        </div>
      </div>
    </div>
  );
};
