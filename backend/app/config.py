# backend/app/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, AliasChoices

class Settings(BaseSettings):
    # ✅ Pydantic v2 style (جایگزین Config قدیمی)
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",  # ✅ اگر کلید اضافه بود کرش نکن
    )

    APP_NAME: str = "AzkiProfileBackend"
    ENV: str = "dev"

    # ✅ اینها با env های lowercase هم کار می‌کنن
    HOST: str = Field(default="0.0.0.0", validation_alias=AliasChoices("host", "HOST"))
    PORT: int = Field(default=4000, validation_alias=AliasChoices("port", "PORT"))
    CORS_ORIGINS: str = Field(
        default="http://localhost:3000",
        validation_alias=AliasChoices("cors_origins", "CORS_ORIGINS"),
    )

    DATABASE_URL: str = Field(default="sqlite:///./app.db")

    JWT_SECRET: str = Field(default="CHANGE_ME_SECRET", validation_alias=AliasChoices("JWT_SECRET", "jwt_secret"))
    JWT_ALG: str = Field(default="HS256", validation_alias=AliasChoices("JWT_ALG", "jwt_alg"))
    JWT_EXPIRE_HOURS: int = Field(
        default=12,
        validation_alias=AliasChoices("jwt_expire_hours", "JWT_EXPIRE_HOURS"),
    )

    GOOGLE_CREDENTIALS_PATH: str = Field(
        default="./app/data/google/service_account.json",
        validation_alias=AliasChoices("GOOGLE_CREDENTIALS_PATH", "google_credentials_path"),
    )

    # ✅ شیت مرکزی (همون MainSheet شما)
    # این خط باعث میشه اگر env رو با هرکدوم از این اسم‌ها گذاشتی، بخونه:
    # CENTRAL_SHEET_ID / central_sheet_id / SHEET_ID / sheet_id
    CENTRAL_SHEET_ID: str = Field(
        default="",
        validation_alias=AliasChoices("CENTRAL_SHEET_ID", "central_sheet_id", "SHEET_ID", "sheet_id"),
    )

    CENTRAL_SHEET_NAME: str = Field(
        default="Main",
        validation_alias=AliasChoices("CENTRAL_SHEET_NAME", "central_sheet_name"),
    )

    # ✅ چون گفتی QC و ERRORS رو آوردی داخل همین گوگل‌شیت مرکزی
    QC_SHEET_NAME: str = Field(
        default="QC",
        validation_alias=AliasChoices("QC_SHEET_NAME", "qc_sheet_name"),
    )
    ERRORS_SHEET_NAME: str = Field(
        default="ERRORS",
        validation_alias=AliasChoices("ERRORS_SHEET_NAME", "errors_sheet_name"),
    )

    NOTIFICATIONS_PPTX_PATH: str = Field(
        default="./app/data/notifications/notifications.pptx",
        validation_alias=AliasChoices("notifications_pptx_path", "NOTIFICATIONS_PPTX_PATH"),
    )

    # (اگر هنوز جایی از اکسل استفاده داشتی نگهش می‌داریم، ولی الان گفتی حذفش می‌کنی)
    REPORTS_XLSX_PATH: str = Field(
        default="./app/data/reports/reports.xlsx",
        validation_alias=AliasChoices("REPORTS_XLSX_PATH", "reports_xlsx_path"),
    )
    REPORTS_QC_SHEET_NAME: str = Field(
        default="QC",
        validation_alias=AliasChoices("REPORTS_QC_SHEET_NAME", "reports_qc_sheet_name"),
    )
    REPORTS_ERRORS_SHEET_NAME: str = Field(
        default="ERRORS",
        validation_alias=AliasChoices("REPORTS_ERRORS_SHEET_NAME", "reports_errors_sheet_name"),
    )

    # ✅ برای اینکه کدهایی که قبلاً settings.sheet_id می‌خوان، بدون تغییر درست کار کنن
    @property
    def sheet_id(self) -> str:
        return self.CENTRAL_SHEET_ID

    @property
    def central_sheet_name(self) -> str:
        return self.CENTRAL_SHEET_NAME

settings = Settings()
