from fastapi import APIRouter, Depends, status

from app.core.permissions import permission_required
from app.services.auth import get_current_user

router = APIRouter(prefix="/learning", tags=["learning"])


@router.get("")
def learning_catalogue(_: object = Depends(get_current_user)) -> dict:
    return {"items": [], "message": "No approved learning resources are published yet."}


@router.post("", status_code=status.HTTP_202_ACCEPTED)
def create_learning(_: object = Depends(permission_required("hr.catalogue.write"))) -> dict:
    return {"status": "accepted", "message": "Learning catalogue writes are ready for service implementation."}


@router.post("/{learning_id}/assign", status_code=status.HTTP_202_ACCEPTED)
def assign_learning(learning_id: str, _: object = Depends(permission_required("team.reviews.write"))) -> dict:
    return {"id": learning_id, "status": "accepted"}
