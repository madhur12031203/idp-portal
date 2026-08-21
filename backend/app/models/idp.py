import enum
from datetime import date, datetime
from uuid import UUID, uuid4

from sqlalchemy import Boolean, Date, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class IdpStatus(str, enum.Enum):
    draft = "draft"
    submitted = "submitted"
    manager_review = "manager_review"
    hr_review = "hr_review"
    approved = "approved"
    active = "active"
    completed = "completed"
    cancelled = "cancelled"
    rejected = "rejected"


class IdpPlan(Base):
    __tablename__ = "idp_plans"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    employee_id: Mapped[UUID] = mapped_column(
        ForeignKey("employee_profiles.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(220), nullable=False)
    status: Mapped[IdpStatus] = mapped_column(Enum(IdpStatus), nullable=False)
    progress: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class IdpMilestone(Base):
    __tablename__ = "idp_milestones"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    plan_id: Mapped[UUID] = mapped_column(ForeignKey("idp_plans.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(220), nullable=False)
    due_on: Mapped[date | None] = mapped_column(Date)
    is_complete: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

