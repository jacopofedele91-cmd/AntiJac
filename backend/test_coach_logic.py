import pytest
from datetime import datetime, timedelta
from main import (
    app, 
    db_users, 
    db_sessions, 
    UserProgress, 
    check_level_progression, 
    handle_missed_session
)
from fastapi.testclient import TestClient

client = TestClient(app)

@pytest.fixture(autouse=True)
def reset_db():
    """Resetta il database mock prima di ogni test."""
    db_sessions.clear()
    db_users.clear()
    db_users["test_user"] = UserProgress(
        user_id="test_user",
        current_level=1,
        sessions_this_week=0,
        target_sessions=21, # 3 micro-sessioni * 7 gg
        consecutive_skips=0
    )
    yield

def test_level_progression_success():
    """Verifica che un completamento >= 80% faccia avanzare di livello."""
    user = db_users["test_user"]
    user.current_level = 1
    # 80% di 21 = 16.8, facciamo 17 sessioni
    user.sessions_this_week = 17 
    
    check_level_progression("test_user")
    
    assert user.current_level == 2 # Livello aumentato
    assert user.sessions_this_week == 0 # Progressi settimana resettati

def test_level_progression_failure():
    """Verifica che un completamento < 80% NON faccia avanzare di livello."""
    user = db_users["test_user"]
    user.current_level = 1
    # Sotto l'80%, es. 10 sessioni
    user.sessions_this_week = 10 
    
    check_level_progression("test_user")
    
    assert user.current_level == 1 # Livello mantenuto per consolidamento
    assert user.sessions_this_week == 10 # Progressi NON resettati, mantiene continuità

def test_level_progression_max_level():
    """Verifica che il livello non superi il massimo consentito (5)."""
    user = db_users["test_user"]
    user.current_level = 5
    user.sessions_this_week = 21 # 100% completamento
    
    check_level_progression("test_user")
    
    assert user.current_level == 5 # Resta a livello 5 (cap massimo)
    assert user.sessions_this_week == 0 # Ma le sessioni vengono resettate

def test_adaptive_scheduling_no_shift():
    """Verifica che con 1 solo skip NON si attivi lo shift."""
    user = db_users["test_user"]
    user.consecutive_skips = 0
    scheduled_time = datetime(2026, 3, 10, 11, 0, 0)
    
    proposed_time = handle_missed_session("test_user", scheduled_time)
    
    assert proposed_time is None
    assert user.consecutive_skips == 1 # Skip incrementato ma no shift

def test_adaptive_scheduling_with_shift():
    """Verifica che con 2 skip consecutivi si attivi lo shift (+1.5 ore) e si resettino gli skip."""
    user = db_users["test_user"]
    user.consecutive_skips = 1 # Era già a 1 skip
    scheduled_time = datetime(2026, 3, 11, 11, 0, 0) # Ore 11:00
    
    proposed_time = handle_missed_session("test_user", scheduled_time)
    
    # 11:00 + 1.5h = 12:30
    expected_time = scheduled_time + timedelta(hours=1, minutes=30)
    
    assert proposed_time is not None
    assert proposed_time == expected_time
    assert user.consecutive_skips == 0 # Skip resettati dopo la proposta
