# backend/app/deps.py
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.database.models import User
from app.utils.jwt import decode_token
from app.utils.security import unauthorized

bearer = HTTPBearer(auto_error=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    if creds is None or not creds.credentials:
        unauthorized("Missing Authorization header")

    try:
        payload = decode_token(creds.credentials)
    except Exception:
        unauthorized("Invalid token")

    username = payload.get("username")
    if not username:
        unauthorized("Invalid token payload")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        unauthorized("User not found in local DB (try login again)")

    return user
