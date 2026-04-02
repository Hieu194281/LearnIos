from datetime import datetime, timezone
from fastapi import APIRouter
from app.database import get_database
from app.models.habit import HabitCreate, HabitResponse

router = APIRouter(prefix="/api/habits", tags=["habits"])


def doc_to_response(doc: dict) -> HabitResponse:
    return HabitResponse(
        id=str(doc["_id"]),
        name=doc["name"],
        frequency=doc["frequency"],
        days=doc.get("days", []),
        created_at=doc["created_at"],
    )


@router.post("/", response_model=HabitResponse, status_code=201)
async def create_habit(habit: HabitCreate):
    db = get_database()
    document = {
        "name": habit.name,
        "frequency": habit.frequency,
        "days": habit.days,
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.habits.insert_one(document)
    created = await db.habits.find_one({"_id": result.inserted_id})
    return doc_to_response(created)


@router.get("/", response_model=list[HabitResponse])
async def list_habits():
    db = get_database()
    cursor = db.habits.find().sort("created_at", -1)
    docs = await cursor.to_list(length=1000)
    return [doc_to_response(doc) for doc in docs]
