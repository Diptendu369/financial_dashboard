from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models.transaction import TransactionType


class TransactionBase(BaseModel):
    amount: float = Field(gt=0)
    type: TransactionType
    category: str = Field(min_length=2, max_length=120)
    date: date
    notes: Optional[str] = None


class TransactionCreate(TransactionBase):
    user_id: int


class TransactionUpdate(BaseModel):
    user_id: Optional[int] = None
    amount: Optional[float] = Field(default=None, gt=0)
    type: Optional[TransactionType] = None
    category: Optional[str] = Field(default=None, min_length=2, max_length=120)
    date: Optional[date] = None
    notes: Optional[str] = None


class TransactionOut(BaseModel):
    id: int
    user_id: int
    amount: float
    type: TransactionType
    category: str
    date: date
    notes: Optional[str]
    is_deleted: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
