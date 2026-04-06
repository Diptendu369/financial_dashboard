from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.middleware.role import require_roles
from app.models.user import User, UserRole
from app.schemas.user_schema import UserCreate, UserOut, UserStatusUpdate, UserUpdate
from app.services.user_service import create_user, update_user, update_user_status

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("", response_model=UserOut, dependencies=[Depends(require_roles(UserRole.admin))])
def create_user_route(payload: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, payload)


@router.get("", response_model=list[UserOut], dependencies=[Depends(require_roles(UserRole.admin))])
def list_users(
    db: Session = Depends(get_db), page: int = Query(default=1, ge=1), limit: int = Query(default=10, ge=1, le=100)
):
    offset = (page - 1) * limit
    return db.query(User).order_by(User.id).offset(offset).limit(limit).all()


@router.get("/{user_id}", response_model=UserOut, dependencies=[Depends(require_roles(UserRole.admin))])
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail={"error": "not_found", "message": "User not found"})
    return user


@router.put("/{user_id}", response_model=UserOut, dependencies=[Depends(require_roles(UserRole.admin))])
def update_user_route(user_id: int, payload: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail={"error": "not_found", "message": "User not found"})
    return update_user(db, user, payload)


@router.patch("/{user_id}/status", response_model=UserOut, dependencies=[Depends(require_roles(UserRole.admin))])
def update_user_status_route(user_id: int, payload: UserStatusUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail={"error": "not_found", "message": "User not found"})
    return update_user_status(db, user, payload)


@router.delete("/{user_id}", dependencies=[Depends(require_roles(UserRole.admin))])
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail={"error": "not_found", "message": "User not found"})
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}
