# Direttiva Modulo: "Oggi mi sento" (Umore & Idratazione + Chat)

## 1. Obiettivo del Modulo
Creare uno spazio rassicurante e sicuro dove l'utente possa tracciare il proprio stato d'animo e l'idratazione giornaliera, interagendo parallelamente in una community protetta. L'esperienza UX deve essere rapida (massimo attrito ridotto: "in 2 tap"), non giudicante, e costantemente basata su rinforzi positivi ("nudge") per normalizzare la condizione e ridurre l'isolamento.

## 2. Architettura delle Funzionalità Core (Cosa Fare)

### 2.1 Tracciamento Mood (In 2 tap)
- **Input Rapido:**
  - **5 Emoji Rassicuranti:** Elementi visivi chiari per mappare lo spettro base (es. Sereno, Ok, Giù, Ansioso, Frustrato).
  - **Tag Rapido:** Un selettore di chip o tag veloci (es. “ansia”, “ok”, “energico”, "sfida").
- **Diario Emotivo (Opzionale):** 
  - Input testuale breve, vincolato a un massimo di **140 caratteri** (modello sfogo breve).
- **Output:** Salvataggio a DB con timestamp, utile a generare summary settimanali sul benessere.

### 2.2 Idratazione Smart
L'idratazione è cruciale per la gestione delle perdite e del pavimento pelvico.
- **Inserimento Rapido Stime:** 
  - Preset visivi a pulsante (es. icona "Bicchiere d'acqua ~200 ml", icona "Lattina/Bottiglietta ~33 cl").
- **Funzionalità di Calibrazione Personale (Opzionale):**
  - Possibilità di *tarare il "proprio" standard* scattando (o caricando) una foto del bicchiere/borraccia più usata dall'utente.
- **Output:** Progressione giornaliera circolare o a "riempimento liquido" verso il target consigliato, con feedback di complimenti gentili al raggiungimento dei macro-step.

### 2.3 Community Protetta (Chat & Topic Rooms)
- **Sicurezza by Design (Anti-Abuso):**
  - **Solo Pseudonimi:** L'identità reale non viene mai esposta. Username/Avatar generati casualmente o scelti tramite alias (PandaFelice, ecc).
  - **Nessun DM 1:1 Inizialmente:** Per disincentivare spam, predatori o disagi non filtrati, i messaggi diretti privati tra singoli sono bloccati al lancio.
- **Le "Topic Room" (Stanze Tematiche):**
  - Invece di un feed caotico e unico, raggruppare i post per argomenti specifici per contestualizzare la condivisione:
    - *“Prime settimane”*
    - *“Sport e Movimento”*
    - *“Viaggio con meno stress”*
    - *“Day by day”*
- **Moderazione Strutturata:**
  - *Pre-Moderazione Automatica:* Filtro con blacklist terminologica/NLP leggero per bloccare parole esplicite, insulti o profanity *prima* di scriverle a DB.
  - *Post-Moderazione:* Tasto per ogni card per segnalare agli amministratori.
  - *Rate Limit:* Limitare la frequenza di post per evitare account spam o flood compulsivi.

### 2.4 Nudge Positivo e Community Sana
- **Assenza di Classifiche Competitive:** Niente leaderboard o logiche performanti (stressogene in campo salute).
- **Badge “Spirito Gentile”:** 
  - Meccanica di *rewarding qualitativo*. Viene assegnato automaticamente dagli algoritmi (o dalla quantità di reaction utili) agli utenti che offrono supporto, condividono tips positivi o mantengono toni rassicuranti nei thread. Aiuta a promuovere comportamento pro-sociale.

### 2.5 Privacy by Default
- **Opt-in Esplicito:** Se l'utente decide di pubblicare una storia/post, il processo *non* deve esser dato per scontato. Conferma chiara e doppio step: switch / checkbox obbligatoria.
- **Trasparenza UX:** Vicino a ogni bottone di pubblicazione serve una macro-etichetta che rassicura: *"Questo messaggio apparirà col tuo pseudonimo. Nessuno vedrà il tuo vero nome o foto."*

## 3. Direttive Implementazione (Backend & Frontend)

**Frontend (React/Next.js/Tailwind):**
- UI tonde, morbide. Usa i colori del `brand-guidelines.md` con contrasti rassicuranti (niente allarmi rossi esagerati).
- Il counter da 140 caratteri deve comparire senza creare stress (es. appare in grigio solo dopo i 100 char inseriti).
- Transizioni fluide per il tracciamento rapido (tap sull'emoji -> tick checkmark immediato).

**Backend (FastAPI/Python):**
- Script su `.execution/` necessari:
  - `profanity_filter.py`: script basato su regex o liste bloccate da eseguire prima del salvataggio nel database sul testo generato nella community.
  - Check Redis o logica in-memory (Rate limit middleware via FastAPI o simile).
- Endpoint isolati: `POST /mood`, `POST /hydration`, `GET /rooms/{room_id}/feed`.

## 4. Casi Limite
1. **Filtro profanity triggerato:** L'app restituisce un error code soft. La UI non banna subito ma risponde: *"Sembra che alcune parole non rispettino lo spirito gentile della community. Prova a modificarle."*
2. **Foto bicchiere fuori standard:** L'applicherà un ritaglio quadrato sicuro a fronte del caricamento, riducendo l'immagine (compressione client-side prima del caricamento per risparmiare risorse).
