# backend/app/routers/home.py
from fastapi import APIRouter, Depends
from app.deps import get_current_user
from app.database.models import User

router = APIRouter(prefix="/home", tags=["home"])

@router.get("")
def home(current: User = Depends(get_current_user)):
    return {
        "name": current.name_persian,
        "summary": {
            "qa_total": current.qa_total,
            "qc_total": current.qc_total,
            "rank": current.rank,
            "accepted_errors": 3,
        }
    }
