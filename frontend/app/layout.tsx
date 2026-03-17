import type { Metadata } from 'next';
import { Inter, Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';
import BottomNav from '@/components/BottomNav';
import AppBackground from '@/components/AppBackground';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-playfair'
});
const montserrat = Montserrat({
    weight: ['400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
    variable: '--font-montserrat'
});

export const metadata: Metadata = {
    title: 'Lines Specialist Coach',
    description: 'Il tuo percorso di benessere quotidiano',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="it">
            <body className={`${inter.variable} ${playfair.variable} ${montserrat.variable} font-sans antialiased`}>
                {/* Global gradient background — fixed, sits behind everything */}
                <AppBackground />

                <div className="mx-auto max-w-md min-h-screen relative overflow-x-hidden flex flex-col">
                    <main className="flex-grow overflow-y-auto w-full no-scrollbar pb-24">
                        {children}
                    </main>

                    {/* BottomNav — no bg override so gradient shows through */}
                    <div className="fixed bottom-0 w-full max-w-md z-50">
                        <BottomNav />
                    </div>
                </div>
            </body>
        </html>
    );
}
