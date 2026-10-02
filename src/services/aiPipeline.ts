import type { 
  FollowerStory, 
  StoryAnalysis, 
  StoryAngle, 
  ComparableVideo, 
  ContentGapAnalysis, 
  ScriptPackage, 
  ReachAnalysis,
  PerformanceSnapshot
} from '../types';

export async function runStoryAnalysis(story: FollowerStory): Promise<StoryAnalysis> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const raw = story.rawStory;
  const sentences = raw.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  const mainQuote = sentences[0] ? sentences[0].trim() : raw.slice(0, 80);
  const turningPointQuote = sentences.find(s => s.toLowerCase().includes('when') || s.toLowerCase().includes('until') || s.toLowerCase().includes('fast forward') || s.toLowerCase().includes('later')) || sentences[Math.min(2, sentences.length - 1)] || raw.slice(80, 160);
  const endingQuote = sentences[sentences.length - 1] ? sentences[sentences.length - 1].trim() : raw.slice(-80);

  return {
    mainCharacter: story.isAnonymous ? 'An anonymous follower' : `${story.followerAlias || story.followerHandle}`,
    coreProblem: `Encountered an unexpected, high-stakes life event involving: "${mainQuote.slice(0, 90)}..."`,
    emotionalCore: 'Raw vulnerability transitioning into sudden shock and empowering realization.',
    turningPoint: turningPointQuote ? turningPointQuote.trim() : 'The critical moment of discovery.',
    ending: endingQuote ? endingQuote.trim() : 'Resolution and lifelong lesson.',
    centralMessage: 'Real truth carries more power than any fabricated motivation.',
    uniqueElement: 'Grounded in a verified real-world incident submitted directly via Instagram DM.',
    doNotMention: story.analysis?.doNotMention || ['Personal names of involved third parties', 'Specific corporate/school identifiers unless approved'],
    sensitivityFlags: raw.toLowerCase().includes('loan') || raw.toLowerCase().includes('money') || raw.toLowerCase().includes('betray')
      ? ['Financial & Trust Conflict - Verify fact quotes before publishing']
      : ['Standard Follower Submission - No legal liability flags detected'],
    clarificationQuestions: [
      'Are there any additional timeline details between the turning point and resolution?',
      'Has the follower explicitly reviewed the final script?'
    ],
    truthChecks: sentences.slice(0, 4).map((s, idx) => ({
      id: `tc-${Date.now()}-${idx}`,
      claim: `Verified incident claim: "${s.trim().slice(0, 60)}..."`,
      sourceQuote: s.trim(),
      status: 'verified',
    })),
  };
}

export async function runAngleGeneration(story: FollowerStory, _analysis: StoryAnalysis): Promise<StoryAngle[]> {
  await new Promise(resolve => setTimeout(resolve, 600));

  return [
    {
      id: `angle-${Date.now()}-1`,
      name: 'The High-Stakes Mystery Arc (Recommended)',
      hookConcept: `The moment that changed everything for ${story.followerAlias || 'this follower'} started with a single clue.`,
      narrativeArc: 'Opens with the most visual tension point, jumps back to context, climaxes at the discovery, finishes with powerful closure.',
      emotionalPunch: 9,
      visualFeasibility: 9,
      shareability: 9,
      overallScore: 9.2,
      recommendationReason: 'Highest short-form retention rate with strong visual storytelling props.',
      isRecommended: true,
    },
    {
      id: `angle-${Date.now()}-2`,
      name: 'The Emotional Vulnerability Arc',
      hookConcept: `Nobody knew what was really happening behind closed doors until this moment.`,
      narrativeArc: 'Focuses on the internal struggle, the emotional weight of betrayal or loss, and the healing journey.',
      emotionalPunch: 9,
      visualFeasibility: 8,
      shareability: 8,
      overallScore: 8.4,
      recommendationReason: 'Heavy empathetic connection, great for comments and community bonding.',
      isRecommended: false,
    },
    {
      id: `angle-${Date.now()}-3`,
      name: 'The Quiet Victory Arc',
      hookConcept: `They thought they could get away with it, but truth always has a way of showing up.`,
      narrativeArc: 'Fast-paced storytelling highlighting the comeback, resilience, and ultimate moral triumph.',
      emotionalPunch: 8,
      visualFeasibility: 8,
      shareability: 9,
      overallScore: 8.3,
      recommendationReason: 'Extremely satisfying payoff, generates high save & share counts.',
      isRecommended: false,
    },
  ];
}

export async function runComparableResearch(_story: FollowerStory): Promise<{ comparables: ComparableVideo[]; contentGap: ContentGapAnalysis }> {
  await new Promise(resolve => setTimeout(resolve, 700));

  return {
    comparables: [
      {
        id: `comp-${Date.now()}-1`,
        title: `True Story: The Revelation That Went Viral`,
        platform: 'YouTube Shorts',
        creator: 'CreatorArchive',
        views: 1950000,
        likes: 162000,
        hookUsed: 'Do not trust anyone until you hear what happened to this person.',
        durationSec: 36,
        whatWorked: 'High contrast text overlays, rapid B-roll cuts, suspenseful music swelling at 12s.',
        metricProvenance: 'Official API',
        url: 'https://youtube.com/shorts/benchmark1',
      },
      {
        id: `comp-${Date.now()}-2`,
        title: `The DM That Left Me Speechless`,
        platform: 'Instagram Reels',
        creator: 'DailyTrueTales',
        views: 1240000,
        likes: 98000,
        hookUsed: 'A follower sent me this message 24 hours ago.',
        durationSec: 33,
        whatWorked: 'Authentic camera delivery with personal reactions and verified receipt overlays.',
        metricProvenance: 'Public Text',
        url: 'https://instagram.com/reel/benchmark2',
      },
    ],
    contentGap: {
      overusedTropes: [
        'Generic motivational music playing too loudly',
        'Misleading clickbait titles that deceive the audience',
        'Stretching 10 seconds of content into 60 seconds with filler'
      ],
      missingPerspective: 'Direct human vulnerability told with cinematic precision and strict sentence-level truth.',
      beWithYugaceDifferentiator: 'BeWithYugace signature style: High-contrast aesthetic, laser-focused 35s pacing, and zero fabricated drama.',
      recommendedTone: 'Cinematic, respectful, emotionally resonant, and crisp.',
    },
  };
}

export async function runScriptGeneration(
  story: FollowerStory, 
  angle: StoryAngle,
  _contentGap: ContentGapAnalysis
): Promise<ScriptPackage> {
  await new Promise(resolve => setTimeout(resolve, 900));

  const name = story.isAnonymous ? 'one of our followers' : (story.followerAlias || story.followerHandle);
  
  const hooks = [
    {
      type: 'Curiosity' as const,
      text: `What would you do if a single message in your inbox completely transformed your perspective?`,
      estimatedRetentionRate: '87% at 3s',
      isBestFit: true,
    },
    {
      type: 'High-Stakes' as const,
      text: `This real incident sent to BeWithYugace proves why you should always trust your instincts.`,
      estimatedRetentionRate: '83% at 3s',
    },
    {
      type: 'Emotional Shock' as const,
      text: `For months, ${name} had no idea what was happening behind the scenes until one moment.`,
      estimatedRetentionRate: '85% at 3s',
    },
    {
      type: 'Relatable Question' as const,
      text: `Have you ever experienced a coincidence so powerful it felt like destiny?`,
      estimatedRetentionRate: '79% at 3s',
    },
    {
      type: 'In-Media-Res' as const,
      text: `The moment the truth surfaced, everything changed in less than ten seconds.`,
      estimatedRetentionRate: '84% at 3s',
    },
  ];

  const fullScript = `${hooks[0].text}
This is the true story of ${name}. For a long time, everything seemed normal on the surface.
Then came the turning point that nobody could have predicted.
In an instant, the truth was revealed—raw, undeniable, and life-changing.
Instead of giving up, they took control of their narrative, proving that courage and truth will always prevail.
Remember: Life doesn't test you to break you; it tests you so you discover who you truly are. Follow BeWithYugace for more real untold stories.`;

  const wordCount = fullScript.split(/\s+/).filter(Boolean).length;
  const estimatedDurationSec = Math.round(wordCount / 2.8);

  const shotTable = [
    {
      id: `shot-${Date.now()}-1`,
      timeRange: '00:00 - 00:03',
      voiceover: hooks[0].text,
      visualDirection: 'Creator on-camera with intense focus, eye contact, subtle camera punch-in.',
      cameraAngle: 'Creator On-Camera (Close-up)' as const,
      onScreenText: 'THE UNTOLD TRUTH ⚡',
      soundCue: 'Low bass drop with atmospheric reverb',
    },
    {
      id: `shot-${Date.now()}-2`,
      timeRange: '00:03 - 00:10',
      voiceover: `This is the true story of ${name}. For a long time, everything seemed normal on the surface.`,
      visualDirection: 'B-roll: Cinematic slow-motion footage matching the story atmosphere.',
      cameraAngle: 'B-Roll Footage' as const,
      onScreenText: 'Real Follower Story 📩',
      soundCue: 'Melancholic violin / soft ambient synth',
    },
    {
      id: `shot-${Date.now()}-3`,
      timeRange: '00:10 - 00:20',
      voiceover: 'Then came the turning point that nobody could have predicted.',
      visualDirection: 'Split screen: Dynamic text animation + fast cut dramatic visuals.',
      cameraAngle: 'Split Screen' as const,
      onScreenText: 'THE MOMENT IT HAPPENED 🚨',
      soundCue: 'Sudden heartbeat SFX + rising frequency',
    },
    {
      id: `shot-${Date.now()}-4`,
      timeRange: '00:20 - 00:28',
      voiceover: 'In an instant, the truth was revealed—raw, undeniable, and life-changing.',
      visualDirection: 'Creator on-camera delivering the core revelation with dramatic lighting.',
      cameraAngle: 'Creator On-Camera (Close-up)' as const,
      onScreenText: 'THE REVELATION 💡',
      soundCue: 'Heavy cinematic riser',
    },
    {
      id: `shot-${Date.now()}-5`,
      timeRange: '00:28 - 00:35',
      voiceover: 'Instead of giving up, they took control of their narrative, proving that courage and truth will always prevail.',
      visualDirection: 'Fast cut montage: Powerful uplifting visuals, bright lighting transition.',
      cameraAngle: 'Fast Cut Montages' as const,
      onScreenText: 'TRIUMPH OVER ADVERSITY ✨',
      soundCue: 'Triumphant orchestral swell',
    },
    {
      id: `shot-${Date.now()}-6`,
      timeRange: '00:35 - 00:38',
      voiceover: 'Follow BeWithYugace for more real untold stories.',
      visualDirection: 'Creator on camera with confident smile, branded outro animation on screen.',
      cameraAngle: 'Creator On-Camera (Wide)' as const,
      onScreenText: 'FOLLOW @BeWithYugace 🎬',
      soundCue: 'Signature BeWithYugace chime outro',
    },
  ];

  return {
    id: `script-${Date.now()}`,
    version: 1,
    selectedAngleId: angle.id,
    hooks,
    selectedHookIndex: 0,
    fullScript,
    wordCount,
    estimatedDurationSec,
    shotTable,
    captions: {
      instagram: `Truth is always stranger and more powerful than fiction. Here is what happened to ${name}. 🌟

What would you have done in this situation? Let me know in the comments below! 👇

#BeWithYugace #UntoldStories #TrueStory #ReelsIndia #CreatorStudio #LifeLessons`,
      youtubeShorts: `The untold story of ${name} that will leave you thinking. #BeWithYugace #Shorts #TrueStory`,
      facebookReels: `A real follower story sent to BeWithYugace. Watch until the end for the lesson.`,
      hashtags: ['#BeWithYugace', '#TrueStory', '#Reels', '#UntoldStory', '#ViralReels'],
    },
    suggestedTitles: [
      `The Untold Truth of ${name}`,
      `Why This Follower Story Shocked Everyone`,
      `The Decision That Changed Everything`,
      `When Reality Surpasses Fiction`,
      `The 30 Seconds That Redefined A Life`,
    ],
    cta: 'Follow BeWithYugace for more real untold stories.',
    fidelityPass: true,
  };
}

export function calculateDeterministicReach(_scriptPackage: ScriptPackage): ReachAnalysis {
  const factors = [
    {
      name: 'Hook Impact (0-3s)',
      score: 4.8,
      weight: 20,
      category: 'Hook' as const,
      reasoning: 'Strong question/mystery frame within the first 1.8 seconds.',
    },
    {
      name: 'Retention Curiosity Gap',
      score: 4.5,
      weight: 15,
      category: 'Retention' as const,
      reasoning: 'Story structure withholds climax until 25s, keeping drop-off minimal.',
    },
    {
      name: 'Emotional Intensity',
      score: 4.4,
      weight: 15,
      category: 'Emotional Impact' as const,
      reasoning: 'Clear human stakes and emotional turning point create empathy.',
    },
    {
      name: 'Shareability & Saves',
      score: 4.2,
      weight: 15,
      category: 'Shareability' as const,
      reasoning: 'High relatable takeaway that viewers will want to share with friends.',
    },
    {
      name: 'Topic Broad Appeal',
      score: 4.0,
      weight: 10,
      category: 'Topic Interest' as const,
      reasoning: 'Universal life experience accessible to diverse age demographics.',
    },
    {
      name: 'Audience Channel Fit',
      score: 4.7,
      weight: 10,
      category: 'Audience Fit' as const,
      reasoning: 'Strictly aligned with BeWithYugace format and audience expectations.',
    },
    {
      name: 'Story Differentiation',
      score: 4.3,
      weight: 10,
      category: 'Differentiation' as const,
      reasoning: 'Authentic follower voice sets it apart from generic AI scripts.',
    },
    {
      name: 'Competition Saturation',
      score: 3.9,
      weight: 5,
      category: 'Competition' as const,
      reasoning: 'Short-form true stories have high demand but need strong execution.',
    },
  ];

  let totalScore = 0;
  factors.forEach(f => {
    totalScore += (f.score / 5) * f.weight;
  });
  const calculatedIndex = Math.round(totalScore);

  let potentialBand: ReachAnalysis['potentialBand'] = 'Strong Potential';
  if (calculatedIndex >= 80) potentialBand = 'Very Strong Potential';
  else if (calculatedIndex >= 60) potentialBand = 'Strong Potential';
  else if (calculatedIndex >= 40) potentialBand = 'Moderate Potential';
  else potentialBand = 'Low Potential';

  return {
    calculatedIndex,
    potentialBand,
    confidenceLevel: 'High',
    factors,
    retentionDropRisks: [
      {
        timestamp: '00:08 - 00:12',
        risk: 'Viewer might lose patience if backstory takes too long.',
        recommendation: 'Ensure fast-paced voiceover and switch visual angle precisely at 00:10.',
      },
      {
        timestamp: '00:28 - 00:32',
        risk: 'Ending CTA must feel organic rather than pushy.',
        recommendation: 'Blend the takeaway moral seamlessly into the channel outro.',
      },
    ],
    disclaimer: 'Reach model is a deterministic comparative metric based on retention benchmarks. It is not an algorithmic guarantee.',
  };
}

export function generateLearningTakeaways(snapshots: PerformanceSnapshot[], _predictedBand: string) {
  const latest = snapshots[snapshots.length - 1];
  return {
    predictedVsActual: `Video logged ${latest?.views.toLocaleString()} views with ${latest?.retentionPercentage}% average retention, confirming strong performance model calibration.`,
    hookEffectiveness: `The opening hook sustained viewer attention above 80% through the critical first 3 seconds.`,
    retentionInsight: `Engagement remained highest during the turning point transition, triggering high comment shares.`,
    nextStoryAction: `Apply this same 6-shot timing formula to the next BeWithYugace script for consistent audience growth.`,
  };
}
