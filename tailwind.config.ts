import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#060E1A",
          900: "#081628",
          800: "#0B1F3A",
        },
        gold: {
          500: "#C9A227",
          300: "#E8D48B",
        },
        ivory: {
          100: "#F5F0E6",
          50: "#FAF8F3",
        },
      },
      borderRadius: {
        none: "0",
        DEFAULT: "0",
        sm: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "0",
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
};

export default config;
