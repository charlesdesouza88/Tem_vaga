import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Claymorphism Palette
                primary: {
                    50: '#EBF5FF',
                    100: '#D6EBFF',
                    200: '#AED7FF',
                    300: '#85C3FF',
                    400: '#5CAFFF',
                    500: '#58A6FF',
                    600: '#3D8AE6',
                    700: '#2D6BB3',
                    800: '#1E4D80',
                    900: '#0F2E4D',
                },
                accent: {
                    50: '#E5FFF5',
                    100: '#CCFFEB',
                    200: '#99FFD7',
                    300: '#7CFAC2',
                    400: '#5EE6AA',
                    500: '#40D392',
                    600: '#33B378',
                    700: '#26935E',
                    800: '#1A7344',
                    900: '#0D532A',
                },
                surface: {
                    white: '#FFFFFF',
                    cream: '#FEFBF8',
                    beige: '#F7EFE5',
                    warm: '#F0E6DC',
                },
                neutral: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#212121',
                    900: '#111827',
                },
                border: {
                    light: '#E8DFD4',
                    medium: '#D4C5B5',
                    subtle: 'rgba(88, 166, 255, 0.12)',
                },
                // Keep shadcn compatibility
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
            },
            boxShadow: {
                'clay-sm': '4px 4px 12px rgba(88, 166, 255, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.9), inset 1px 1px 2px rgba(255, 255, 255, 0.5)',
                'clay-md': '8px 8px 20px rgba(88, 166, 255, 0.12), -8px -8px 20px rgba(255, 255, 255, 0.95), inset 2px 2px 4px rgba(255, 255, 255, 0.6)',
                'clay-lg': '12px 12px 28px rgba(88, 166, 255, 0.15), -12px -12px 28px rgba(255, 255, 255, 1), inset 3px 3px 6px rgba(255, 255, 255, 0.7)',
                'clay-inset': 'inset 4px 4px 12px rgba(88, 166, 255, 0.06), inset -4px -4px 12px rgba(255, 255, 255, 0.8)',
                'float': '0 8px 24px rgba(88, 166, 255, 0.1), 0 2px 8px rgba(88, 166, 255, 0.06)',
            },
            borderRadius: {
                'clay-sm': '8px',
                'clay-md': '12px',
                'clay-lg': '16px',
                'clay-xl': '20px',
                'clay-2xl': '24px',
            },
        }
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
