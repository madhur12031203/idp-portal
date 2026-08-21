from uuid import UUID, uuid4

from sqlalchemy.orm import Session

from app.core.security import now_utc
from app.models.audit import AuditEvent


def write_audit_event(
    db: Session,
    *,
    action: str,
    target_type: str,
    actor_id: UUID | None = None,
    target_id: str | None = None,
    summary: str = "",
    ip_address: str | None = None,
    user_agent: str | None = None,
    request_id: str | None = None,
) -> AuditEvent:
    event = AuditEvent(
        actor_id=actor_id,
        action=action,
        target_type=target_type,
        target_id=target_id,
        summary=summary,
        ip_address=ip_address,
        user_agent=user_agent,
        request_id=request_id or f"req_{uuid4().hex}",
        created_at=now_utc(),
    )
    db.add(event)
    return event

