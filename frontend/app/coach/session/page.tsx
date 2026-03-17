"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Play, Pause, Square } from 'lucide-react';
import Link from 'next/link';

// Esercizio: Contrazione Pavimento Pelvico (Kegel)
// Fase 1: Contrazione (Vibrazione breve)
// Fase 2: Rilascio (Vibrazione lunga / Pausa)
const SESSION_DURATION_SEC = 90; // 1.5 minuti per il prototipo

export default function CoachSessionPage() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(SESSION_DURATION_SEC);
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<'IDLE' | 'CONTRAZIONE' | 'RILASCIO'>('IDLE');
    const [isFinished, setIsFinished] = useState(false);
    const [showStopModal, setShowStopModal] = useState(false);

    // Usa ref per timer complessi per evitare dipendenze impazzite in useEffect
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Vibrazione
    const triggerHaptic = (pattern: number[]) => {
        try {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(pattern);
            }
        } catch (e) {
            console.warn("Haptic non supportato");
        }
    };

    // Gestione timer principale
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((t) => t - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            handleComplete();
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, timeLeft]);

    // Gestione ciclo Allenamento (Contrazione 5s / Rilascio 5s)
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            if (phase === 'IDLE') {
                startContraction();
            }
        } else {
            // Paued or finished
            if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
        }

        return () => {
            if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
        };
    }, [isActive, phase]);

    const startContraction = () => {
        setPhase('CONTRAZIONE');
        triggerHaptic([200]); // Breve vibrazione per dire "inizia a contrarre"

        phaseTimerRef.current = setTimeout(() => {
            startRelease();
        }, 5000); // 5 secondi di contrazione
    };

    const startRelease = () => {
        setPhase('RILASCIO');
        triggerHaptic([500, 100, 500]); // Pattern lungo decrescente per rilascio

        phaseTimerRef.current = setTimeout(() => {
            startContraction();
        }, 5000); // 5 secondi di riposo
    };

    const handlePlayPause = () => {
        setIsActive(!isActive);
        if (isActive) {
            setPhase('IDLE'); // Resetta fase se lo metti in pausa per evitare desync
        }
    };

    const handleStop = () => {
        setIsActive(false);
        setPhase('IDLE');
        setShowStopModal(true);
    };

    const handleComplete = async () => {
        setIsActive(false);
        setPhase('IDLE');
        setIsFinished(true);
        triggerHaptic([200, 100, 200, 100, 200]); // Success pattern

        // Chiamata backend FastAPI per registrare la sessione
        try {
            await fetch('http://localhost:8000/coach/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: "user_123", // Utente mock
                    duration_minutes: 2, // 2 minuti circa (arrotondato)
                    completed_at: new Date().toISOString(),
                    scheduled_for: new Date(new Date().setHours(11, 30, 0, 0)).toISOString(),
                    level: 1
                })
            });
        } catch (error) {
            console.error("Failed to save session", error);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (isFinished) {
        return (
            <div className="min-h-screen bg-[#6F1A4A] flex flex-col items-center justify-center p-6 text-center animate-fade-in relative max-w-md mx-auto shadow-2xl">
                <div className="w-24 h-24 bg-[#D8EE00] rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(216,238,0,0.5)]">
                    <span className="text-4xl">🎉</span>
                </div>
                <h1 className="text-white font-black text-3xl font-serif mb-2 leading-tight">Ottimo lavoro!</h1>
                <p className="text-white/80 font-medium text-lg mb-8">Sessione completata. Il tuo pavimento pelvico ringrazia.</p>
                <Link href="/coach" className="bg-[#BC5887] text-white font-bold text-lg py-4 px-12 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform uppercase tracking-wider">
                    Torna al Piano
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#6F1A4A] flex flex-col font-sans pb-10 max-w-md mx-auto shadow-xl relative overflow-hidden">

            {/* Soft Breathing Animation Background based on Phase */}
            <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${phase === 'CONTRAZIONE' ? 'opacity-30' : 'opacity-0'}`}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[60%] bg-[#D47BA4] rounded-full blur-[100px] animate-[pulse_5s_ease-in-out_infinite]"></div>
            </div>

            <header className="pt-12 pb-4 px-6 flex justify-between items-center z-10">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm transition-transform hover:scale-110">
                    <ChevronLeft strokeWidth={2.5} size={24} />
                </button>
                <div className="text-white font-bold tracking-widest text-sm uppercase">Ore 11:30</div>
                <div className="w-10"></div> {/* Spaziatore per bilanciare */}
            </header>

            <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 mt-[-40px]">

                {/* Indicatore Visuale Centrale */}
                <div className="relative w-64 h-64 flex items-center justify-center mb-10">

                    {/* Anelli Animati */}
                    <div className={`absolute inset-0 rounded-full border-4 transition-all duration-5000 ease-in-out ${phase === 'CONTRAZIONE' ? 'border-[#D8EE00] scale-75 opacity-100' :
                            phase === 'RILASCIO' ? 'border-[#D47BA4] scale-110 opacity-30' :
                                'border-white/20 scale-100 opacity-50'
                        }`}></div>

                    <div className={`absolute inset-4 rounded-full border-2 transition-all duration-5000 ease-in-out ${phase === 'CONTRAZIONE' ? 'border-[#D8EE00] scale-50 opacity-80' :
                            phase === 'RILASCIO' ? 'border-[#D47BA4] scale-100 opacity-20' :
                                'border-white/10 scale-100 opacity-30'
                        }`}></div>

                    {/* Testo di Stato */}
                    <div className="text-center z-20">
                        {phase === 'IDLE' && (
                            <div className="text-white/80 font-medium italic text-lg font-serif">Premi Play <br />per iniziare</div>
                        )}
                        {phase === 'CONTRAZIONE' && (
                            <div className="text-[#D8EE00] font-black uppercase text-2xl tracking-widest animate-pulse drop-shadow-md">Contrai</div>
                        )}
                        {phase === 'RILASCIO' && (
                            <div className="text-[#D47BA4] font-bold uppercase text-2xl tracking-widest drop-shadow-md">Rilascia</div>
                        )}
                    </div>
                </div>

                <div className="text-white font-mono text-5xl font-light mb-12 tabular-nums">
                    {formatTime(timeLeft)}
                </div>

                {/* Controlli Multimediali */}
                <div className="flex items-center space-x-8">
                    <button
                        onClick={handleStop}
                        className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md hover:bg-white/20 transition-colors"
                    >
                        <Square fill="currentColor" size={20} />
                    </button>

                    <button
                        onClick={handlePlayPause}
                        className="w-20 h-20 rounded-full bg-[#D8EE00] flex items-center justify-center text-[#6F1A4A] shadow-[0_0_20px_rgba(216,238,0,0.4)] hover:scale-105 active:scale-95 transition-transform"
                    >
                        {isActive ? <Pause fill="currentColor" size={32} /> : <Play fill="currentColor" size={32} className="ml-2" />}
                    </button>
                </div>
            </div>

            {/* Modal di Stop / Avvertenze Sicurezza */}
            {showStopModal && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-6 animate-fade-in">
                    <div className="bg-[#f8f9fa] rounded-[2rem] p-6 shadow-2xl text-center w-full max-w-sm">
                        <div className="text-4xl mb-4">✋</div>
                        <h3 className="text-[#6F1A4A] font-bold text-xl mb-2 font-serif">Tutto bene?</h3>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            Ricorda di non forzare mai. Se senti dolore, fermati immediatamente. Riprenderemo quando ti sentirai pronta!
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => { setShowStopModal(false); setIsActive(true); }}
                                className="w-full bg-[#6F1A4A] text-white font-bold py-3 rounded-xl shadow-md hover:bg-[#5a143b] transition-colors"
                            >
                                Riprendi Allenamento
                            </button>
                            <button
                                onClick={() => router.push('/coach')}
                                className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-xl border border-gray-300 hover:bg-gray-300 transition-colors"
                            >
                                Interrompi ed esci
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Safety Reminder Banner Soft */}
            <div className="absolute bottom-6 left-0 right-0 text-center px-6 pointer-events-none">
                <p className="text-white/40 text-[11px] font-medium leading-tight">
                    Respira in modo naturale.<br />Il movimento segue il respiro, non tenerlo.
                </p>
            </div>
        </div>
    );
}
