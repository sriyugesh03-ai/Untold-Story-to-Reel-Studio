from fastapi import APIRouter
from app.config import settings
from app.models.schemas import KeyConfig
from app.db.mongodb import db_manager

router = APIRouter(prefix="/api/settings", tags=["Settings & Keys"])

@router.get("/status")
async def get_services_status():
    return {
        "gemini": {
            "isConfigured": bool(settings.GEMINI_API_KEY),
            "keyPreview": f"...{settings.GEMINI_API_KEY[-4:]}" if settings.GEMINI_API_KEY else "Not set"
        },
        "openai": {
            "isConfigured": bool(settings.OPENAI_API_KEY),
            "keyPreview": f"...{settings.OPENAI_API_KEY[-4:]}" if settings.OPENAI_API_KEY else "Not set"
        },
        "mongodb": {
            "isConnected": db_manager.is_connected,
            "database": settings.DATABASE_NAME,
            "uriConfigured": bool(settings.MONGODB_URI)
        },
        "youtube": {
            "isConfigured": bool(settings.YOUTUBE_API_KEY)
        },
        "tavily": {
            "isConfigured": bool(settings.TAVILY_API_KEY)
        }
    }

@router.post("/update-keys")
async def update_keys(config: KeyConfig):
    if config.geminiApiKey is not None:
        settings.GEMINI_API_KEY = config.geminiApiKey.strip()
    if config.openaiApiKey is not None:
        settings.OPENAI_API_KEY = config.openaiApiKey.strip()
    if config.mongodbUri is not None:
        settings.MONGODB_URI = config.mongodbUri.strip()
        await db_manager.connect()
    if config.youtubeApiKey is not None:
        settings.YOUTUBE_API_KEY = config.youtubeApiKey.strip()
    if config.tavilyApiKey is not None:
        settings.TAVILY_API_KEY = config.tavilyApiKey.strip()

    return {
        "success": True,
        "message": "API keys updated successfully!",
        "mongodbConnected": db_manager.is_connected
    }
