"use client";

import { useState } from 'react';

const DAILY_GOAL_ML = 2000; // 2 Liters target

export default function HydrationTracker() {
    const [currentMl, setCurrentMl] = useState(0);
    const [showReward, setShowReward] = useState(false);

    const addWater = async (amount: number) => {
        try {
            const res = await fetch('http://localhost:8000/hydration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: 'user_123', // Hardcoded user for prototype
                    amount_ml: amount,
                    timestamp: new Date().toISOString()
                })
            });

            if (res.ok) {
                const data = await res.json();
                const newTotal = data.total_today;
                const oldTotal = currentMl;
                setCurrentMl(newTotal);

                // Check if passed a macro-step (e.g. 50% or 100%)
                const halfStepPassed = oldTotal < (DAILY_GOAL_ML / 2) && newTotal >= (DAILY_GOAL_ML / 2);
                const goalPassed = oldTotal < DAILY_GOAL_ML && newTotal >= DAILY_GOAL_ML;

                if (halfStepPassed || goalPassed) {
                    setShowReward(true);
                    setTimeout(() => setShowReward(false), 4000);
                }
            }
        } catch (err) {
            console.error('Failed to record hydration:', err);
        }
    };

    const percentage = Math.min(100, Math.round((currentMl / DAILY_GOAL_ML) * 100));

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
            {/* Confetti / Reward Overlay */}
            <div className={`absolute inset-0 bg-[#6F1A4A]/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center transition-all duration-500 ${showReward ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <span className="text-5xl mb-2 animate-bounce">💧</span>
                <h3 className="text-white font-heading font-bold text-xl mb-1">Bravissima!</h3>
                <p className="text-white/80 text-sm">{percentage >= 100 ? "Hai raggiunto l'obiettivo di oggi!" : "Sei a metà dell'opera. Continua così!"}</p>
            </div>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-[#6F1A4A] font-bold text-lg">Idratazione</h2>
                    <p className="text-gray-400 text-xs mt-0.5">L&apos;acqua è l&apos;alleato numero 1 per il pavimento pelvico.</p>
                </div>

                {/* Visual Circle Progress */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-16 h-16 transform -rotate-90">
                        {/* Background plain circle */}
                        <circle cx="32" cy="32" r="28" fill="none" stroke="#f3f4f6" strokeWidth="6" />
                        {/* Progress circle */}
                        <circle
                            cx="32" cy="32" r="28" fill="none"
                            stroke="#0ea5e9" strokeWidth="6" strokeLinecap="round"
                            strokeDasharray="175"
                            strokeDashoffset={175 - (175 * percentage) / 100}
                            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                        />
                    </svg>
                    <span className="absolute text-xs font-bold text-sky-600">{percentage}%</span>
                </div>
            </div>

            {/* Quick Actions (The Nudge) */}
            <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                    onClick={() => addWater(200)}
                    className="flex items-center justify-center space-x-2 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold py-3 rounded-2xl transition-colors border border-sky-100 active:scale-95"
                >
                    <span className="text-lg">🫗</span>
                    <span className="text-sm">+200 ml</span>
                </button>

                <button
                    onClick={() => addWater(500)}
                    className="flex items-center justify-center space-x-2 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold py-3 rounded-2xl transition-colors border border-sky-100 active:scale-95"
                >
                    <span className="text-lg">🍶</span>
                    <span className="text-sm">+500 ml</span>
                </button>
            </div>

            <div className="text-center mt-4">
                <span className="text-[11px] font-medium text-gray-400 tracking-wide uppercase">
                    {currentMl} / {DAILY_GOAL_ML} ml oggi
                </span>
            </div>
        </div>
    );
}
