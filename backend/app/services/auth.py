from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    now_utc,
    token_hash,
    verify_password,
)
from app.db.session import get_db
from app.models.security import RefreshToken, Role, User
from app.services.audit import write_audit_event

bearer_scheme = HTTPBearer(auto_error=False)


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(
        select(User)
        .where(User.email == email.lower())
        .options(selectinload(User.roles).selectinload(Role.permissions))
    )


def get_user_by_id(db: Session, user_id) -> User | None:
    return db.scalar(
        select(User).where(User.id == user_id).options(selectinload(User.roles).selectinload(Role.permissions))
    )


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if not user or not user.is_active or not verify_password(password, user.hashed_password):
        return None
    return user


def issue_token_pair(
    db: Session, request: Request, user: User, *, revoke_token: str | None = None
) -> tuple[str, str]:
    if revoke_token:
        existing = db.scalar(select(RefreshToken).where(RefreshToken.token_hash == token_hash(revoke_token)))
        if existing:
            existing.revoked_at = now_utc()

    access_token = create_access_token(user.id, user.permission_codes)
    refresh_token, expires_at = create_refresh_token(user.id)
    db.add(
        RefreshToken(
            user_id=user.id,
            token_hash=token_hash(refresh_token),
            expires_at=expires_at,
            created_at=now_utc(),
            user_agent=request.headers.get("user-agent"),
            ip_address=request.client.host if request.client else None,
        )
    )
    user.last_login_at = now_utc()
    write_audit_event(
        db,
        action="auth.token_issued",
        target_type="user",
        target_id=str(user.id),
        actor_id=user.id,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    db.commit()
    return access_token, refresh_token


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")

    try:
        user_id = decode_token(credentials.credentials, "access")
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc

    user = get_user_by_id(db, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return user

