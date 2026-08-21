from collections.abc import Callable

from fastapi import Depends, HTTPException, status

from app.models.security import User
from app.services.auth import get_current_user


def permission_required(permission: str) -> Callable[..., User]:
    def dependency(current_user: User = Depends(get_current_user)) -> User:
        if permission not in current_user.permission_codes:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"code": "permission_denied", "message": "You do not have access."},
            )
        return current_user

    return dependency

