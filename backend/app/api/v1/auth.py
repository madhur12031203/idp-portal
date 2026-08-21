from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import decode_token, now_utc, token_hash
from app.db.session import get_db
from app.models.security import RefreshToken
from app.schemas.auth import LoginRequest, MeResponse, RefreshRequest, TokenPair
from app.services.auth import authenticate_user, get_current_user, get_user_by_id, issue_token_pair

router = APIRouter(prefix="/auth", tags=["auth"])


def workspaces_for_roles(roles: list[str]) -> list[str]:
    mapping = {"employee": "employee", "manager": "manager", "hr_admin": "hr", "system_admin": "hr"}
    return sorted({mapping[role] for role in roles if role in mapping})


@router.post("/login", response_model=TokenPair)
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)) -> TokenPair:
    user = authenticate_user(db, payload.email, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "invalid_credentials", "message": "Invalid email or password."},
        )

    access_token, refresh_token = issue_token_pair(db, request, user)
    return TokenPair(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=TokenPair)
def refresh(payload: RefreshRequest, request: Request, db: Session = Depends(get_db)) -> TokenPair:
    try:
        user_id = decode_token(payload.refresh_token, "refresh")
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc

    stored = db.scalar(
        select(RefreshToken).where(RefreshToken.token_hash == token_hash(payload.refresh_token))
    )
    if not stored or stored.revoked_at or stored.expires_at <= now_utc() or stored.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    user = get_user_by_id(db, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    access_token, refresh_token = issue_token_pair(
        db, request, user, revoke_token=payload.refresh_token
    )
    return TokenPair(access_token=access_token, refresh_token=refresh_token)


@router.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED)
def forgot_password() -> dict[str, str]:
    return {"status": "accepted", "message": "Password reset delivery is not configured yet."}


@router.post("/reset-password", status_code=status.HTTP_202_ACCEPTED)
def reset_password() -> dict[str, str]:
    return {"status": "accepted", "message": "Password reset verification is not configured yet."}


@router.post("/logout")
def logout(payload: RefreshRequest, db: Session = Depends(get_db)) -> dict[str, str]:
    stored = db.scalar(
        select(RefreshToken).where(RefreshToken.token_hash == token_hash(payload.refresh_token))
    )
    if stored and not stored.revoked_at:
        stored.revoked_at = now_utc()
        db.commit()
    return {"status": "ok"}


@router.post("/logout-all")
def logout_all(current_user=Depends(get_current_user), db: Session = Depends(get_db)) -> dict[str, str]:
    tokens = db.scalars(
        select(RefreshToken).where(
            RefreshToken.user_id == current_user.id, RefreshToken.revoked_at.is_(None)
        )
    ).all()
    for stored in tokens:
        stored.revoked_at = now_utc()
    db.commit()
    return {"status": "ok"}


@router.get("/me", response_model=MeResponse)
def me(current_user=Depends(get_current_user)) -> MeResponse:
    roles = current_user.role_names
    return MeResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        roles=roles,
        permissions=sorted(current_user.permission_codes),
        workspaces=workspaces_for_roles(roles),
    )

