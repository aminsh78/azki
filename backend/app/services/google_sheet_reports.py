from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build # type: ignore

from app.config import settings


SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

# برای پیدا کردن ستون کد پرسنلی در شیت‌ها (انگلیسی/فارسی/مدل‌های مختلف)
CODE_HEADERS = {
    "personnel code",
    "personnelcode",
    "agent code",
    "agentcode",
    "personnel_code",
    "agent_code",
    "کد پرسنلی",
    "کدپرسنلی",
}


def _norm_header(v: Any) -> str:
    s = str(v or "").strip().lower()
    s = s.replace("\u200c", " ")  # نیم‌فاصله
    s = " ".join(s.split())
    return s


def _norm_code(v: Any) -> str:
    if v is None:
        return ""
    if isinstance(v, int):
        return str(v).strip()
    if isinstance(v, float):
        if v.is_integer():
            return str(int(v)).strip()
        return str(v).strip()
    s = str(v).strip()
    if s.endswith(".0"):
        s = s[:-2]
    return s.strip()


def _get_sheet_id() -> str:
    # با چند نام مختلف سازگار می‌کنیم (برای اینکه به کد قبلی‌ات نخوره)
    sid = (
        getattr(settings, "sheet_id", None)
        or getattr(settings, "SHEET_ID", None)
        or getattr(settings, "google_sheet_id", None)
        or getattr(settings, "GOOGLE_SHEET_ID", None)
        or ""
    )
    sid = str(sid).strip()
    if not sid:
        raise RuntimeError("Sheet ID در settings پیدا نشد (sheet_id / SHEET_ID ...).")
    return sid


def _get_credentials_path() -> Path:
    # پیش‌فرض: backend/credentials.json
    backend_root = Path(__file__).resolve().parents[2]
    p = (
        getattr(settings, "credentials_path", None)
        or getattr(settings, "CREDENTIALS_PATH", None)
        or (backend_root / "credentials.json")
    )
    return Path(p)


@lru_cache(maxsize=1)
def _sheets_service():
    creds_path = _get_credentials_path()
    if not creds_path.exists():
        raise RuntimeError(f"credentials.json پیدا نشد: {creds_path}")

    creds = Credentials.from_service_account_file(str(creds_path), scopes=SCOPES)
    return build("sheets", "v4", credentials=creds, cache_discovery=False)


def _fetch_values(tab_name: str, a1_range: str = "A:ZZ") -> List[List[Any]]:
    service = _sheets_service()
    sheet_id = _get_sheet_id()
    # اگر اسم tab خاص باشد، بهتر است با کوتیشن خوانده شود
    rng = f"'{tab_name}'!{a1_range}"
    resp = service.spreadsheets().values().get(
        spreadsheetId=sheet_id,
        range=rng,
        majorDimension="ROWS",
    ).execute()
    return resp.get("values", []) or []


def _find_header_row(values: List[List[Any]], max_scan: int = 80) -> Optional[int]:
    """
    در اولین max_scan ردیف دنبال ردیفی می‌گردد که شامل ستون Personnel Code/Agent Code باشد.
    خروجی: index ردیف header (0-based)
    """
    limit = min(len(values), max_scan)
    for i in range(limit):
        row = values[i]
        normed = [_norm_header(x) for x in row if x is not None and str(x).strip() != ""]
        if not normed:
            continue
        has_code = any(h in CODE_HEADERS for h in normed)
        if has_code:
            return i
    return None


def _row_to_obj(headers: List[str], row: List[Any]) -> Dict[str, Any]:
    obj: Dict[str, Any] = {}
    for idx, h in enumerate(headers):
        key = str(h or "").strip()
        if not key:
            continue
        val = row[idx] if idx < len(row) else ""
        obj[key] = val
    # حذف کلیدهایی که هیچ داده‌ای ندارند
    obj = {k: v for k, v in obj.items() if str(v or "").strip() != ""}
    return obj


def _read_tab_filtered(tab_name: str, personnel_code: str) -> Tuple[List[Dict[str, Any]], Optional[str]]:
    values = _fetch_values(tab_name)
    if not values:
        return [], f"شیت {tab_name} خالی است یا قابل خواندن نیست."

    header_i = _find_header_row(values)
    if header_i is None:
        return [], f"Header در شیت {tab_name} پیدا نشد (ستون Personnel Code/Agent Code دیده نشد)."

    headers = [str(x or "").strip() for x in values[header_i]]

    # پیدا کردن index ستون کد
    code_col = None
    for idx, h in enumerate(headers):
        if _norm_header(h) in CODE_HEADERS:
            code_col = idx
            break
    if code_col is None:
        return [], f"ستون Personnel Code / Agent Code در شیت {tab_name} پیدا نشد."

    target = _norm_code(personnel_code)
    if not target:
        return [], "کد پرسنلی کاربر خالی است."

    items: List[Dict[str, Any]] = []
    for r in range(header_i + 1, len(values)):
        row = values[r]
        # ردیف کاملاً خالی
        if not any(str(x or "").strip() for x in row):
            continue

        row_code = _norm_code(row[code_col] if code_col < len(row) else "")
        if row_code != target:
            continue

        items.append(_row_to_obj(headers, row))

    return items, None


def get_qc_for_user(personnel_code: str) -> Dict[str, Any]:
    items, err = _read_tab_filtered("QC", personnel_code)
    if err:
        return {"items": [], "message": err}
    if not items:
        return {"items": [], "message": "❤️ تبریک! شما توی تماس‌هات مشکلی نبوده"}
    return {"items": items, "message": None}


def get_errors_for_user(personnel_code: str) -> Dict[str, Any]:
    items, err = _read_tab_filtered("ERRORS", personnel_code)
    if err:
        return {"items": [], "message": err}
    if not items:
        return {"items": [], "message": "💛 بهت تبریک می‌گم! تا الان بدون مشکل داری کار می‌کنی"}
    return {"items": items, "message": None}
