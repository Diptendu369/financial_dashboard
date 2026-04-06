from datetime import date
from typing import List

from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_income: float
    total_expense: float
    net_balance: float


class CategorySummaryItem(BaseModel):
    category: str
    total: float


class MonthlyTrendItem(BaseModel):
    month: str
    income: float
    expense: float


class CategorySummaryResponse(BaseModel):
    categories: List[CategorySummaryItem]


class MonthlyTrendResponse(BaseModel):
    monthly: List[MonthlyTrendItem]


class RecentActivityItem(BaseModel):
    id: int
    amount: float
    type: str
    category: str
    date: date
    notes: str | None


class RecentActivityResponse(BaseModel):
    activities: List[RecentActivityItem]
