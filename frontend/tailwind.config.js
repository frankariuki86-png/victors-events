/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Manrope'", "sans-serif"]
      },
      colors: {
        brand: {
          plum: "#6d28d9",
          grape: "#4c1d95",
          gold: "#d4af37",
          cream: "#fdf8f2",
          slate: "#1f1f2b"
        }
      },
      boxShadow: {
        glow: "0 12px 35px rgba(109, 40, 217, 0.28)"
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        fadeInUp: "fadeInUp 0.8s ease forwards"
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};
