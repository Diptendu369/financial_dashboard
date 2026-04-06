from datetime import date

from app.database.db import Base, db_context, engine
from app.middleware.auth import hash_password
from app.models.transaction import Transaction, TransactionType
from app.models.user import User, UserRole, UserStatus


def run():
    Base.metadata.create_all(bind=engine)
    with db_context() as db:
        if db.query(User).count() > 0:
            print("Seed skipped: users already exist.")
            return

        admin = User(
            name="System Admin",
            email="admin@example.com",
            password=hash_password("admin123"),
            role=UserRole.admin,
            status=UserStatus.active,
        )
        analyst = User(
            name="Finance Analyst",
            email="analyst@example.com",
            password=hash_password("analyst123"),
            role=UserRole.analyst,
            status=UserStatus.active,
        )
        viewer = User(
            name="Finance Viewer",
            email="viewer@example.com",
            password=hash_password("viewer123"),
            role=UserRole.viewer,
            status=UserStatus.active,
        )
        db.add_all([admin, analyst, viewer])
        db.flush()

        db.add_all(
            [
                Transaction(
                    user_id=admin.id,
                    amount=5000,
                    type=TransactionType.income,
                    category="salary",
                    date=date(2026, 1, 5),
                    notes="January salary",
                ),
                Transaction(
                    user_id=admin.id,
                    amount=1200,
                    type=TransactionType.expense,
                    category="rent",
                    date=date(2026, 1, 7),
                    notes="Monthly house rent",
                ),
                Transaction(
                    user_id=analyst.id,
                    amount=800,
                    type=TransactionType.expense,
                    category="food",
                    date=date(2026, 1, 10),
                    notes="Groceries and dining",
                ),
            ]
        )
        db.commit()
        print("Seed completed.")


if __name__ == "__main__":
    run()
