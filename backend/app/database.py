import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

client: AsyncIOMotorClient | None = None
db = None


async def connect_db():
    global client, db
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    database_name = os.getenv("DATABASE_NAME", "habit_tracker")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[database_name]


async def close_db():
    global client
    if client:
        client.close()


def get_database():
    return db
