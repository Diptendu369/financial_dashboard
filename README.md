# Finance Data Processing and Access Control System

Production-ready full-stack finance dashboard with role-based access control, transaction management, analytics APIs, and a responsive React UI.

## Tech Stack

- Backend: FastAPI, SQLAlchemy, PostgreSQL, JWT, Pydantic
- Frontend: React (Vite), Material UI, Recharts, Axios
- Security: Password hashing, JWT auth, RBAC middleware, rate limiting
- Deployment: Docker, Docker Compose, `.env`-based configuration
- Docs: Swagger UI at `/docs`

## Features

- Authentication: `POST /auth/register`, `POST /auth/login`
- Session lifecycle: `POST /auth/refresh`, `POST /auth/logout`
- RBAC roles: `admin`, `analyst`, `viewer`
- User management (Admin only)
- Transaction CRUD with filters, search, pagination, and soft delete
- Dashboard analytics (summary, category totals, monthly trend)
- Dashboard recent activity endpoint
- Structured validation and error responses
- Seed data with sample users and transactions

## Project Structure

```txt
finance-dashboard/
  backend/
    app/
      main.py
      models/
      schemas/
      routes/
      services/
      middleware/
      database/
    scripts/seed_data.py
  frontend/
    src/
      components/
      pages/
      services/
      context/
  compose.yaml
```

## Database Schema

### users

- `id` (PK)
- `name`
- `email` (unique)
- `password` (hashed)
- `role` (`admin`, `analyst`, `viewer`)
- `status` (`active`, `inactive`)
- `created_at`
- `updated_at`

### transactions

- `id` (PK)
- `user_id` (FK -> users.id)
- `amount`
- `type` (`income`, `expense`)
- `category`
- `date`
- `notes`
- `is_deleted` (soft delete)
- `created_at`
- `updated_at`

## Setup Instructions

### Local (without Docker)

1. Backend:
   - `cd backend`
   - `python -m venv .venv`
   - Activate venv
   - `pip install -r requirements.txt`
   - Copy `.env.example` to `.env`
   - Run API: `uvicorn app.main:app --reload`
2. Seed data:
   - `python -m scripts.seed_data`
3. Frontend:
   - `cd ../frontend`
   - `npm install`
   - Copy `.env.example` to `.env`
   - `npm run dev`

### Docker

1. Copy `backend/.env.example` to `backend/.env` and adjust values if needed.
2. Run:
   - `docker compose -f compose.yaml up --build`
3. Access:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000`
   - Swagger: `http://localhost:8000/docs`

## API Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

### Users (Admin only)

- `POST /users`
- `GET /users?page=1&limit=10`
- `GET /users/{id}`
- `PUT /users/{id}`
- `PATCH /users/{id}/status`
- `DELETE /users/{id}`

### Transactions

- `POST /transactions` (Admin)
- `GET /transactions` (Admin, Analyst)
- `GET /transactions/{id}` (Admin, Analyst)
- `PUT /transactions/{id}` (Admin)
- `DELETE /transactions/{id}` (Admin, soft delete)

Filters:
- `type`, `category`, `start_date`, `end_date`, `search`
- pagination: `page`, `limit`

### Dashboard

- `GET /dashboard/summary` (All roles)
- `GET /dashboard/category-summary` (All roles)
- `GET /dashboard/monthly-trend` (All roles)
- `GET /dashboard/recent-activity` (All roles)

## Sample Users

- Admin: `admin@example.com` / `admin123`
- Analyst: `analyst@example.com` / `analyst123`
- Viewer: `viewer@example.com` / `viewer123`

## Assumptions

- Auto table creation is used for demo setup (`Base.metadata.create_all`).
- Role checks are enforced server-side with middleware dependencies.
- Viewer has dashboard-only access.
- Analyst has read-only access to transactions and dashboard analytics.
- Admin has full CRUD access.

## Migrations (Alembic)

- Create/update schema with:
  - `cd backend`
  - `alembic upgrade head`
- Initial migration is included in `backend/alembic/versions/0001_initial_schema.py`.

## Tests

- Run backend tests:
  - `cd backend`
  - `pytest`
