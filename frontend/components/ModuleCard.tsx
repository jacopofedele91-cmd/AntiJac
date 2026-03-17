import Link from "next/link";
import { ReactNode } from "react";

interface ModuleCardProps {
    title: string;
    href: string;
    icon?: string;
    className?: string;
    backgroundImage?: string;
    children?: ReactNode;
}

export default function ModuleCard({ title, href, icon, className = "", backgroundImage, children }: ModuleCardProps) {
    return (
        <Link href={href} className="block group">
            <div
                className={`relative overflow-hidden rounded-[2rem] bg-pink-dusty p-6 h-48 sm:h-56 flex flex-col justify-end transition-transform duration-300 group-hover:scale-[1.02] shadow-lg ${className}`}
                style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
                {/* Overlay for readability if image exists */}
                {backgroundImage && (
                    <div className="absolute inset-0 bg-plum-dark/40 backdrop-blur-[2px] rounded-[2rem] transition-opacity group-hover:bg-plum-dark/30 z-0"></div>
                )}

                <div className="relative z-10 flex flex-col items-start gap-2">
                    {icon && <span className="text-4xl drop-shadow-md">{icon}</span>}
                    <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white drop-shadow-md leading-tight">
                        {title}
                    </h2>
                    {children && <div className="mt-2 text-white/90 text-sm">{children}</div>}
                </div>
            </div>
        </Link>
    );
}
