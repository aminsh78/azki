# backend/app/routers/auth.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_db
from app.database.models import User
from app.services.google_sheets import validate_login
from app.utils.jwt import create_access_token

router = APIRouter(prefix="/users", tags=["auth"])


def _to_int(v) -> int:
    if v is None:
        return 0
    s = str(v).strip()
    if s in ("", "-", "—"):
        return 0
    s = s.replace("%", "").replace(",", "")
    try:
        return int(float(s))
    except Exception:
        return 0


def upsert_user_from_sheet(db: Session, row: dict) -> User:
    def s(v) -> str:
        # safe string
        if v is None:
            return ""
        return str(v).strip()

    def i(v) -> int:
        # safe int (handles: int/float/"12"/"0%"/"")
        if v is None:
            return 0
        if isinstance(v, (int, float)):
            return int(v)
        t = str(v).strip()
        if not t:
            return 0
        t = t.replace("%", "")
        try:
            return int(float(t))
        except:
            return 0

    username = s(row.get("User"))
    password = s(row.get("Password"))

    user = db.query(User).filter(User.username == username).first()
    if not user:
        user = User(username=username)

    user.password = password

    user.name_english = s(row.get("Name English"))
    user.name_persian = s(row.get("Name persian"))
    user.email_azki = s(row.get("Email Azki"))
    user.personal_email = s(row.get("Personal Email"))
    user.position = s(row.get("Position"))

    user.qa_total = i(row.get("Qa total"))
    user.qc_total = i(row.get("Qc total"))
    user.rank = s(row.get("Rank"))
    user.personnel_code = s(row.get("Personnel Code"))
    user.role = s(row.get("Role"))
    user.number = s(row.get("Number"))

    # اگر ستون Accepted Errors تو شیت داری:
    user.accepted_errors = i(
        row.get("Accepted errors")
        or row.get("Accepted Errors")
        or row.get("Total Accepted Errors")
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user

    """
    row: dict with EXACT headers from Google Sheet
    """
    username = str(row.get("User") or "").strip()
    password = str(row.get("Password") or "").strip()

    if not username or not password:
        raise ValueError("Row must include 'User' and 'Password'")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        user = User(username=username, password=password)
        db.add(user)

    # always sync password from sheet
    user.password = password

    # profile fields
    user.name_english = (row.get("Name English") or "").strip() or None
    user.name_persian = (row.get("Name persian") or "").strip() or None
    user.email_azki = (row.get("Email Azki") or "").strip() or None
    user.personal_email = (row.get("Personal Email") or "").strip() or None
    user.position = (row.get("Position") or "").strip() or None

    user.personnel_code = (row.get("Personnel Code") or "").strip() or None
    user.role = (row.get("Role") or "").strip() or None
    user.number = (row.get("Number") or "").strip() or None

    # summary fields
    user.qa_total = _to_int(row.get("Qa total"))
    user.qc_total = _to_int(row.get("Qc total"))
    user.rank = (str(row.get("Rank") or "-").strip() or "-")

    # accepted errors (IMPORTANT: set this to your exact header name if different)
    user.accepted_errors = _to_int(
        row.get("Total Accepted Errors")
        or row.get("Accepted Errors")
        or row.get("accepted_errors")
    )

    db.commit()
    db.refresh(user)
    return user


@router.post("")
def login(payload: dict, db: Session = Depends(get_db)):
    username = (payload.get("username") or "").strip()
    password = (payload.get("password") or "").strip()

    if not username or not password:
        raise HTTPException(status_code=400, detail="username and password are required")

    row = validate_login(username, password)
    if not row:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    try:
        user = upsert_user_from_sheet(db, row)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    token = create_access_token(
        {
            "username": user.username,
            "role": user.role,
        }
    )

    return {
        "token": token,
        "user": {
            "username": user.username,
            "name_persian": user.name_persian,
            "name_english": user.name_english,
            "position": user.position,
            "role": user.role,
            "email_azki": user.email_azki,
            "personal_email": user.personal_email,
            "personnel_code": user.personnel_code,
            "number": user.number,
            "qa_total": user.qa_total,
            "qc_total": user.qc_total,
            "rank": user.rank,
            "accepted_errors": getattr(user, "accepted_errors", 0),
        },
    }
