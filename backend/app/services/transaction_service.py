from datetime import date
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.transaction_schema import TransactionCreate, TransactionUpdate


def create_transaction(db: Session, payload: TransactionCreate) -> Transaction:
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "bad_request", "message": "Invalid user_id for transaction"},
        )
    transaction = Transaction(**payload.model_dump())
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


def update_transaction(db: Session, transaction: Transaction, payload: TransactionUpdate) -> Transaction:
    data = payload.model_dump(exclude_unset=True)
    if "user_id" in data:
        user = db.query(User).filter(User.id == data["user_id"]).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"error": "bad_request", "message": "Invalid user_id for transaction"},
            )
    for key, value in data.items():
        setattr(transaction, key, value)
    db.commit()
    db.refresh(transaction)
    return transaction


def query_transactions(
    db: Session,
    tx_type: Optional[str],
    category: Optional[str],
    start_date: Optional[date],
    end_date: Optional[date],
    search: Optional[str],
):
    query = db.query(Transaction).filter(Transaction.is_deleted.is_(False))
    if tx_type:
        query = query.filter(Transaction.type == tx_type)
    if category:
        query = query.filter(Transaction.category.ilike(f"%{category}%"))
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    if search:
        query = query.filter(
            or_(
                Transaction.category.ilike(f"%{search}%"),
                Transaction.notes.ilike(f"%{search}%"),
            )
        )
    return query.order_by(Transaction.date.desc())
