"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BottomNav from '../../components/BottomNav';

export default function OggiMiSento() {
    const [mood, setMood] = useState<number | null>(null);
    const [moodSelected, setMoodSelected] = useState(false);
    const [glasses, setGlasses] = useState(0);

    const maxGlasses = 8;
    const fillPercentage = Math.min((glasses / maxGlasses) * 100, 100);

    useEffect(() => {
        const saved = localStorage.getItem('lines_hydration_glasses');
        if (saved !== null) {
            setGlasses(parseInt(saved, 10));
        }

        const handleSync = (e: Event) => {
            const customEvent = e as CustomEvent;
            setGlasses(customEvent.detail);
        };
        window.addEventListener('hydrationUpdate', handleSync);
        return () => window.removeEventListener('hydrationUpdate', handleSync);
    }, []);

    const updateGlasses = (newVal: number) => {
        setGlasses(newVal);
        localStorage.setItem('lines_hydration_glasses', newVal.toString());
        window.dispatchEvent(new CustomEvent('hydrationUpdate', { detail: newVal }));
    };

    const emojis = [
        {
            id: 1, angle: -160, label: "Felice",
            imageSrc: "/images/emojis/emoji_1.png"
        },
        {
            id: 2, angle: -90, label: "Triste",
            imageSrc: "/images/emojis/emoji_2.png"
        },
        {
            id: 3, angle: -20, label: "Normale",
            imageSrc: "/images/emojis/emoji_3.png"
        },
        {
            id: 4, angle: 50, label: "Nervoso",
            imageSrc: "/images/emojis/emoji_4.png"
        },
        {
            id: 5, angle: 130, label: "Super!",
            imageSrc: "/images/emojis/emoji_5.png"
        }
    ];

    const getIdratazioneLevel = () => {
        if (glasses === 0) return "Da iniziare";
        if (glasses < 4) return "Scarso";
        if (glasses < 6) return "Buono";
        return "Ottimo";
    };

    return (
        <main className="min-h-screen flex flex-col font-sans relative pb-32 max-w-md mx-auto overflow-x-hidden">
            {/* Header */}
            <div className="flex items-start justify-between p-6">
                <div>
                    <h1 className="text-[32px] font-black text-white tracking-wide uppercase" style={{ fontFamily: "var(--font-montserrat)" }}>CIAO MARIA!</h1>
                    <h2 className="text-2xl font-bold text-[#D8EE00] tracking-wide mt-1 drop-shadow-md leading-snug" style={{ fontFamily: "var(--font-pacifico)" }}>Come ti senti oggi?</h2>
                </div>
                <Link href="/" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm transition-transform hover:scale-110 shrink-0 ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-4 space-y-4 scrollbar-none pb-4">

                {/* Primo blocco: Umore & Chat (Row) */}
                <div className="flex space-x-3 h-[240px]">
                    {/* Emojis Card */}
                    <div className="flex-[3] bg-[#BC5887] rounded-2xl relative overflow-hidden shadow-md">
                        {/* Background Overlay pseudo-image */}
                        <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#BC5887] to-transparent"></div>

                        <div className="relative w-full h-full flex items-center justify-center">
                            <div className="relative w-[200px] h-[200px] flex items-center justify-center">
                                {!moodSelected ? (
                                    <>
                                        <h3 className="text-[#D8EE00] font-black text-lg tracking-wider text-center leading-tight z-10 uppercase drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]">
                                            IL TUO<br />UMORE<br />OGGI:
                                        </h3>
                                        {/* Emojis Circle */}
                                        {emojis.map((em) => {
                                            const rad = (em.angle * Math.PI) / 180;
                                            const radius = 86; // Increased radius to give more space around text
                                            const x = Math.cos(rad) * radius;
                                            const y = Math.sin(rad) * radius + 10; // Added vertical offset to move icons down
                                            const isSelected = mood === em.id;

                                            return (
                                                <button
                                                    key={em.id}
                                                    onClick={async () => {
                                                        setMood(em.id);
                                                        // Persist to localStorage so Homepage can read it
                                                        localStorage.setItem('selectedMood', JSON.stringify({
                                                            id: em.id,
                                                            label: em.label,
                                                            date: new Date().toDateString()
                                                        }));
                                                        try {
                                                            await fetch('http://localhost:8000/mood', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({
                                                                    user_id: "user_123",
                                                                    mood_id: em.id.toString(),
                                                                    tags: [em.label],
                                                                    timestamp: new Date().toISOString()
                                                                })
                                                            });
                                                        } catch (e) {
                                                            console.error("Errore salvataggio umore", e);
                                                        }
                                                        setTimeout(() => setMoodSelected(true), 300); // Small delay for the selection effect
                                                    }}
                                                    className={`absolute flex flex-col items-center justify-center transition-all duration-300 ${isSelected ? 'scale-125 z-30' : 'hover:scale-110'}`}
                                                    style={{
                                                        left: '50%',
                                                        top: '50%',
                                                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                                                    }}
                                                >
                                                    <div className={`rounded-full flex items-center justify-center transition-all ${isSelected
                                                        ? 'w-[52px] h-[52px] bg-[#D8EE00]/20 shadow-[0_0_30px_rgba(216,238,0,0.8)] border-[3px] border-[#D8EE00] mb-1'
                                                        : 'w-[48px] h-[48px] bg-white/20 z-10 border-2 border-white backdrop-blur-sm mb-1 hover:bg-white/30 shadow-md'
                                                        }`}>
                                                        <div className="w-[85%] h-[85%] relative drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
                                                            <Image src={em.imageSrc} alt={em.label} fill className="object-contain" unoptimized />
                                                        </div>
                                                    </div>
                                                    {/* Etichetta sotto l'emoticon */}
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider transition-opacity ${isSelected ? 'text-[#D8EE00] opacity-100' : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] opacity-90'}`}>
                                                        {em.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </> 
                                ) : (
                                    /* Selected Mood Exploded View */
                                    <div className="absolute inset-0 flex flex-col items-center justify-center z-40 animate-fade-in">
                                        <div className="w-[100px] h-[100px] bg-white/10 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(216,238,0,0.5)] mb-3 relative border-[3px] border-[#D8EE00] animate-[bounce-in_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)] backdrop-blur-md">
                                            {/* Sunrays decorative effect */}
                                            <div className="absolute -inset-4 border-[3px] border-[#D8EE00]/30 rounded-full animate-[ping_2s_infinite]"></div>
                                            <div className="w-[85%] h-[85%] relative drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)]">
                                                {/* @ts-ignore */}
                                                <Image src={emojis.find(e => e.id === mood)?.imageSrc || ''} alt="" fill className="object-contain" unoptimized />
                                            </div>
                                        </div>
                                        <h3 className="text-[#D8EE00] font-black uppercase text-xl tracking-wider drop-shadow-md">
                                            {emojis.find(e => e.id === mood)?.label}
                                        </h3>
                                        <button
                                            onClick={() => { setMood(null); setMoodSelected(false); }}
                                            className="mt-3 text-white/80 text-xs underline font-semibold hover:text-white"
                                        >
                                            Cambia umore
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Chat Card (Styled like Home Page) */}
                    <Link href="/oggi-mi-sento/chat" className="flex-[2] bg-[#BC5887] p-3 flex flex-col items-center justify-between text-center shadow-md transition-transform hover:scale-[1.02] rounded-t-[2.5rem] rounded-br-[2.5rem] rounded-bl-sm relative group overflow-hidden border border-[#a64875]">
                        
                        <div className="w-full flex-shrink-0 mt-3 mb-1">
                            <h3 className="text-white font-black text-xl tracking-wider leading-[1.1] uppercase drop-shadow-sm">INIZIA<br />CHAT</h3>
                        </div>
                        
                        {/* Nuvoletta Gialla (pallone di risposta) */}
                        <div className="bg-[#D8EE00] p-4 w-[92%] flex flex-col items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.2)] rounded-tl-[1.8rem] rounded-tr-[1.8rem] rounded-bl-[1.8rem] rounded-br-sm relative z-20 group mb-0.5 border border-[#C5D900]">
                            <p className="text-[#6F1A4A] font-bold text-[13px] leading-tight flex flex-col items-center justify-center text-center px-1">
                                <span>Raccontaci</span>
                                <span>di te!</span>
                            </p>
                        </div>

                        {/* 3 Puntini stile chat (subito sotto la nuvoletta in basso a sinistra) */}
                        <div className="w-full flex justify-start pl-2 mb-3">
                            <div className="flex space-x-1.5 opacity-80">
                                <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Secondo blocco: Idratazione */}
                <div className="w-full bg-[#BC5887] rounded-3xl p-5 relative shadow-lg min-h-[17rem] flex overflow-visible border border-white/10 mt-[20px]">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-[#6F1A4A]/20 rounded-3xl overflow-hidden pointer-events-none"></div>

                    {/* Left text/controls */}
                    <div className="relative z-10 w-3/5 flex flex-col justify-center pr-2">
                        <h3 className="text-[#D8EE00] font-black uppercase text-[22px] leading-tight tracking-wider drop-shadow-sm">
                            LIVELLO<br />IDRATAZIONE
                        </h3>
                        {/* Cursive text */}
                        <p className="text-white text-[42px] mb-4 font-serif capitalize" style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
                            {getIdratazioneLevel()}
                        </p>

                        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                            <p className="text-white font-bold mb-3 text-[15px]">Ho appena bevuto:</p>
                            <div className="flex items-center justify-between px-1">
                                <button
                                    onClick={async () => {
                                        if (glasses === 0) return;
                                        const newVal = Math.max(0, glasses - 1);
                                        updateGlasses(newVal);
                                        try { await fetch('http://localhost:8000/hydration', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: "user_123", amount_ml: -200, timestamp: new Date().toISOString() }) }); } catch (e) { }
                                    }}
                                    className="text-white w-10 h-10 flex items-center justify-center text-5xl font-light hover:scale-110 active:scale-90 transition-transform disabled:opacity-30 leading-none pb-1"
                                    disabled={glasses === 0}
                                >
                                    &minus;
                                </button>
                                <div className="w-14 h-14 rounded-[50%] border-[3px] border-white flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                    {glasses}
                                </div>
                                <button
                                    onClick={async () => {
                                        const newVal = Math.min(20, glasses + 1);
                                        updateGlasses(newVal);
                                        try { await fetch('http://localhost:8000/hydration', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: "user_123", amount_ml: 200, timestamp: new Date().toISOString() }) }); } catch (e) { }
                                    }}
                                    className="text-white w-10 h-10 flex items-center justify-center text-4xl font-light hover:scale-110 active:scale-90 transition-transform leading-none pb-1"
                                >
                                    +
                                </button>
                            </div>
                            <p className="text-white text-center mt-3 font-semibold text-[15px]">bicchiere d'acqua</p>
                        </div>
                    </div>

                    {/* Right bottle illustration */}
                    <div className="absolute right-4 bottom-0 top-6 z-10 w-[28%] flex items-end justify-center pointer-events-none pb-2">
                        <svg viewBox="0 0 100 240" className="w-[100%] h-[100%] overflow-visible drop-shadow-2xl" preserveAspectRatio="xMidYMax meet">
                            <defs>
                                <clipPath id="bottleClip">
                                    <path d="M35 30 L35 45 L20 75 L20 110 C28 110, 28 130, 20 130 L20 150 C28 150, 28 170, 20 170 L20 200 C20 220, 80 220, 80 200 L80 170 C72 170, 72 150, 80 150 L80 130 C72 130, 72 110, 80 110 L80 75 L65 45 L65 30 Z" />
                                </clipPath>
                            </defs>

                            {/* Empty Bottle background (semi transparent white) */}
                            <path d="M35 30 L35 45 L20 75 L20 110 C28 110, 28 130, 20 130 L20 150 C28 150, 28 170, 20 170 L20 200 C20 220, 80 220, 80 200 L80 170 C72 170, 72 150, 80 150 L80 130 C72 130, 72 110, 80 110 L80 75 L65 45 L65 30 Z" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="6" strokeLinejoin="round" />

                            {/* Water Fill - moving Y upwards */}
                            <rect
                                x="0"
                                y={220 - ((Math.min(fillPercentage, 100) / 100) * 190)}
                                width="100"
                                height={220}
                                fill="white"
                                clipPath="url(#bottleClip)"
                                className="transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                            />

                            {/* Cap */}
                            <rect x="35" y="8" width="30" height="15" rx="3" fill="white" />
                        </svg>
                    </div>
                </div>

            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 z-50">
                <BottomNav />
            </div>
        </main>
    );
}
