/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          main: '#071521',
          secondary: '#0B1F33',
          panel: '#0E2438',
          card: '#112C44',
          hover: '#163857',
        },
        cyan: {
          DEFAULT: '#19C7D8',
          glow: 'rgba(25, 199, 216, 0.25)',
          muted: '#12838e'
        },
        kxblue: {
          DEFAULT: '#4DA3FF',
          glow: 'rgba(77, 163, 255, 0.25)',
        },
        warning: {
          DEFAULT: '#FF9F1C',
          glow: 'rgba(255, 159, 28, 0.25)',
        },
        critical: {
          DEFAULT: '#FF4D4D',
          glow: 'rgba(255, 77, 77, 0.35)',
        },
        success: {
          DEFAULT: '#35D07F',
          glow: 'rgba(53, 208, 127, 0.25)',
        },
        text: {
          primary: '#EAF4F7',
          muted: '#8EA6B6',
          dim: '#5A7588'
        },
        border: {
          subtle: '#1A374F',
          active: '#2A557A'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-critical': 'glowCritical 2s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.65 },
        },
        glowCritical: {
          'from': { boxShadow: '0 0 4px rgba(255, 77, 77, 0.4)' },
          'to': { boxShadow: '0 0 16px rgba(255, 77, 77, 0.85), 0 0 30px rgba(255, 77, 77, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
