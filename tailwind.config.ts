import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#C9748F",
          light: "#D98A9F",
          dark: "#B05E78",
        },
        secondary: "#F5E6D3",
        accent: "#8B6B8A",
        dark: "#2D2025",
        surface: "#FDF7F2",
        brand: {
          text: "#3A2A30",
          muted: "#7A6268",
          border: "#EDD9CB",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["DM Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(45,32,37,0.08), 0 1px 4px rgba(45,32,37,0.08)",
        "card-hover": "0 8px 32px rgba(45,32,37,0.14), 0 2px 8px rgba(45,32,37,0.08)",
        "btn": "0 2px 8px rgba(201,116,143,0.35)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
