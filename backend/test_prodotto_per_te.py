import pytest
from fastapi.testclient import TestClient
from main import app, db_momenti_ops, db_product_profiles
from datetime import datetime

client = TestClient(app)

@pytest.fixture(autouse=True)
def reset_dbs():
    """Resetta i mock database prima di ogni test."""
    db_momenti_ops.clear()
    db_product_profiles.clear()
    yield

def test_log_momento_ops():
    """Verifica il salvataggio corretto di un record Momento Ops con trigger."""
    ops_data = {
        "user_id": "test_user_ppt",
        "trigger_type": "t2", # Risata
        "timestamp": datetime.now().isoformat()
    }
    
    response = client.post("/momenti-ops", json=ops_data)
    assert response.status_code == 200
    assert response.json()["message"] == "Momento Ops logged successfully"
    assert len(db_momenti_ops) == 1
    assert db_momenti_ops[0]["trigger_type"] == "t2"

def test_save_product_profile():
    """Verifica che il profilo prodotto venga salvato coi dati del questionario."""
    profile_data = {
        "user_id": "test_user_ppt",
        "answers": {
            "q1": "Pochi giorni / Settimane",
            "q2": "Assorbenti",
            "q3": "Spesso (2-3 volte)"
        },
        "calculated_level": "L3",
        "timestamp": datetime.now().isoformat()
    }
    
    response = client.post("/product-profile", json=profile_data)
    assert response.status_code == 200
    assert response.json()["message"] == "Product profile saved successfully"
    assert len(db_product_profiles) == 1
    assert db_product_profiles[0]["calculated_level"] == "L3"
