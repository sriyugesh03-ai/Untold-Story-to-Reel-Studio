from fastapi import APIRouter, HTTPException
from app.models.schemas import FollowerStory, StoryStatus
from app.db.mongodb import db_manager
import logging

logger = logging.getLogger("bewithyugace.stories")
router = APIRouter(prefix="/api/stories", tags=["Stories"])

# In-memory fallback if MongoDB is not yet configured
_in_memory_stories: dict[str, dict] = {}

@router.get("", response_model=list[FollowerStory])
async def list_stories():
    if db_manager.is_connected and db_manager.db is not None:
        cursor = db_manager.db.stories.find({}, {"_id": 0}).sort("createdAt", -1)
        stories = await cursor.to_list(length=100)
        return stories
    return list(_in_memory_stories.values())

@router.get("/{story_id}", response_model=FollowerStory)
async def get_story(story_id: str):
    if db_manager.is_connected and db_manager.db is not None:
        story = await db_manager.db.stories.find_one({"id": story_id}, {"_id": 0})
        if story:
            return story
    elif story_id in _in_memory_stories:
        return _in_memory_stories[story_id]
    raise HTTPException(status_code=404, detail="Story not found")

@router.post("", response_model=FollowerStory)
async def create_story(story: FollowerStory):
    story_dict = story.model_dump()
    if db_manager.is_connected and db_manager.db is not None:
        await db_manager.db.stories.update_one(
            {"id": story.id},
            {"$set": story_dict},
            upsert=True
        )
    _in_memory_stories[story.id] = story_dict
    return story

@router.put("/{story_id}", response_model=FollowerStory)
async def update_story(story_id: str, story: FollowerStory):
    story_dict = story.model_dump()
    if db_manager.is_connected and db_manager.db is not None:
        await db_manager.db.stories.update_one(
            {"id": story_id},
            {"$set": story_dict},
            upsert=True
        )
    _in_memory_stories[story_id] = story_dict
    return story

@router.patch("/{story_id}/status")
async def update_story_status(story_id: str, status: StoryStatus):
    if db_manager.is_connected and db_manager.db is not None:
        result = await db_manager.db.stories.update_one(
            {"id": story_id},
            {"$set": {"status": status}}
        )
        if result.matched_count == 0 and story_id not in _in_memory_stories:
            raise HTTPException(status_code=404, detail="Story not found")
    if story_id in _in_memory_stories:
        _in_memory_stories[story_id]["status"] = status
    return {"success": True, "id": story_id, "status": status}

@router.delete("/{story_id}")
async def withdraw_story(story_id: str):
    if db_manager.is_connected and db_manager.db is not None:
        await db_manager.db.stories.delete_one({"id": story_id})
    if story_id in _in_memory_stories:
        del _in_memory_stories[story_id]
    return {"success": True, "message": "Story purged successfully for follower privacy"}
