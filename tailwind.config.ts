import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "Manrope", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
      colors: {
        background: "#000000",
        surface: {
          base: "#000000",
          primary: "#181818",
          secondary: "#1F1F1F",
          tertiary: "#272727",
          subtle: "#313131",
          elevated: "#131823",
        },
        border: {
          subtle: "#272727",
          primary: "#313131",
          accent: "#0070BA",
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
        },
        paypal: {
          blue: "#0070BA",
          darkblue: "#003087",
          hover: "#005EA6",
          gold: "#FFC439",
        },
        status: {
          locked: "#64748B",
          active: "#3B82F6",
          review: "#F59E0B",
          passed: "#10B981",
        },
      },
      spacing: {
        "0": "0px",
        "25": "2px",
        "50": "4px",
        "75": "8px",
        "100": "12px",
        "200": "16px",
        "300": "24px",
        "400": "32px",
        "500": "40px",
        "600": "48px",
        "700": "64px",
        "800": "80px",
        "900": "96px",
      },
      borderRadius: {
        "none": "0px",
        "xs": "2px",
        "sm": "4px",
        "md": "6px",
        "lg": "8px",
        "xl": "12px",
        "2xl": "16px",
        "3xl": "24px",
        "full": "9999px",
      },
      transitionTimingFunction: {
        "decelerate": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        "300": "300ms",
        "500": "500ms",
      },
    },
  },
  plugins: [],
};

export default config;

