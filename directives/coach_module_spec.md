# Specifiche Modulo COACH (Pavimento Pelvico + Core)

Questo documento definisce le direttive per lo sviluppo e l'orchestrazione del modulo "**Coach**", dedicato all'allenamento del pavimento pelvico e del core. 

## 1. Personalizzazione Progressiva
- **Baseline Test Iniziale**: L'onboarding del modulo prevede un test di baseline di 3 minuti.
- **Livelli di Difficoltà**: Il percorso si divide in Livelli dall'1 al 5.
- **Progressione Automatica**: L'incremento della difficoltà (aumento delle ripetizioni o salto di livello) avviene *solo* se l'utente completa almeno l'80% delle sessioni previste nella settimana corrente. In caso contrario, il livello viene mantenuto per consolidare l'abitudine senza frustrazione.

## 2. Micro-sessioni Flessibili
- **Formato**: Gli esercizi devono essere erogati in formato "micro", della durata di 1-3 minuti ciascuno.
- **Distribuzione**: Prevedere 3-5 micro-esercizi distribuiti lungo l'arco della giornata.
- **Obiettivo**: Ridurre l'attrito iniziale, inserire l'esercizio nella quotidianità e "normalizzare" la pratica per renderla un'abitudine sostenibile.

## 3. Biofeedback "Povero" (Accessibile)
- **Zero Hardware Esterno**: Non è richiesto alcun dispositivo hardware opzionale.
- **Interfaccia Tattile/Sonora (Metronomo)**: 
  - La guida agli esercizi (contrazione/rilascio) viene fornita tramite pattern di vibrazione (Haptic Feedback) e/o segnali sonori discreti.
  - Esempio di pattern: **Vibrazione breve** = "Contrai", **Vibrazione lunga** = "Rilascia".
- **Discrezione**: Sostituisce i conti alla rovescia rumorosi o eccessivamente visibili, consentendo la pratica anche in ambienti pubblici, e mantiene l'interfaccia pulita.

## 4. Adaptive Scheduling (Riprogrammazione Intelligente)
- **Logica di Riprogrammazione**: Se il sistema rileva che l'utente salta la stessa sessione (es. delle ore 11:00) per 2 volte consecutive.
- **Intervento Attivo**: Il sistema sposta automaticamente la notifica e la sessione in una fascia oraria successiva (es. alle 12:30).
- **Consenso dell'Utente**: Deve essere richiesta approvazione tramite una notifica gentile. Esempio di copy: *"Ti va di provarla a quest'ora per i prossimi 3 giorni?"*

## 5. Linee Guida di Sicurezza e Tono di Voce (Safety)
- **Promemoria Respiro**: Inserire alert e reminder periodici e rassicuranti sul mantenimento di una corretta respirazione (non andare in apnea).
- **Nessuno Sforzo Eccessivo**: Invitare l'utente a non forzare mai.
- **Logica di Stop**: Fornire sempre l'indicazione chiara di fermarsi immediatamente in caso di dolore.
- **Tono di Voce**: Non-clinico, informale, rassicurante e orientato al well-being (in linea con le indicazioni UX previste per l'app intera). Evitare terminologie strettamente mediche o allarmanti.
