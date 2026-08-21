from datetime import UTC, datetime, timedelta
from hashlib import sha256
from uuid import UUID

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"


def now_utc() -> datetime:
    return datetime.now(UTC)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def token_hash(token: str) -> str:
    return sha256(token.encode("utf-8")).hexdigest()


def create_access_token(user_id: UUID, permissions: set[str]) -> str:
    expires_at = now_utc() + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {
        "sub": str(user_id),
        "type": "access",
        "permissions": sorted(permissions),
        "exp": expires_at,
        "iat": now_utc(),
    }
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)


def create_refresh_token(user_id: UUID) -> tuple[str, datetime]:
    expires_at = now_utc() + timedelta(days=settings.refresh_token_expire_days)
    payload = {"sub": str(user_id), "type": "refresh", "exp": expires_at, "iat": now_utc()}
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM), expires_at


def decode_token(token: str, expected_type: str) -> UUID:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
    except JWTError as exc:
        raise ValueError("Invalid token") from exc

    if payload.get("type") != expected_type or not payload.get("sub"):
        raise ValueError("Invalid token")

    return UUID(payload["sub"])

