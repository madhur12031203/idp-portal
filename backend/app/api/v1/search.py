from fastapi import APIRouter, Depends, Query

from app.services.auth import get_current_user

router = APIRouter(prefix="/search", tags=["search"])


@router.get("")
def search(q: str = Query(default="", max_length=120), _: object = Depends(get_current_user)) -> dict:
    return {
        "items": [],
        "query": q,
        "message": "Search becomes active after official records are connected.",
    }

