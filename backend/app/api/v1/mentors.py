from fastapi import APIRouter, Depends, status

from app.core.permissions import permission_required
from app.services.auth import get_current_user

router = APIRouter(prefix="/mentors", tags=["mentors"])


@router.get("")
def mentors(_: object = Depends(get_current_user)) -> dict:
    return {"items": [], "message": "No approved mentors are available yet."}


@router.post("", status_code=status.HTTP_202_ACCEPTED)
def create_mentor(_: object = Depends(permission_required("hr.workforce.write"))) -> dict:
    return {"status": "accepted", "message": "Mentor administration is ready for service implementation."}


@router.post("/assignments", status_code=status.HTTP_202_ACCEPTED)
def create_mentor_assignment(_: object = Depends(get_current_user)) -> dict:
    return {"status": "accepted", "message": "Mentor assignment requests are ready for workflow implementation."}
