from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.deps import get_db
from app.database.models import User

# مهم: این dependency باید تو پروژه‌ت موجود باشه (همون که بقیه route ها استفاده می‌کنن)
from app.deps import get_current_user

from app.services.google_sheet_reports import get_qc_for_user, get_errors_for_user

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/qc")
def qc_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # همیشه از کد پرسنلی کاربر لاگین کرده استفاده می‌کنیم
    personnel_code = str(getattr(current_user, "personnel_code", "") or "").strip()

    # برای اینکه 500 نده، خطاها رو message برمی‌گردونیم
    try:
        return get_qc_for_user(personnel_code)
    except Exception as e:
        return {"items": [], "message": f"خطا در خواندن گزارش QC از گوگل‌شیت: {e}"}


@router.get("/errors")
def errors_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    personnel_code = str(getattr(current_user, "personnel_code", "") or "").strip()
    try:
        return get_errors_for_user(personnel_code)
    except Exception as e:
        return {"items": [], "message": f"خطا در خواندن گزارش ERRORS از گوگل‌شیت: {e}"}
legacy_router = router
