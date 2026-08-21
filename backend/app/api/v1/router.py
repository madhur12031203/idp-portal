from fastapi import APIRouter

from app.api.v1 import auth, employees, evidence, health, hr, idps, learning, manager, mentors, notifications, projects, search

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(employees.router)
api_router.include_router(evidence.router)
api_router.include_router(manager.router)
api_router.include_router(hr.router)
api_router.include_router(idps.router)
api_router.include_router(learning.router)
api_router.include_router(mentors.router)
api_router.include_router(projects.router)
api_router.include_router(notifications.router)
api_router.include_router(search.router)

