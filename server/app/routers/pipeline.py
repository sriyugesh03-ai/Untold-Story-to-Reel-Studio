from fastapi import APIRouter
from app.models.schemas import (
    FollowerStory,
    StoryAnalysis,
    StoryAngle,
    ScriptPackage,
    ReachAnalysis
)
from app.services.llm_engine import llm_engine
from app.services.research_engine import research_engine

router = APIRouter(prefix="/api/pipeline", tags=["Pipeline AI"])

@router.post("/analyze", response_model=StoryAnalysis)
async def analyze_story(story: FollowerStory):
    return await llm_engine.analyze_story(story)

@router.post("/angles", response_model=list[StoryAngle])
async def generate_angles(story: FollowerStory):
    analysis = story.analysis or await llm_engine.analyze_story(story)
    return await llm_engine.generate_angles(story, analysis)

@router.post("/research")
async def research_comparables(story: FollowerStory):
    comparables = await research_engine.fetch_youtube_comparables(story.category)
    content_gap = research_engine.generate_content_gap(story, comparables)
    return {
        "comparables": comparables,
        "contentGap": content_gap
    }

@router.post("/script", response_model=ScriptPackage)
async def generate_script(story: FollowerStory):
    analysis = story.analysis or await llm_engine.analyze_story(story)
    angles = story.angles or await llm_engine.generate_angles(story, analysis)
    selected_angle = next((a for a in angles if a.id == story.selectedAngleId), angles[0])
    return await llm_engine.generate_script(story, selected_angle)

@router.post("/reach", response_model=ReachAnalysis)
async def calculate_reach(script_package: ScriptPackage):
    return llm_engine.calculate_reach(script_package)

@router.post("/full-run", response_model=FollowerStory)
async def full_pipeline_run(story: FollowerStory):
    # 1. Analyze
    analysis = await llm_engine.analyze_story(story)
    # 2. Angles
    angles = await llm_engine.generate_angles(story, analysis)
    selected_angle = next((a for a in angles if a.isRecommended), angles[0])
    # 3. Research
    comparables = await research_engine.fetch_youtube_comparables(story.category)
    content_gap = research_engine.generate_content_gap(story, comparables)
    # 4. Script
    script_package = await llm_engine.generate_script(story, selected_angle)
    # 5. Reach
    reach_analysis = llm_engine.calculate_reach(script_package)

    story.status = "in_production"
    story.analysis = analysis
    story.angles = angles
    story.selectedAngleId = selected_angle.id
    story.comparables = comparables
    story.contentGap = content_gap
    story.scriptPackage = script_package
    story.reachAnalysis = reach_analysis

    return story
