import enum
from datetime import date, datetime
from uuid import UUID, uuid4

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class EmployeeStatus(str, enum.Enum):
    active = "active"
    transferred = "transferred"
    suspended = "suspended"
    retired = "retired"
    archived = "archived"


class EmployeeProfile(Base):
    __tablename__ = "employee_profiles"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    department_id: Mapped[UUID | None] = mapped_column(ForeignKey("departments.id"))
    employee_code: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    designation: Mapped[str] = mapped_column(String(180), nullable=False)
    grade: Mapped[str | None] = mapped_column(String(80))
    status: Mapped[EmployeeStatus] = mapped_column(Enum(EmployeeStatus), nullable=False)
    joining_date: Mapped[date | None] = mapped_column(Date)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    user = relationship("User")
    department = relationship("Department")


class ReportingRelationship(Base):
    __tablename__ = "reporting_relationships"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    employee_id: Mapped[UUID] = mapped_column(
        ForeignKey("employee_profiles.id", ondelete="CASCADE"), nullable=False
    )
    manager_id: Mapped[UUID] = mapped_column(
        ForeignKey("employee_profiles.id", ondelete="CASCADE"), nullable=False
    )
    starts_on: Mapped[date] = mapped_column(Date, nullable=False)
    ends_on: Mapped[date | None] = mapped_column(Date)



class EmployeeImportedSkill(Base):
    __tablename__ = "employee_imported_skills"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    employee_id: Mapped[UUID] = mapped_column(
        ForeignKey("employee_profiles.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    category: Mapped[str | None] = mapped_column(String(120))
    current_level: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    target_level: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    evidence: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    employee = relationship("EmployeeProfile")
