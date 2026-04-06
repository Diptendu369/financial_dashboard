from collections import defaultdict

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.transaction import Transaction, TransactionType


def get_summary(db: Session):
    income = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0.0))
        .filter(Transaction.type == TransactionType.income, Transaction.is_deleted.is_(False))
        .scalar()
    )
    expense = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0.0))
        .filter(Transaction.type == TransactionType.expense, Transaction.is_deleted.is_(False))
        .scalar()
    )
    return {"total_income": float(income), "total_expense": float(expense), "net_balance": float(income - expense)}


def get_category_summary(db: Session):
    rows = (
        db.query(Transaction.category, func.coalesce(func.sum(Transaction.amount), 0.0))
        .filter(Transaction.is_deleted.is_(False))
        .group_by(Transaction.category)
        .all()
    )
    typed_rows = (
        db.query(
            Transaction.type,
            Transaction.category,
            func.coalesce(func.sum(Transaction.amount), 0.0),
        )
        .filter(Transaction.is_deleted.is_(False))
        .group_by(Transaction.type, Transaction.category)
        .all()
    )
    income_categories = []
    expense_categories = []
    for tx_type, category, total in typed_rows:
        item = {"category": category, "total": float(total)}
        if tx_type == TransactionType.income:
            income_categories.append(item)
        elif tx_type == TransactionType.expense:
            expense_categories.append(item)

    return {
        "categories": [{"category": r[0], "total": float(r[1])} for r in rows],
        "income_categories": income_categories,
        "expense_categories": expense_categories,
    }


def get_monthly_trend(db: Session):
    dialect = db.bind.dialect.name if db.bind else ""
    month_expr = (
        func.strftime("%Y-%m", Transaction.date).label("month")
        if dialect == "sqlite"
        else func.to_char(Transaction.date, "YYYY-MM").label("month")
    )

    rows = (
        db.query(
            month_expr,
            Transaction.type,
            func.coalesce(func.sum(Transaction.amount), 0.0),
        )
        .filter(Transaction.is_deleted.is_(False))
        .group_by(month_expr, Transaction.type)
        .order_by(month_expr)
        .all()
    )
    monthly = defaultdict(lambda: {"income": 0.0, "expense": 0.0})
    for month, tx_type, total in rows:
        monthly[month][tx_type.value] = float(total)
    return {
        "monthly": [
            {"month": m, "income": values["income"], "expense": values["expense"]}
            for m, values in monthly.items()
        ]
    }


def get_recent_activity(db: Session, limit: int = 10):
    rows = (
        db.query(Transaction)
        .filter(Transaction.is_deleted.is_(False))
        .order_by(Transaction.created_at.desc())
        .limit(limit)
        .all()
    )
    return {
        "activities": [
            {
                "id": row.id,
                "amount": float(row.amount),
                "type": row.type.value,
                "category": row.category,
                "date": row.date,
                "notes": row.notes,
            }
            for row in rows
        ]
    }
