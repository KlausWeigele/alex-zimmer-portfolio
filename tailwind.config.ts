import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./demo.html",
    "./*.html",
  ],
  theme: {
    extend: {
      colors: {
        // Definiert unser A+ optimiertes Farbsystem
        background: {
          primary: "#0f1419",
          secondary: "#1c252e", 
          tertiary: "#243040"
        },
        text: {
          primary: "#ffffff",
          secondary: "#a3b3bc",
          accent: "#F7C47E"
        },
        accent: {
          gold: "#F7C47E",
          "gold-dark": "#E5A85C",
          mint: "#4fd1c7", 
          "mint-dark": "#0f6b63"
        },
        border: {
          primary: "rgba(247, 196, 126, 0.2)",
          secondary: "rgba(255, 255, 255, 0.1)"
        }
      },
      boxShadow: {
        // Konsistente 10px blur Shadow-System
        'accent': '0 4px 10px rgba(247, 196, 126, 0.15)',
        'accent-lg': '0 8px 20px rgba(247, 196, 126, 0.15)',
        'accent-xl': '0 12px 30px rgba(247, 196, 126, 0.2)',
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.1)',
        'card': '0 4px 10px rgba(0, 0, 0, 0.15)'
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      lineHeight: {
        'relaxed-more': '1.75',
      }
    },
  },
  plugins: [
    // Plugin für bessere Accessibility
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
  // Optimierungen für bessere Performance
  corePlugins: {
    preflight: true,
  },
  // Dark mode als Standard
  darkMode: 'class',
} satisfies Config;

export default config;