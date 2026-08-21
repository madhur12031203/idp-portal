from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import now_utc
from app.db.session import get_db
from app.models.employee import EmployeeProfile
from app.models.talent import Approval, ApprovalStatus, EvidenceStatus, SkillEvidence
from app.schemas.evidence import EvidenceCreate, EvidenceReview
from app.services.audit import write_audit_event
from app.services.auth import get_current_user

router = APIRouter(prefix="/evidence", tags=["evidence"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_evidence(
    payload: EvidenceCreate, current_user=Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    profile = db.scalar(select(EmployeeProfile).where(EmployeeProfile.user_id == current_user.id))
    if not profile:
        raise HTTPException(status_code=404, detail="No employee profile exists yet.")

    evidence = SkillEvidence(
        employee_id=profile.id,
        skill_id=payload.skill_id,
        title=payload.title,
        source=payload.source,
        description=payload.description,
        status=EvidenceStatus.draft,
        created_at=now_utc(),
        updated_at=now_utc(),
    )
    db.add(evidence)
    db.flush()
    write_audit_event(
        db,
        action="evidence.created",
        target_type="skill_evidence",
        target_id=str(evidence.id),
        actor_id=current_user.id,
    )
    db.commit()
    return {"id": evidence.id, "status": evidence.status.value}


@router.get("/{evidence_id}")
def get_evidence(evidence_id: UUID, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    evidence = db.get(SkillEvidence, evidence_id)
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found.")
    profile = db.scalar(select(EmployeeProfile).where(EmployeeProfile.user_id == current_user.id))
    can_review = {"team.reviews.write", "hr.workforce.write"} & current_user.permission_codes
    if not can_review and (not profile or evidence.employee_id != profile.id):
        raise HTTPException(status_code=404, detail="Evidence not found.")
    return {
        "id": evidence.id,
        "title": evidence.title,
        "source": evidence.source,
        "description": evidence.description,
        "status": evidence.status.value,
        "submitted_at": evidence.submitted_at,
        "reviewed_at": evidence.reviewed_at,
        "review_note": evidence.review_note,
    }


@router.patch("/{evidence_id}")
def update_evidence(
    evidence_id: UUID,
    payload: EvidenceCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.scalar(select(EmployeeProfile).where(EmployeeProfile.user_id == current_user.id))
    evidence = db.get(SkillEvidence, evidence_id)
    if not profile or not evidence or evidence.employee_id != profile.id:
        raise HTTPException(status_code=404, detail="Evidence not found.")
    if evidence.status != EvidenceStatus.draft:
        raise HTTPException(status_code=409, detail="Only draft evidence can be updated.")
    evidence.title = payload.title
    evidence.source = payload.source
    evidence.description = payload.description
    evidence.skill_id = payload.skill_id
    evidence.updated_at = now_utc()
    write_audit_event(
        db,
        action="evidence.updated",
        target_type="skill_evidence",
        target_id=str(evidence.id),
        actor_id=current_user.id,
    )
    db.commit()
    return {"id": evidence.id, "status": evidence.status.value}


@router.post("/{evidence_id}/submit")
def submit_evidence(
    evidence_id: UUID, current_user=Depends(get_current_user), db: Session = Depends(get_db)
):
    profile = db.scalar(select(EmployeeProfile).where(EmployeeProfile.user_id == current_user.id))
    evidence = db.get(SkillEvidence, evidence_id)
    if not profile or not evidence or evidence.employee_id != profile.id:
        raise HTTPException(status_code=404, detail="Evidence not found.")
    if evidence.status != EvidenceStatus.draft:
        raise HTTPException(status_code=409, detail="Only draft evidence can be submitted.")

    evidence.status = EvidenceStatus.submitted
    evidence.submitted_at = now_utc()
    evidence.updated_at = now_utc()
    db.add(
        Approval(
            target_type="skill_evidence",
            target_id=evidence.id,
            requested_by_id=current_user.id,
            status=ApprovalStatus.pending,
            created_at=now_utc(),
        )
    )
    write_audit_event(
        db,
        action="evidence.submitted",
        target_type="skill_evidence",
        target_id=str(evidence.id),
        actor_id=current_user.id,
    )
    db.commit()
    return {"id": evidence.id, "status": evidence.status.value}


@router.post("/{evidence_id}/review")
def review_evidence(
    evidence_id: UUID,
    payload: EvidenceReview,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not ({"team.reviews.write", "hr.workforce.write"} & current_user.permission_codes):
        raise HTTPException(status_code=403, detail="Permission denied.")

    evidence = db.get(SkillEvidence, evidence_id)
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found.")

    evidence.status = EvidenceStatus.approved if payload.decision == "approved" else EvidenceStatus.rejected
    evidence.reviewed_at = now_utc()
    evidence.reviewed_by_id = current_user.id
    evidence.review_note = payload.note
    evidence.updated_at = now_utc()
    write_audit_event(
        db,
        action=f"evidence.{payload.decision}",
        target_type="skill_evidence",
        target_id=str(evidence.id),
        actor_id=current_user.id,
        summary=payload.note or "",
    )
    db.commit()
    return {"id": evidence.id, "status": evidence.status.value}

