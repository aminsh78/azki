# backend/app/routers/notifications.py
from fastapi import APIRouter, Query, Depends
from app.deps import get_current_user
from app.database.models import User
from app.services.notification_pptx import load_notifications_from_pptx

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("")
def notifications(
    q: str | None = Query(default=None),
    limit: int = Query(default=50, ge=1, le=200),
    current: User = Depends(get_current_user),
):
    items = load_notifications_from_pptx(query=q)
    return {"count": len(items), "items": items[:limit]}
