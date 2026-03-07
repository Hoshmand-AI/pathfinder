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
        navy: {
          950: "#0A1628",
          900: "#0F2140",
          800: "#162D54",
          700: "#1E3A6A",
        },
        gold: {
          600: "#B8862E",
          500: "#C8963E",
          400: "#D4A94F",
          100: "#FDF6E9",
        },
        warm: {
          700: "#4A443C",
          600: "#6B6359",
          500: "#8A8178",
          400: "#B8B0A4",
          300: "#E2DDD5",
          200: "#F0EDE8",
          100: "#F8F6F3",
          50:  "#FDFCFA",
        },
        success: "#3D8B6E",
        warning: "#C4873B",
        danger:  "#B85C5C",
        info:    "#4A7FB5",
      },
      fontFamily: {
        serif: ["DM Serif Display", "Georgia", "serif"],
        sans:  ["DM Sans", "system-ui", "sans-serif"],
      },
      animation: {
        none: "none",
      },
    },
  },
  plugins: [],
};

export default config;
