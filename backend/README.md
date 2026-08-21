# IDP Portal Backend

FastAPI + PostgreSQL backend for the IDP Portal.

## Quick Start

```bash
cd backend
cp .env.example .env
docker compose up --build
```

API docs:

- http://localhost:8000/docs
- http://localhost:8000/redoc

Health checks:

- `GET /api/v1/health`
- `GET /api/v1/ready`

## Local Development Without Docker

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload
```

## Default Seed User

The seed command creates roles, permissions, and one HR admin user from env vars:

- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

Change these values before using any shared environment.

## Auth Flow

1. `POST /api/v1/auth/login`
2. Use `access_token` as `Authorization: Bearer <token>`.
3. Use `POST /api/v1/auth/refresh` with the refresh token when the access token expires.
4. `POST /api/v1/auth/logout` revokes the current refresh token.
5. `POST /api/v1/auth/logout-all` revokes all refresh tokens for the signed-in user.

## Project Shape

```text
backend/
  app/
    api/v1/       FastAPI routers
    core/         settings, security, RBAC
    db/           SQLAlchemy session/base
    models/       database models
    schemas/      Pydantic DTOs
    services/     domain logic
  alembic/        migrations
```

