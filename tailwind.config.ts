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
        background: "#111827", // bg-gray-900
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#3B82F6",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#1F2937", // bg-gray-800
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#3f8600",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#cf1322",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#374151", // bg-gray-700
          foreground: "#9CA3AF", // text-gray-400
        },
        accent: {
          DEFAULT: "#4F46E5",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#1F2937", // bg-gray-800
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      fontSize: {
        "2xl": "1.75rem",
        xl: "1.25rem",
        sm: "0.875rem",
      },
      spacing: {
        4: "1rem",
        6: "1.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;