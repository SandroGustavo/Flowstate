/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background:                '#131315',
        surface:                   '#131315',
        'surface-dim':             '#131315',
        'surface-container-low':   '#1c1b1d',
        'surface-container':       '#201f22',
        'surface-container-high':  '#2a2a2c',
        'surface-bright':          '#39393b',
        'on-surface':              '#e5e1e4',
        'on-surface-variant':      '#ccc3d8',
        'outline':                 '#958da1',
        'outline-variant':         '#4a4455',
        'primary':                 '#d2bbff',
        'primary-container':       '#7c3aed',
        'on-primary':              '#3f008e',
        'on-primary-container':    '#ede0ff',
        'secondary':               '#5de6ff',
        'secondary-container':     '#00cbe6',
        'tertiary':                '#4edea3',
        'tertiary-container':      '#007650',
        'error':                   '#ffb4ab',
        'error-container':         '#93000a',
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg':   ['3.5rem',  { lineHeight: '1',    letterSpacing: '-0.035em', fontWeight: '700' }],
        'display-md':   ['2.25rem', { lineHeight: '1.1',  letterSpacing: '-0.025em', fontWeight: '700' }],
        'headline-lg':  ['1.75rem', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '700' }],
        'body-sm':      ['0.875rem', { lineHeight: '1.6' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':       { transform: 'scale(1.15)' },
        },
        bloom: {
          '0%':   { transform: 'scale(0)',   opacity: '0' },
          '70%':  { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.4' },
        },
      },
      animation: {
        'fade-in':        'fade-in 0.3s ease-out both',
        'slide-in-left':  'slide-in-left 0.3s ease-out both',
        'slide-in-right': 'slide-in-right 0.3s ease-out both',
        shimmer:          'shimmer 2s linear infinite',
        pulse:            'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        breathe:          'breathe 4s ease-in-out infinite',
        bloom:            'bloom 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
