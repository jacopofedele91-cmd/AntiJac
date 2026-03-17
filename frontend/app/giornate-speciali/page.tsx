import Link from 'next/link';
import { Dumbbell, Plane, ChevronLeft } from 'lucide-react';

export default function GiornateSpecialiPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans relative pb-28">
            <header className="pt-12 pb-4 px-6 flex justify-between items-start z-10 text-white">
                <div>
                    <h1 className="text-[32px] font-black text-white tracking-wide uppercase" style={{ fontFamily: "var(--font-montserrat)" }}>CIAO MARIA!</h1>
                    <h2 className="text-2xl font-bold text-[#D8EE00] tracking-wide mt-1 drop-shadow-md leading-snug" style={{ fontFamily: "var(--font-pacifico)" }}>Oggi giornata speciale!</h2>
                </div>
                <Link href="/" className="w-10 h-10 rounded-full bg-[#BC5887] flex items-center justify-center text-black border border-black/20 shadow-sm transition-transform hover:scale-105">
                    <ChevronLeft strokeWidth={2.5} size={24} />
                </Link>
            </header>

            <div className="mx-6 mt-2 mb-6 bg-[#BC5887] rounded-xl p-3 text-center shadow-md">
                <p className="text-white font-bold tracking-widest uppercase text-sm leading-tight">SELEZIONA COSA TI ASPETTA<br />OGGI</p>
                <p className="text-white font-bold text-xs mt-1">e ti aiuteremo a prepararti al meglio!</p>
            </div>

            <div className="px-6 flex-1 flex space-x-4 pb-4">

                {/* Card 1: Sport Intenso */}
                <Link href="/giornate-speciali/sport" className="w-1/2 relative rounded-xl overflow-hidden shadow-lg group transition-transform active:scale-95 flex flex-col bg-[#BC5887]">
                    <div className="h-3/5 relative">
                        <img src="/images/woman_sport_over50_1773129453413.png" alt="Sport intenso" className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100" />
                    </div>
                    <div className="h-2/5 flex flex-col items-center justify-center p-2 text-center bg-[#BC5887]">
                        <h2 className="text-[#D8EE00] text-lg leading-snug drop-shadow-md" style={{ fontFamily: "var(--font-pacifico)" }}>Giornata di sport<br />intenso</h2>
                    </div>
                </Link>

                {/* Card 2: Viaggio */}
                <Link href="/giornate-speciali/viaggio" className="w-1/2 relative rounded-xl overflow-hidden shadow-lg group transition-transform active:scale-95 flex flex-col bg-[#BC5887]">
                    <div className="h-3/5 relative">
                        <img src="/images/woman_travel_over50_1773129467890.png" alt="Viaggio o spostamento" className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100" />
                    </div>
                    <div className="h-2/5 flex flex-col items-center justify-center p-2 text-center bg-[#BC5887]">
                        <h2 className="text-[#D8EE00] text-lg leading-snug drop-shadow-md" style={{ fontFamily: "var(--font-pacifico)" }}>Viaggio o<br />spostamento<br />lungo</h2>
                    </div>
                </Link>

            </div>
        </div>
    );
}
