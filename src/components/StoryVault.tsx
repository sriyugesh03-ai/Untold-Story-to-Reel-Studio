import React, { useState } from 'react';
import { 
  Search, 
  Mic, 
  FileText, 
  ShieldCheck, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  Flame,
  ArrowUpRight,
  Download,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import type { FollowerStory, StoryStatus, EmotionCategory } from '../types';

interface StoryVaultProps {
  stories: FollowerStory[];
  selectedStoryId: string | null;
  onSelectStory: (storyId: string) => void;
  onDeleteStory: (storyId: string) => void;
  onOpenDMIntake: () => void;
  onUpdateStoryStatus?: (storyId: string, newStatus: StoryStatus) => void;
}

const CATEGORIES: EmotionCategory[] = [
  'Heartbreak & Betrayal',
  'Career & Hustle',
  'Family & Secrets',
  'Horror & Paranormal',
  'Unbelievable Coincidence',
  'Redemption & Victory',
  'Wild & Humorous',
];

export const StoryVault: React.FC<StoryVaultProps> = ({
  stories,
  selectedStoryId,
  onSelectStory,
  onDeleteStory,
  onOpenDMIntake,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [withdrawingStoryId, setWithdrawingStoryId] = useState<string | null>(null);

  const filteredStories = stories.filter((story) => {
    const matchesSearch = 
      story.followerHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (story.followerAlias && story.followerAlias.toLowerCase().includes(searchQuery.toLowerCase())) ||
      story.rawStory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' ? true : story.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' ? true : story.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleExportVaultJSON = () => {
    const dataStr = JSON.stringify(stories, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BeWithYugace_Stories_Vault_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleExportVaultCSV = () => {
    const headers = 'ID,Created At,Follower Handle,Alias,Category,Status,Source,Raw Story\n';
    const rows = stories
      .map(
        s =>
          `"${s.id}","${s.createdAt}","${s.followerHandle}","${s.followerAlias || ''}","${s.category}","${s.status}","${s.source}","${s.rawStory.replace(/"/g, '""').slice(0, 200)}..."`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BeWithYugace_Stories_Vault_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const getStatusBadge = (status: StoryStatus) => {
    switch (status) {
      case 'new_dm':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">New DM</span>;
      case 'needs_clarification':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Needs Q&A</span>;
      case 'analyzed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Analyzed</span>;
      case 'in_production':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">In Scripting</span>;
      case 'approved':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" /> Approved</span>;
      case 'published':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1"><Flame className="w-2.5 h-2.5" /> Published</span>;
      case 'withdrawn':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-white/5">Withdrawn</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300">{status}</span>;
    }
  };

  const getSourceIcon = (source: FollowerStory['source']) => {
    switch (source) {
      case 'Instagram DM':
        return <InstagramIcon className="w-3.5 h-3.5 text-rose-400" />;
      case 'Voice Transcript':
        return <Mic className="w-3.5 h-3.5 text-amber-400" />;
      case 'Public Form':
        return <FileText className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      
      {/* Header Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-white/5">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Story Vault & Creator Inbox</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-mono">
              {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage incoming Instagram DMs, verify follower facts, and initiate Reel production.
          </p>
        </div>

        {/* Search and Export Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search handle or story..."
              className="w-full rounded-xl bg-slate-950/80 border border-white/10 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportVaultCSV}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 border border-white/5 transition-all"
              title="Export Vault to CSV"
            >
              <Download className="w-3 h-3 text-cyan-400" />
              <span>CSV</span>
            </button>
            <button
              onClick={handleExportVaultJSON}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 border border-white/5 transition-all"
              title="Export Vault to JSON"
            >
              <Download className="w-3 h-3 text-amber-400" />
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Category Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Stories' },
            { id: 'new_dm', label: 'New DMs' },
            { id: 'needs_clarification', label: 'Needs Q&A' },
            { id: 'analyzed', label: 'Analyzed' },
            { id: 'in_production', label: 'In Scripting' },
            { id: 'approved', label: 'Approved' },
            { id: 'published', label: 'Published' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 scale-[1.02]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl bg-slate-900 border border-white/10 px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Stories List / Grid */}
      {filteredStories.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-white/10 bg-slate-950/30">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
            <InstagramIcon className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-sm font-bold text-white">No stories match your filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
            Paste a new Instagram DM or voice transcript from your followers to get started.
          </p>
          <button
            onClick={onOpenDMIntake}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
          >
            Paste Instagram DM
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 overflow-y-auto pr-1">
          {filteredStories.map((story) => {
            const isSelected = story.id === selectedStoryId;
            return (
              <div
                key={story.id}
                onClick={() => onSelectStory(story.id)}
                className={`group relative flex flex-col justify-between p-4 rounded-2xl transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500/60 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30'
                    : 'bg-slate-900/60 hover:bg-slate-900/90 border-white/5 hover:border-white/15'
                }`}
              >
                <div>
                  {/* Top Bar: Handle & Status */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 rounded-md bg-white/5 border border-white/5">
                        {getSourceIcon(story.source)}
                      </div>
                      <span className="text-xs font-bold text-white truncate max-w-[140px]">
                        {story.isAnonymous ? 'Anonymous' : story.followerHandle}
                      </span>
                      {story.isAnonymous && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    {getStatusBadge(story.status)}
                  </div>

                  {/* Category Pill & Reach Preview */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-semibold text-slate-300 border border-white/5">
                      {story.category}
                    </span>
                    {story.reachAnalysis && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-[10px] font-bold text-amber-300 border border-amber-500/20 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400" />
                        <span>{story.reachAnalysis.calculatedIndex}/100</span>
                      </span>
                    )}
                  </div>

                  {/* Story Excerpt */}
                  <p className="text-xs text-slate-300/90 line-clamp-3 leading-relaxed font-sans mb-3">
                    {story.rawStory}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setWithdrawingStoryId(story.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Withdraw / Remove Story"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onSelectStory(story.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-xs font-semibold border border-white/5 transition-all group-hover:border-amber-500/30"
                    >
                      <span>Studio</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Withdrawal Confirmation Dialog */}
      {withdrawingStoryId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm p-5 rounded-2xl bg-slate-900 border border-rose-500/30 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 rounded-xl bg-rose-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Withdraw Follower Story?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This action immediately deletes the story, derived AI truth checks, scripts, and exports from the database in compliance with follower privacy rights.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setWithdrawingStoryId(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteStory(withdrawingStoryId);
                  setWithdrawingStoryId(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
