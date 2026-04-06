from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.middleware.role import require_roles
from app.models.user import UserRole
from app.schemas.dashboard_schema import (
    CategorySummaryResponse,
    DashboardSummary,
    MonthlyTrendResponse,
    RecentActivityResponse,
)
from app.services.dashboard_service import get_category_summary, get_monthly_trend, get_recent_activity, get_summary

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get(
    "/summary",
    response_model=DashboardSummary,
    dependencies=[Depends(require_roles(UserRole.admin, UserRole.analyst, UserRole.viewer))],
)
def summary(db: Session = Depends(get_db)):
    return get_summary(db)


@router.get(
    "/category-summary",
    response_model=CategorySummaryResponse,
    dependencies=[Depends(require_roles(UserRole.admin, UserRole.analyst, UserRole.viewer))],
)
def category_summary(db: Session = Depends(get_db)):
    return get_category_summary(db)


@router.get(
    "/monthly-trend",
    response_model=MonthlyTrendResponse,
    dependencies=[Depends(require_roles(UserRole.admin, UserRole.analyst, UserRole.viewer))],
)
def monthly_trend(db: Session = Depends(get_db)):
    return get_monthly_trend(db)


@router.get(
    "/recent-activity",
    response_model=RecentActivityResponse,
    dependencies=[Depends(require_roles(UserRole.admin, UserRole.analyst, UserRole.viewer))],
)
def recent_activity(limit: int = 10, db: Session = Depends(get_db)):
    return get_recent_activity(db, limit=limit)
