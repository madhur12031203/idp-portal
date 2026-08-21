"""employee imported skills

Revision ID: 202608210002
Revises: 202608210001
Create Date: 2026-08-21
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "202608210002"
down_revision: str | None = "202608210001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "employee_imported_skills",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("employee_id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("category", sa.String(length=120), nullable=True),
        sa.Column("current_level", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("target_level", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("evidence", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["employee_id"], ["employee_profiles.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("employee_id", "name"),
    )
    op.create_index(
        "ix_employee_imported_skills_employee",
        "employee_imported_skills",
        ["employee_id"],
    )


def downgrade() -> None:
    op.drop_index("ix_employee_imported_skills_employee", table_name="employee_imported_skills")
    op.drop_table("employee_imported_skills")
