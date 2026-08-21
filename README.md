# IDP Portal

Clean Next.js + FastAPI implementation for an Individual Development Plan portal.

## Requirements

- Node.js `>=22.13.0` for the frontend
- Docker Desktop for the backend PostgreSQL stack
- Python `>=3.12` only if running the backend without Docker

## Frontend

```powershell
npm install
npm run dev
```

Open http://localhost:3000.

The frontend expects the backend at `http://localhost:8000/api/v1`. To override it, create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

## Backend

```powershell
cd backend
copy .env.example .env
docker compose up --build
```

Open http://localhost:8000/docs.

The backend seeds a default HR/system admin from `backend/.env`:

- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

## Basic Test Flow

1. Start backend with Docker Compose.
2. Start frontend with `npm run dev`.
3. Sign in as the seeded HR admin.
4. Open HR Administration -> Data import.
5. Upload or paste employee JSON.
6. Sign out and sign in as the imported employee to view their profile.

## JSON Import Shape

```json
{
  "employees": [
    {
      "email": "employee.one@department.gov",
      "full_name": "Employee One",
      "password": "ChangeMe123!",
      "employee_code": "EMP-001",
      "designation": "Program Officer",
      "grade": "Level 6",
      "status": "active",
      "joining_date": "2024-04-01",
      "department": { "code": "DPT-HR", "name": "Human Resources" },
      "roles": ["employee"]
    }
  ]
}
```
