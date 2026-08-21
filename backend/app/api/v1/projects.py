from fastapi import APIRouter, Depends, status

from app.core.permissions import permission_required
from app.services.auth import get_current_user

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("")
def projects(_: object = Depends(get_current_user)) -> dict:
    return {"items": [], "message": "No stretch assignments are published yet."}


@router.post("", status_code=status.HTTP_202_ACCEPTED)
def create_project(_: object = Depends(permission_required("hr.workforce.write"))) -> dict:
    return {"status": "accepted", "message": "Project opportunity writes are ready for service implementation."}


@router.post("/{project_id}/apply", status_code=status.HTTP_202_ACCEPTED)
def apply_to_project(project_id: str, _: object = Depends(get_current_user)) -> dict:
    return {"id": project_id, "status": "accepted"}
