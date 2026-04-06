def register_and_login_admin(client):
    client.post(
        "/auth/register",
        json={"name": "Admin", "email": "dashadmin@test.com", "password": "admin123", "role": "admin"},
    )
    response = client.post("/auth/login", json={"email": "dashadmin@test.com", "password": "admin123"})
    return response.json()["access_token"]


def test_category_summary_separates_income_and_expense(client):
    token = register_and_login_admin(client)
    headers = {"Authorization": f"Bearer {token}"}

    client.post(
        "/transactions",
        headers=headers,
        json={
            "user_id": 1,
            "amount": 3000,
            "type": "income",
            "category": "salary",
            "date": "2026-01-05",
            "notes": "income row",
        },
    )
    client.post(
        "/transactions",
        headers=headers,
        json={
            "user_id": 1,
            "amount": 450,
            "type": "expense",
            "category": "salary",
            "date": "2026-01-06",
            "notes": "expense row with same category name",
        },
    )

    result = client.get("/dashboard/category-summary", headers=headers)
    assert result.status_code == 200
    payload = result.json()
    assert any(item["category"] == "salary" and item["total"] == 3000 for item in payload["income_categories"])
    assert any(item["category"] == "salary" and item["total"] == 450 for item in payload["expense_categories"])
