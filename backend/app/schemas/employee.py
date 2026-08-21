from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr


class DepartmentSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    code: str


class EmployeeProfileResponse(BaseModel):
    id: UUID
    employee_code: str
    email: EmailStr
    full_name: str
    designation: str
    grade: str | None
    status: str
    joining_date: date | None
    department: DepartmentSummary | None


class OfficialEmptyResponse(BaseModel):
    items: list[dict] = []
    message: str = "No official records are connected yet."

