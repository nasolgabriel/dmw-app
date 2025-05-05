import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff", // Static light background
        foreground: "#000000", // Static dark text
        primary: {
          main: "#0038A8", // Your primary blue color
          light: "#00257A", // Lighter primary color
          dark: "#001F5D", // Darker primary color
        },
        secondary: {
          main: "#FEAF00", // Your secondary yellow color
          hover: "#E9A000", // Hover state for yellow
        },
        action: {
          success: "#4CAF50", // Success green
          warning: "#FF8113", // Warning/transfer orange
          danger: "#F44336", // Error/logout red
        },
        text: {
          primary: "#000000", // Main text color
          secondary: "#ACACAC", // Secondary text (like "In Queue")
        },
        ui: {
          divider: "#E5E5E5", // Color for dividers
          card: "#F4F4F4", // Card background color
        }
      },
    },
  },
  // This is important - disable dark mode variants completely
  plugins: [],
};

export default config;