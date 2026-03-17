"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, CalendarDays, Plane, Search } from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { name: "Coach", href: "/coach", icon: Dumbbell },
        { name: "Oggi mi sento", href: "/oggi-mi-sento", icon: CalendarDays },
        { name: "Giornate speciali", href: "/giornate-speciali", icon: Plane },
        { name: "Prodotto per te!", href: "/prodotto-per-te", icon: Search },
    ];

    return (
        <div className="px-4 pb-6 pt-2">
            {/* The outer container uses Glassmorphism and inner shadows for a 3D bar effect */}
            <nav className="flex items-start justify-around bg-[#550c35]/80 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.15)] relative">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    const activeBg = "bg-gradient-to-b from-[#e4fa00] to-[#bacc00] text-[#4A0E30] shadow-[0_10px_25px_rgba(216,238,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-4px_8px_rgba(0,0,0,0.15)] scale-[1.15] -translate-y-3";
                    const inactiveBg = "bg-white/5 text-white/70 shadow-[inset_0_2px_2px_rgba(255,255,255,0.1),inset_0_-1px_1px_rgba(0,0,0,0.2)] border border-[#ffffff15] group-hover:bg-white/10 group-hover:text-white group-hover:-translate-y-1";

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center justify-start w-[72px] group relative"
                        >
                            {/* Glow behind the active button */}
                            {isActive && (
                                <div className="absolute -top-3 w-16 h-16 bg-[#D8EE00] rounded-full blur-xl opacity-40 transition-opacity duration-500"></div>
                            )}

                            <div className={`relative flex items-center justify-center w-[58px] h-[58px] rounded-[1.25rem] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-10 box-border ${isActive ? activeBg : inactiveBg}`}>

                                {/* 3D Glass Reflection Highlight on top edge */}
                                {isActive && (
                                    <div className="absolute top-[2px] left-[15%] w-[70%] h-[30%] bg-gradient-to-b from-white/80 to-transparent rounded-t-[1.25rem] opacity-70 mix-blend-overlay"></div>
                                )}

                                <Icon strokeWidth={isActive ? 2.5 : 2} size={isActive ? 28 : 26} className="relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)]" />
                            </div>

                            <span className={`text-[10px] font-bold text-center mt-2 font-sans leading-tight whitespace-pre-wrap transition-all duration-300 drop-shadow-md relative z-10 ${isActive ? "text-[#D8EE00] font-black tracking-wide" : "text-white/80"}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
