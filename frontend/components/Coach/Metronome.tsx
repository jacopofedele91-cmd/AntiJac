"use client";

import { useState, useEffect, useRef } from 'react';

type Phase = 'idle' | 'contrai' | 'rilascia' | 'riposo';

interface MetronomeProps {
    durationMinutes?: number;
    onComplete?: () => void;
}

export default function Metronome({ durationMinutes = 3, onComplete }: MetronomeProps) {
    const [phase, setPhase] = useState<Phase>('idle');
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
    const [isActive, setIsActive] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const cycleRef = useRef<NodeJS.Timeout | null>(null);
    const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);

    // 1 cycle: 4s contrai -> 4s rilascia -> 2s riposo (10s total)
    const runCycle = () => {
        // Phase: CONTRAI
        setPhase('contrai');
        try {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([200]); // Short vibration
            }
        } catch (e) { }

        phaseTimerRef.current = setTimeout(() => {
            // Phase: RILASCIA
            setPhase('rilascia');
            try {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate([600]); // Long vibration
                }
            } catch (e) { }

            phaseTimerRef.current = setTimeout(() => {
                // Phase: RIPOSO
                setPhase('riposo');
            }, 4000); // Rilascia lasts 4s
        }, 4000); // Contrai lasts 4s
    };

    const startSession = () => {
        if (isActive) return;
        setIsActive(true);
        runCycle();
        cycleRef.current = setInterval(runCycle, 10000); // Run cycle every 10s

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    stopSession(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const stopSession = (completed = false) => {
        setIsActive(false);
        setPhase('idle');
        if (cycleRef.current) clearInterval(cycleRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);

        if (completed && onComplete) {
            onComplete();
        }
    };

    useEffect(() => {
        return () => stopSession();
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Variazioni UI in base alla fase
    const getCircleClasses = () => {
        switch (phase) {
            case 'contrai': return 'scale-50 bg-accent transition-transform duration-[4000ms] ease-in-out';
            case 'rilascia': return 'scale-110 bg-primary transition-transform duration-[4000ms] ease-in-out';
            case 'riposo': return 'scale-100 bg-secondary opacity-50 transition-all duration-500 ease-in-out';
            default: return 'scale-100 bg-gray-200';
        }
    };

    const getPhaseText = () => {
        switch (phase) {
            case 'contrai': return 'Contrai...';
            case 'rilascia': return 'Rilascia dolcemente...';
            case 'riposo': return 'Riposo. Respira...';
            default: return 'Pronto per iniziare?';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100 w-full max-w-sm mx-auto">
            <div className="text-secondary font-medium mb-8 text-lg">
                {formatTime(timeLeft)}
            </div>

            <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                <div className={`absolute w-full h-full rounded-full ${getCircleClasses()}`}></div>
                <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                    <span className={`font-semibold text-lg z-10 transition-colors ${phase === 'idle' ? 'text-gray-500' : 'text-white'}`}>
                        {getPhaseText()}
                    </span>
                </div>
            </div>

            <div className="text-center mb-6 text-sm text-gray-500 max-w-xs">
                Ricorda: non forzare e continua a respirare in modo naturale. Ferma l'esercizio in caso di fastidio.
            </div>

            {isActive ? (
                <button
                    onClick={() => stopSession(false)}
                    className="bg-red-50 text-red-600 font-medium py-3 px-8 rounded-full shadow-sm hover:bg-red-100 transition-colors"
                >
                    Pausa
                </button>
            ) : (
                <button
                    onClick={startSession}
                    className="bg-primary text-white font-medium py-3 px-8 rounded-full shadow-md hover:opacity-90 transition-opacity"
                >
                    {timeLeft < durationMinutes * 60 ? 'Riprendi' : 'Inizia Sessione'}
                </button>
            )}
        </div>
    );
}
