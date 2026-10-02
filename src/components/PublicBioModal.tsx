import React, { useState } from 'react';
import { X, Smartphone, Check, Shield, Sparkles, Send } from 'lucide-react';
import type { FollowerStory } from '../types';

interface PublicBioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStorySubmitted: (story: FollowerStory) => void;
}

export const PublicBioModal: React.FC<PublicBioModalProps> = ({
  isOpen,
  onClose,
  onStorySubmitted,
}) => {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [q4, setQ4] = useState('');
  const [q5, setQ5] = useState('');
  const [q6, setQ6] = useState('');
  const [handle, setHandle] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q1.trim()) return;

    const fullNarrative = `[Q1: What happened?]: ${q1}
${q2 ? `[Q2: Who was involved?]: ${q2}` : ''}
${q3 ? `[Q3: What was the hardest part?]: ${q3}` : ''}
${q4 ? `[Q4: Turning point]: ${q4}` : ''}
${q5 ? `[Q5: How did it end?]: ${q5}` : ''}
${q6 ? `[Q6: Do NOT mention]: ${q6}` : ''}`;

    const newStory: FollowerStory = {
      id: `story-bio-${Date.now()}`,
      createdAt: new Date().toISOString(),
      followerHandle: isAnonymous ? 'Anonymous Follower' : (handle || '@bio_follower'),
      followerAlias: isAnonymous ? 'Anonymous' : handle.replace('@', ''),
      isAnonymous,
      source: 'Public Form',
      rawStory: fullNarrative.trim(),
      category: 'Heartbreak & Betrayal',
      status: 'new_dm',
      consent: {
        voluntaryConsent: true,
        allowSocialAdaptation: true,
        preserveTruthAgreed: true,
        keepAnonymous: isAnonymous,
        confirmedAt: new Date().toISOString(),
        sourceType: 'bio_form',
      },
      notes: q6 ? `DO NOT MENTION: ${q6}` : undefined,
    };

    onStorySubmitted(newStory);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[92vh] flex flex-col rounded-3xl bg-slate-950 border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Mobile Device Frame Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-200">Follower Mobile Form Preview</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Brand Header */}
          <div className="text-center pb-2 border-b border-white/5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-semibold mb-2">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>BeWithYugace • Untold Stories</span>
            </div>
            <h3 className="text-base font-bold text-white">Share Your Untold Story</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Have an unforgettable real-life story? Tell Yugace in your own words. We never share your real name without permission.
            </p>
          </div>

          {/* Privacy Notice Banner */}
          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 flex items-start gap-2.5 text-[11px] text-blue-200">
            <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-300">Privacy Notice</p>
              <p className="text-blue-300/80">
                Please do not include phone numbers, exact addresses, or government ID numbers.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <Check className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-white">Story Received!</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Thank you for sharing your truth with BeWithYugace. If selected, it will be scripted with utmost care.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  1. What happened? <span className="text-rose-400">*</span>
                </label>
                <textarea
                  value={q1}
                  onChange={(e) => setQ1(e.target.value)}
                  placeholder="Tell it in your own words, short or long..."
                  required
                  rows={3}
                  className="w-full rounded-xl bg-slate-900 border border-white/10 p-2.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  2. Who was involved? (Fake names are totally fine)
                </label>
                <input
                  type="text"
                  value={q2}
                  onChange={(e) => setQ2(e.target.value)}
                  placeholder="e.g. My business partner, my college roommate"
                  className="w-full rounded-xl bg-slate-900 border border-white/10 p-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  3. What was the hardest or most shocking part?
                </label>
                <textarea
                  value={q3}
                  onChange={(e) => setQ3(e.target.value)}
                  placeholder="The moment you felt the most emotion..."
                  rows={2}
                  className="w-full rounded-xl bg-slate-900 border border-white/10 p-2.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  4. Was there a moment when things changed?
                </label>
                <textarea
                  value={q4}
                  onChange={(e) => setQ4(e.target.value)}
                  placeholder="The turning point or discovery..."
                  rows={2}
                  className="w-full rounded-xl bg-slate-900 border border-white/10 p-2.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  5. How did it end, or where are you now?
                </label>
                <input
                  type="text"
                  value={q5}
                  onChange={(e) => setQ5(e.target.value)}
                  placeholder="The resolution or current state..."
                  className="w-full rounded-xl bg-slate-900 border border-white/10 p-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1 text-rose-300">
                  6. Anything you do NOT want mentioned?
                </label>
                <input
                  type="text"
                  value={q6}
                  onChange={(e) => setQ6(e.target.value)}
                  placeholder="Names, companies, or cities to skip..."
                  className="w-full rounded-xl bg-slate-900 border border-white/10 p-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Anonymous toggle & handle */}
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-semibold text-slate-300">Keep me 100% anonymous</span>
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-amber-500 bg-slate-800"
                  />
                </label>
                {!isAnonymous && (
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="Your Instagram handle (e.g. @yourname)"
                    className="w-full rounded-lg bg-slate-950 border border-white/10 p-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={!q1.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-violet-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>Submit Story to BeWithYugace</span>
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
