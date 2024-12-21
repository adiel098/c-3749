import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#0B1120", // כחול כהה מאוד
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#0EA5E9", // כחול בהיר
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#111827",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#22C55E",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#1F2937",
          foreground: "#9CA3AF",
        },
        accent: {
          DEFAULT: "#3B82F6",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#1E293B", // כחול אפור כהה
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#1E293B", // Adding solid background for popovers
          foreground: "#FFFFFF",
        },
        dialog: {
          DEFAULT: "#1E293B", // Adding solid background for dialogs
          foreground: "#FFFFFF",
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;