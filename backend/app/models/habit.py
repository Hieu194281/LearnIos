from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field, field_validator, model_validator


VALID_DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]


class HabitCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    frequency: Literal["daily", "custom"] = "daily"
    days: list[Literal["mon", "tue", "wed", "thu", "fri", "sat", "sun"]] = []

    @field_validator("name", mode="before")
    @classmethod
    def strip_name(cls, v: str) -> str:
        if isinstance(v, str):
            return v.strip()
        return v

    @model_validator(mode="after")
    def validate_custom_days(self) -> "HabitCreate":
        if self.frequency == "custom" and not self.days:
            raise ValueError("days must not be empty when frequency is 'custom'")
        return self


class HabitResponse(BaseModel):
    id: str
    name: str
    frequency: Literal["daily", "custom"]
    days: list[str]
    created_at: datetime
