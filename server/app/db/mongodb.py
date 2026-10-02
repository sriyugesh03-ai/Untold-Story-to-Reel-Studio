from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from app.config import settings
import logging

logger = logging.getLogger("bewithyugace.db")

class MongoDBManager:
    client: AsyncIOMotorClient | None = None
    db = None
    is_connected: bool = False

    async def connect(self):
        if not settings.MONGODB_URI:
            logger.warning("MONGODB_URI not provided. Server will run in memory-cache mode.")
            self.is_connected = False
            return False

        try:
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=5000
            )
            # Verify connection
            await self.client.admin.command('ping')
            self.db = self.client[settings.DATABASE_NAME]
            self.is_connected = True
            logger.info("Successfully connected to MongoDB Atlas!")
            
            # Setup indexes
            await self.db.stories.create_index("id", unique=True)
            await self.db.stories.create_index("status")
            await self.db.stories.create_index("created_at")
            return True
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB Atlas: {e}")
            self.is_connected = False
            return False

    async def close(self):
        if self.client:
            self.client.close()
            self.is_connected = False
            logger.info("Closed MongoDB Atlas connection.")

db_manager = MongoDBManager()
