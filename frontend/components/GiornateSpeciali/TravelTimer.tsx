"use client";

import { useState, useEffect, useRef } from 'react';

interface TravelTimerProps {
    durationMinutes?: number; // Durata tra una notifica e l'altra (default 90 min)
}

export default function TravelTimer({ durationMinutes = 90 }: TravelTimerProps) {
    const [isActive, setIsActive] = useState(false);
    const [timeLeftSeconds, setTimeLeftSeconds] = useState(durationMinutes * 60);
    const [showNotification, setShowNotification] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Gestione del timer
    useEffect(() => {
        if (isActive && timeLeftSeconds > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeftSeconds(prev => {
                    if (prev <= 1) {
                        triggerDiscreetNotification();
                        return durationMinutes * 60; // Auto-restart per il prossimo ciclo
                    }
                    return prev - 1;
                });
            }, 1000); // IN PRODUZIONE: 1000ms. PER TEST si può abbassare a 10ms per testare rapido.
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeftSeconds, durationMinutes]);

    const triggerDiscreetNotification = () => {
        setShowNotification(true);
        // Feedback Aptico (Discreto se telefono silenzioso)
        try {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                // Vibrazione rassicurante e breve: 2 colpetti
                navigator.vibrate([150, 100, 150]);
            }
        } catch (e) { console.warn("Vibration not supported") }

        // Nascondi notifica dopo 10 secondi
        setTimeout(() => setShowNotification(false), 10000);
    };

    const handleToggle = async () => {
        setIsActive(!isActive);
        if (!isActive) {
            // Se si accende da zero e stava a zero, resetta
            setTimeLeftSeconds(durationMinutes * 60);

            // Log event to backend
            try {
                await fetch('http://localhost:8000/special-events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: 'user_123',
                        event_type: 'viaggio',
                        timestamp: new Date().toISOString()
                    })
                });
            } catch (err) {
                console.error("Failed to log special event:", err);
            }
        }
    };

    // Formattazione H:MM:SS
    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        if (h > 0) {
            return `${h}h ${m.toString().padStart(2, '0')}'`;
        }
        return `${m}m ${s.toString().padStart(2, '0')}s`;
    };

    const progressPercentage = ((durationMinutes * 60 - timeLeftSeconds) / (durationMinutes * 60)) * 100;

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">

            {/* Soft Notification Overlay */}
            <div className={`absolute inset-0 bg-sky-900/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-white transition-all duration-500 ease-in-out ${showNotification ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}>
                <span className="text-4xl mb-3">🔔</span>
                <p className="font-heading text-lg font-bold mb-1 tracking-wide">È quasi ora di sgranchirsi un po&apos; le gambe!</p>
                <p className="text-sky-100 text-sm opacity-90">Pianifica la tua prossima sosta con calma.</p>
                <button
                    onClick={() => setShowNotification(false)}
                    className="mt-6 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-semibold transition-colors"
                >
                    Capito
                </button>
            </div>

            <h3 className="text-[#6F1A4A] font-bold text-lg mb-1">Timer di Viaggio</h3>
            <p className="text-xs text-gray-400 mb-6 max-w-[250px] leading-relaxed">
                POTRAI GODERTELO IN SERENITÀ E TI INVIEREMO NOI UNA NOTIFICA "DISCRETA" TRA 1H 30' PER PIANIFICARE LA PROSSIMA SOSTA!
            </p>

            {/* Circolo Start / Stop */}
            <div className="relative mb-6">
                <svg className="w-40 h-40 transform -rotate-90">
                    {/* Ring Base */}
                    <circle cx="80" cy="80" r="72" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                    {/* Ring Progresso */}
                    {isActive && (
                        <circle
                            cx="80" cy="80" r="72" fill="none"
                            stroke="#BC5887" strokeWidth="8" strokeLinecap="round"
                            strokeDasharray="452"
                            strokeDashoffset={452 - (452 * progressPercentage) / 100}
                            style={{ transition: 'stroke-dashoffset 1s linear' }}
                        />
                    )}
                </svg>

                {/* Bottone centrale */}
                <button
                    onClick={handleToggle}
                    className={`absolute inset-0 m-auto w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-md active:scale-95 ${isActive ? 'bg-pink-50' : 'bg-[#6F1A4A]'}`}
                >
                    {isActive ? (
                        <>
                            <span className="text-[#6F1A4A] font-bold text-[10px] uppercase tracking-widest mb-1">In corso</span>
                            <span className="text-[#6F1A4A] font-medium text-xl font-mono">{formatTime(timeLeftSeconds)}</span>
                        </>
                    ) : (
                        <span className="text-white font-heading font-bold text-2xl tracking-wider">START!</span>
                    )}
                </button>
            </div>

            <div className="flex items-center space-x-2 text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <span className="text-xs">📳</span>
                <span className="text-[10px] font-medium tracking-wide">Notifiche silenziose e sicure</span>
            </div>

        </div>
    );
}
