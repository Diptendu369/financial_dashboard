from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.middleware.auth import hash_password
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserStatusUpdate, UserUpdate


def create_user(db: Session, payload: UserCreate) -> User:
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "bad_request", "message": "Email already exists"},
        )
    user = User(
        name=payload.name,
        email=payload.email,
        password=hash_password(payload.password),
        role=payload.role,
        status=payload.status,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user: User, payload: UserUpdate) -> User:
    data = payload.model_dump(exclude_unset=True)
    if "email" in data and data["email"] != user.email:
        existing = db.query(User).filter(User.email == data["email"]).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"error": "bad_request", "message": "Email already exists"},
            )
    if "password" in data:
        data["password"] = hash_password(data["password"])
    for key, value in data.items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user


def update_user_status(db: Session, user: User, payload: UserStatusUpdate) -> User:
    user.status = payload.status
    db.commit()
    db.refresh(user)
    return user
