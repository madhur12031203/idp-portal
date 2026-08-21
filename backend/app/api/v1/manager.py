from fastapi import APIRouter, Depends

from app.core.permissions import permission_required

router = APIRouter(prefix="/manager", tags=["manager"])


@router.get("/team")
def team(_: object = Depends(permission_required("team.members.read"))) -> dict:
    return {"items": [], "message": "No team records are loaded yet."}


@router.get("/approvals")
def approvals(_: object = Depends(permission_required("team.reviews.write"))) -> dict:
    return {"items": [], "message": "No pending development approvals."}


@router.get("/team/readiness")
def readiness(_: object = Depends(permission_required("team.members.read"))) -> dict:
    return {"items": [], "message": "Team readiness appears after verified records are connected."}


@router.get("/team/idps")
def idps(_: object = Depends(permission_required("team.members.read"))) -> dict:
    return {"items": [], "message": "No team development plans are loaded yet."}



@router.post("/approvals/{approval_id}/decision")
def approval_decision(approval_id: str, _: object = Depends(permission_required("team.reviews.write"))) -> dict:
    return {"id": approval_id, "status": "accepted", "message": "Approval decisions are ready for service implementation."}
