/**
 * contentModeration.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Moderatore del linguaggio lato client per la Community Chat.
 *
 * Strategie implementate:
 *   1. Normalizzazione leet-speak  (c4zzo → cazzo, str0nz0 → stronzo, ecc.)
 *   2. Lista estesa di termini vietati (IT + EN): offese, razzismo, xenofobia,
 *      omofobia, sessismo, aggressività esplicita.
 *   3. Pattern di tono aggressivo  (frasi tipo "vaffanculo", "ti ammazzo", ecc.)
 *   4. Risultato strutturato con categoria e messaggio da mostrare all'utente.
 */

// ── 1. NORMALIZZAZIONE LEET-SPEAK ─────────────────────────────────────────────
const LEET_MAP: Record<string, string> = {
  '0': 'o', '1': 'i', '3': 'e', '4': 'a',
  '5': 's', '6': 'g', '7': 't', '8': 'b',
  '@': 'a', '$': 's', '!': 'i', '+': 't',
};

function normalizeLeet(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map(c => LEET_MAP[c] ?? c)
    .join('')
    // rimuovi spazi e trattini tra le lettere (c a z z o → cazzo)
    .replace(/([a-z])\s+([a-z])/g, '$1$2')
    .replace(/([a-z])-([a-z])/g, '$1$2')
    // rimuovi ripetizioni (cazzzzzo → cazzo)
    .replace(/(.)\1{2,}/g, '$1$1');
}

// ── 2. DIZIONARIO TERMINI VIETATI ─────────────────────────────────────────────
// Suddiviso per categoria per dare feedback preciso all'utente.

const PROFANITY: string[] = [
  // Volgarità comuni IT
  'cazzo', 'cazzi', 'cazzata', 'cazzate', 'cazzetto',
  'minchia', 'minchiate', 'minchione',
  'merda', 'merdoso', 'stronzo', 'stronza', 'stronzate', 'stronzata',
  'puttana', 'puttane', 'puttaniere', 'bagascia',
  'troia', 'troie', 'mignotta', 'baldracca',
  'fanculo', 'vaffanculo', 'vaffa', 'affanculo',
  'porco dio', 'porcodio', 'porco', 'porca miseria',
  'coglione', 'coglioni', 'coglionata',
  'figlio di puttana', 'figlio di troia',
  'bastardo', 'bastarda',
  'cretino', 'cretina', 'idiotiche', 'idiota',
  'imbecille', 'scemo', 'scema', 'deficiente',
  'stupido', 'stupida',
  // Volgarità EN
  'fuck', 'fucking', 'fucked', 'fucker', 'motherfucker',
  'shit', 'bullshit', 'asshole', 'ass',
  'bitch', 'bitches', 'bastard', 'dick', 'cock', 'pussy',
  'cunt', 'whore', 'slut',
  'damn', 'dumbass', 'jackass',
];

const RACIST_XENOPHOBIC: string[] = [
  // Slur razziali
  'negro', 'negra', 'negretta', 'negerino',
  'sporco negro', 'sporco africano', 'terrone', 'polentone',
  'extracomunitario', 'clandestino', 'invasione', 'rimpatria',
  'scimmia', 'scimmie',  // usato come slur razziale
  // Slur EN
  'nigger', 'nigga', 'chink', 'gook', 'spic', 'wetback',
  'kike', 'hymie', 'raghead', 'sandnigger', 'zipperhead',
  // Ideologie
  'nazismo', 'fascismo', 'nazista', 'fascista', 'kkk', 'ku klux klan',
  'supremazia bianca', 'white power', 'sieg heil', 'heil hitler',
  'antisemita', 'antisemitismo', 'olocausto nega',
];

const HOMOPHOBIC_SEXIST: string[] = [
  // Omofobia
  'frocio', 'froci', 'finocchio', 'finocchi', 'checka', 'ricchione',
  'lesbiaccia', 'trans*, fa*ggot', 'faggot', 'dyke', 'queer', // slur
  // Sessismo
  'donnaccia', 'femminaccia', 'zoccola',
  'vai a cucinare', 'stai in cucina', 'solo affari da uomini',
];

const VIOLENT_AGGRESSIVE: string[] = [
  // Minacce
  'ti ammazzo', 'ti uccido', 'ti spezzo', 'ti faccio del male',
  'vi ammazzo', 'vi uccido',
  'ti sparo', 'ti taglio la gola', 'ti faccio fuori',
  "i'll kill you", 'i will kill you', 'i will hurt you',
  'go kill yourself', 'kill yourself',
  // Incitamento all\'odio
  'odio tutti', 'vi odio', 'morte a', 'dovete morire',
  'sterminate', 'eliminarli', 'mandarli via a forza',
];

// Tutti i termini in un'unica mappa categorizzata
const BLOCKED_TERMS: Array<{ terms: string[]; category: string }> = [
  { terms: PROFANITY,            category: 'volgarità' },
  { terms: RACIST_XENOPHOBIC,    category: 'linguaggio razzista o xenofobo' },
  { terms: HOMOPHOBIC_SEXIST,    category: 'linguaggio omofobo o sessista' },
  { terms: VIOLENT_AGGRESSIVE,   category: 'linguaggio violento o minaccioso' },
];

// ── 3. ANALISI TONO AGGRESSIVO (pattern regex) ────────────────────────────────
const AGGRESSIVE_PATTERNS: RegExp[] = [
  /\bstai\s+zitta?\b/i,
  /\bsei\s+una?\s+(schifo|vergogna)\b/i,
  /\bva(?:tten)?e\s+a\s+fanculo\b/i,
  /\bchi[au]di\s+il\s+bec[oc]o\b/i,
  /\bfan\W*culo\b/i,
  /\bvaffanculo\b/i,
];

// ── 4. INTERFACCIA PUBBLICA ────────────────────────────────────────────────────

export interface ModerationResult {
  /** true se il messaggio è accettabile */
  allowed: boolean;
  /** categoria del termine bloccato (se bloccato) */
  category?: string;
  /** messaggio user-friendly da mostrare nell'UI */
  userMessage?: string;
}

const USER_MESSAGES: Record<string, string> = {
  'volgarità':
    'Il tuo messaggio contiene parole volgari non consentite in questa stanza 🌸 Riformulalo gentilmente.',
  'linguaggio razzista o xenofobo':
    'Il tuo messaggio contiene linguaggio razzista o xenofobo. Non è consentito in questa community 🛡️',
  'linguaggio omofobo o sessista':
    'Il tuo messaggio contiene linguaggio omofobo o sessista. Per favore rispetta tutte le persone 💜',
  'linguaggio violento o minaccioso':
    'Il tuo messaggio include minacce o incitamento alla violenza. Non è tollerato in nessun caso ⚠️',
  'tono aggressivo':
    'Il tono del tuo messaggio sembra aggressivo. Ricorda che questa è una stanza sicura 🌸',
};

export function moderateMessage(text: string): ModerationResult {
  if (!text || !text.trim()) return { allowed: true };

  // 1. Normalizza per intercettare leet-speak
  const normalized = normalizeLeet(text);
  // Testo originale lowercased per pattern regex
  const lower = text.toLowerCase();

  // 2. Controlla ogni categoria di termini vietati
  for (const { terms, category } of BLOCKED_TERMS) {
    for (const term of terms) {
      // Controlla su testo normalizzato E originale
      if (normalized.includes(normalizeLeet(term)) || lower.includes(term)) {
        return {
          allowed: false,
          category,
          userMessage: USER_MESSAGES[category],
        };
      }
    }
  }

  // 3. Controlla pattern aggressivi
  for (const pattern of AGGRESSIVE_PATTERNS) {
    if (pattern.test(text)) {
      return {
        allowed: false,
        category: 'tono aggressivo',
        userMessage: USER_MESSAGES['tono aggressivo'],
      };
    }
  }

  return { allowed: true };
}
