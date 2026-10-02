import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db.mongodb import db_manager
from app.routers import stories, pipeline, settings as settings_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("bewithyugace.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🎬 Starting BeWithYugace Studio FastAPI Server...")
    await db_manager.connect()
    yield
    logger.info("Stopping BeWithYugace Studio FastAPI Server...")
    await db_manager.close()

app = FastAPI(
    title=settings.APP_NAME,
    description="Live AI & MongoDB Atlas Backend for BeWithYugace Untold Story to Reel Studio",
    version="2.4.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(stories.router)
app.include_router(pipeline.router)
app.include_router(settings_router.router)

@app.get("/health")
async def healthcheck():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "mongodb": "connected" if db_manager.is_connected else "offline_cache",
        "version": "2.4.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
