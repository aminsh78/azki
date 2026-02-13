# backend/app/services/google_sheets.py
import os
import certifi

os.environ["SSL_CERT_FILE"] = certifi.where()
os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()

from typing import Optional, Dict, Any, List
import gspread
from google.oauth2.service_account import Credentials
from app.config import settings

REQUIRED_HEADERS = [
    "Name English",
    "Name persian",
    "Email Azki",
    "Personal Email",
    "Position",
    "User",
    "Password",
    "Qa total",
    "Qc total",
    "Rank",
    "Personnel Code",
    "Role",
    "Number",
]

def _client():
    scopes = [
        "https://www.googleapis.com/auth/spreadsheets.readonly",
        "https://www.googleapis.com/auth/drive.readonly",
    ]
    creds = Credentials.from_service_account_file(settings.GOOGLE_CREDENTIALS_PATH, scopes=scopes)
    return gspread.authorize(creds)

def _open_sheet():
    gc = _client()
    if settings.CENTRAL_SHEET_ID.strip():
        sh = gc.open_by_key(settings.CENTRAL_SHEET_ID.strip())
    else:
        sh = gc.open(settings.CENTRAL_SHEET_NAME)
    return sh.sheet1

def _validate_headers(sheet) -> None:
    header_row: List[str] = sheet.row_values(1)
    missing = [h for h in REQUIRED_HEADERS if h not in header_row]
    if missing:
        raise RuntimeError(f"Missing headers in Google Sheet: {missing}")

def get_all_users() -> List[Dict[str, Any]]:
    sheet = _open_sheet()
    _validate_headers(sheet)
    return sheet.get_all_records()

def find_user_by_username(username: str) -> Optional[Dict[str, Any]]:
    rows = get_all_users()
    for r in rows:
        if str(r.get("User", "")).strip() == username.strip():
            return r
    return None

def validate_login(username: str, password: str) -> Optional[Dict[str, Any]]:
    user = find_user_by_username(username)
    if not user:
        return None
    if str(user.get("Password", "")) != str(password):
        return None
    return user
