export type StoryStatus = 
  | 'new_dm'
  | 'needs_clarification'
  | 'analyzed'
  | 'in_production'
  | 'approved'
  | 'published'
  | 'archived'
  | 'withdrawn';

export type EmotionCategory = 
  | 'Heartbreak & Betrayal'
  | 'Career & Hustle'
  | 'Family & Secrets'
  | 'Horror & Paranormal'
  | 'Unbelievable Coincidence'
  | 'Redemption & Victory'
  | 'Wild & Humorous';

export type ThemeMode = 'obsidian-gold' | 'midnight-cyber' | 'studio-dark' | 'electric-sunset';

export interface ConsentRecord {
  voluntaryConsent: boolean;
  allowSocialAdaptation: boolean;
  preserveTruthAgreed: boolean;
  keepAnonymous: boolean;
  confirmedAt: string;
  sourceType: 'instagram_dm' | 'bio_form' | 'voice_transcript';
}

export interface PIISanitizationResult {
  hasPII: boolean;
  cleanedText: string;
  detectedItems: {
    type: 'phone' | 'email' | 'address' | 'real_name';
    value: string;
    replacement: string;
  }[];
}

export interface TruthCheckItem {
  id: string;
  claim: string;
  sourceQuote: string;
  status: 'verified' | 'unclear' | 'needs_verification';
  notes?: string;
}

export interface StoryAnalysis {
  mainCharacter: string;
  coreProblem: string;
  emotionalCore: string;
  turningPoint: string;
  ending: string;
  centralMessage: string;
  uniqueElement: string;
  doNotMention: string[];
  sensitivityFlags: string[];
  clarificationQuestions: string[];
  truthChecks: TruthCheckItem[];
}

export interface StoryAngle {
  id: string;
  name: string;
  hookConcept: string;
  narrativeArc: string;
  emotionalPunch: number; // 1-10
  visualFeasibility: number; // 1-10
  shareability: number; // 1-10
  overallScore: number;
  recommendationReason: string;
  isRecommended: boolean;
}

export interface ComparableVideo {
  id: string;
  title: string;
  platform: 'Instagram Reels' | 'YouTube Shorts' | 'TikTok';
  creator: string;
  views: number;
  likes: number;
  hookUsed: string;
  durationSec: number;
  whatWorked: string;
  metricProvenance: 'Official API' | 'Public Text' | 'Creator Manual Entry';
  url: string;
}

export interface ContentGapAnalysis {
  overusedTropes: string[];
  missingPerspective: string;
  beWithYugaceDifferentiator: string;
  recommendedTone: string;
}

export interface ShotItem {
  id: string;
  timeRange: string; // e.g. "00:00 - 00:03"
  voiceover: string;
  visualDirection: string;
  cameraAngle: 'Creator On-Camera (Close-up)' | 'B-Roll Footage' | 'Split Screen' | 'Fast Cut Montages' | 'Creator On-Camera (Wide)';
  onScreenText: string;
  soundCue: string;
}

export interface ScriptPackage {
  id: string;
  version: number;
  selectedAngleId: string;
  hooks: {
    type: 'Curiosity' | 'High-Stakes' | 'Emotional Shock' | 'Relatable Question' | 'In-Media-Res';
    text: string;
    estimatedRetentionRate: string;
    isBestFit?: boolean;
  }[];
  selectedHookIndex: number;
  fullScript: string;
  wordCount: number;
  estimatedDurationSec: number;
  shotTable: ShotItem[];
  captions: {
    instagram: string;
    youtubeShorts: string;
    facebookReels: string;
    hashtags: string[];
  };
  suggestedTitles: string[];
  cta: string;
  fidelityPass: boolean;
}

export interface ReachFactor {
  name: string;
  score: number; // 1 - 5
  weight: number; // percentage
  reasoning: string;
  category: 'Hook' | 'Retention' | 'Emotional Impact' | 'Shareability' | 'Topic Interest' | 'Audience Fit' | 'Differentiation' | 'Competition';
}

export interface ReachAnalysis {
  calculatedIndex: number; // 0-100
  potentialBand: 'Low Potential' | 'Moderate Potential' | 'Strong Potential' | 'Very Strong Potential';
  confidenceLevel: 'High' | 'Moderate' | 'Tentative (Low Data)';
  factors: ReachFactor[];
  retentionDropRisks: {
    timestamp: string;
    risk: string;
    recommendation: string;
  }[];
  disclaimer: string;
}

export interface PerformanceSnapshot {
  timestampLabel: '1 Hour' | '6 Hours' | '24 Hours' | '48 Hours';
  loggedAt: string;
  views: number;
  retentionPercentage: number;
  avgWatchTimeSec: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  followersGained: number;
}

export interface PerformanceLearning {
  publishedUrl: string;
  platform: 'Instagram' | 'YouTube Shorts' | 'Both';
  publishedAt: string;
  snapshots: PerformanceSnapshot[];
  aiTakeaways: {
    predictedVsActual: string;
    hookEffectiveness: string;
    retentionInsight: string;
    nextStoryAction: string;
  };
}

export interface FollowerStory {
  id: string;
  createdAt: string;
  followerHandle: string;
  followerAlias?: string;
  isAnonymous: boolean;
  source: 'Instagram DM' | 'Voice Transcript' | 'Public Form';
  rawStory: string;
  category: EmotionCategory;
  status: StoryStatus;
  consent: ConsentRecord;
  analysis?: StoryAnalysis;
  angles?: StoryAngle[];
  selectedAngleId?: string;
  comparables?: ComparableVideo[];
  contentGap?: ContentGapAnalysis;
  scriptPackage?: ScriptPackage;
  reachAnalysis?: ReachAnalysis;
  learning?: PerformanceLearning;
  notes?: string;
}
