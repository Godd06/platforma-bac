/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'var(--background)',
          elevated: 'var(--background-elevated)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
          hover: 'var(--surface-hover)',
          glass: 'var(--surface-glass)',
        },
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
          subtle: 'var(--text-subtle)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
          cyan: 'var(--border-cyan)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          dark: 'var(--accent-dark)',
          soft: 'var(--accent-soft)',
          glow: 'var(--accent-glow)',
          secondary: 'var(--accent-secondary)',
          teal: 'var(--accent-teal)',
        },
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        status: {
          success: 'var(--success)',
          warning: 'var(--warning)',
          danger: 'var(--danger)',
          info: 'var(--info)',
        },
        pro: {
          DEFAULT: 'var(--pro-gold)',
          gradient: 'var(--pro-gradient)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glow-lg': '0 0 45px -5px rgba(6, 182, 212, 0.5)',
        'glow-pro': '0 0 30px -5px rgba(245, 158, 11, 0.35)',
        card: '0 4px 24px rgba(0, 0, 0, 0.35)',
        'card-hover': '0 8px 32px rgba(6, 182, 212, 0.15)',
      },
      backdropBlur: {
        glass: '16px',
        heavy: '24px',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 0.7, transform: 'scale(1.04)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translate(0px, 0px)' },
          '50%': { transform: 'translate(15px, -20px)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translate(0px, 0px)' },
          '50%': { transform: 'translate(-20px, 15px)' },
        },
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 8s ease-in-out infinite',
        'float-slow': 'float-slow 14s ease-in-out infinite',
        'float-reverse': 'float-reverse 16s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
