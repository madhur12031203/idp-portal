from sqlalchemy import select

from app.core.config import settings
from app.core.security import hash_password, now_utc
from app.db.session import SessionLocal
from app.models.security import Permission, Role, User

ROLE_PERMISSIONS = {
    "employee": ["employee.self.read", "employee.self.write_request"],
    "manager": [
        "employee.self.read",
        "team.members.read",
        "team.reviews.write",
    ],
    "hr_admin": [
        "hr.workforce.read",
        "hr.workforce.write",
        "hr.catalogue.write",
        "hr.policy.write",
        "audit.read",
    ],
    "system_admin": ["admin.settings.write", "audit.read"],
}

PERMISSION_DESCRIPTIONS = {
    "employee.self.read": "Read own employee records.",
    "employee.self.write_request": "Submit own record update requests.",
    "team.members.read": "Read assigned team records.",
    "team.reviews.write": "Review assigned team requests.",
    "hr.workforce.read": "Read HR workforce records.",
    "hr.workforce.write": "Manage HR workforce records.",
    "hr.catalogue.write": "Manage role and skill catalogues.",
    "hr.policy.write": "Manage HR approval and readiness policies.",
    "audit.read": "Read audit events.",
    "admin.settings.write": "Manage technical system settings.",
}


def upsert_permission(db, code: str) -> Permission:
    permission = db.scalar(select(Permission).where(Permission.code == code))
    if permission:
        return permission
    permission = Permission(code=code, description=PERMISSION_DESCRIPTIONS.get(code, ""))
    db.add(permission)
    db.flush()
    return permission


def upsert_role(db, name: str, permission_codes: list[str]) -> Role:
    role = db.scalar(select(Role).where(Role.name == name))
    if not role:
        role = Role(name=name, description=f"{name.replace('_', ' ').title()} role")
        db.add(role)
        db.flush()

    permissions = [upsert_permission(db, code) for code in permission_codes]
    role.permissions = permissions
    return role


def seed() -> None:
    with SessionLocal() as db:
        roles = {
            name: upsert_role(db, name, permissions)
            for name, permissions in ROLE_PERMISSIONS.items()
        }

        admin = db.scalar(select(User).where(User.email == settings.seed_admin_email.lower()))
        if not admin:
            admin = User(
                email=settings.seed_admin_email.lower(),
                full_name="Seed HR Administrator",
                hashed_password=hash_password(settings.seed_admin_password),
                is_active=True,
                created_at=now_utc(),
                updated_at=now_utc(),
            )
            db.add(admin)
        admin.roles = [roles["hr_admin"], roles["system_admin"]]
        admin.updated_at = now_utc()
        db.commit()


if __name__ == "__main__":
    seed()

