import Image from "next/image";
import Link from "next/link";
import { Activity, User, MoonStar, ChevronLeft } from "lucide-react";

export default function CoachPage() {
    return (
        <div className="relative min-h-screen flex flex-col font-sans pb-28 max-w-md mx-auto shadow-2xl">
            {/* Background Image */}
            <div className="absolute inset-x-0 top-1/2 bottom-0 z-0">
                <Image src="/coach-bg.png" alt="Yoga woman" fill className="object-cover opacity-60 mix-blend-overlay object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#6F1A4A] via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 px-6 pt-10 pb-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-[32px] font-black text-white tracking-wide uppercase" style={{ fontFamily: "var(--font-montserrat)" }}>CIAO MARIA!</h1>
                        <h2 className="text-2xl font-bold text-[#D8EE00] tracking-wide mt-1 drop-shadow-md leading-snug" style={{ fontFamily: "var(--font-pacifico)" }}>Ecco cosa ci aspetta<br />oggi:</h2>
                    </div>
                    <a href="/" className="flex-shrink-0 w-10 h-10 rounded-full bg-[#BC5887] text-black border border-black/20 flex items-center justify-center shadow-sm transition-transform hover:scale-105">
                        <ChevronLeft strokeWidth={2.5} size={24} />
                    </a>
                </div>

                <div className="space-y-4">
                    {/* Card 1 */}
                    <div className="bg-[#D47BA4]/80 backdrop-blur-md rounded-[1.5rem] p-5 shadow-lg border-t border-white/20 relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="text-white font-semibold text-xl mb-1">Ore 8.30</div>
                            <div className="text-white/90 font-medium text-sm mb-4 font-serif">Esercizi di respirazione post risveglio</div>
                            <div className="flex justify-center">
                                <Link href="/coach/session" className="bg-white/30 backdrop-blur-sm text-center text-white font-bold text-xl py-3 px-8 rounded-2xl shadow-sm hover:bg-white/40 transition-colors w-full uppercase tracking-wider inline-block">
                                    INIZIAMO!
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white/10 backdrop-blur-md rounded-[1.5rem] p-5 shadow-lg border border-white/10 flex items-center justify-between">
                        <div>
                            <div className="text-white font-semibold text-xl mb-1">Ore 11.30</div>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                            <div className="text-white font-bold text-sm max-w-[120px] leading-tight">Rinforziamo il pavimento pelvico!</div>
                            <div className="w-12 h-12 flex items-center justify-center">
                                <Activity className="w-10 h-10 text-white" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[#D47BA4]/40 backdrop-blur-sm rounded-[1.5rem] p-5 shadow-lg border-t border-white/10 flex items-center justify-between">
                        <div>
                            <div className="text-white font-semibold text-xl mb-1">Ore 17.30</div>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                            <div className="text-white font-bold text-sm max-w-[120px] leading-tight">Mobilità articolare</div>
                            <div className="w-12 h-12 flex items-center justify-center">
                                <User className="w-9 h-9 text-white" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white/20 backdrop-blur-md rounded-[1.5rem] p-5 shadow-lg border border-white/20 flex items-center justify-between">
                        <div>
                            <div className="text-white font-semibold text-xl mb-1">Ore 21.30</div>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                            <div className="text-white font-bold text-sm max-w-[120px] leading-tight">Rilassamento pre sonno</div>
                            <div className="w-12 h-12 flex items-center justify-center">
                                <MoonStar className="w-9 h-9 text-white" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
