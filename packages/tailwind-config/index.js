/**
 * Shared ella brand Tailwind preset.
 * Used by both apps/web and apps/admin via `presets: [require('@repo/tailwind-config')]`.
 * `content` is intentionally omitted — each app declares its own content globs.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: "#9c1137",
          dark: "#7c0d2b",
          light: "#b8324f",
        },
        cream: "#f6f3ee",
        ink: "#383434",
        muted: "#958f86",
      },
      fontFamily: {
        serif: ["var(--font-baskerville)", "Georgia", "serif"],
        sans: ["var(--font-lato)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1280px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [],
};
