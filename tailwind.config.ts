import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          50: "#faf7f2",
          100: "#f0e9df",
          200: "#e2d5c3",
          300: "#c9a98a",
          400: "#b08060",
          500: "#8B5E3C",
          600: "#5a280e",
          700: "#3d1a08",
          800: "#2a1005",
          900: "#1a0903",
        },
        gold: {
          400: "#d4b56a",
          500: "#c9a14a",
          600: "#a8832e",
        },
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "Georgia", "serif"],
        "be-vietnam": ["var(--font-be-vietnam)", "sans-serif"],
      },
      backgroundImage: {
        "wood-pattern": "url('/images/wood-pattern.png')",
      },
    },
  },
  plugins: [],
};

export default config;
