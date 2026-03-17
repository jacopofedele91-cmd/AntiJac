"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const MOODS = ['😍', '😊', '😐', '😔', '😭'];

const QUOTES = [
    { text: "«Sii il cambiamento che vuoi vedere nel mondo!»", author: "Mahatma Gandhi" },
    { text: "«Il futuro appartiene a coloro che credono nella bellezza dei sogni.»", author: "Eleanor Roosevelt" },
    { text: "«Non hai mai fallito finché non smetti di provare.»", author: "Albert Einstein" },
    { text: "«Il modo migliore per iniziare è smettere di parlare e cominciare a fare.»", author: "Walt Disney" },
    { text: "«Fai della tua vita un sogno, e di un sogno, una realtà.»", author: "Antoine de Saint-Exupéry" }
];

export default function Home() {
    const router = useRouter();
    const [dates, setDates] = useState({
        yesterday: '',
        today: '',
        tomorrow: ''
    });

    const [glasses, setGlasses] = useState(0);
    const maxGlasses = 8;
    const fillPercentage = Math.min((glasses / maxGlasses) * 100, 100);

    // Interaction states
    const [mood, setMood] = useState('😍');
    const [isMoodPickerOpen, setIsMoodPickerOpen] = useState(false);
    const [quote, setQuote] = useState(QUOTES[0]);
    // Saved mood from 'Oggi Mi Sento' module
    const [savedMood, setSavedMood] = useState<{ id: number; label: string; emoji: string } | null>(null);

    const MOOD_EMOJI_MAP: Record<number, string> = { 1: '😊', 2: '😢', 3: '😐', 4: '😟', 5: '🤩' };

    useEffect(() => {
        const today = new Date();
        const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
        const processDate = (offset: number) => {
            const d = new Date(today);
            d.setDate(d.getDate() + offset);
            const day = d.getDate().toString().padStart(2, '0');
            const month = months[d.getMonth()];
            return `${day}-${month}`;
        }

        setDates({
            yesterday: processDate(-1),
            today: processDate(0),
            tomorrow: processDate(1)
        });

        const start = new Date(today.getFullYear(), 0, 0);
        const diff = (today.getTime() - start.getTime()) + ((start.getTimezoneOffset() - today.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        setQuote(QUOTES[dayOfYear % QUOTES.length]);

        // Read mood saved by 'Oggi Mi Sento'
        const rawMood = localStorage.getItem('selectedMood');
        if (rawMood) {
            try {
                const parsed = JSON.parse(rawMood);
                // Only valid if set today
                if (parsed.date === new Date().toDateString()) {
                    setSavedMood({
                        id: parsed.id,
                        label: parsed.label,
                        emoji: { 1: '😊', 2: '😢', 3: '😐', 4: '😟', 5: '🤩' }[parsed.id as number] || '😊'
                    });
                }
            } catch (_) {}
        }

        // Sync hydration
        const savedHydration = localStorage.getItem('lines_hydration_glasses');
        if (savedHydration !== null) {
            setGlasses(parseInt(savedHydration, 10));
        }
        const handleHydrationSync = (e: Event) => {
            const customEvent = e as CustomEvent;
            setGlasses(customEvent.detail);
        };
        window.addEventListener('hydrationUpdate', handleHydrationSync);
        return () => window.removeEventListener('hydrationUpdate', handleHydrationSync);
    }, []);

    const updateGlasses = (newVal: number) => {
        setGlasses(newVal);
        localStorage.setItem('lines_hydration_glasses', newVal.toString());
        window.dispatchEvent(new CustomEvent('hydrationUpdate', { detail: newVal }));
        // Sincronizza anche via backend per sicurezza anche se solo prototipo
        fetch('http://localhost:8000/hydration', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: "user_123", amount_ml: 200, timestamp: new Date().toISOString() }) }).catch(() => {});
    };

    const handleAddWater = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (glasses < maxGlasses) {
            updateGlasses(glasses + 1);
        }
    };

    const handleMoodSelect = (e: React.MouseEvent, m: string) => {
        e.preventDefault();
        e.stopPropagation();
        setMood(m);
        setIsMoodPickerOpen(false);
    };

    return (
        <div className="flex flex-col min-h-screen pb-[120px] text-white font-body px-4 pt-4">
            {/* Header */}
            <header className="flex flex-col items-center mb-6 px-2 relative pt-2">

                <div className="flex items-center space-x-4 mb-4 mt-2">
                    <Sun className="w-16 h-16 text-[#FFD700] fill-[#FFD700] flex-shrink-0 drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]" />
                    <h1 className="text-[28px] leading-tight font-black font-serif tracking-wide text-white uppercase" style={{ fontFamily: "var(--font-montserrat)" }}>Buongiorno <br /> Maria!</h1>
                </div>

                {/* Motivational Quote (Dynamic) */}
                <div className="bg-white/10 rounded-2xl p-5 w-full max-w-sm text-center backdrop-blur-md shadow-sm border border-white/20 z-10 mx-auto mt-2">
                    <p className="text-[20px] leading-snug text-white italic drop-shadow-sm font-serif" style={{ fontFamily: "var(--font-pacifico)" }}>
                        {quote.text}
                    </p>
                    <p className="text-xs text-[#D8EE00] font-bold mt-3 uppercase tracking-wider">- {quote.author}</p>
                </div>

                {/* Calendar Badge exactly like screenshot */}
                <div className="flex justify-center w-full mt-8 mb-2 z-10 px-4">
                    <div className="flex items-center justify-between w-full max-w-[320px] bg-white/20 p-1 rounded-xl shadow-inner border border-white/30 backdrop-blur-md">
                        {/* Ieri (Più piccolo) */}
                        <div className="flex-1 flex flex-col items-center justify-center py-1.5 opacity-80">
                            <span className="text-white font-bold text-[10px] tracking-widest uppercase mb-0.5">Ieri</span>
                            <span className="text-white text-[13px] font-semibold tracking-wide">{dates.yesterday}</span>
                        </div>
                        
                        {/* Oggi (Evidenziato e più grande) */}
                        <div className="flex-1 bg-[#BC5887] py-2 px-2 rounded-lg flex flex-col items-center justify-center shadow-md border border-white/40 transform scale-110 z-10 mx-1">
                            <span className="text-white font-bold text-[12px] tracking-widest uppercase mb-0.5">Oggi</span>
                            <span className="text-white text-[18px] font-bold tracking-wide">{dates.today}</span>
                        </div>
                        
                        {/* Domani (Più piccolo) */}
                        <div className="flex-1 flex flex-col items-center justify-center py-1.5 opacity-80">
                            <span className="text-white font-bold text-[10px] tracking-widest uppercase mb-0.5">Domani</span>
                            <span className="text-white text-[13px] font-semibold tracking-wide">{dates.tomorrow}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content area wrapped to give space since header has absolute background extending down */}
            <div className="px-4">
                {/* 2x2 Grid Modules */}
                <div className="grid grid-cols-2 gap-4 auto-rows-fr mt-4">

                    {/* IDRATAZIONE - Interactive & Link */}
                    <div
                        onClick={() => router.push('/oggi-mi-sento')}
                        className="relative rounded-[2rem] overflow-hidden flex flex-col items-center justify-between p-4 text-center shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] min-h-[160px] cursor-pointer"
                    >
                        <Image src="/hydration_bg.png" alt="Idratazione" fill className="object-cover" />
                        <div className="absolute inset-0 bg-pink-light/70 mix-blend-multiply" />
                        <div className="absolute inset-0 bg-[#DE4190]/50" />

                        <div className="relative z-10 w-full mb-1 mt-1">
                            <h2 className="text-white font-black text-xl tracking-wider mb-2 drop-shadow-md">IDRATAZIONE</h2>
                            <p className="text-white font-medium text-[11px] mb-1 leading-tight drop-shadow-sm">Il tuo livello di idratazione:</p>
                        </div>

                        <div className="relative z-10 flex flex-col items-center justify-center w-full flex-1">
                            <button onClick={handleAddWater} className="relative w-20 h-36 active:scale-95 transition-transform z-20 flex-shrink-0 mt-2 mb-1 flex items-end justify-center">
                                {/* The requested bottle icon from "Oggi Mi Sento" adapted for the Home Page */}
                                <svg viewBox="0 0 100 240" className="w-[100%] h-[100%] absolute inset-0 z-10 drop-shadow-md" preserveAspectRatio="xMidYMax meet">
                                    <defs>
                                        <clipPath id="homeBottleClip">
                                            <path d="M35 30 L35 45 L20 75 L20 110 C28 110, 28 130, 20 130 L20 150 C28 150, 28 170, 20 170 L20 200 C20 220, 80 220, 80 200 L80 170 C72 170, 72 150, 80 150 L80 130 C72 130, 72 110, 80 110 L80 75 L65 45 L65 30 Z" />
                                        </clipPath>
                                    </defs>
                                    
                                    {/* Empty Bottle background */}
                                    <path d="M35 30 L35 45 L20 75 L20 110 C28 110, 28 130, 20 130 L20 150 C28 150, 28 170, 20 170 L20 200 C20 220, 80 220, 80 200 L80 170 C72 170, 72 150, 80 150 L80 130 C72 130, 72 110, 80 110 L80 75 L65 45 L65 30 Z" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="6" strokeLinejoin="round" />
                                    
                                    {/* Water Fill */}
                                    <rect
                                        x="0"
                                        y={220 - ((Math.min(fillPercentage, 100) / 100) * 190)}
                                        width="100"
                                        height={220}
                                        fill="white"
                                        clipPath="url(#homeBottleClip)"
                                        className="transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                                    />
                                    
                                    {/* Cap */}
                                    <rect x="35" y="8" width="30" height="15" rx="3" fill="white" />
                                </svg>
                            </button>

                            <div className="text-center text-white leading-tight mt-auto w-full">
                                <div className="flex justify-center items-center gap-1.5 mb-2 mt-4">
                                    <span className="font-extrabold text-[15px] uppercase drop-shadow-md tracking-wide">
                                        {glasses === 0 ? "Basso! Bevi" : (glasses < 4 ? "Forza! Bevi!" : (glasses < maxGlasses ? "Continua così!" : "Idratata!"))}
                                    </span>
                                    {glasses < maxGlasses && <span className="text-[16px] drop-shadow-sm">💧</span>}
                                </div>
                                <div className="text-[14px] font-bold opacity-100 bg-white/30 px-5 py-2 rounded-full inline-block border border-white/40 drop-shadow-sm shadow-inner tracking-wide">
                                    {glasses}/{maxGlasses} bicchieri
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* UMORE - Interactive & Link */}
                    <div
                        onClick={() => router.push('/oggi-mi-sento')}
                        className="relative rounded-[2rem] overflow-visible flex flex-col items-center justify-center p-4 text-center shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] min-h-[160px] cursor-pointer"
                    >
                        <Image src="/travel.png" alt="Umore" fill className="object-cover rounded-[2rem]" />
                        <div className="absolute inset-0 bg-pink-light/70 mix-blend-multiply rounded-[2rem]" />
                        <div className="absolute inset-0 bg-[#DE4190]/40 rounded-[2rem]" />
                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-between py-1">
                            <div className="w-full">
                                <h2 className="text-lemon-bright font-black text-lg tracking-wider mb-1">UMORE</h2>
                                <p className="text-white font-medium text-xs leading-tight drop-shadow-sm">
                                    {savedMood ? 'Il tuo umore oggi:' : 'Come ti senti?'}
                                </p>
                            </div>

                            {/* Mood display */}
                            {savedMood ? (
                                <div className="flex flex-col items-center justify-center flex-1">
                                    <div className="w-16 h-16 rounded-full bg-[#D8EE00] flex items-center justify-center shadow-[0_0_20px_rgba(216,238,0,0.5)] border-4 border-white mb-2">
                                        <span className="text-3xl">{savedMood.emoji}</span>
                                    </div>
                                    <span className="text-white font-black text-sm uppercase tracking-wider drop-shadow-md">{savedMood.label}</span>
                                    <span className="text-white/70 text-[10px] mt-1 font-medium">Tocca per cambiare →</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center flex-1">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsMoodPickerOpen(!isMoodPickerOpen); }}
                                        className="relative w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-transparent backdrop-blur-[2px] shadow-sm transition-transform active:scale-95 z-20"
                                    >
                                        <span className="text-[2rem] leading-none mb-1">{mood}</span>
                                    </button>
                                    <span className="text-white/70 text-[10px] mt-2 font-medium">Tocca per selezionare</span>
                                </div>
                            )}

                            {/* Quick picker (shown only if no savedMood) */}
                            {isMoodPickerOpen && !savedMood && (
                                <div className="absolute top-[80%] z-50 bg-[#6F1A4A] rounded-full px-3 py-2 flex space-x-2 shadow-xl border border-white/20 mt-2" onClick={e => e.stopPropagation()}>
                                    {MOODS.map(m => (
                                        <button
                                            key={m}
                                            onClick={(e) => handleMoodSelect(e, m)}
                                            className={`text-2xl transition-transform hover:scale-125 ${mood === m ? 'scale-125 bg-white/20 rounded-full' : ''}`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* LE ATTIVITA' DI OGGI */}
                    <Link href="/coach" className="relative rounded-[2rem] overflow-hidden flex flex-col items-center justify-center p-4 text-center shadow-lg transition-transform hover:scale-[1.02] min-h-[160px]">
                        <Image src="/yoga.png" alt="Attività" fill className="object-cover" />
                        <div className="absolute inset-0 bg-pink-light/70 mix-blend-multiply" />
                        <div className="absolute inset-0 bg-[#DE4190]/40" />
                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                            <div className="w-full mb-1">
                                <h2 className="text-lemon-bright font-black text-lg tracking-wider mb-3 px-2 leading-tight drop-shadow-md">LE ATTIVITA'<br />di OGGI</h2>
                                <p className="text-white font-medium text-xs mb-2 leading-tight drop-shadow-sm">La tua attività oggi:</p>
                            </div>
                            <p className="text-white font-bold text-sm drop-shadow-md mt-auto">
                                <span className="font-medium text-white/90">Ore 8.30:</span><br />
                                Respirazione
                            </p>
                        </div>
                    </Link>

                    {/* RACCONTACI DI TE! */}
                    <Link href="/oggi-mi-sento/chat" className="bg-[#DE4190] p-4 flex flex-col items-center justify-between text-center shadow-lg transition-transform hover:scale-[1.02] rounded-t-[2.5rem] rounded-br-[2.5rem] rounded-bl-sm relative min-h-[160px] overflow-hidden">
                        
                        <div className="w-full flex-shrink-0 mt-1 mb-2">
                            <h2 className="text-white font-black text-[1.2rem] tracking-wider leading-tight uppercase drop-shadow-sm">Raccontaci<br />di te!</h2>
                        </div>
                        
                        {/* Nuvoletta Gialla (pallone di risposta, spostata più in alto) */}
                        <div className="bg-[#D8EE00] p-3 w-[85%] flex flex-col items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] rounded-tl-[1.8rem] rounded-tr-[1.8rem] rounded-bl-[1.8rem] rounded-br-sm relative z-20 group mb-3">
                            <p className="text-[#6F1A4A] font-bold text-[14px] leading-[1.15] flex flex-col items-center justify-center text-center px-1">
                                <span>Avvia una chat</span>
                                <span>con le altre donne</span>
                                <span>sull' App!</span>
                            </p>
                        </div>

                        {/* 3 Puntini stile chat (in basso a sinistra) */}
                        <div className="w-full flex justify-start pl-2 mb-1">
                            <div className="flex space-x-1.5 opacity-80">
                                <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </Link>

                </div>
            </div>
        </div>
    );
}
