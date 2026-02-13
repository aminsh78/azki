# backend/app/utils/security.py
from fastapi import HTTPException, status

def unauthorized(detail: str = "Unauthorized"):
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)
