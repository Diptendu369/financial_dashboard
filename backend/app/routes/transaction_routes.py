from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.middleware.role import require_roles
from app.models.transaction import Transaction
from app.models.user import UserRole
from app.schemas.transaction_schema import TransactionCreate, TransactionOut, TransactionUpdate
from app.services.transaction_service import create_transaction, query_transactions, update_transaction

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("", response_model=TransactionOut, dependencies=[Depends(require_roles(UserRole.admin))])
def create_transaction_route(payload: TransactionCreate, db: Session = Depends(get_db)):
    return create_transaction(db, payload)


@router.get(
    "",
    response_model=list[TransactionOut],
    dependencies=[Depends(require_roles(UserRole.admin, UserRole.analyst))],
)
def list_transactions(
    db: Session = Depends(get_db),
    type: Optional[str] = None,
    category: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    search: Optional[str] = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
):
    query = query_transactions(db, type, category, start_date, end_date, search)
    offset = (page - 1) * limit
    return query.offset(offset).limit(limit).all()


@router.get(
    "/{transaction_id}",
    response_model=TransactionOut,
    dependencies=[Depends(require_roles(UserRole.admin, UserRole.analyst))],
)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.is_deleted.is_(False)).first()
    if not transaction:
        raise HTTPException(status_code=404, detail={"error": "not_found", "message": "Transaction not found"})
    return transaction


@router.put("/{transaction_id}", response_model=TransactionOut, dependencies=[Depends(require_roles(UserRole.admin))])
def update_transaction_route(transaction_id: int, payload: TransactionUpdate, db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.is_deleted.is_(False)).first()
    if not transaction:
        raise HTTPException(status_code=404, detail={"error": "not_found", "message": "Transaction not found"})
    return update_transaction(db, transaction, payload)


@router.delete("/{transaction_id}", dependencies=[Depends(require_roles(UserRole.admin))])
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.is_deleted.is_(False)).first()
    if not transaction:
        raise HTTPException(status_code=404, detail={"error": "not_found", "message": "Transaction not found"})
    transaction.is_deleted = True
    db.commit()
    return {"message": "Transaction deleted"}
