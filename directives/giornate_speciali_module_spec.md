# Specifica Modulo "Giornate Speciali"

## Obiettivo
Fornire all'utente un supporto pratico, discreto e rassicurante durante eventi che alterano la routine quotidiana (es. sport intenso, viaggi lunghi), aiutandolo a gestire l'incontinenza senza stress e senza attirare l'attenzione.

## Flusso e UI Principale

### 1. Schermata Principale (Selezione Evento)
- **Titolo:** `CIAO MARIA! Oggi giornata speciale!`
- **Testo introduttivo:** `SELEZIONA COSA TI ASPETTA OGGI e ti aiuteremo a prepararti al meglio!`
- **Opzioni (Card ampie con immagine di sfondo + overlay):**
  - **Giornata di sport intenso** (es. foto donna in abbigliamento sportivo/corsa).
  - **Viaggio o spostamento lungo** (es. foto aerea, mappa, passaporto).

### 2. Schermata: Giornata di sport intenso
- **Intestazione:** `Giornata di sport intenso` accompagnata da un'icona tematica (es. donna che salta la corda).
- **Sezione Consigli (`ECCO QUALCHE CONSIGLIO:`):**
  - Mostra una checklist fissa/dinamica basata sulla selezione:
    - ✅ Recati al bagno 15-20 min prima dell'attività.
    - ✅ Usa un prodotto più protettivo di quello che usi di solito (1 o 2 gocce in più).
    - ✅ Evita caffè e bevande gasate prima dell'allenamento.
    - ✅ Simula a casa qualche movimento più "estremo" per verificare la stabilità dell'assorbente/Pant.
    - ✅ Utilizza leggins/abbigliamento sportivo scuro ed aderente.

### 3. Schermata: Viaggio o spostamento lungo
- **Intestazione:** `Viaggio` accompagnata da un'icona tematica (es. aereo sul mondo).
- **Sezione Consigli (`ECCO QUALCHE CONSIGLIO:`):**
  - ✅ Pianifica le soste ogni 2-3 ore.
  - ✅ Idrati a piccoli sorsi.
  - ✅ Evita caffè e bevande gasate durante il viaggio.
  - ✅ Vestiti comodo ed evita pressione nella zona inguinale.
  - ✅ Prepara il tuo kit cambio, con 2-3 prodotti, salviettine e un cambio leggero.
- **Funzionalità Timer di Viaggio:**
  - Pulsante circolare evidente: `START!`
  - Testo esplicativo accanto: `ATTIVA IL TIMER QUANDO INIZIA IL TUO VIAGGIO! POTRAI GODERTELO IN SERENITA' E TI INVIEREMO NOI UNA NOTIFICA "DISCRETA" TRA 1H 30' PER PIANIFICARE LA PROSSIMA SOSTA!`
  - **Logica Timer:** Monitora la lunghezza del viaggio (es. auto/treno). Innesca notifiche discrete ogni 60-90 minuti con testi neutri (es. *"E' quasi ora di sgranchirsi un po' le gambe!"*).
  - **Feedback aptico/silenzioso:** Come descritto nelle linee guida di design, in modo da non attirare l'attenzione di chi viaggia insieme.

## Toni e Stile
- **Rassicurante e Pratico:** L'app deve far sentire l'utente preparato e in controllo.
- **Assolutamente Discreto:** La privacy è la priorità assoluta, specialmente per le funzionalità di lockscreen, notifica timer e compagno di viaggio.
- **Interfaccia Pulita:** Iconografia chiara, palette colori premium, testuale chiaro basato sui font di brand.
