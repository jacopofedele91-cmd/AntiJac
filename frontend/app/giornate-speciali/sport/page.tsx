"use client";

import Link from 'next/link';

export default function SportIntensoPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-body pb-28">

            {/* Header Decorativo */}
            <div className="bg-[#BC5887] pt-12 pb-16 px-6 relative rounded-b-[2.5rem] shadow-md z-10">
                <Link href="/giornate-speciali" className="inline-flex items-center text-white/80 hover:text-white transition-colors text-sm font-medium mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Indietro
                </Link>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold font-heading text-white">Giornata di sport intenso</h1>
                        <p className="text-white/80 text-sm mt-1">Preparati al meglio senza pensieri.</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl shadow-inner backdrop-blur-sm">
                        🏃‍♀️
                    </div>
                </div>
            </div>

            {/* Checklist Consigli */}
            <div className="px-6 -mt-8 relative z-20">
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                    <h2 className="text-[#6F1A4A] font-bold text-lg mb-5 font-heading uppercase tracking-wide">Ecco qualche consiglio:</h2>

                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <span className="text-[#BC5887] text-xl mr-3 leading-none mt-0.5">✅</span>
                            <span className="text-gray-700 font-medium text-sm leading-snug">Recati al bagno 15-20 min prima dell&apos;attività.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-[#BC5887] text-xl mr-3 leading-none mt-0.5">✅</span>
                            <span className="text-gray-700 font-medium text-sm leading-snug">Usa un prodotto più protettivo di quello che usi di solito <span className="text-[#6F1A4A] font-bold">(1 o 2 gocce in più)</span>.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-[#BC5887] text-xl mr-3 leading-none mt-0.5">✅</span>
                            <span className="text-gray-700 font-medium text-sm leading-snug">Evita caffè e bevande gasate prima dell&apos;allenamento.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-[#BC5887] text-xl mr-3 leading-none mt-0.5">✅</span>
                            <span className="text-gray-700 font-medium text-sm leading-snug">Simula a casa qualche movimento più &quot;estremo&quot; per verificare la stabilità dell&apos;assorbente/Pant.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-[#BC5887] text-xl mr-3 leading-none mt-0.5">✅</span>
                            <span className="text-gray-700 font-medium text-sm leading-snug">Utilizza leggins/abbigliamento sportivo scuro ed aderente.</span>
                        </li>
                    </ul>
                </div>

                {/* CTA Rassicurante */}
                <div className="mt-6 bg-[#D8EE00] rounded-2xl p-5 text-center shadow-sm">
                    <p className="text-[#6F1A4A] font-bold text-sm">Pronta per dare il massimo?<br />Certo che sì! 💪</p>
                </div>
            </div>

        </div>
    );
}
