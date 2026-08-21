from pydantic import BaseModel, Field


class IdpCreate(BaseModel):
    title: str = Field(min_length=2, max_length=220)

