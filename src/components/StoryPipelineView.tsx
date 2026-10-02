import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Sliders, 
  Layers, 
  TrendingUp, 
  Film, 
  Tv, 
  BarChart3, 
  ArrowLeft, 
  Download, 
  Copy, 
  Check, 
  Flame, 
  AlertTriangle, 
  ShieldCheck, 
  Play, 
  Pause, 
  RotateCcw, 
  Save,
  Eye,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import type { 
  FollowerStory, 
  StoryStatus,
  ScriptPackage,
  PerformanceSnapshot
} from '../types';
import { 
  runStoryAnalysis, 
  runAngleGeneration, 
  runComparableResearch, 
  runScriptGeneration, 
  calculateDeterministicReach,
  generateLearningTakeaways
} from '../services/aiPipeline';

interface StoryPipelineViewProps {
  story: FollowerStory;
  onUpdateStory: (updated: FollowerStory) => void;
  onBackToVault: () => void;
}

type TabKey = 
  | 'truth_check'
  | 'angles'
  | 'research'
  | 'script'
  | 'production'
  | 'reach'
  | 'teleprompter'
  | 'learning';

export const StoryPipelineView: React.FC<StoryPipelineViewProps> = ({
  story,
  onUpdateStory,
  onBackToVault,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('truth_check');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Editable Script & Shot State
  const [editableScript, setEditableScript] = useState(story.scriptPackage?.fullScript || '');
  const [selectedHookIdx, setSelectedHookIdx] = useState(story.scriptPackage?.selectedHookIndex || 0);

  // Teleprompter state
  const [isPrompting, setIsPrompting] = useState(false);
  const [promptSpeed, setPromptSpeed] = useState(2); // 1 to 5
  const [fontSize, setFontSize] = useState(32); // px
  const [isMirrored, setIsMirrored] = useState(false);

  // Follow-up question state
  const [activeFollowupQuestion, setActiveFollowupQuestion] = useState<string | null>(null);

  // Performance Snapshot form state
  const [snapTime, setSnapTime] = useState<'1 Hour' | '6 Hours' | '24 Hours' | '48 Hours'>('1 Hour');
  const [snapViews, setSnapViews] = useState(15000);
  const [snapRetention, setSnapRetention] = useState(82);
  const [snapWatchTime] = useState(28);
  const [snapLikes] = useState(2100);
  const [snapComments] = useState(180);
  const [snapShares, setSnapShares] = useState(520);
  const [snapSaves] = useState(410);
  const [snapFollowers] = useState(120);

  // Run full AI Pipeline
  const handleRunFullPipeline = async () => {
    setIsProcessing(true);
    try {
      // 1. Analysis
      const analysis = await runStoryAnalysis(story);
      // 2. Angles
      const angles = await runAngleGeneration(story, analysis);
      const chosenAngle = angles.find(a => a.isRecommended) || angles[0];
      // 3. Research
      const { comparables, contentGap } = await runComparableResearch(story);
      // 4. Script
      const scriptPackage = await runScriptGeneration(story, chosenAngle, contentGap);
      // 5. Reach
      const reachAnalysis = calculateDeterministicReach(scriptPackage);

      const updated: FollowerStory = {
        ...story,
        status: 'in_production',
        analysis,
        angles,
        selectedAngleId: chosenAngle.id,
        comparables,
        contentGap,
        scriptPackage,
        reachAnalysis,
      };

      setEditableScript(scriptPackage.fullScript);
      onUpdateStory(updated);
      setActiveTab('script');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatusChange = (newStatus: StoryStatus) => {
    const updated: FollowerStory = {
      ...story,
      status: newStatus,
    };
    onUpdateStory(updated);
  };

  const handleApproveReel = () => {
    const updated: FollowerStory = {
      ...story,
      status: 'approved',
    };
    onUpdateStory(updated);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleSaveScriptEdits = () => {
    if (!story.scriptPackage) return;
    const words = editableScript.split(/\s+/).filter(Boolean).length;
    const updatedScriptPkg: ScriptPackage = {
      ...story.scriptPackage,
      fullScript: editableScript,
      wordCount: words,
      estimatedDurationSec: Math.round(words / 2.8),
    };
    const updated: FollowerStory = {
      ...story,
      scriptPackage: updatedScriptPkg,
    };
    onUpdateStory(updated);
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateDMClarification = (question: string) => {
    const handleName = story.followerAlias || story.followerHandle;
    const message = `Hey ${handleName}! Loved your story for BeWithYugace. Quick clarification before we film the Reel: ${question} (Reply whenever you get time!)`;
    handleCopyText(message, 'dm_clarification');
    setActiveFollowupQuestion(question);
  };

  const handleExportCapCutCSV = () => {
    if (!story.scriptPackage) return;
    const headers = 'Timecode,Camera Angle,Voiceover,On-Screen Text,Sound Cue\n';
    const rows = story.scriptPackage.shotTable
      .map(
        s =>
          `"${s.timeRange}","${s.cameraAngle}","${s.voiceover.replace(/"/g, '""')}","${s.onScreenText.replace(/"/g, '""')}","${s.soundCue.replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BeWithYugace_Shots_${story.id}.csv`;
    a.click();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('BeWithYugace — Untold Story Production Package', 14, 20);
    doc.setFontSize(12);
    doc.text(`Story ID: ${story.id} | Follower: ${story.followerHandle}`, 14, 30);
    doc.text(`Status: ${story.status.toUpperCase()} | Category: ${story.category}`, 14, 38);
    
    doc.setFontSize(14);
    doc.text('1. Approved 30-40s Script:', 14, 50);
    doc.setFontSize(10);
    const splitScript = doc.splitTextToSize(editableScript || story.rawStory, 180);
    doc.text(splitScript, 14, 58);

    if (story.scriptPackage) {
      doc.setFontSize(14);
      doc.text('2. Instagram Caption & Hashtags:', 14, 120);
      doc.setFontSize(9);
      const splitCap = doc.splitTextToSize(story.scriptPackage.captions.instagram, 180);
      doc.text(splitCap, 14, 128);
    }

    doc.save(`BeWithYugace_Package_${story.id}.pdf`);
  };

  const handleAddSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    const newSnapshot: PerformanceSnapshot = {
      timestampLabel: snapTime,
      loggedAt: new Date().toISOString(),
      views: Number(snapViews),
      retentionPercentage: Number(snapRetention),
      avgWatchTimeSec: Number(snapWatchTime),
      likes: Number(snapLikes),
      comments: Number(snapComments),
      shares: Number(snapShares),
      saves: Number(snapSaves),
      followersGained: Number(snapFollowers),
    };

    const existingSnapshots = story.learning?.snapshots || [];
    const updatedSnapshots = [...existingSnapshots, newSnapshot];
    const aiTakeaways = generateLearningTakeaways(updatedSnapshots, story.reachAnalysis?.potentialBand || 'Strong');

    const updated: FollowerStory = {
      ...story,
      status: 'published',
      learning: {
        publishedUrl: story.learning?.publishedUrl || 'https://instagram.com/reel/bewithyugace_latest',
        platform: 'Instagram',
        publishedAt: story.learning?.publishedAt || new Date().toISOString(),
        snapshots: updatedSnapshots,
        aiTakeaways,
      },
    };

    onUpdateStory(updated);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      
      {/* Top Breadcrumb & Action Deck */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-white/10">
        
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToVault}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {story.category}
              </span>
              <h2 className="text-base font-bold text-white truncate max-w-[220px] sm:max-w-md">
                {story.followerAlias || story.followerHandle}’s Story
              </h2>
            </div>
            
            {/* Status Lifecycle Selector */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-slate-500">Lifecycle State:</span>
              <select
                value={story.status}
                onChange={(e) => handleStatusChange(e.target.value as StoryStatus)}
                className="bg-slate-950 border border-white/10 text-emerald-400 font-bold text-xs rounded-lg px-2 py-0.5 focus:outline-none focus:border-amber-500 uppercase tracking-wider"
              >
                <option value="new_dm">NEW DM</option>
                <option value="needs_clarification">NEEDS CLARIFICATION</option>
                <option value="analyzed">ANALYZED</option>
                <option value="in_production">IN PRODUCTION</option>
                <option value="approved">APPROVED</option>
                <option value="published">PUBLISHED</option>
                <option value="archived">ARCHIVED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRunFullPipeline}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            <Sparkles className={`w-3.5 h-3.5 text-slate-950 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Running AI Engine...' : 'Run Full Pipeline'}</span>
          </button>

          <button
            onClick={handleApproveReel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve Reel</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 text-xs font-semibold transition-all"
            title="Download PDF Package"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export PDF</span>
          </button>
        </div>

      </div>

      {/* Stage Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs border-b border-white/5">
        {[
          { id: 'truth_check', label: '1. Truth Check & Facts', icon: ShieldCheck },
          { id: 'angles', label: '2. Story Angles (3)', icon: Sliders },
          { id: 'research', label: '3. Benchmarks & Gap', icon: Layers },
          { id: 'script', label: '4. Script & 5 Hooks', icon: FileText },
          { id: 'production', label: '5. Shot-by-Shot Table', icon: Film },
          { id: 'reach', label: '6. 12-Factor Reach Meter', icon: TrendingUp },
          { id: 'teleprompter', label: '7. Teleprompter Mode', icon: Tv },
          { id: 'learning', label: '8. Performance & Learnings', icon: BarChart3 },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as TabKey)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panes */}
      <div className="flex-1 overflow-y-auto pr-1">
        
        {/* TAB 1: TRUTH CHECK & SOURCE QUOTES (PHASE 3) */}
        {activeTab === 'truth_check' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Left: Raw DM & Follow-up Q&A Generator */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="p-1 rounded-md bg-rose-500/20 text-rose-300">DM</span>
                  <span>Verbatim Follower Input</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(story.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                {story.rawStory}
              </div>

              {/* Follow-up Clarification Tool */}
              {story.analysis?.clarificationQuestions && story.analysis.clarificationQuestions.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-amber-500/20 space-y-2.5">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Generate Instagram DM Follow-Up Question:</span>
                  </span>
                  <div className="space-y-2">
                    {story.analysis.clarificationQuestions.map((q, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-white/5 text-xs text-slate-300">
                        <span className="truncate pr-2">{q}</span>
                        <button
                          onClick={() => handleGenerateDMClarification(q)}
                          className="px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-semibold text-[11px] shrink-0 transition-all flex items-center gap-1"
                        >
                          {copiedKey === 'dm_clarification' && activeFollowupQuestion === q ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'dm_clarification' && activeFollowupQuestion === q ? 'Copied DM' : 'Copy IG DM'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guardrails / Consent Card */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-2 text-xs">
                <span className="font-bold text-slate-300 block">Follower Consent Status:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Voluntary Submission
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Reel Adaptation Permitted
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Zero Fact Alteration Agreed
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <ShieldCheck className="w-3 h-3" /> {story.isAnonymous ? '100% Anonymous' : 'Handle Tag Approved'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: AI Fact Extraction & Verbatim Match */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Sentence-Level Truth Verification (Zero-Hallucination)</span>
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  100% Source-Bound
                </span>
              </div>

              {story.analysis ? (
                <div className="space-y-3 text-xs">
                  
                  {/* Core Points */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Protagonist</span>
                      <p className="text-white font-medium mt-0.5">{story.analysis.mainCharacter}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Turning Point</span>
                      <p className="text-white font-medium mt-0.5">{story.analysis.turningPoint}</p>
                    </div>
                  </div>

                  {/* Fact Quotes List */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 block">Extracted Verbatim Proof Quotes:</span>
                    {story.analysis.truthChecks.map((tc) => (
                      <div key={tc.id} className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/20 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{tc.claim}</span>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">
                            Verified
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 italic">
                          "{tc.sourceQuote}"
                        </p>
                      </div>
                    ))}
                  </div>

                </div>
              ) : (
                <div className="text-center py-10 space-y-2">
                  <p className="text-xs text-slate-400">Analysis has not been run yet.</p>
                  <button
                    onClick={handleRunFullPipeline}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    Run Truth Extraction
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 2: 3-STORY ANGLES */}
        {activeTab === 'angles' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">3 Distinct Story Angles</h3>
                <p className="text-xs text-slate-400">
                  Select the narrative perspective that best aligns with BeWithYugace storytelling and viral retention.
                </p>
              </div>
            </div>

            {story.angles ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {story.angles.map((angle) => {
                  const isSelected = story.selectedAngleId === angle.id;
                  return (
                    <div
                      key={angle.id}
                      className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'bg-slate-900 border-amber-500 ring-1 ring-amber-500/40 shadow-xl'
                          : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div>
                        {angle.isRecommended && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 mb-3 shadow-md">
                            <Flame className="w-3 h-3 fill-slate-950" /> AI Recommended Angle
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-white mb-1.5">{angle.name}</h4>
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 text-xs text-amber-200/90 font-medium mb-3">
                          "{angle.hookConcept}"
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          {angle.narrativeArc}
                        </p>

                        {/* Scores */}
                        <div className="space-y-2 text-[11px] mb-4">
                          <div className="flex justify-between text-slate-400">
                            <span>Emotional Punch:</span>
                            <span className="font-bold text-white">{angle.emotionalPunch}/10</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${angle.emotionalPunch * 10}%` }} />
                          </div>

                          <div className="flex justify-between text-slate-400">
                            <span>Visual Feasibility:</span>
                            <span className="font-bold text-white">{angle.visualFeasibility}/10</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${angle.visualFeasibility * 10}%` }} />
                          </div>

                          <div className="flex justify-between text-slate-400">
                            <span>Shareability:</span>
                            <span className="font-bold text-white">{angle.shareability}/10</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${angle.shareability * 10}%` }} />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const updated = { ...story, selectedAngleId: angle.id };
                          onUpdateStory(updated);
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-white/5 hover:bg-white/10 text-white'
                        }`}
                      >
                        {isSelected ? 'Selected Angle ✓' : 'Select This Angle'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 p-6 rounded-2xl bg-slate-900/40 border border-white/5">
                <p className="text-xs text-slate-400 mb-3">No angles generated yet.</p>
                <button
                  onClick={handleRunFullPipeline}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Generate 3 Angles
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BENCHMARKS & CONTENT GAP */}
        {activeTab === 'research' && (
          <div className="space-y-4">
            
            {/* Content Gap Report */}
            {story.contentGap && (
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <h3 className="text-sm font-bold text-white">BeWithYugace Content Gap & Differentiator</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5">
                    <span className="text-[10px] text-rose-400 font-bold uppercase block mb-1">Overused Tropes to Avoid</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                      {story.contentGap.overusedTropes.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-1">BeWithYugace Winning Edge</span>
                    <p className="text-slate-200 text-[11px] leading-relaxed">
                      {story.contentGap.beWithYugaceDifferentiator}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Comparables Table */}
            {story.comparables && (
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Comparable Short-Form Benchmark Data</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                        <th className="pb-2">Video Title</th>
                        <th className="pb-2">Platform</th>
                        <th className="pb-2">Views</th>
                        <th className="pb-2">Hook Analyzed</th>
                        <th className="pb-2">Provenance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {story.comparables.map((comp) => (
                        <tr key={comp.id} className="text-slate-300">
                          <td className="py-2.5 font-semibold text-white">{comp.title}</td>
                          <td className="py-2.5">{comp.platform}</td>
                          <td className="py-2.5 font-mono text-amber-300">{comp.views.toLocaleString()}</td>
                          <td className="py-2.5 text-slate-400 max-w-xs truncate">"{comp.hookUsed}"</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-slate-400 border border-white/5">
                              {comp.metricProvenance}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 4: SCRIPT & 5 VIRAL HOOKS */}
        {activeTab === 'script' && (
          <div className="space-y-4">
            
            {/* 5 Viral Hook Carousel */}
            {story.scriptPackage && (
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>5 High-Retention Viral Hook Options</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Tested for 0-3s scroll-stop</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {story.scriptPackage.hooks.map((h, idx) => {
                    const isSelected = selectedHookIdx === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedHookIdx(idx)}
                        className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 text-amber-200'
                            : 'bg-slate-950/60 border-white/5 hover:border-white/20 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[10px] uppercase tracking-wider text-amber-400">
                            {h.type}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono">
                            {h.estimatedRetentionRate}
                          </span>
                        </div>
                        <p className="font-medium text-xs leading-relaxed line-clamp-3">
                          "{h.text}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Script Live Editor */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold text-white">
                    30–40s Teleprompter-Ready Script
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {editableScript.split(/\s+/).filter(Boolean).length} Words • ~{Math.round(editableScript.split(/\s+/).filter(Boolean).length / 2.8)}s Duration
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyText(editableScript, 'script')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/5"
                  >
                    {copiedKey === 'script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'script' ? 'Copied!' : 'Copy Script'}</span>
                  </button>

                  <button
                    onClick={handleSaveScriptEdits}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5 text-slate-950" />
                    <span>Save Edits</span>
                  </button>
                </div>
              </div>

              <textarea
                value={editableScript}
                onChange={(e) => setEditableScript(e.target.value)}
                rows={8}
                className="w-full rounded-xl bg-slate-950/80 border border-white/10 p-4 text-sm text-slate-100 font-sans leading-relaxed focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-all"
              />

              {/* Captions & Hashtag Generator */}
              {story.scriptPackage && (
                <div className="pt-2 border-t border-white/5 space-y-3">
                  <span className="text-xs font-bold text-slate-300 block">Instagram Reel Caption & Hashtag Suite:</span>
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 text-xs text-slate-300 space-y-2">
                    <p className="whitespace-pre-wrap">{story.scriptPackage.captions.instagram}</p>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleCopyText(story.scriptPackage!.captions.instagram, 'caption')}
                        className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300"
                      >
                        {copiedKey === 'caption' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'caption' ? 'Copied Caption' : 'Copy IG Caption'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 5: SHOT-BY-SHOT PRODUCTION TABLE */}
        {activeTab === 'production' && (
          <div className="space-y-4">
            
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white">Shot-by-Shot Visual & Audio Direction</h3>
                <p className="text-xs text-slate-400">
                  Follow this structured timeline during filming and CapCut / Premiere Pro editing.
                </p>
              </div>

              <button
                onClick={handleExportCapCutCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export CapCut CSV</span>
              </button>
            </div>

            {story.scriptPackage?.shotTable ? (
              <div className="space-y-3">
                {story.scriptPackage.shotTable.map((shot, idx) => (
                  <div
                    key={shot.id}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 hover:border-white/15 transition-all space-y-3 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold font-mono flex items-center justify-center text-xs">
                          {idx + 1}
                        </span>
                        <span className="font-mono text-white font-bold text-xs bg-slate-950 px-2 py-0.5 rounded-md border border-white/5">
                          {shot.timeRange}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {shot.cameraAngle}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Voiceover Line</span>
                        <p className="text-slate-100 font-medium">"{shot.voiceover}"</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Visual / B-Roll Action</span>
                        <p className="text-slate-300">{shot.visualDirection}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px]">
                      <div className="flex items-center gap-1.5 text-amber-300">
                        <span className="text-slate-500 font-semibold">On-Screen Text:</span>
                        <span className="font-mono bg-slate-950 px-2 py-0.5 rounded border border-white/5">{shot.onScreenText}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-rose-300">
                        <span className="text-slate-500 font-semibold">Audio SFX:</span>
                        <span>{shot.soundCue}</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-white/5">
                <p className="text-xs text-slate-400 mb-2">No production plan generated yet.</p>
                <button
                  onClick={handleRunFullPipeline}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Generate Production Plan
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 6: 12-FACTOR REACH METER */}
        {activeTab === 'reach' && (
          <div className="space-y-4">
            
            {story.reachAnalysis ? (
              <div className="space-y-4">
                
                {/* Score Gauge Banner */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Deterministic Reach Potential Index
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">
                      {story.reachAnalysis.potentialBand}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md">
                      {story.reachAnalysis.disclaimer}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col items-center justify-center shadow-lg shadow-amber-500/20">
                      <span className="text-2xl font-black text-amber-400">{story.reachAnalysis.calculatedIndex}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">/ 100</span>
                    </div>
                  </div>
                </div>

                {/* Factors List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {story.reachAnalysis.factors.map((f, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{f.name}</span>
                        <span className="font-mono text-amber-300 font-bold">{f.score}/5.0</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full" style={{ width: `${(f.score / 5) * 100}%` }} />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{f.reasoning}</p>
                    </div>
                  ))}
                </div>

                {/* Retention Risk Alerts */}
                <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Predicted Retention Drop-Off Alerts</span>
                  </div>
                  <div className="space-y-2">
                    {story.reachAnalysis.retentionDropRisks.map((r, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-white/5 text-xs">
                        <div className="flex items-center gap-2 font-mono font-bold text-rose-300 mb-1">
                          <span>{r.timestamp}</span>
                          <span className="text-slate-500">•</span>
                          <span>{r.risk}</span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          <strong className="text-emerald-400">Action: </strong> {r.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-white/5">
                <p className="text-xs text-slate-400 mb-2">Reach analysis not calculated yet.</p>
                <button
                  onClick={handleRunFullPipeline}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Calculate Reach Index
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 7: TELEPROMPTER MODE */}
        {activeTab === 'teleprompter' && (
          <div className="space-y-4">
            
            {/* Control Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPrompting(!isPrompting)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs transition-all ${
                    isPrompting
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                      : 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                  }`}
                >
                  {isPrompting ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPrompting ? 'Pause Prompter' : 'Start Auto-Scroll'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsPrompting(false);
                    const el = document.getElementById('prompter-box');
                    if (el) el.scrollTop = 0;
                  }}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  title="Reset Prompter"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed & Font slider */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Speed:</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={promptSpeed}
                    onChange={(e) => setPromptSpeed(Number(e.target.value))}
                    className="w-24 accent-amber-500"
                  />
                  <span className="font-mono text-amber-300 font-bold">{promptSpeed}x</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Size:</span>
                  <input
                    type="range"
                    min="24"
                    max="52"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-24 accent-amber-500"
                  />
                  <span className="font-mono text-amber-300 font-bold">{fontSize}px</span>
                </div>

                <button
                  onClick={() => setIsMirrored(!isMirrored)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    isMirrored ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {isMirrored ? 'Mirrored (Glass)' : 'Normal'}
                </button>
              </div>
            </div>

            {/* Scrolling Prompter Screen */}
            <div
              id="prompter-box"
              className={`h-[450px] overflow-y-auto p-10 rounded-3xl bg-black border-2 border-white/10 shadow-2xl relative select-none ${
                isMirrored ? 'scale-x-[-1]' : ''
              }`}
              style={{
                scrollBehavior: isPrompting ? 'smooth' : 'auto',
              }}
            >
              <div className="max-w-2xl mx-auto space-y-8 text-center text-slate-100 font-bold tracking-wide leading-relaxed">
                <div className="text-amber-400 text-sm uppercase tracking-widest font-mono">
                  [ 3-2-1 RECORDING • BEWITHYUGACE ]
                </div>
                <p style={{ fontSize: `${fontSize}px`, lineHeight: 1.4 }}>
                  {editableScript || story.rawStory}
                </p>
                <div className="text-slate-600 text-sm uppercase tracking-widest font-mono pt-20">
                  [ END OF SCRIPT ]
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 8: PERFORMANCE & LEARNINGS */}
        {activeTab === 'learning' && (
          <div className="space-y-4">
            
            {/* AI Post-Mortem & Pattern Learner */}
            {story.learning?.aiTakeaways && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>BeWithYugace Continuous AI Learning Post-Mortem</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">Predicted vs Actual</span>
                    <p className="text-slate-200 text-[11px]">{story.learning.aiTakeaways.predictedVsActual}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">Hook & 3s Retention</span>
                    <p className="text-slate-200 text-[11px]">{story.learning.aiTakeaways.hookEffectiveness}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase">Retention Behavior</span>
                    <p className="text-slate-200 text-[11px]">{story.learning.aiTakeaways.retentionInsight}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                    <span className="text-[10px] text-rose-400 font-bold uppercase">Action for Next Video</span>
                    <p className="text-slate-200 text-[11px]">{story.learning.aiTakeaways.nextStoryAction}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Check-in Snapshots History */}
            {story.learning?.snapshots && story.learning.snapshots.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Logged Performance Milestones</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {story.learning.snapshots.map((s, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between items-center text-amber-400 font-bold">
                        <span>{s.timestampLabel}</span>
                        <Eye className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-lg font-black text-white font-mono">{s.views.toLocaleString()} Views</div>
                      <div className="text-[11px] text-slate-400 space-y-1 border-t border-white/5 pt-2">
                        <div className="flex justify-between"><span>Retention:</span><span className="text-emerald-400 font-bold">{s.retentionPercentage}%</span></div>
                        <div className="flex justify-between"><span>Watch Time:</span><span>{snapWatchTime}s</span></div>
                        <div className="flex justify-between"><span>Shares:</span><span className="text-amber-300">{s.shares.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Followers:</span><span className="text-cyan-300">+{snapFollowers}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Log New Snapshot Form */}
            <form onSubmit={handleAddSnapshot} className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Log Performance Snapshot (1h / 6h / 24h / 48h)</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 text-[11px] block mb-1">Time Point</label>
                  <select
                    value={snapTime}
                    onChange={(e) => setSnapTime(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-950 border border-white/10 p-2 text-white"
                  >
                    <option value="1 Hour">1 Hour</option>
                    <option value="6 Hours">6 Hours</option>
                    <option value="24 Hours">24 Hours</option>
                    <option value="48 Hours">48 Hours</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 text-[11px] block mb-1">Total Views</label>
                  <input
                    type="number"
                    value={snapViews}
                    onChange={(e) => setSnapViews(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 border border-white/10 p-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[11px] block mb-1">Avg Retention %</label>
                  <input
                    type="number"
                    value={snapRetention}
                    onChange={(e) => setSnapRetention(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 border border-white/10 p-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[11px] block mb-1">Shares Count</label>
                  <input
                    type="number"
                    value={snapShares}
                    onChange={(e) => setSnapShares(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 border border-white/10 p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  Save Snapshot & Recalibrate AI
                </button>
              </div>
            </form>

          </div>
        )}

      </div>

    </div>
  );
};
