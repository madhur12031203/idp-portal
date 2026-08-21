from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.employee import EmployeeImportedSkill, EmployeeProfile
from app.schemas.employee import DepartmentSummary, EmployeeProfileResponse, OfficialEmptyResponse
from app.services.auth import get_current_user

router = APIRouter(prefix="/employees", tags=["employees"])


@router.get("/me", response_model=EmployeeProfileResponse)
def my_profile(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.scalar(select(EmployeeProfile).where(EmployeeProfile.user_id == current_user.id))
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "employee_profile_missing", "message": "No employee profile exists yet."},
        )
    return EmployeeProfileResponse(
        id=profile.id,
        employee_code=profile.employee_code,
        email=current_user.email,
        full_name=current_user.full_name,
        designation=profile.designation,
        grade=profile.grade,
        status=profile.status.value,
        joining_date=profile.joining_date,
        department=DepartmentSummary.model_validate(profile.department)
        if profile.department
        else None,
    )


@router.patch("/me")
def update_my_profile(_: object = Depends(get_current_user)) -> dict:
    return {
        "status": "accepted",
        "message": "Profile update requests will be routed through the official approval workflow.",
    }


@router.get("/me/skills")
def my_skills(current_user=Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    profile = db.scalar(select(EmployeeProfile).where(EmployeeProfile.user_id == current_user.id))
    if not profile:
        raise HTTPException(status_code=404, detail="No employee profile exists yet.")
    skills = db.scalars(
        select(EmployeeImportedSkill)
        .where(EmployeeImportedSkill.employee_id == profile.id)
        .order_by(EmployeeImportedSkill.category, EmployeeImportedSkill.name)
    ).all()
    return {
        "items": [
            {
                "id": skill.id,
                "name": skill.name,
                "category": skill.category,
                "current": skill.current_level,
                "target": skill.target_level,
                "gap": max(skill.target_level - skill.current_level, 0),
                "evidence": skill.evidence,
            }
            for skill in skills
        ],
        "total": len(skills),
    }


@router.get("/me/gaps")
def my_gaps(current_user=Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    skills = my_skills(current_user, db)["items"]
    gaps = [skill for skill in skills if skill["gap"] > 0]
    return {"items": gaps, "total": len(gaps)}


@router.get("/me/readiness")
def my_readiness(_: object = Depends(get_current_user)) -> dict:
    return {
        "overall": None,
        "positive_factors": [],
        "constraints": [],
        "missing_evidence": [],
        "message": "Readiness is unavailable until verified evidence and rules are connected.",
    }


@router.get("/me/idp", response_model=OfficialEmptyResponse)
def my_idp(_: object = Depends(get_current_user)) -> OfficialEmptyResponse:
    return OfficialEmptyResponse(message="No approved development plan exists yet.")


@router.get("/me/progress")
def my_progress(_: object = Depends(get_current_user)) -> dict:
    return {"items": [], "message": "Progress tracking starts after an approved development plan."}

