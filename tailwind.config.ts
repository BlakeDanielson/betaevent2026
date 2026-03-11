import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'beta-blue':  '#1B3A5C',
        'beta-pink':  '#C4697C',
        'beta-cream': '#FAF7F2',
        'beta-dark':  '#111827',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:  ['var(--font-inter)',    'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(to bottom, rgba(27,58,92,0.82) 0%, rgba(27,58,92,0.65) 60%, rgba(17,24,39,0.90) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
