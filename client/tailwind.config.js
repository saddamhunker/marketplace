export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"]
      },
      colors: {
        ink: "#05070f",
        panel: "#0b1020",
        line: "#1b2740",
        mint: "#25f2a7",
        cyan: "#4fd8ff",
        amber: "#ffbf47",
        danger: "#ff5c7c"
      }
    }
  },
  plugins: []
};
