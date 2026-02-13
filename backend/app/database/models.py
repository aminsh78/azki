# backend/app/database/models.py
from sqlalchemy import Column, Integer, String
from app.database.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    name_english = Column(String, nullable=True)
    name_persian = Column(String, nullable=True)
    email_azki = Column(String, nullable=True)
    personal_email = Column(String, nullable=True)
    position = Column(String, nullable=True)
    personnel_code = Column(String, index=True, nullable=True)
    role = Column(String, nullable=True)
    number = Column(String, nullable=True)

    qa_total = Column(Integer, default=0, nullable=False)
    qc_total = Column(Integer, default=0, nullable=False)
    accepted_errors = Column(Integer, default=0, nullable=False)
    rank = Column(String, default="-", nullable=False)
