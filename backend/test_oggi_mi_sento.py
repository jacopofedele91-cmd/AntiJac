import pytest
from fastapi.testclient import TestClient
from main import app, db_moods, db_hydration, db_community_posts
from datetime import datetime
import sys
import os

# Ensure the execution module is discoverable for the tests
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'execution')))

client = TestClient(app)

@pytest.fixture(autouse=True)
def reset_dbs():
    """Resetta i mock database prima di ogni test."""
    db_moods.clear()
    db_hydration.clear()
    db_community_posts.clear()
    yield

def test_record_mood():
    """Verifica il salvataggio corretto di un record mood."""
    mood_data = {
        "user_id": "test_user_mc",
        "mood_id": "1",
        "tags": ["Scintillante"],
        "note": "Una bellissima giornata!",
        "timestamp": datetime.now().isoformat()
    }
    
    response = client.post("/mood", json=mood_data)
    assert response.status_code == 200
    assert response.json()["message"] == "Mood recorded successfully"
    assert len(db_moods) == 1
    assert db_moods[0]["mood_id"] == "1"

def test_add_hydration():
    """Verifica che l'idratazione sia accumulata correttamente per l'utente."""
    hydration_data_1 = {
        "user_id": "test_user_hydro",
        "amount_ml": 200,
        "timestamp": datetime.now().isoformat()
    }
    
    hydration_data_2 = {
        "user_id": "test_user_hydro",
        "amount_ml": 300,
        "timestamp": datetime.now().isoformat()
    }
    
    # First entry
    res1 = client.post("/hydration", json=hydration_data_1)
    assert res1.status_code == 200
    assert res1.json()["total_today"] == 200
    
    # Second entry
    res2 = client.post("/hydration", json=hydration_data_2)
    assert res2.status_code == 200
    assert res2.json()["total_today"] == 500 # 200 + 300

def test_create_valid_community_post():
    """Verifica che un post senza parole sgradite venga salvato e restituito nel feed."""
    post_data = {
        "user_id": "test_user_comm",
        "author_pseudonym": "TestUser99",
        "room_id": "room_1",
        "content": "Ciao a tutti! Spero stiate passando una bella giornata."
    }
    
    # Creazione
    res_create = client.post("/rooms/room_1/post", json=post_data)
    assert res_create.status_code == 200
    assert res_create.json()["message"] == "Post created successfully"
    
    # Verifica Feed
    res_feed = client.get("/rooms/room_1/feed")
    assert res_feed.status_code == 200
    feed = res_feed.json()
    assert len(feed) == 1
    assert feed[0]["content"] == "Ciao a tutti! Spero stiate passando una bella giornata."
    assert feed[0]["author_pseudonym"] == "TestUser99"

def test_create_profane_community_post():
    """Verifica che un post contenente una parola della blacklist venga rifiutato con il messaggio soft."""
    post_data = {
        "user_id": "test_user_comm",
        "author_pseudonym": "TestUser99",
        "room_id": "room_1",
        "content": "Oggi è stata una giornata di merda in ufficio."
    }
    
    res_create = client.post("/rooms/room_1/post", json=post_data)
    # Assicura il fallimento
    assert res_create.status_code == 400
    # Assicura che la UI mostri il messaggio rassicurante e non un errore tecnico
    assert "Sembra che alcune parole non rispettino lo spirito gentile" in res_create.json()["detail"]
    
    # Verifica che il post NON sia finito nel feed
    res_feed = client.get("/rooms/room_1/feed")
    assert len(res_feed.json()) == 0
