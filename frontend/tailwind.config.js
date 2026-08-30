/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FAFAF7",
        surface: "#FFFFFF",
        ink: "#14181B",
        muted: "#68706E",
        primary: {
          DEFAULT: "#154D44",
          light: "#1E6C5F",
          dark: "#0E332C",
        },
        accent: {
          DEFAULT: "#E0A526",
          light: "#F0BE55",
          dark: "#B3820F",
        },
        success: "#2F7D52",
        danger: "#C0392B",
        border: "#E4E1D8",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
    },
  },
  plugins: [],
};
