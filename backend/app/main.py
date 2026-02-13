# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import auth, users, profile

# ساخت دیتابیس در صورت نیاز
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Azki Profile API",
    version="1.0.0",
)

# فقط دامنه واقعی شما اجازه دارد
origins = [
    "https://aminshahabi.ir",
    "https://www.aminshahabi.ir",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# روترها
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
