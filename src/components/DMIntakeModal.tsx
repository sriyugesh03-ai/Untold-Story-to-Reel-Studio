import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  Mic, 
  FileText, 
  UserX,
  Lock,
  MessageSquareQuote
} from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import type { FollowerStory, EmotionCategory } from '../types';
import { sanitizePII, parseInstagramDM } from '../services/piiSanitizer';

interface DMIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryAdded: (newStory: FollowerStory) => void;
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

export const DMIntakeModal: React.FC<DMIntakeModalProps> = ({
  isOpen,
  onClose,
  onStoryAdded,
}) => {
  const [activeTab, setActiveTab] = useState<'dm_paste' | 'voice_transcript' | 'guided'>('dm_paste');
  
  // Form State
  const [rawText, setRawText] = useState('');
  const [followerHandle, setFollowerHandle] = useState('@');
  const [followerAlias, setFollowerAlias] = useState('');
  const [category, setCategory] = useState<EmotionCategory>('Career & Hustle');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [doNotMention, setDoNotMention] = useState('');
  
  // Consent checkboxes
  const [voluntaryConsent, setVoluntaryConsent] = useState(true);
  const [allowSocialAdaptation, setAllowSocialAdaptation] = useState(true);
  const [preserveTruthAgreed, setPreserveTruthAgreed] = useState(true);

  // Guided questions state
  const [guidedQ1, setGuidedQ1] = useState('');
  const [guidedQ2, setGuidedQ2] = useState('');
  const [guidedQ3, setGuidedQ3] = useState('');

  if (!isOpen) return null;

  // Real-time PII scan
  const activeContent = activeTab === 'guided' 
    ? `${guidedQ1}\n${guidedQ2}\n${guidedQ3}`
    : rawText;
  
  const piiScan = sanitizePII(activeContent);

  const handleQuickPasteDM = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawText(val);
    const parsed = parseInstagramDM(val);
    if (parsed.handle && parsed.handle !== '@instagram_user') {
      setFollowerHandle(parsed.handle);
    }
    if (parsed.isAnonymous) {
      setIsAnonymous(true);
    }
    if (parsed.doNotMention) {
      setDoNotMention(parsed.doNotMention);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeContent.trim()) return;

    const finalStoryText = piiScan.hasPII ? piiScan.cleanedText : activeContent;
    
    const newStory: FollowerStory = {
      id: `story-${Date.now()}`,
      createdAt: new Date().toISOString(),
      followerHandle: isAnonymous ? 'Anonymous Follower' : (followerHandle || '@follower'),
      followerAlias: followerAlias || (isAnonymous ? 'Anonymous' : followerHandle.replace('@', '')),
      isAnonymous,
      source: activeTab === 'voice_transcript' ? 'Voice Transcript' : 'Instagram DM',
      rawStory: finalStoryText.trim(),
      category,
      status: 'new_dm',
      consent: {
        voluntaryConsent,
        allowSocialAdaptation,
        preserveTruthAgreed,
        keepAnonymous: isAnonymous,
        confirmedAt: new Date().toISOString(),
        sourceType: activeTab === 'voice_transcript' ? 'voice_transcript' : 'instagram_dm',
      },
      notes: doNotMention ? `DO NOT MENTION: ${doNotMention}` : undefined,
    };

    onStoryAdded(newStory);
    onClose();
    // Reset
    setRawText('');
    setGuidedQ1('');
    setGuidedQ2('');
    setGuidedQ3('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-slate-950 font-bold">
              <InstagramIcon className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Instagram DM Intake Engine</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  BeWithYugace Channel
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Paste raw Instagram messages or audio transcripts. AI automatically cleans PII and structures narrative.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-950/30 border-b border-white/5">
          <button
            onClick={() => setActiveTab('dm_paste')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'dm_paste'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Direct DM Chat Paste</span>
          </button>
          
          <button
            onClick={() => setActiveTab('voice_transcript')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'voice_transcript'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Note / Audio Transcript</span>
          </button>

          <button
            onClick={() => setActiveTab('guided')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'guided'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Structured 3-Step Intake</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Main Input Tab: DM Paste */}
          {activeTab === 'dm_paste' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MessageSquareQuote className="w-4 h-4 text-amber-400" />
                  <span>Paste Instagram DM Message / Chat Log</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  {rawText.length} characters • {rawText.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={rawText}
                onChange={handleQuickPasteDM}
                placeholder="Paste the follower's DM directly here... e.g.:&#10;'Hey Yugace bro! I wanted to tell you what happened when I found out my partner stole money...'"
                rows={6}
                required
                className="w-full rounded-xl bg-slate-950/80 border border-white/10 p-3.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-sans"
              />
            </div>
          )}

          {/* Main Input Tab: Voice Transcript */}
          {activeTab === 'voice_transcript' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-rose-400" />
                  <span>Follower Voice Note Transcription</span>
                </label>
                <span className="text-[11px] text-slate-500">Audio/Speech-to-text transcript</span>
              </div>
              <textarea
                value={rawText}
                onChange={handleQuickPasteDM}
                placeholder="Paste the transcribed voice note or dictation here..."
                rows={6}
                required
                className="w-full rounded-xl bg-slate-950/80 border border-white/10 p-3.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 transition-all font-sans"
              />
            </div>
          )}

          {/* Main Input Tab: Guided Builder */}
          {activeTab === 'guided' && (
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1 block">1. What happened? (Core Event)</label>
                <textarea
                  value={guidedQ1}
                  onChange={(e) => setGuidedQ1(e.target.value)}
                  placeholder="Describe the initial situation or incident..."
                  rows={2}
                  className="w-full rounded-lg bg-slate-950/80 border border-white/10 p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1 block">2. What was the hardest / most shocking moment?</label>
                <textarea
                  value={guidedQ2}
                  onChange={(e) => setGuidedQ2(e.target.value)}
                  placeholder="The moment of betrayal, discovery, or climax..."
                  rows={2}
                  className="w-full rounded-lg bg-slate-950/80 border border-white/10 p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1 block">3. How did it end or where are they now?</label>
                <textarea
                  value={guidedQ3}
                  onChange={(e) => setGuidedQ3(e.target.value)}
                  placeholder="The outcome, resolution, or triumph..."
                  rows={2}
                  className="w-full rounded-lg bg-slate-950/80 border border-white/10 p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* Live PII & Privacy Sanitizer Badge */}
          {piiScan.hasPII && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300">
                  PII Guard Active: {piiScan.detectedItems.length} private details detected & sanitized!
                </p>
                <p className="text-[11px] text-amber-300/80 mt-0.5">
                  Phone numbers, addresses, and email addresses will automatically be masked with safe tokens before reaching the AI script engine.
                </p>
              </div>
            </div>
          )}

          {/* Follower Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Follower Handle */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Follower IG Handle</label>
              <input
                type="text"
                value={followerHandle}
                onChange={(e) => setFollowerHandle(e.target.value)}
                disabled={isAnonymous}
                placeholder="@username"
                className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 disabled:opacity-40"
              />
            </div>

            {/* Display Alias */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Script Name / Alias</label>
              <input
                type="text"
                value={followerAlias}
                onChange={(e) => setFollowerAlias(e.target.value)}
                placeholder="e.g. Rahul / Ananya"
                className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Story Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EmotionCategory)}
                className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Guardrails: Do Not Mention */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">
              'Do Not Mention' Restrictions (Optional)
            </label>
            <input
              type="text"
              value={doNotMention}
              onChange={(e) => setDoNotMention(e.target.value)}
              placeholder="e.g., Ex-partner's real name, company brand name, specific college"
              className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Privacy & Consent Checklist */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Consent & Truth Verification Checklist</span>
              </span>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isAnonymous
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <UserX className="w-3.5 h-3.5" />
                <span>{isAnonymous ? 'Keep 100% Anonymous' : 'Credit Handle'}</span>
              </button>
            </div>

            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={voluntaryConsent}
                onChange={(e) => setVoluntaryConsent(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-white/10"
              />
              <span>Follower voluntarily shared story via DM or voice note.</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={allowSocialAdaptation}
                onChange={(e) => setAllowSocialAdaptation(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-white/10"
              />
              <span>Permission granted to adapt into 30-40s BeWithYugace Reel/Shorts.</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={preserveTruthAgreed}
                onChange={(e) => setPreserveTruthAgreed(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-white/10"
              />
              <span>House Rule: Preserves core truth without fabricating false events or facts.</span>
            </label>
          </div>

          {/* Footer Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!activeContent.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Ingest to BeWithYugace Vault</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
