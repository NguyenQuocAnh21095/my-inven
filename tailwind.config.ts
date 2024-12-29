import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          400: '#a1d99b',
          500: '#5DB996',
          600: '#118B50',
        },
        yellow:{
          400: '#fdff7d',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
