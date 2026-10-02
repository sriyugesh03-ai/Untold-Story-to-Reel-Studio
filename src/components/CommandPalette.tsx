import React, { useState, useEffect } from 'react';
import { 
  Search, 
  PlusCircle, 
  Palette, 
  Film, 
  X,
  Flame,
  FileText
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { FollowerStory, ThemeMode } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  stories: FollowerStory[];
  onSelectStory: (storyId: string) => void;
  onOpenDMIntake: () => void;
  onOpenBioForm: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  stories,
  onSelectStory,
  onOpenDMIntake,
  onOpenBioForm,
}) => {
  const [query, setQuery] = useState('');
  const { setTheme, availableThemes } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredStories = stories.filter(s => 
    s.followerHandle.toLowerCase().includes(query.toLowerCase()) ||
    (s.followerAlias && s.followerAlias.toLowerCase().includes(query.toLowerCase())) ||
    s.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 bg-slate-950 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, follower handle, or theme..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
          />
          <kbd className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono border border-white/5">
            ESC
          </kbd>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3 text-xs">
          
          {/* Quick Actions */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1 block">
              Quick Actions
            </span>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenDMIntake();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-slate-200 hover:bg-amber-500 hover:text-slate-950 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold">Paste New Instagram DM</span>
                </div>
                <span className="text-[10px] opacity-70">Intake Engine</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenBioForm();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-slate-200 hover:bg-cyan-500 hover:text-slate-950 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold">Preview Public Bio Submission Link</span>
                </div>
                <span className="text-[10px] opacity-70">Follower Form</span>
              </button>
            </div>
          </div>

          {/* Stories Matching */}
          {filteredStories.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1 block">
                Stories in Vault ({filteredStories.length})
              </span>
              <div className="space-y-1">
                {filteredStories.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onClose();
                      onSelectStory(s.id);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Film className="w-3.5 h-3.5 text-rose-400" />
                      <span className="font-medium">{s.followerAlias || s.followerHandle}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400">
                        {s.category}
                      </span>
                    </div>
                    {s.reachAnalysis && (
                      <span className="text-[10px] font-mono text-amber-400 font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {s.reachAnalysis.calculatedIndex}/100
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Themes */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1 block">
              Switch Studio Theme
            </span>
            <div className="grid grid-cols-2 gap-1 px-1">
              {availableThemes.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id as ThemeMode);
                    onClose();
                  }}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950/60 hover:bg-white/10 text-slate-300 hover:text-white text-xs border border-white/5"
                >
                  <div className="flex items-center gap-2">
                    <Palette className="w-3 h-3 text-slate-400" />
                    <span>{t.name}</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.primaryColor }} />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
