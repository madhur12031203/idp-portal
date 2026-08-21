from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "IDP Portal Backend"
    environment: str = "local"
    database_url: str = "postgresql+psycopg://idp:idp@localhost:5432/idp_portal"
    secret_key: str = Field(default="change-this-local-secret", min_length=16)
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 30
    cors_origins: str = "http://localhost:3000,http://localhost:3004,http://localhost:8788,http://localhost:5173"
    cors_origin_regex: str = r"https?://(localhost|127\.0\.0\.1|192\.168\.[0-9]+\.[0-9]+):[0-9]+"
    seed_admin_email: str = "hr.admin@department.gov"
    seed_admin_password: str = "ChangeMe123!"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
