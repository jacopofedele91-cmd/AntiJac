"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import BottomNav from "../../components/BottomNav";
import { ArrowLeft } from 'lucide-react';

type Answer = string | string[];

const QUESTIONS = [
    { id: 'q1', type: 'single', text: "1. Da quanto tempo registri episodi con piccole perdite?", options: ["Pochi giorni / Settimane", "Qualche mese", "Più di un anno"] },
    { id: 'q2', type: 'single', text: "2. Fino ad oggi cosa hai usato per rimediare?", options: ["Proteggislip", "Assorbenti", "Nulla"] },
    { id: 'q3', type: 'single', text: "3. Quante volte al giorno registri perdite?", options: ["Occasionalmente (1 volta o meno)", "Spesso (2-3 volte)", "Molto spesso (Più di 3 volte)"] },
    { id: 'q4', type: 'single', text: "4. Conduci una vita dinamica (passeggiate, allenamenti, ecc)?", options: ["No", "Poco", "Molto"] },
    { id: 'q5', type: 'single', text: "5. I tuoi piccoli momenti «ops» limitano in qualche modo le tue scelte di vita?", options: ["No", "Poco", "Molto"] }
];

export default function ProdottoPerTePage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, Answer>>({});
    const [result, setResult] = useState<string | null>(null);
    const [momentiOps, setMomentiOps] = useState(0);
    const [isOpsModalOpen, setIsOpsModalOpen] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const OPS_TRIGGERS = [
        { id: 't1', icon: '🤧', label: 'Starnuto / Tosse' },
        { id: 't2', icon: '😄', label: 'Risata' },
        { id: 't3', icon: '🏃‍♀️', label: 'Sforzo sportivo' },
        { id: 't4', icon: '🏋️‍♀️', label: 'Sollevamento pesi' },
        { id: 't5', icon: '🤷‍♀️', label: 'Nessuno sforzo' }
    ];

    const handleSelect = (questionId: string, option: string, type: string) => {
        if (type === 'single') {
            setAnswers({ ...answers, [questionId]: option });
        } else {
            const current = (answers[questionId] as string[]) || [];
            const updated = current.includes(option) ? current.filter(o => o !== option) : [...current, option];
            setAnswers({ ...answers, [questionId]: updated });
        }
    };

    const nextStep = () => {
        if (step < QUESTIONS.length - 1) setStep(step + 1);
        else finishQuestionnaire(answers);
    };

    const handleBack = () => {
        if (step > 0 && step < QUESTIONS.length) {
            setStep(step - 1);
        } else {
            router.push('/');
        }
    };

    const finishQuestionnaire = (finalAnswers: Record<string, Answer>) => {
        calculateProduct(finalAnswers);
    };

    const calculateProduct = (ans: Record<string, Answer>) => {
        let score = 0;
        let baseLevel = 1;
        let extraLevels = 0;

        // Q2: Cosa hai usato
        const q2 = ans['q2'] as string;
        if (q2 === "Proteggislip") score += 1;
        else if (q2 === "Assorbenti") score += 3;

        // Q3: Quante volte
        const q3 = ans['q3'] as string;
        if (q3 === "Occasionalmente (1 volta o meno)") score += 1;
        else if (q3 === "Spesso (2-3 volte)") score += 3;
        else if (q3 === "Molto spesso (Più di 3 volte)") score += 5;

        // Mapping Punteggio -> Livello base
        if (score <= 2) baseLevel = 1;      // L1 LONG
        else if (score <= 4) baseLevel = 2; // L2 MINI
        else if (score <= 6) baseLevel = 3; // L3 NORMAL
        else if (score <= 7) baseLevel = 4; // L4 EXTRA
        else baseLevel = 5;                 // L5 MAXI

        // Aggiunte di livello + Override
        const q4 = ans['q4'] as string;
        if (q4 === "Molto") extraLevels += 1;

        const q5 = ans['q5'] as string;
        if (q5 === "Molto") extraLevels += 1;

        let finalLevel = Math.min(5, baseLevel + extraLevels);

        // Regole dinamiche (Momenti Ops)
        if (momentiOps > 3 && finalLevel < 5) finalLevel += 1;

        const levelStr = `L${finalLevel}`;
        setResult(levelStr);
        setStep(QUESTIONS.length);

        // Save profile to backend
        fetch('http://localhost:8000/product-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: 'user_123',
                answers: ans,
                calculated_level: levelStr,
                timestamp: new Date().toISOString()
            })
        }).catch(err => console.error("Error saving product profile:", err));
    };

    const handleMomentoOpsClick = () => {
        setIsOpsModalOpen(true);
    };

    const submitMomentoOps = async (triggerId: string) => {
        // Aggiornamento UI ottimistico per garantire sempre la chiusura della modale immediatamente
        setIsOpsModalOpen(false);
        setMomentiOps(prev => prev + 1);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);

        // Ricalcolo al volo del livello (Smart Advice simulation)
        if (answers['q1']) {
            try {
                calculateProduct(answers);
            } catch (e) {
                console.error("Errore ricalcolo prodotto:", e);
            }
        }

        try {
            await fetch('http://localhost:8000/momenti-ops', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: 'user_123',
                    trigger_type: triggerId,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (error) {
            console.error("Errore salvataggio Momento Ops:", error);
        }
    };

    const renderQuestion = () => {
        const q = QUESTIONS[step];
        return (
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white/20 animate-fade-in">
                <h2 className="font-semibold text-xl mb-6 text-white drop-shadow-md">{q.text}</h2>
                <div className="space-y-3">
                    {q.options.map(opt => {
                        const isSelected = q.type === 'single' ? answers[q.id] === opt : ((answers[q.id] as string[]) || []).includes(opt);
                        return (
                            <button
                                key={opt}
                                onClick={() => handleSelect(q.id, opt, q.type)}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${isSelected ? 'border-[#D8EE00] bg-white/20 text-white font-semibold backdrop-blur-sm' : 'border-white/20 text-white/90 hover:bg-white/10 hover:border-white/40 backdrop-blur-sm bg-white/5'}`}
                            >
                                {opt}
                            </button>
                        )
                    })}
                </div>
                <button
                    onClick={nextStep}
                    disabled={!answers[q.id] || (q.type === 'multi' && (answers[q.id] as string[]).length === 0)}
                    className={`mt-6 w-full py-3 rounded-xl font-semibold transition-colors ${answers[q.id] && (q.type === 'single' || (answers[q.id] as string[]).length > 0)
                        ? 'bg-[#D8EE00] text-[#4A0E30] hover:bg-[#c8de00]'
                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                        }`}
                >
                    Continua
                </button>
            </div>
        );
    };

    const renderResult = () => {
        if (result === 'Skipped') {
            return (
                <div className="bg-[#D47BA4] p-6 rounded-3xl shadow-sm text-center text-white">
                    Consiglio personalizzato saltato! Esplora il resto dell'app.
                </div>
            )
        }

        const getProductName = (res: string | null) => {
            switch (res) {
                case 'L1': return 'LONG';
                case 'L2': return 'MINI';
                case 'L3': return 'NORMAL';
                case 'L4': return 'EXTRA';
                case 'L5': return 'MAXI';
                default: return 'EXTRA';
            }
        };

        const getSpecialProductLevel = (res: string | null) => {
            switch (res) {
                case 'L1': return 'L3'; // NORMAL
                case 'L2': return 'L4'; // EXTRA
                case 'L3': return 'L4'; // EXTRA
                case 'L4': return 'L5'; // MAXI
                case 'L5': return 'L5'; // MAXI
                default: return 'L4';
            }
        };

        const getSpecialProduct = (res: string | null) => {
            const spl = getSpecialProductLevel(res);
            return getProductName(spl);
        };

        return (
            <div className="w-full flex flex-col space-y-4 animate-fade-in pb-10">
                {/* Ripeti questionario */}
                <button onClick={() => { setStep(0); setAnswers({}); setMomentiOps(0); }} className="w-full bg-[#8A2E5C] hover:bg-[#973A66] transition-colors rounded-xl p-5 text-center shadow-md cursor-pointer border-none">
                    <p className="text-white/90 text-sm font-bold tracking-widest uppercase">Abitudini cambiate?</p>
                    <h3 className="text-white text-3xl mt-1 tracking-wide" style={{ fontFamily: "var(--font-pacifico)" }}>Ripeti il questionario!</h3>
                </button>

                {/* Main product recommendation */}
                <div className="w-full bg-[#BC5887] rounded-xl p-6 text-center shadow-lg relative overflow-hidden">
                    <p className="text-white text-sm">In base alle tue risposte,</p>
                    <p className="text-[#D8EE00] font-bold text-lg mb-4">il prodotto adatto a te è:</p>

                    <div className="flex justify-between items-center text-left">
                        <div className="w-1/2 pr-2">
                            <h2 className="text-white font-serif font-bold text-2xl leading-tight">
                                LINES <br />SPECIALIST <br />{getProductName(result)}
                            </h2>
                        </div>
                        <div className="w-1/2 flex justify-end">
                            <Image 
                                src={`/images/products/${result || 'L3'}_pack.png`}
                                alt={`Lines Specialist ${getProductName(result)}`}
                                width={120}
                                height={160}
                                className="object-contain drop-shadow-xl"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Split layout */}
                <div className="flex space-x-3">
                    {/* Special Days Product */}
                    <Link href="/giornate-speciali" className="w-1/2 bg-[#BC5887] hover:bg-[#a64e75] transition-colors rounded-xl p-4 flex flex-col text-center shadow-lg justify-start cursor-pointer group">
                        <p className="text-white text-xs mb-3 font-semibold leading-tight group-hover:scale-105 transition-transform">Nelle tue <span className="text-[#D8EE00]">giornate speciali</span><br />ti consigliamo:</p>
                        <div className="flex flex-col items-center flex-grow justify-end group-hover:scale-105 transition-transform">
                            <Image 
                                src={`/images/products/${getSpecialProductLevel(result)}_pack.png`}
                                alt={`Lines Specialist ${getSpecialProduct(result)}`}
                                width={80}
                                height={120}
                                className="object-contain drop-shadow-lg mb-2"
                            />
                            <h3 className="text-white font-serif font-bold text-[11px] leading-tight flex items-center mt-1">
                                LINES SPECIALIST<br />{getSpecialProduct(result)}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline text-[#D8EE00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </h3>
                        </div>
                    </Link>

                    {/* Momento Ops widget */}
                    <div className="w-1/2 bg-[#6F1A4A] rounded-xl p-4 flex flex-col text-center shadow-lg border-2 border-white/10 items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95" onClick={handleMomentoOpsClick}>
                        <div className="relative mb-3 mt-1 flex justify-center items-center w-[90px] h-[90px]">
                            {/* Premium pulsing aura effect - properly centered and proportional */}
                            <div className="absolute inset-0 m-auto w-[110%] h-[110%] bg-[#D8EE00]/20 rounded-full animate-ping"></div>
                            <div className="absolute inset-0 m-auto w-[120%] h-[120%] border-[2px] border-[#D8EE00]/30 rounded-full animate-pulse"></div>
                            
                            <div className="relative bg-[#BC5887] w-[75px] h-[75px] rounded-full flex flex-col items-center justify-center z-10 shadow-lg border-[2px] border-[#D8EE00]/60 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                <span className="text-white font-bold tracking-[0.1em] text-[10px] leading-none z-10">MOMENTO</span>
                                <span className="text-white text-[22px] leading-none z-10 mt-0.5" style={{ fontFamily: "var(--font-pacifico)" }}>Ops</span>
                            </div>
                        </div>
                        <p className="text-white/90 text-[10px] leading-tight mb-2 mt-2">
                            Registra qui i tuoi momenti «Ops» durante la giornata per permetterci di consigliarti il sempre con maggior precisione!
                        </p>
                        <div className="text-[#D8EE00] font-bold text-xs">({momentiOps} registrati)</div>
                    </div>
                </div>

                {/* Modale Bottom Sheet per Momento Ops */}
                {isOpsModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fade-in px-4 pb-24">
                        <div className="bg-[#f8f9fa] w-full max-w-sm rounded-[2rem] p-6 shadow-2xl translate-y-0 transform transition-transform border border-white">
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-5"></div>

                            <h3 className="text-[#6F1A4A] font-bold text-2xl mb-1 text-center font-serif">Momento Ops</h3>
                            <p className="text-gray-500 text-sm text-center mb-6 leading-tight">Cosa stavi facendo quando è successo?</p>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {OPS_TRIGGERS.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => submitMomentoOps(t.id)}
                                        className="flex flex-col items-center justify-center bg-white hover:bg-pink-50 border border-gray-200 p-4 rounded-xl transition-colors active:scale-95 shadow-sm"
                                    >
                                        <span className="text-3xl mb-2">{t.icon}</span>
                                        <span className="text-[#6F1A4A] font-bold text-[11px] uppercase tracking-wide text-center">{t.label}</span>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setIsOpsModalOpen(false)}
                                className="w-full text-center text-gray-400 font-bold text-sm py-2 hover:text-gray-600 transition-colors"
                            >
                                Annulla
                            </button>
                        </div>
                    </div>
                )}

                {/* Toast Successo */}
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 bg-[#D8EE00] text-[#6F1A4A] px-6 py-3 rounded-full shadow-lg z-50 font-bold text-sm tracking-wide flex items-center transition-all duration-300 ${showSuccessToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
                    <span>💖 Non preoccuparti, capita. Salvato!</span>
                </div>
            </div>
        );
    };

    return (
        <main className="min-h-screen pb-24 font-sans relative max-w-md mx-auto transition-colors duration-500">
            {step < QUESTIONS.length ? (
                <header className="pt-12 pb-4 px-6 sticky top-0 z-20 flex flex-col backdrop-blur-xl bg-white/10 border-b border-white/10">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-[32px] font-black tracking-wide uppercase text-white" style={{ fontFamily: "var(--font-montserrat)" }}>CIAO MARIA!</h1>
                        <button onClick={handleBack} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
                            <span className="sr-only">Back</span>
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="bg-[#D47BA4] text-white py-2 px-4 rounded-xl text-center shadow-sm w-full font-serif italic text-lg mb-6 truncate whitespace-nowrap overflow-hidden">
                        Dicci di Te!
                    </div>

                    <div className="flex justify-between items-end mb-1.5 mt-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Domanda {step + 1} di {QUESTIONS.length}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-[#6F1A4A] h-2 rounded-full transition-all duration-300" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}></div>
                    </div>
                </header>
            ) : (
                <header className="pt-12 pb-4 px-6 sticky top-0 z-20 flex justify-between items-center bg-[#6F1A4A]">
                    <h1 className="text-[32px] font-black tracking-wide uppercase text-white" style={{ fontFamily: "var(--font-montserrat)" }}>CIAO MARIA!</h1>
                    <button onClick={handleBack} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm transition-transform hover:scale-110">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </header>
            )}

            <div className="px-6 space-y-6 mt-4 relative z-10">
                {step < QUESTIONS.length ? renderQuestion() : renderResult()}
            </div>

            <div className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 z-50">
                <BottomNav />
            </div>
        </main>
    );
}
