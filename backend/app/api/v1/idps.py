from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import now_utc
from app.db.session import get_db
from app.models.employee import EmployeeProfile
from app.models.idp import IdpPlan, IdpStatus
from app.schemas.idp import IdpCreate
from app.services.audit import write_audit_event
from app.services.auth import get_current_user

router = APIRouter(prefix="/idps", tags=["idps"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_idp(payload: IdpCreate, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.scalar(select(EmployeeProfile).where(EmployeeProfile.user_id == current_user.id))
    if not profile:
        raise HTTPException(status_code=404, detail="No employee profile exists yet.")

    plan = IdpPlan(
        employee_id=profile.id,
        title=payload.title,
        status=IdpStatus.draft,
        progress=0,
        created_at=now_utc(),
        updated_at=now_utc(),
    )
    db.add(plan)
    db.flush()
    write_audit_event(
        db,
        action="idp.created",
        target_type="idp_plan",
        target_id=str(plan.id),
        actor_id=current_user.id,
    )
    db.commit()
    return {"id": plan.id, "status": plan.status.value}



@router.get("/{idp_id}")
def get_idp(idp_id: str, _: object = Depends(get_current_user)) -> dict:
    return {"id": idp_id, "message": "No official development plan details are connected yet."}


@router.patch("/{idp_id}")
def update_idp(idp_id: str, _: object = Depends(get_current_user)) -> dict:
    return {"id": idp_id, "status": "accepted"}


@router.post("/{idp_id}/submit")
def submit_idp(idp_id: str, _: object = Depends(get_current_user)) -> dict:
    return {"id": idp_id, "status": "submitted"}


@router.post("/{idp_id}/approve")
def approve_idp(idp_id: str, current_user=Depends(get_current_user)) -> dict:
    if not ({"team.reviews.write", "hr.workforce.write"} & current_user.permission_codes):
        raise HTTPException(status_code=403, detail="Permission denied.")
    return {"id": idp_id, "status": "approved"}


@router.post("/{idp_id}/milestones", status_code=status.HTTP_201_CREATED)
def create_milestone(idp_id: str, _: object = Depends(get_current_user)) -> dict:
    return {"idp_id": idp_id, "status": "accepted"}


@router.patch("/{idp_id}/milestones/{milestone_id}")
def update_milestone(idp_id: str, milestone_id: str, _: object = Depends(get_current_user)) -> dict:
    return {"idp_id": idp_id, "milestone_id": milestone_id, "status": "accepted"}
