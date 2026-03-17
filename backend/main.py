from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime, timedelta
import os
import sys

# Aggiunge la cartella execution al path per importare lo script python
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'execution')))
try:
    from profanity_filter import check_profanity
except ImportError:
    # Fallback se non trovato
    def check_profanity(text): return False

app = FastAPI(title="Inclusive Health App API")

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Modelli Pydantic ---
class SessionCreate(BaseModel):
    user_id: str
    duration_minutes: int
    completed_at: datetime
    scheduled_for: datetime
    level: int

class Session(SessionCreate):
    id: str

class UserProgress(BaseModel):
    user_id: str
    current_level: int
    sessions_this_week: int
    target_sessions: int = 21 # 3 micro-sessioni al giorno * 7 giorni
    next_scheduled_session: Optional[datetime] = None
    consecutive_skips: int = 0

class RescheduleRequest(BaseModel):
    user_id: str
    original_time: datetime
    proposed_time: datetime

# --- Modelli Pydantic (Oggi Mi Sento) ---
class MoodCreate(BaseModel):
    user_id: str
    mood_id: str
    tags: List[str] = []
    note: Optional[str] = None
    timestamp: datetime

class HydrationAdd(BaseModel):
    user_id: str
    amount_ml: int
    timestamp: datetime

class CommunityPostCreate(BaseModel):
    user_id: str
    author_pseudonym: str
    room_id: str
    content: str

class CommunityPost(CommunityPostCreate):
    id: str
    likes: int
    timestamp: datetime

class SpecialEventLog(BaseModel):
    user_id: str
    event_type: str # es. "sport", "viaggio"
    timestamp: datetime

# --- Modelli Pydantic (Prodotto Per Te) ---
class MomentoOpsLog(BaseModel):
    user_id: str
    trigger_type: str
    timestamp: datetime

class ProductProfileCreate(BaseModel):
    user_id: str
    answers: Dict[str, str | List[str]]
    calculated_level: str
    timestamp: datetime


# --- Mock Database ---
# Utilizziamo dizionari in memoria per questo prototipo
db_sessions: List[Session] = []
db_users: dict[str, UserProgress] = {
    # Un utente fittizio di base
    "user_123": UserProgress(
        user_id="user_123",
        current_level=1,
        sessions_this_week=10,
        target_sessions=21,
        consecutive_skips=0
    )
}

# --- Mock Database (Oggi Mi Sento) ---
db_moods: List[dict] = []
db_hydration: Dict[str, int] = {} # user_id -> ml_today
db_community_posts: List[CommunityPost] = [
    CommunityPost(
        id="p1", 
        user_id="user_999", 
        author_pseudonym="PandaFelice", 
        room_id="1", 
        content="Oggi ho completato le mie prime 3 micro-sessioni! Non pensavo sarebbe stato così semplice.", 
        likes=12, 
        timestamp=datetime.now() - timedelta(hours=2)
    )
]
db_special_events: List[dict] = []

# --- Mock Database (Prodotto Per Te) ---
db_momenti_ops: List[dict] = []
db_product_profiles: List[dict] = []


# --- Logiche di Business (Coach Module) ---

def check_level_progression(user_id: str):
    """
    SOP Rule: ≥80% completion weekly incrementa il livello.
    """
    user = db_users.get(user_id)
    if not user:
        return
    
    completion_rate = user.sessions_this_week / user.target_sessions
    if completion_rate >= 0.8:
        user.current_level = min(5, user.current_level + 1)
        # Resetta le sessioni della settimana dopo l'avanzamento
        user.sessions_this_week = 0 

def handle_missed_session(user_id: str, scheduled_time: datetime):
    """
    SOP Rule: Adaptive Scheduling. 2 skip consecutivi = propone shift orario.
    """
    user = db_users.get(user_id)
    if not user:
        return None
    
    user.consecutive_skips += 1
    
    if user.consecutive_skips >= 2:
        # Trova la prossima fascia oraria "sicura" (es. +1.5 ore)
        new_proposed_time = scheduled_time + timedelta(hours=1, minutes=30)
        # Resetta gli skip dopo aver proposto lo spostamento
        user.consecutive_skips = 0
        return new_proposed_time
    
    return None

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Inclusive Health App Backend - Running"}

@app.post("/coach/session")
def record_session(session_data: SessionCreate):
    """Registra una sessione di allenamento completata."""
    new_id = f"sess_{len(db_sessions) + 1}"
    new_session = Session(**session_data.model_dump(), id=new_id)
    db_sessions.append(new_session)
    
    # Aggiorna progressi utente
    user = db_users.get(session_data.user_id)
    if not user:
        user = UserProgress(
            user_id=session_data.user_id,
            current_level=session_data.level,
            sessions_this_week=0
        )
        db_users[session_data.user_id] = user
        
    user.sessions_this_week += 1
    user.consecutive_skips = 0 # reset skips if completed
    
    # Controlla se avanza di livello
    check_level_progression(session_data.user_id)
    
    return {"message": "Session recorded successfully", "session": new_session, "user_progress": user}


@app.get("/coach/progress/{user_id}")
def get_progress(user_id: str):
    """Invia al frontend il progresso e il livello attuale dell'utente."""
    user = db_users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    completion_percentage = (user.sessions_this_week / user.target_sessions) * 100
    
    return {
        "user_id": user.user_id,
        "current_level": user.current_level,
        "sessions_completed": user.sessions_this_week,
        "progress_percentage": round(completion_percentage, 1),
        "needs_reschedule_prompt": False
    }

@app.post("/coach/evaluate-missed/{user_id}")
def evaluate_missed_session(user_id: str, scheduled_time: datetime):
    """
    Endpoint chiamato dal backend o client quando una notifica scade ed è ignorata.
    Verifica se serve applicare l'Adaptive Scheduling.
    """
    proposed_time = handle_missed_session(user_id, scheduled_time)
    if proposed_time:
        return {
            "action": "prompt_reschedule",
            "message": "Ti va di provarla a quest'ora per i prossimi 3 giorni?",
            "proposed_time": proposed_time
        }
    return {"action": "none"}

@app.post("/coach/reschedule")
def confirm_reschedule(req: RescheduleRequest):
    """Conferma il nuovo orario per l'Adaptive Scheduling."""
    user = db_users.get(req.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.next_scheduled_session = req.proposed_time
    return {"message": "Rescheduled successfully", "new_time": user.next_scheduled_session}

# --- Endpoints (Oggi Mi Sento) ---

@app.post("/mood")
def record_mood(mood_data: MoodCreate):
    """Registra l'umore dell'utente."""
    record = mood_data.model_dump()
    db_moods.append(record)
    return {"message": "Mood recorded successfully", "record": record}

@app.post("/hydration")
def add_hydration(hydration_data: HydrationAdd):
    """Aggiunge idratazione al totale giornaliero dell'utente."""
    current_ml = db_hydration.get(hydration_data.user_id, 0)
    new_total = current_ml + hydration_data.amount_ml
    db_hydration[hydration_data.user_id] = new_total
    
    return {
        "message": "Hydration recorded successfully", 
        "amount_added": hydration_data.amount_ml,
        "total_today": new_total
    }

@app.get("/rooms/{room_id}/feed")
def get_room_feed(room_id: str):
    """Recupera i post di una specifica stanza, ordinati dal più recente."""
    posts = [p for p in db_community_posts if p.room_id == room_id]
    posts.sort(key=lambda x: x.timestamp, reverse=True)
    return posts

@app.post("/rooms/{room_id}/post")
def create_community_post(room_id: str, post_data: CommunityPostCreate):
    """Crea un nuovo post in una stanza. Include un Profanity Check (Pre-Moderazione)."""
    
    # 1. Utilizza lo script Python "deterministico" di Livello 3 per validare il testo
    if check_profanity(post_data.content):
        raise HTTPException(
            status_code=400, 
            detail="Sembra che alcune parole non rispettino lo spirito gentile della community. Prova a modificarle."
        )
        
    # 2. Crea e salva il post se la validazione è superata
    new_post = CommunityPost(
        **post_data.model_dump(),
        id=f"p{len(db_community_posts) + 1}",
        likes=0,
        timestamp=datetime.now()
    )
    db_community_posts.append(new_post)
    
    return {"message": "Post created successfully", "post": new_post}

@app.post("/special-events")
def log_special_event(event_data: SpecialEventLog):
    """Traccia in forma anonima l'inizio di una giornata speciale per l'utente."""
    record = event_data.model_dump()
    db_special_events.append(record)
    return {"message": "Event logged successfully", "record": record}

# --- Endpoints (Prodotto Per Te) ---

@app.post("/momenti-ops")
def log_momento_ops(ops_data: MomentoOpsLog):
    """Traccia un 'Momento Ops' specificando il trigger scatentante."""
    record = ops_data.model_dump()
    db_momenti_ops.append(record)
    
    # ESEMPIO: Se superati N momenti ops nell'ultimo mese, il sistema frontend/backend 
    # potrebbe inviare una push notification per lo 'Smart Advice' consigliando un nuovo livello.
    
    return {"message": "Momento Ops logged successfully", "record": record}

@app.post("/product-profile")
def save_product_profile(profile_data: ProductProfileCreate):
    """Salva i risultati del questionario iniziale del prodotto."""
    record = profile_data.model_dump()
    db_product_profiles.append(record)
    return {"message": "Product profile saved successfully", "record": record}

