def register_user(client, name, email, password, role):
    response = client.post(
        "/auth/register",
        json={"name": name, "email": email, "password": password, "role": role},
    )
    assert response.status_code == 200
    return response.json()


def login_user(client, email, password):
    response = client.post("/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200
    return response.json()


def test_refresh_and_logout_flow(client):
    tokens = register_user(client, "Admin", "admin@test.com", "admin123", "admin")
    refresh_token = tokens["refresh_token"]

    refreshed = client.post("/auth/refresh", json={"refresh_token": refresh_token})
    assert refreshed.status_code == 200
    assert "access_token" in refreshed.json()
    assert "refresh_token" in refreshed.json()

    logout = client.post("/auth/logout", json={"refresh_token": refreshed.json()["refresh_token"]})
    assert logout.status_code == 200

    after_logout = client.post("/auth/refresh", json={"refresh_token": refreshed.json()["refresh_token"]})
    assert after_logout.status_code == 401


def test_viewer_forbidden_from_transactions(client):
    register_user(client, "Viewer", "viewer@test.com", "viewer123", "viewer")
    tokens = login_user(client, "viewer@test.com", "viewer123")
    response = client.get("/transactions", headers={"Authorization": f"Bearer {tokens['access_token']}"})
    assert response.status_code == 403


def test_analyst_forbidden_from_transaction_write(client):
    register_user(client, "Analyst", "analyst@test.com", "analyst123", "analyst")
    tokens = login_user(client, "analyst@test.com", "analyst123")
    response = client.post(
        "/transactions",
        headers={"Authorization": f"Bearer {tokens['access_token']}"},
        json={
            "user_id": 1,
            "amount": 99,
            "type": "expense",
            "category": "food",
            "date": "2026-01-01",
            "notes": "not allowed",
        },
    )
    assert response.status_code == 403
