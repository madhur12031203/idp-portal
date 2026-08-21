from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class OrmModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class Page(BaseModel, Generic[T]):
    items: list[T]
    page: int = 1
    page_size: int = 25
    total: int = 0


class EmptyOfficialRecords(BaseModel):
    items: list[dict] = []
    message: str = "No official records are connected yet."

