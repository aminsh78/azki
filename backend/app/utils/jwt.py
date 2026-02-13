# backend/app/utils/jwt.py
import jwt
from datetime import datetime, timedelta, timezone
from app.config import settings

def create_access_token(payload: dict) -> str:
    data = payload.copy()
    exp = datetime.now(timezone.utc) + timedelta(hours=settings.JWT_EXPIRE_HOURS)
    data["exp"] = exp
    return jwt.encode(data, settings.JWT_SECRET, algorithm=settings.JWT_ALG)

def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALG])
