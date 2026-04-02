import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime, timezone
from bson import ObjectId
from httpx import AsyncClient, ASGITransport
from app.main import app


FAKE_ID = ObjectId("65f1a2b3c4d5e6f7a8b9c0d1")
FAKE_HABIT = {
    "_id": FAKE_ID,
    "name": "Exercise",
    "frequency": "daily",
    "days": [],
    "created_at": datetime(2026, 4, 2, 10, 0, 0, tzinfo=timezone.utc),
}


@pytest.fixture
def mock_db():
    db = MagicMock()
    db.habits.insert_one = AsyncMock(return_value=MagicMock(inserted_id=FAKE_ID))
    db.habits.find_one = AsyncMock(return_value=FAKE_HABIT)

    cursor = MagicMock()
    cursor.sort = MagicMock(return_value=cursor)
    cursor.to_list = AsyncMock(return_value=[FAKE_HABIT])
    db.habits.find = MagicMock(return_value=cursor)
    return db


@pytest.mark.asyncio
async def test_create_habit(mock_db):
    with patch("app.routers.habits.get_database", return_value=mock_db):
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/habits/",
                json={"name": "Exercise", "frequency": "daily"},
            )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Exercise"
    assert data["frequency"] == "daily"
    assert data["days"] == []
    assert "id" in data
    assert "created_at" in data


@pytest.mark.asyncio
async def test_create_habit_empty_name(mock_db):
    with patch("app.routers.habits.get_database", return_value=mock_db):
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/habits/",
                json={"name": ""},
            )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_habit_custom_no_days(mock_db):
    with patch("app.routers.habits.get_database", return_value=mock_db):
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/habits/",
                json={"name": "Read", "frequency": "custom", "days": []},
            )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_habit_custom_with_days(mock_db):
    custom_habit = {**FAKE_HABIT, "frequency": "custom", "days": ["mon", "fri"]}
    mock_db.habits.find_one = AsyncMock(return_value=custom_habit)

    with patch("app.routers.habits.get_database", return_value=mock_db):
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/habits/",
                json={"name": "Read", "frequency": "custom", "days": ["mon", "fri"]},
            )

    assert response.status_code == 201
    data = response.json()
    assert data["frequency"] == "custom"
    assert data["days"] == ["mon", "fri"]


@pytest.mark.asyncio
async def test_list_habits(mock_db):
    with patch("app.routers.habits.get_database", return_value=mock_db):
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.get("/api/habits/")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["name"] == "Exercise"


@pytest.mark.asyncio
async def test_list_habits_empty(mock_db):
    mock_db.habits.find.return_value.to_list = AsyncMock(return_value=[])

    with patch("app.routers.habits.get_database", return_value=mock_db):
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.get("/api/habits/")

    assert response.status_code == 200
    assert response.json() == []
