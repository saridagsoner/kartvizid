/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                dark: {
                    bg: '#111827', // Gray-900
                    card: '#1F2937', // Gray-800 
                    border: '#374151', // Gray-700
                    text: '#F9FAFB', // Gray-50
                    muted: '#9CA3AF', // Gray-400
                }
            }
        },
    },
    plugins: [],
}
