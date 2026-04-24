/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:      "#030303",
        "bg-2":  "#07070a",
        "bg-3":  "#0c0c12",
        border:  "#1a1a2e",
        text:    "#e8e8f0",
        muted:   "#5a5a7a",
        accent:  "var(--accent)",
        success: "#22c55e",
        danger:  "#ef4444",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
        body:    ["var(--font-body)", "sans-serif"],
      },
      animation: {
        "pulse-slow":  "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "spin-slow":   "spin 8s linear infinite",
        "float":       "float 6s ease-in-out infinite",
        "glitch":      "glitch 0.3s steps(2) infinite",
        "scan":        "scan 4s linear infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-12px)" },
        },
        glitch: {
          "0%":   { clipPath: "inset(0 0 95% 0)", transform: "translate(-2px)" },
          "25%":  { clipPath: "inset(40% 0 50% 0)", transform: "translate(2px)" },
          "50%":  { clipPath: "inset(80% 0 10% 0)", transform: "translate(-1px)" },
          "75%":  { clipPath: "inset(10% 0 80% 0)", transform: "translate(1px)" },
          "100%": { clipPath: "inset(0 0 95% 0)", transform: "translate(0)" },
        },
        scan: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
    },
  },
  plugins: [],
};
