import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F172A',
        surface: '#1E293B',
        border: '#334155',
        primary: '#6366F1',
        'primary-hover': '#4F46E5',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        text: '#F1F5F9',
        muted: '#94A3B8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(0,0,0,0.3)',
        'card-hover': '0 8px 40px 0 rgba(99,102,241,0.18)',
        glow: '0 0 24px 0 rgba(99,102,241,0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-in': 'slideIn 0.3s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideIn: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionDuration: {
        '150': '150ms',
      },
    },
  },
  plugins: [],
}

export default config
