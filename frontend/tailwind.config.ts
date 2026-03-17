import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    purple: "#6F1A4A",
                    lightPurple: "#9e3471",
                    gold: "#c5a059", // Premium gold/yellow replacement for the harsh yellow
                    magenta: "#e6007e",
                    teal: "#00dfd8",
                    darkblue: "#1d214c",
                    bg: "#fcfafb", // Off-white premium background
                }
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                serif: ['var(--font-playfair)', 'serif'],
            }
        },
    },
    plugins: [],
}
export default config
