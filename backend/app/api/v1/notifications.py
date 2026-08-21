from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import now_utc
from app.db.session import get_db
from app.models.notification import Notification
from app.services.auth import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("")
def notifications(current_user=Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    rows = db.scalars(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(50)
    ).all()
    return {
        "items": [
            {
                "id": row.id,
                "title": row.title,
                "body": row.body,
                "read_at": row.read_at,
                "created_at": row.created_at,
            }
            for row in rows
        ]
    }


@router.post("/{notification_id}/read")
def mark_read(
    notification_id: UUID, current_user=Depends(get_current_user), db: Session = Depends(get_db)
):
    notification = db.get(Notification, notification_id)
    if notification and notification.user_id == current_user.id and not notification.read_at:
        notification.read_at = now_utc()
        db.commit()
    return {"status": "ok"}

