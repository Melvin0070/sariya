/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#000000', 2: '#5E5E5E', 3: '#8A8A8A' },
        paper: '#FFFFFF',
        tile: '#F3F3F3',
        pill: '#EEEEEE',
        line: '#E2E2E2',
        accent: { DEFAULT: '#FF6A13', soft: '#FFF0E6' },
        pass: { DEFAULT: '#05944F', soft: '#E6F4EC' },
        fail: { DEFAULT: '#E11900', soft: '#FDECEA' },
        warn: { DEFAULT: '#C77700', soft: '#FFF4E0' },
      },
      fontFamily: {
        regular: ['Inter_400Regular'],
        medium: ['Inter_500Medium'],
        semibold: ['Inter_600SemiBold'],
        bold: ['Inter_700Bold'],
        black: ['Inter_800ExtraBold'],
      },
      borderRadius: { card: '16px', sheet: '24px' },
    },
  },
  plugins: [],
};
