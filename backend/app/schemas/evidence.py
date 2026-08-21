from uuid import UUID

from pydantic import BaseModel, Field


class EvidenceCreate(BaseModel):
    title: str = Field(min_length=2, max_length=220)
    source: str = Field(min_length=2, max_length=160)
    description: str = ""
    skill_id: UUID | None = None


class EvidenceReview(BaseModel):
    decision: str = Field(pattern="^(approved|rejected|changes_requested)$")
    note: str | None = None

