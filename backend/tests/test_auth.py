"""
JWT Authentication Tests

Tests for the JWT verification endpoint and middleware.
Covers:
- Valid token verification
- Expired token handling
- Invalid signature handling
- Missing Authorization header handling

@see US4: Backend JWT Verification
"""

import time
from datetime import datetime, timedelta, timezone

import jwt
import pytest
from httpx import AsyncClient, ASGITransport

from src.main import app
from src.config import get_settings


# Get settings for test configuration
settings = get_settings()


def create_test_token(
    user_id: str = "test-user-123",
    email: str = "test@example.com",
    expired: bool = False,
    invalid_secret: bool = False,
) -> str:
    """
    Create a JWT token for testing.

    Args:
        user_id: User ID to include in token
        email: Email to include in token
        expired: If True, create an expired token
        invalid_secret: If True, sign with wrong secret

    Returns:
        JWT token string
    """
    now = datetime.now(timezone.utc)

    if expired:
        exp = now - timedelta(hours=1)  # Expired 1 hour ago
    else:
        exp = now + timedelta(hours=24)  # Valid for 24 hours

    payload = {
        "sub": user_id,
        "email": email,
        "iat": now,
        "exp": exp,
    }

    secret = "wrong-secret" if invalid_secret else settings.BETTER_AUTH_SECRET

    return jwt.encode(payload, secret, algorithm="HS256")


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.mark.anyio
async def test_verify_valid_token():
    """Test successful JWT verification with valid token."""
    token = create_test_token()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(
            "/api/auth/verify",
            headers={"Authorization": f"Bearer {token}"},
        )

    assert response.status_code == 200
    data = response.json()
    assert data["authenticated"] is True
    assert data["user_id"] == "test-user-123"
    assert data["email"] == "test@example.com"


@pytest.mark.anyio
async def test_verify_expired_token():
    """Test 401 response for expired token."""
    token = create_test_token(expired=True)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(
            "/api/auth/verify",
            headers={"Authorization": f"Bearer {token}"},
        )

    assert response.status_code == 401
    data = response.json()
    assert "expired" in data["detail"].lower()


@pytest.mark.anyio
async def test_verify_invalid_signature():
    """Test 401 response for token signed with wrong secret."""
    token = create_test_token(invalid_secret=True)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(
            "/api/auth/verify",
            headers={"Authorization": f"Bearer {token}"},
        )

    assert response.status_code == 401
    data = response.json()
    assert "invalid" in data["detail"].lower() or "signature" in data["detail"].lower()


@pytest.mark.anyio
async def test_verify_missing_authorization_header():
    """Test 401 response when Authorization header is missing."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/auth/verify")

    assert response.status_code == 401
    data = response.json()
    assert "missing" in data["detail"].lower() or "authorization" in data["detail"].lower()


@pytest.mark.anyio
async def test_verify_invalid_bearer_format():
    """Test 401 response when Authorization header has wrong format."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(
            "/api/auth/verify",
            headers={"Authorization": "InvalidFormat token123"},
        )

    assert response.status_code == 401
    data = response.json()
    assert "invalid" in data["detail"].lower() or "format" in data["detail"].lower()


@pytest.mark.anyio
async def test_verify_empty_token():
    """Test 401 response when token is empty."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(
            "/api/auth/verify",
            headers={"Authorization": "Bearer "},
        )

    assert response.status_code == 401


@pytest.mark.anyio
async def test_verify_malformed_token():
    """Test 401 response for malformed token."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(
            "/api/auth/verify",
            headers={"Authorization": "Bearer not.a.valid.jwt.token"},
        )

    assert response.status_code == 401
    data = response.json()
    assert "invalid" in data["detail"].lower()


@pytest.mark.anyio
async def test_health_check_no_auth_required():
    """Verify health check endpoint doesn't require authentication."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
