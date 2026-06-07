import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:  ["DM Sans", "system-ui", "sans-serif"],
        serif: ["Lora", "Georgia", "serif"],
      },
      colors: {
        rose: {
          50:  "#fdf0f1",
          100: "#fbeaf0",
          200: "#f5c4c9",
          300: "#f4c0d1",
          400: "#e8697a",
          500: "#d4537e",
          600: "#c97aa0",
          700: "#993556",
          800: "#72243e",
          900: "#4b1528",
        },
        sage: {
          50:  "#eef7f1",
          100: "#eaf3de",
          400: "#6aaa80",
          600: "#3b6d11",
          800: "#27500a",
        },
        amber: {
          50:  "#fdf5e6",
          400: "#e8a030",
          600: "#854f0b",
        },
        lav: {
          50:  "#f4f0fb",
          100: "#eeedfe",
          400: "#9b7fd4",
          600: "#534ab7",
          800: "#3c3489",
        },
        ink: {
          DEFAULT: "#18162a",
          mid:     "#46425e",
          soft:    "#8a869e",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.25s ease forwards",
        "pulse2":  "pulse2 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulse2: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(232,105,122,0.4)" },
          "50%":      { boxShadow: "0 0 0 8px rgba(232,105,122,0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
