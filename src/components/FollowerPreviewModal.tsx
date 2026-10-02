import React, { useState } from 'react';
import { X, Check, Copy, Shield, Smartphone, Lock } from 'lucide-react';
import type { FollowerStory } from '../types';

interface FollowerPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: FollowerStory;
}

export const FollowerPreviewModal: React.FC<FollowerPreviewModalProps> = ({
  isOpen,
  onClose,
  story,
}) => {
  const [copied, setCopied] = useState(false);
  const [followerConfirmed, setFollowerConfirmed] = useState(false);

  if (!isOpen) return null;

  const previewToken = `preview_token_${story.id.replace('story-', '')}_${Math.floor(Date.now() / 1000)}`;
  const previewUrl = `https://bewithyugace.com/preview/${previewToken}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg flex flex-col rounded-3xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Follower Script Approval Link</h3>
              <p className="text-[11px] text-slate-400">Share with the follower so they can verify the final script</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* Link box */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Secure One-Time Preview URL</label>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-white/10">
              <input
                type="text"
                readOnly
                value={previewUrl}
                className="w-full bg-transparent text-xs text-amber-300 font-mono outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs shrink-0 hover:bg-amber-400 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Follower View Simulation Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="font-bold text-slate-200">What Follower Sees:</span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3" /> End-to-End Encrypted
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded-xl border border-white/5 font-sans">
              "{story.scriptPackage?.fullScript || story.rawStory}"
            </p>

            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5 font-bold">
                <Shield className="w-3.5 h-3.5" />
                <span>Zero-Hallucination & Truth Guarantee</span>
              </div>
              <p className="text-emerald-300/80">
                BeWithYugace will never add fictional events or disclose identifying information without your consent.
              </p>
            </div>

            <label className="flex items-center gap-2 pt-1 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={followerConfirmed}
                onChange={(e) => setFollowerConfirmed(e.target.checked)}
                className="rounded text-amber-500 bg-slate-900 border-white/10"
              />
              <span className="font-semibold text-xs">Follower confirmed and approved final script via DM</span>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
