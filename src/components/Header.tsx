import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Clapperboard, PlusCircle, ExternalLink, Palette, Flame } from 'lucide-react';
import type { ThemeMode } from '../types';

interface HeaderProps {
  onOpenDMIntake: () => void;
  onOpenBioForm: () => void;
  totalStories: number;
  approvedCount: number;
  avgReachScore: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDMIntake,
  onOpenBioForm,
  totalStories,
  approvedCount,
  avgReachScore,
}) => {
  const { theme, setTheme, availableThemes } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 glass-panel backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-violet-600 p-[2px] shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Clapperboard className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-cyan-300 bg-clip-text text-transparent font-black tracking-wide">
                    BeWithYugace
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10 uppercase tracking-wider">
                    Studio v2.4
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Untold Story to Viral Reel System • Direct DM Intake Engine
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-xl bg-slate-900/80 border border-white/5 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-slate-500 font-medium">Total Stories:</span>
              <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded-md border border-white/5">{totalStories}</span>
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-slate-500 font-medium">Approved Reels:</span>
              <span className="font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/20">{approvedCount}</span>
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-1.5 text-slate-300">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-slate-500 font-medium">Avg Reach Score:</span>
              <span className="font-bold text-amber-300">{avgReachScore}/100</span>
            </div>
          </div>

          {/* Action Buttons & Theme Selector */}
          <div className="flex items-center gap-2.5 flex-wrap justify-end">
            
            {/* Theme Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-medium text-slate-300 hover:text-white cursor-pointer hover:border-white/20 transition-all">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span className="capitalize">{theme.replace('-', ' ')}</span>
              </div>
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-900 border border-white/10 shadow-2xl p-1.5 hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">
                  Select Theme
                </div>
                {availableThemes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as ThemeMode)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg text-left transition-colors ${
                      theme === t.id
                        ? 'bg-amber-500/20 text-amber-300 font-semibold'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{t.name}</span>
                    <span className={`w-2.5 h-2.5 rounded-full`} style={{ backgroundColor: t.primaryColor }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Public Form Mobile Link */}
            <button
              onClick={onOpenBioForm}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs font-semibold text-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Preview Follower Public Link (Link in Bio)"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>Bio Link Form</span>
            </button>

            {/* Ingest Instagram DM Button */}
            <button
              onClick={onOpenDMIntake}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Paste Instagram DM</span>
              <Sparkles className="w-3 h-3 text-slate-950 animate-spin" style={{ animationDuration: '6s' }} />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
