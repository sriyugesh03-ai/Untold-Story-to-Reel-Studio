from pydantic import BaseModel, Field
from typing import Literal

StoryStatus = Literal[
    'new_dm',
    'needs_clarification',
    'analyzed',
    'in_production',
    'approved',
    'published',
    'archived',
    'withdrawn'
]

EmotionCategory = Literal[
    'Heartbreak & Betrayal',
    'Career & Hustle',
    'Family & Secrets',
    'Horror & Paranormal',
    'Unbelievable Coincidence',
    'Redemption & Victory',
    'Wild & Humorous'
]

class ConsentRecord(BaseModel):
    voluntaryConsent: bool = True
    allowSocialAdaptation: bool = True
    preserveTruthAgreed: bool = True
    keepAnonymous: bool = False
    confirmedAt: str
    sourceType: str = "instagram_dm"

class TruthCheckItem(BaseModel):
    id: str
    claim: str
    sourceQuote: str
    status: Literal['verified', 'unclear', 'needs_verification'] = 'verified'
    notes: str | None = None

class StoryAnalysis(BaseModel):
    mainCharacter: str
    coreProblem: str
    emotionalCore: str
    turningPoint: str
    ending: str
    centralMessage: str
    uniqueElement: str
    doNotMention: list[str] = Field(default_factory=list)
    sensitivityFlags: list[str] = Field(default_factory=list)
    clarificationQuestions: list[str] = Field(default_factory=list)
    truthChecks: list[TruthCheckItem] = Field(default_factory=list)

class StoryAngle(BaseModel):
    id: str
    name: str
    hookConcept: str
    narrativeArc: str
    emotionalPunch: float = 8.0
    visualFeasibility: float = 8.0
    shareability: float = 8.0
    overallScore: float = 8.0
    recommendationReason: str
    isRecommended: bool = False

class ComparableVideo(BaseModel):
    id: str
    title: str
    platform: str = "YouTube Shorts"
    creator: str = ""
    views: int = 0
    likes: int = 0
    hookUsed: str = ""
    durationSec: int = 35
    whatWorked: str = ""
    metricProvenance: str = "Official API"
    url: str = ""

class ContentGapAnalysis(BaseModel):
    overusedTropes: list[str] = Field(default_factory=list)
    missingPerspective: str = ""
    beWithYugaceDifferentiator: str = ""
    recommendedTone: str = ""

class ShotItem(BaseModel):
    id: str
    timeRange: str
    voiceover: str
    visualDirection: str
    cameraAngle: str
    onScreenText: str
    soundCue: str

class CaptionsData(BaseModel):
    instagram: str
    youtubeShorts: str
    facebookReels: str
    hashtags: list[str] = Field(default_factory=list)

class HookItem(BaseModel):
    type: str
    text: str
    estimatedRetentionRate: str
    isBestFit: bool = False

class ScriptPackage(BaseModel):
    id: str
    version: int = 1
    selectedAngleId: str
    hooks: list[HookItem] = Field(default_factory=list)
    selectedHookIndex: int = 0
    fullScript: str
    wordCount: int
    estimatedDurationSec: int
    shotTable: list[ShotItem] = Field(default_factory=list)
    captions: CaptionsData
    suggestedTitles: list[str] = Field(default_factory=list)
    cta: str
    fidelityPass: bool = True

class ReachFactor(BaseModel):
    name: str
    score: float
    weight: float
    reasoning: str
    category: str

class RetentionRisk(BaseModel):
    timestamp: str
    risk: str
    recommendation: str

class ReachAnalysis(BaseModel):
    calculatedIndex: int
    potentialBand: str
    confidenceLevel: str
    factors: list[ReachFactor] = Field(default_factory=list)
    retentionDropRisks: list[RetentionRisk] = Field(default_factory=list)
    disclaimer: str

class PerformanceSnapshot(BaseModel):
    timestampLabel: str
    loggedAt: str
    views: int
    retentionPercentage: float
    avgWatchTimeSec: float
    likes: int
    comments: int
    shares: int
    saves: int
    followersGained: int

class AITakeaways(BaseModel):
    predictedVsActual: str
    hookEffectiveness: str
    retentionInsight: str
    nextStoryAction: str

class PerformanceLearning(BaseModel):
    publishedUrl: str
    platform: str
    publishedAt: str
    snapshots: list[PerformanceSnapshot] = Field(default_factory=list)
    aiTakeaways: AITakeaways | None = None

class FollowerStory(BaseModel):
    id: str
    createdAt: str
    followerHandle: str
    followerAlias: str | None = None
    isAnonymous: bool = False
    source: str = "Instagram DM"
    rawStory: str
    category: str
    status: StoryStatus = "new_dm"
    consent: ConsentRecord
    analysis: StoryAnalysis | None = None
    angles: list[StoryAngle] | None = None
    selectedAngleId: str | None = None
    comparables: list[ComparableVideo] | None = None
    contentGap: ContentGapAnalysis | None = None
    scriptPackage: ScriptPackage | None = None
    reachAnalysis: ReachAnalysis | None = None
    learning: PerformanceLearning | None = None
    notes: str | None = None

class KeyConfig(BaseModel):
    geminiApiKey: str | None = None
    openaiApiKey: str | None = None
    mongodbUri: str | None = None
    youtubeApiKey: str | None = None
    tavilyApiKey: str | None = None
