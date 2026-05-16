import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'var(--color-surface)',
          dim: 'var(--color-surface-dim)',
          bright: 'var(--color-surface-bright)',
          container: {
            lowest: 'var(--color-surface-container-lowest)',
            low: 'var(--color-surface-container-low)',
            DEFAULT: 'var(--color-surface-container)',
            high: 'var(--color-surface-container-high)',
            highest: 'var(--color-surface-container-highest)',
          },
        },
        on: {
          surface: 'var(--color-on-surface)',
          'surface-variant': 'var(--color-on-surface-variant)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          container: 'var(--color-primary-container)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          container: 'var(--color-secondary-container)',
        },
        tertiary: {
          DEFAULT: 'var(--color-tertiary)',
          container: 'var(--color-tertiary-container)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          container: 'var(--color-error-container)',
        },
      },
      fontFamily: {
        display: ['var(--font-geist)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      spacing: {
        '4px': '4px',
        '8px': '8px',
        '16px': '16px',
        '24px': '24px',
        '40px': '40px',
        '64px': '64px',
        gutter: '20px',
        margin: '24px',
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
};

export default config;
