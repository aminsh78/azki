# backend/app/database/init_db.py
from app.database.db import engine
from app.database.models import User

def init_db() -> None:
    User.metadata.create_all(bind=engine)
