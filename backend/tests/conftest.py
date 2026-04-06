import os

import pytest
from fastapi.testclient import TestClient

os.environ["DATABASE_URL"] = "sqlite:///./test_finance.db"
os.environ["JWT_SECRET"] = "test-secret"

from app.database.db import Base, engine  # noqa: E402
from app.main import app  # noqa: E402
from app.models.refresh_token import RefreshToken  # noqa: F401, E402
from app.models.transaction import Transaction  # noqa: F401, E402
from app.models.user import User  # noqa: F401, E402


@pytest.fixture(autouse=True)
def reset_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def client():
    return TestClient(app)
