import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal LM Energy
        petroleo: {
          DEFAULT: "#071824", // Azul petróleo escuro — Fundo principal
          900: "#040f17",
          800: "#071824",
          700: "#0a2030",
        },
        grafite: {
          DEFAULT: "#102735", // Azul grafite — Seções secundárias
          800: "#102735",
          700: "#16344a",
          600: "#1d4360",
        },
        gelo: {
          DEFAULT: "#F4F7FA", // Branco gelo — Textos principais
          100: "#F4F7FA",
          200: "#e5ebf1",
        },
        energia: {
          DEFAULT: "#F4B223", // Amarelo energia — CTA / destaque
          400: "#f6c14f",
          500: "#F4B223",
          600: "#d6981a",
        },
        aco: {
          DEFAULT: "#7E8B96", // Cinza aço — Textos secundários
          400: "#9aa6b0",
          500: "#7E8B96",
          600: "#5f6c77",
        },
        sustentavel: {
          DEFAULT: "#2BB673", // Verde sustentável — Indicadores positivos
          400: "#4ec78e",
          500: "#2BB673",
          600: "#1f9a5e",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "radial-spot":
          "radial-gradient(60% 50% at 50% 0%, rgba(244,178,35,0.18) 0%, rgba(7,24,36,0) 70%)",
        "hero-grid":
          "linear-gradient(rgba(244,247,250,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(244,247,250,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      boxShadow: {
        glow: "0 0 60px -10px rgba(244,178,35,0.45)",
        card: "0 20px 60px -20px rgba(0,0,0,0.55)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
