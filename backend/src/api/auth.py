"""
Authentication API routes for the backend application.

This module provides authentication-related endpoints:
- /api/auth/verify: Verify JWT token and return user info

@see US4: Backend JWT Verification
"""

from fastapi import APIRouter

from src.middleware.auth import CurrentUser


# Create router for auth endpoints
router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.get("/verify")
async def verify_token(current_user: CurrentUser) -> dict:
    """
    Verify JWT token and return user information.

    This endpoint verifies the JWT token in the Authorization header
    and returns the authenticated user's information.

    Args:
        current_user: Authenticated user from JWT (injected by dependency)

    Returns:
        dict: User information including:
            - authenticated: Always true if endpoint is reached
            - user_id: User's unique identifier
            - email: User's email address
    """
    return {
        "authenticated": True,
        "user_id": current_user["user_id"],
        "email": current_user.get("email"),
    }
