from fastapi import Depends, HTTPException, status

from app.middleware.auth import get_current_user
from app.models.user import User, UserRole


def require_roles(*roles: UserRole):
    def checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"error": "forbidden", "message": "Insufficient permissions"},
            )
        return current_user

    return checker
