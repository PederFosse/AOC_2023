import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        wallpaper: '#141E46',
        primary: '#BB2525',
        secondary: '#FF6969',
        thirdary: '#FFF5E0',
      },
      backgroundImage: {
        day1: "url('/images/day1.jpeg')",
        gif: "url('/video/cozy.gif')",
        video: "url('/video/cozy1.mp4')",
      },
    },
    fontFamily: {
      primary: ['Source Code Pro', 'sans-serif'],
    },
  },
  plugins: [],
} satisfies Config;
