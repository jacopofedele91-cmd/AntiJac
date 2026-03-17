"use client";

import Link from 'next/link';
import TravelTimer from '../../../components/GiornateSpeciali/TravelTimer';

export default function ViaggioLungoPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-body pb-28">

            {/* Header Decorativo */}
            <div className="bg-sky-700 pt-12 pb-16 px-6 relative rounded-b-[2.5rem] shadow-md z-10">
                <Link href="/giornate-speciali" className="inline-flex items-center text-white/80 hover:text-white transition-colors text-sm font-medium mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Indietro
                </Link>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold font-heading text-white tracking-wide">Viaggio</h1>
                        <p className="text-white/80 text-sm mt-1">Spostamenti tranquilli, tappe sicure.</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl shadow-inner backdrop-blur-sm">
                        ✈️
                    </div>
                </div>
            </div>

            {/* Checklist Consigli */}
            <div className="px-6 -mt-8 relative z-20 space-y-6">

                {/* Timer di Viaggio Widget */}
                <TravelTimer durationMinutes={90} />

                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                    <h2 className="text-[#6F1A4A] font-bold text-lg mb-5 font-heading uppercase tracking-wide">Ecco qualche consiglio:</h2>

                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <span className="text-sky-500 text-xl mr-3 leading-none mt-0.5">✅</span>
                            <span className="text-gray-700 font-medium text-sm leading-snug">Pianifica le soste ogni 2-3 ore.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-sky-500 text-xl mr-3 leading-none mt-0.5">✅</span>
                            <span className="text-gray-700 font-medium text-sm leading-snug">Idratati a piccoli sorsi.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-sky-500 text-xl mr-3 leading-none mt-0.5">✅</span>
                            <span className="text-gray-700 font-medium text-sm leading-snug">Evita caffè e bevande gasate durante il viaggio.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-sky-500 text-xl mr-3 leading-none mt-0.5">✅</span>
                            <span className="text-gray-700 font-medium text-sm leading-snug">Vestiti comodo ed evita pressione nella zona inguinale.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-sky-500 text-xl mr-3 leading-none mt-0.5">✅</span>
                            <span className="text-gray-700 font-medium text-sm leading-snug">Prepara il tuo kit cambio, con <span className="text-sky-700 font-bold">2-3 prodotti, salviettine e un cambio leggero</span>.</span>
                        </li>
                    </ul>
                </div>

            </div>

        </div>
    );
}
