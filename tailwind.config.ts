import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      gridTemplateColumns: {
        12: "var(--grid-cols-12)",
      },
      zIndex: {
        base: "var(--z-base)",
        raised: "var(--z-raised)",
        stacked: "var(--z-stacked)",
        sticky: "var(--z-sticky)",
        dock: "var(--z-dock)",
        dropdown: "var(--z-dropdown)",
        overlay: "var(--z-overlay)",
        modal: "var(--z-modal)",
        toast: "var(--z-toast)",
        max: "var(--z-max)",
      },
      boxShadow: {
        "elevation-none": "var(--elevation-0)",
        "elevation-1": "var(--elevation-1)",
        "elevation-2": "var(--elevation-2)",
        "elevation-popover": "var(--elevation-popover)",
        "elevation-dialog": "var(--elevation-dialog)",
        nav: "var(--shadow-nav)",
        card: "var(--shadow-card)",
        modal: "var(--shadow-modal)",
      },
    },
  },
  plugins: [],
};

export default config;
