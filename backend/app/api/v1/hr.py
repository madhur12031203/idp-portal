from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.core.permissions import permission_required
from app.core.security import hash_password, now_utc
from app.db.session import get_db
from app.models.employee import EmployeeImportedSkill, EmployeeProfile, EmployeeStatus
from app.models.organization import Department
from app.models.security import Role, User
from app.services.audit import write_audit_event

router = APIRouter(prefix="/hr", tags=["hr"])


class ImportDepartment(BaseModel):
    code: str = Field(min_length=1, max_length=50)
    name: str = Field(min_length=1, max_length=180)


class ImportSkill(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    category: str | None = None
    current: int = Field(default=0, ge=0, le=100)
    target: int = Field(default=0, ge=0, le=100)
    evidence: str | None = None


class ImportEmployee(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=1, max_length=255)
    password: str = Field(default="ChangeMe123!", min_length=6)
    employee_code: str = Field(min_length=1, max_length=80)
    designation: str = Field(min_length=1, max_length=180)
    grade: str | None = None
    status: EmployeeStatus = EmployeeStatus.active
    joining_date: date | None = None
    department: ImportDepartment | None = None
    roles: list[str] = ["employee"]
    skills: list[ImportSkill] = []


class WorkforceImportRequest(BaseModel):
    employees: list[ImportEmployee]


def skill_payload(row: EmployeeImportedSkill) -> dict:
    gap = max(row.target_level - row.current_level, 0)
    return {
        "id": row.id,
        "name": row.name,
        "category": row.category,
        "current": row.current_level,
        "target": row.target_level,
        "gap": gap,
        "evidence": row.evidence,
    }


def employee_payload(profile: EmployeeProfile, skills: list[EmployeeImportedSkill]) -> dict:
    return {
        "id": profile.id,
        "employee_code": profile.employee_code,
        "email": profile.user.email,
        "full_name": profile.user.full_name,
        "designation": profile.designation,
        "grade": profile.grade,
        "status": profile.status.value,
        "joining_date": profile.joining_date,
        "department": {
            "id": profile.department.id,
            "name": profile.department.name,
            "code": profile.department.code,
        } if profile.department else None,
        "skills": [skill_payload(skill) for skill in skills],
    }


@router.get("/workforce")
def workforce(
    _: object = Depends(permission_required("hr.workforce.read")),
    db: Session = Depends(get_db),
) -> dict:
    profiles = db.scalars(
        select(EmployeeProfile)
        .options(selectinload(EmployeeProfile.user), selectinload(EmployeeProfile.department))
        .order_by(EmployeeProfile.employee_code)
    ).all()
    skill_rows = db.scalars(select(EmployeeImportedSkill)).all()
    skills_by_employee: dict = {}
    for skill in skill_rows:
        skills_by_employee.setdefault(skill.employee_id, []).append(skill)
    items = [employee_payload(profile, skills_by_employee.get(profile.id, [])) for profile in profiles]
    return {"items": items, "total": len(items)}


@router.get("/skills")
def skills(_: object = Depends(permission_required("hr.catalogue.write"))) -> dict:
    return {"items": [], "message": "No skill taxonomy has been configured yet."}


@router.get("/roles")
def roles(_: object = Depends(permission_required("hr.catalogue.write"))) -> dict:
    return {"items": [], "message": "No role catalogue has been configured yet."}


@router.get("/analytics/overview")
def overview(_: object = Depends(permission_required("hr.workforce.read")), db: Session = Depends(get_db)) -> dict:
    count = db.scalar(select(func.count(EmployeeProfile.id)))
    return {"employee_count": count or 0, "departments": [], "message": "Analytics require official data."}


@router.get("/analytics/nine-box")
def nine_box(_: object = Depends(permission_required("hr.workforce.read"))) -> dict:
    return {"items": [], "message": "Nine-box data is unavailable until reviews exist."}


@router.get("/analytics/succession")
def succession(_: object = Depends(permission_required("hr.workforce.read"))) -> dict:
    return {"items": [], "message": "Succession data is unavailable until role criteria exist."}


@router.get("/analytics/fairness")
def fairness(_: object = Depends(permission_required("hr.workforce.read"))) -> dict:
    return {"items": [], "message": "Fairness metrics require sufficient official records."}


@router.get("/audit")
def audit(_: object = Depends(permission_required("audit.read"))) -> dict:
    return {"items": [], "message": "No official actions recorded yet."}


@router.post("/workforce/imports", status_code=202)
def create_workforce_import(_: object = Depends(permission_required("hr.workforce.write"))) -> dict:
    return {"status": "accepted", "message": "Workforce import jobs are queued in a later phase."}


@router.post("/skills", status_code=202)
def create_skill(_: object = Depends(permission_required("hr.catalogue.write"))) -> dict:
    return {"status": "accepted", "message": "Skill catalogue writes are ready for service implementation."}


@router.post("/roles", status_code=202)
def create_role(_: object = Depends(permission_required("hr.catalogue.write"))) -> dict:
    return {"status": "accepted", "message": "Role catalogue writes are ready for service implementation."}


@router.post("/workforce/import-json", status_code=status.HTTP_201_CREATED)
def import_json(
    payload: WorkforceImportRequest,
    current_user=Depends(permission_required("hr.workforce.write")),
    db: Session = Depends(get_db),
) -> dict:
    created = 0
    updated = 0
    results = []

    for item in payload.employees:
        department = None
        if item.department:
            department = db.scalar(select(Department).where(Department.code == item.department.code))
            if not department:
                department = Department(code=item.department.code, name=item.department.name)
                db.add(department)
                db.flush()
            else:
                department.name = item.department.name

        user = db.scalar(select(User).where(User.email == item.email.lower()))
        if user:
            updated += 1
            user.full_name = item.full_name
            user.updated_at = now_utc()
        else:
            created += 1
            user = User(
                email=item.email.lower(),
                full_name=item.full_name,
                hashed_password=hash_password(item.password),
                is_active=True,
                created_at=now_utc(),
                updated_at=now_utc(),
            )
            db.add(user)
            db.flush()

        roles = db.scalars(select(Role).where(Role.name.in_(item.roles))).all()
        missing_roles = sorted(set(item.roles) - {role.name for role in roles})
        if missing_roles:
            raise HTTPException(
                status_code=400,
                detail={"code": "unknown_roles", "message": f"Unknown roles: {', '.join(missing_roles)}"},
            )
        user.roles = roles

        profile = db.scalar(select(EmployeeProfile).where(EmployeeProfile.employee_code == item.employee_code))
        if not profile:
            profile = EmployeeProfile(
                user_id=user.id,
                employee_code=item.employee_code,
                designation=item.designation,
                grade=item.grade,
                status=item.status,
                joining_date=item.joining_date,
                department_id=department.id if department else None,
                created_at=now_utc(),
                updated_at=now_utc(),
            )
            db.add(profile)
            db.flush()
        else:
            profile.user_id = user.id
            profile.designation = item.designation
            profile.grade = item.grade
            profile.status = item.status
            profile.joining_date = item.joining_date
            profile.department_id = department.id if department else None
            profile.updated_at = now_utc()

        imported_skill_names = set()
        for skill_item in item.skills:
            imported_skill_names.add(skill_item.name)
            skill = db.scalar(
                select(EmployeeImportedSkill).where(
                    EmployeeImportedSkill.employee_id == profile.id,
                    EmployeeImportedSkill.name == skill_item.name,
                )
            )
            if not skill:
                skill = EmployeeImportedSkill(
                    employee_id=profile.id,
                    name=skill_item.name,
                    created_at=now_utc(),
                    updated_at=now_utc(),
                )
                db.add(skill)
                db.flush()
            skill.category = skill_item.category
            skill.current_level = skill_item.current
            skill.target_level = skill_item.target
            skill.evidence = skill_item.evidence
            skill.updated_at = now_utc()

        results.append({
            "email": user.email,
            "employee_code": profile.employee_code,
            "roles": item.roles,
            "skills_imported": len(imported_skill_names),
        })

    write_audit_event(
        db,
        action="workforce.import_json",
        target_type="employee_profiles",
        actor_id=current_user.id,
        summary=f"Imported {len(payload.employees)} employee profile records.",
    )
    db.commit()
    return {"created_users": created, "updated_users": updated, "items": results}
