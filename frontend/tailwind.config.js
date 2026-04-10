/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            screens: {
                '3xl': '2560px',
            },
            colors: {
                primary: {
                    DEFAULT: "#f8e6c1",
                    dark: "#e9d5ab",
                },
                secondary: {
                    DEFAULT: "#00887b",
                    dark: "#006d62",
                    light: "#d1f3f0",
                },
                accent: {
                    gold: "#d4af37",
                },
                text: {
                    primary: "#0f172a", // slate-900
                    muted: "#64748b",   // slate-500
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Merriweather', 'serif'],
                display: ['Playfair Display', 'serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'pulse-ring': 'pulseRing 2.5s cubic-bezier(0.24, 0, 0.38, 1) infinite',
                'rotate-slow': 'rotate 10s linear infinite',
                'rotate-reverse': 'rotateReverse 7s linear infinite',
                'shine': 'shine 2s linear infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulseRing: {
                    '0%': { transform: 'scale(0.8)', opacity: '0.5' },
                    '100%': { transform: 'scale(1.5)', opacity: '0' },
                },
                rotate: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                rotateReverse: {
                    '0%': { transform: 'rotate(360deg)' },
                    '100%': { transform: 'rotate(0deg)' },
                },
                shine: {
                    '100%': { transform: 'translateX(200%)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-15px)' },
                }
            },
        },
    },
    plugins: [],
}
