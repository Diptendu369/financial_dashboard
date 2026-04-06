def register_and_login_admin(client):
    client.post(
        "/auth/register",
        json={"name": "Admin", "email": "admin2@test.com", "password": "admin123", "role": "admin"},
    )
    response = client.post("/auth/login", json={"email": "admin2@test.com", "password": "admin123"})
    return response.json()["access_token"]


def test_transaction_filter_and_search(client):
    token = register_and_login_admin(client)
    headers = {"Authorization": f"Bearer {token}"}

    client.post(
        "/transactions",
        headers=headers,
        json={
            "user_id": 1,
            "amount": 4000,
            "type": "income",
            "category": "salary",
            "date": "2026-01-05",
            "notes": "monthly salary",
        },
    )
    client.post(
        "/transactions",
        headers=headers,
        json={
            "user_id": 1,
            "amount": 500,
            "type": "expense",
            "category": "food",
            "date": "2026-01-06",
            "notes": "groceries",
        },
    )

    expense = client.get("/transactions?type=expense", headers=headers)
    assert expense.status_code == 200
    assert len(expense.json()) == 1
    assert expense.json()[0]["category"] == "food"

    search = client.get("/transactions?search=salary", headers=headers)
    assert search.status_code == 200
    assert len(search.json()) == 1
    assert search.json()[0]["type"] == "income"


def test_transaction_invalid_user_and_date_range(client):
    token = register_and_login_admin(client)
    headers = {"Authorization": f"Bearer {token}"}

    invalid_user = client.post(
        "/transactions",
        headers=headers,
        json={
            "user_id": 999,
            "amount": 100,
            "type": "expense",
            "category": "misc",
            "date": "2026-01-02",
            "notes": "invalid user",
        },
    )
    assert invalid_user.status_code == 400
    assert invalid_user.json()["error"] == "bad_request"

    invalid_range = client.get(
        "/transactions?start_date=2026-01-10&end_date=2026-01-01",
        headers=headers,
    )
    assert invalid_range.status_code == 400
    assert invalid_range.json()["error"] == "bad_request"
