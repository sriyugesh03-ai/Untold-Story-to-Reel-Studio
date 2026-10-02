import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { StoryVault } from './components/StoryVault';
import { StoryPipelineView } from './components/StoryPipelineView';
import { DMIntakeModal } from './components/DMIntakeModal';
import { PublicBioModal } from './components/PublicBioModal';
import { CommandPalette } from './components/CommandPalette';
import { SettingsModal } from './components/SettingsModal';
import { INITIAL_STORIES } from './data/mockStories';
import type { FollowerStory } from './types';

export function AppContent() {
  const [stories, setStories] = useState<FollowerStory[]>(INITIAL_STORIES);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>('story-101');
  const [isDMIntakeOpen, setIsDMIntakeOpen] = useState(false);
  const [isBioFormOpen, setIsBioFormOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key.toLowerCase() === 'n' && !isDMIntakeOpen && !isBioFormOpen && !isCommandPaletteOpen && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsDMIntakeOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDMIntakeOpen, isBioFormOpen, isCommandPaletteOpen]);

  const selectedStory = stories.find((s) => s.id === selectedStoryId) || null;

  const handleStoryAdded = (newStory: FollowerStory) => {
    setStories([newStory, ...stories]);
    setSelectedStoryId(newStory.id);
  };

  const handleUpdateStory = (updated: FollowerStory) => {
    setStories(stories.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteStory = (storyId: string) => {
    setStories(stories.filter((s) => s.id !== storyId));
    if (selectedStoryId === storyId) {
      setSelectedStoryId(null);
    }
  };

  // Metrics
  const approvedCount = stories.filter((s) => s.status === 'approved' || s.status === 'published').length;
  const scoredStories = stories.filter((s) => s.reachAnalysis);
  const avgReachScore = scoredStories.length > 0
    ? Math.round(scoredStories.reduce((acc, curr) => acc + (curr.reachAnalysis?.calculatedIndex || 0), 0) / scoredStories.length)
    : 84;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Dynamic Glow Orbs in Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-rose-500/5 blur-[140px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] rounded-full bg-cyan-500/5 blur-[130px] animate-pulse-glow" style={{ animationDelay: '3s' }} />
      </div>

      {/* Brand Header */}
      <Header
        onOpenDMIntake={() => setIsDMIntakeOpen(true)}
        onOpenBioForm={() => setIsBioFormOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        totalStories={stories.length}
        approvedCount={approvedCount}
        avgReachScore={avgReachScore}
      />

      {/* Main Workspace Body */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {selectedStory ? (
          <StoryPipelineView
            story={selectedStory}
            onUpdateStory={handleUpdateStory}
            onBackToVault={() => setSelectedStoryId(null)}
          />
        ) : (
          <StoryVault
            stories={stories}
            selectedStoryId={selectedStoryId}
            onSelectStory={(id) => setSelectedStoryId(id)}
            onDeleteStory={handleDeleteStory}
            onOpenDMIntake={() => setIsDMIntakeOpen(true)}
          />
        )}
      </main>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        stories={stories}
        onSelectStory={(id) => setSelectedStoryId(id)}
        onOpenDMIntake={() => setIsDMIntakeOpen(true)}
        onOpenBioForm={() => setIsBioFormOpen(true)}
      />

      {/* Settings & API Key Configuration Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Modals */}
      <DMIntakeModal
        isOpen={isDMIntakeOpen}
        onClose={() => setIsDMIntakeOpen(false)}
        onStoryAdded={handleStoryAdded}
      />

      <PublicBioModal
        isOpen={isBioFormOpen}
        onClose={() => setIsBioFormOpen(false)}
        onStorySubmitted={handleStoryAdded}
      />

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-4 px-6 text-center text-xs text-slate-500 glass-panel">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
          <span>
            © 2026 <strong className="text-slate-300">BeWithYugace Studio</strong> • Powered by Zero-Hallucination AI Pipeline
          </span>
          <span className="text-[11px] text-slate-500 flex items-center gap-2">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-white/10">Cmd+K</kbd> for Command Palette</span>
            <span>•</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-white/10">N</kbd> for New DM</span>
          </span>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
