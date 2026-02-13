# backend/app/routers/report_details.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.deps import get_current_user, get_db
from app.services.report_excel import get_qc_rows_for_user, get_error_rows_for_user

router = APIRouter(prefix="/report", tags=["report"])


@router.get("/qc")
def qc_report(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    rows = get_qc_rows_for_user(user)
    if not rows:
        return {
            "items": [],
            "message": "تبریک! شما توی تماس‌هات مشکلی نبوده ❤️",
        }
    return {"items": rows, "message": None}


@router.get("/errors")
def error_report(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    rows = get_error_rows_for_user(user)
    if not rows:
        return {
            "items": [],
            "message": "بهت تبریک می‌گم! تا الان بدون مشکل داری کار می‌کنی 💛",
        }
    return {"items": rows, "message": None}
