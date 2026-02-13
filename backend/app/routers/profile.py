# backend/app/routers/profile.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_current_user, get_db
from app.database.models import User
from app.schemas.profile import ProfileOut, ProfileUpdate

router = APIRouter(prefix="", tags=["profile"])


@router.get("/profile", response_model=ProfileOut)
def get_profile(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user = db.query(User).filter(User.username == current_user.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/profile", response_model=ProfileOut)
def update_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user = db.query(User).filter(User.username == current_user.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.personal_email is not None:
        user.personal_email = payload.personal_email

    if payload.number is not None:
        user.number = payload.number

    if payload.position is not None:
        user.position = payload.position

    db.commit()
    db.refresh(user)
    return user
