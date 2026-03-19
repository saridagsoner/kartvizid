/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./context/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                gray: {
                    900: '#000000',
                },
                dark: {
                    bg: '#000000', // Pure Black
                    card: '#111827', // Gray-900 (previously bg)
                    border: '#1F2937', // Gray-800
                    text: '#F9FAFB', // Gray-50
                    muted: '#9CA3AF', // Gray-400
                }
            }
        },
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
}
