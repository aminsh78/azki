# backend/app/schemas/profile.py
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional


class ProfileOut(BaseModel):
    name_persian: str | None = None
    position: str | None = None
    email_azki: str | None = None
    personal_email: str | None = None
    personnel_code: str | None = None
    number: str | None = None

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    position: Optional[str] = None
    personal_email: Optional[str] = None
    number: Optional[str] = None

    @field_validator("position", "personal_email", "number")
    @classmethod
    def strip_or_none(cls, v):
        if v is None:
            return None
        v = str(v).strip()
        return v if v else None
