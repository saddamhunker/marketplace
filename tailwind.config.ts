import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        saffron: "#ff8a00",
        mint: "#17b978",
        jamun: "#7c3aed"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 32, 38, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
