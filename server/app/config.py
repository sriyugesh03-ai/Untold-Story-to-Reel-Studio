import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    # App Settings
    APP_NAME: str = "BeWithYugace Studio Backend"
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

    # Database
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "bewithyugace_studio")

    # AI Model Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DEFAULT_AI_PROVIDER: str = os.getenv("DEFAULT_AI_PROVIDER", "gemini") # "gemini" or "openai"

    # Scraping & Web Research APIs
    YOUTUBE_API_KEY: str = os.getenv("YOUTUBE_API_KEY", "")
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "")
    SERPAPI_API_KEY: str = os.getenv("SERPAPI_API_KEY", "")

settings = Settings()
