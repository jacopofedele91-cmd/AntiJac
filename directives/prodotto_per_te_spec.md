# Specifiche Modulo PRODOTTO PER TE

Questo documento definisce le direttive per lo sviluppo e l'orchestrazione del modulo "**Prodotto per te**". L'obiettivo del modulo è fornire raccomandazioni personalizzate di prodotti, supportate da un monitoraggio amichevole e discreto, con l'algoritmo in grado di adattarsi dinamicamente alle reali esigenze nel tempo.

## 1. Schermata Iniziale (Solo al primo accesso)
Il questionario di ingresso deve essere veloce (**≤ 90 secondi**) e con **tono colloquiale, non giudicante ed empatico**. 

**Layout & UI:**
- **Header:** `CIAO MARIA!` con pulsante "Back" (freccia) in alto a destra.
- **Sottotitolo (Card o Banner):** `Dicci di Te!`

**Domande del Questionario:**
Il questionario presenta le domande in un'unica interfaccia a scorrimento o step consecutivi con questo testo esatto:

1. **Da quanto tempo registri episodi con piccole perdite ?**
2. **Fino ad oggi cosa hai usato per rimediare?**
   - Opzioni (Bottoni): `Proteggislip` / `Assorbenti` / `Nulla`
3. **Quante volte al giorno registri perdite ?**
4. **Conduci una vita dinamica (passeggiate, allenamenti, ecc)?**
   - Opzioni (Bottoni): `No` / `Poco` / `Molto`
5. **I tuoi piccoli momenti «ops» limitano in qualche modo le tue scelte di vita ?**
   - Opzioni (Bottoni): `No` / `Poco` / `Molto`

**Barra di Navigazione (Bottom Nav):**
Sempre presente e arrotondata, con icone allineate al design:
- 🏋️ Allenamento (Coach)
- 📅 Calendario (Oggi mi sento)
- ✈️ Aereo (Giornate speciali)
- 🔍 Lente di ingrandimento (Prodotto per te - Sezione Attiva evidenziata)

## 2. Dashboard Principale (Dopo il Questionario)
Una volta profilato l'utente, la schermata principale del modulo mostra le raccomandazioni e gli strumenti di tracking:

### Tasto Rigenerazione
- In alto alla view: `Abitudini cambiate? Ripeti il questionario!`
- Permette all'utente in qualsiasi momento di ri-calibrare il suo profilo rifacendo le domande.

### Card Raccomandazione Principale
- **Titolo:** `In base alle tue risposte, il prodotto adatto a te è:`
- **Risultato:** Mostra chiaramente la scatola/immagine del prodotto e il suo nome (es. *LINES SPECIALIST LADY EXTRA*).
- La referenza è scelta coerentemente con la scala dei prodotti Lines Specialist basandosi sulle risposte dell'utente.

### Card Raccomandazione "Giornate Speciali"
- **Titolo:** `Nelle tue giornate speciali ti consigliamo:`
- **Risultato:** Sulla base dell'esito del questionario (e possibilmente delle scelte fatte nel modulo *Giornate Speciali*), viene fornita un'ulteriore raccomandazione con un prodotto **più assorbente** (es. *LINES SPECIALIST LADY MAXI* / 1-2 gocce in più rispetto al principale).

### Card Tracking "Momento Ops"
- Identificata da un'icona evidente e uno stile che attira l'attenzione (es. contorno tratteggiato giallo).
- **Titolo:** `MOMENTO Ops`
- **Descrizione:** `Registra qui i tuoi momenti "Ops" durante la giornata per permetterci di consigliarti il sempre con maggior precisione!`
- **Tasto di registrazione:** Permette di inserire "al volo" un incidente di perdita involontaria di urina.

## 3. Logica Algoritmo "Momento Ops" e Smart Advice
Il pulsante "Momento Ops" non è solo un diario passivo, ma un input essenziale per l'algoritmo di raccomandazione dell'app:
- Ogni volta che si preme, l'evento viene salvato aggiornando la frequenza/volume reale (dati oggettivi dell'uso quotidiano rispetto al questionario).
- **Notifiche Proattive (Smart Advice):** Se, ad esempio, dopo il primo mese di utilizzo dell'App gli episodi di "Momento Ops" risultano più frequenti di quanto dichiarato nel questionario iniziale, l'algoritmo rileverà l'anomalia. L'App invierà una **notifica discreta** all'utente suggerendo proattivamente di passare a un prodotto più assorbente (es. consiglierà di aggiornare il carrello della spesa o valutare la referenza immediatamente successiva nella scala di assorbenza).
