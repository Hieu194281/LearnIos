import pytest
from pydantic import ValidationError
from app.models.habit import HabitCreate


class TestHabitCreate:
    def test_valid_daily_habit(self):
        habit = HabitCreate(name="Exercise")
        assert habit.name == "Exercise"
        assert habit.frequency == "daily"
        assert habit.days == []

    def test_valid_custom_habit(self):
        habit = HabitCreate(name="Read", frequency="custom", days=["mon", "wed", "fri"])
        assert habit.frequency == "custom"
        assert habit.days == ["mon", "wed", "fri"]

    def test_name_required(self):
        with pytest.raises(ValidationError):
            HabitCreate(name="")

    def test_name_whitespace_only(self):
        with pytest.raises(ValidationError):
            HabitCreate(name="   ")

    def test_name_stripped(self):
        habit = HabitCreate(name="  Exercise  ")
        assert habit.name == "Exercise"

    def test_custom_frequency_requires_days(self):
        with pytest.raises(ValidationError) as exc:
            HabitCreate(name="Read", frequency="custom", days=[])
        assert "days must not be empty" in str(exc.value)

    def test_invalid_frequency(self):
        with pytest.raises(ValidationError):
            HabitCreate(name="Read", frequency="weekly")

    def test_invalid_day_value(self):
        with pytest.raises(ValidationError):
            HabitCreate(name="Read", frequency="custom", days=["monday"])

    def test_default_frequency_is_daily(self):
        habit = HabitCreate(name="Meditate")
        assert habit.frequency == "daily"
