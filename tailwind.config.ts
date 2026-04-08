import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          0: '#0a0a0a',
          1: '#111111',
          2: '#1a1a1a',
          3: '#222222',
          4: '#2a2a2a',
        },
        border: {
          DEFAULT: '#2a2a2a',
          subtle: '#1f1f1f',
        },
        text: {
          primary: '#f0f0f0',
          secondary: '#888888',
          muted: '#555555',
        },
        accent: {
          blue: '#3b82f6',
          green: '#22c55e',
          amber: '#f59e0b',
          red: '#ef4444',
          yellow: '#eab308',
        },
      },
      fontSize: {
        'display': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '18px', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}

export default config
