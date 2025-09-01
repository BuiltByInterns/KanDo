import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // adjust to match your folders
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        backgroundAlt: "var(--background-alt)",
        foreground: "var(--foreground)",
        foregroundMuted: "var(--foreground-muted)",
        border: "var(--border)",

        accent: "var(--accent)",
        accentContrast: "var(--accent-contrast)",
        accentHover: "var(--accent-hover)",

        success: "var(--success)",
        danger: "var(--danger)",
      },
      borderRadius: {
        lg: "var(--radius-lg)",
      },
    },
  },
  plugins: [],
};

export default config;
