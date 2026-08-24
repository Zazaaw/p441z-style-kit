/* ==========================================================================
   p441z Style Kit — tailwind.config.ts
   --------------------------------------------------------------------------
   Copy to your project root. Two jobs:

     1. Map the CSS variables from globals.css onto Tailwind color names,
        using the `hsl(var(--x))` form so `bg-primary/90` opacity works.
     2. Register the motion vocabulary (keyframes + animations).

   Requires:  npm i -D tailwindcss-animate tailwind-scrollbar-hide
   ========================================================================== */

import type { Config } from "tailwindcss";

const config: Config = {
  // Class-based dark mode — pairs with next-themes / a manual `.dark` toggle.
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ── MOTION ──────────────────────────────────────────────────────────
         Animations that reference a CSS variable (--duration, --speed,
         --radius, --gap, --shimmer-width) are configured per-instance via an
         inline style, e.g.:
           <div className="animate-marquee" style={{ "--duration": "20s", "--gap": "1rem" }} />
         That keeps one keyframe reusable at many speeds.
      ─────────────────────────────────────────────────────────────────────── */
      animation: {
        shimmer: "shimmer 8s infinite",
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
        slide: "slide var(--speed) ease-in-out infinite alternate",
        "gradient-x": "gradient-x 4s ease infinite",
        "spin-slow": "spin 4s linear infinite",
        shine: "shine 3s linear infinite",
        ripple: "ripple 0.6s ease-out",
        rainbow: "rainbow 3s linear infinite",
        "border-beam": "border-beam calc(var(--duration,4s)) linear infinite",
        meteor: "meteor 5s linear infinite",
        orbit: "orbit calc(var(--duration,20s)) linear infinite",
      },
      keyframes: {
        // Animated gradient text/background — slides the gradient, not the box.
        "gradient-x": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        // A light sweep across text/buttons.
        shine: {
          from: { "background-position": "200% 0" },
          to: { "background-position": "-200% 0" },
        },
        // Material-style click ripple.
        ripple: {
          to: { transform: "translate(-50%, -50%) scale(28)", opacity: "0" },
        },
        rainbow: {
          "0%": { "background-position": "0% 50%" },
          "100%": { "background-position": "200% 50%" },
        },
        // Traces a light along an element's border via offset-path.
        "border-beam": {
          "100%": { "offset-distance": "100%" },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        "grid-scroll": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(40px)" },
        },
        // Circular orbit — the counter-rotation keeps the child upright.
        orbit: {
          "0%": {
            transform:
              "rotate(0deg) translateY(calc(var(--radius,80px) * 1px)) rotate(0deg)",
          },
          "100%": {
            transform:
              "rotate(360deg) translateY(calc(var(--radius,80px) * 1px)) rotate(-360deg)",
          },
        },
        // Long pause, quick sweep — a periodic glint, not a constant shimmer.
        shimmer: {
          "0%, 90%, 100%": {
            "background-position": "calc(-100% - var(--shimmer-width)) 0",
          },
          "30%, 60%": {
            "background-position": "calc(100% + var(--shimmer-width)) 0",
          },
        },
        // Infinite scroller. Duplicate your content twice for a seamless loop.
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        "spin-around": {
          "0%": { transform: "translateZ(0) rotate(0)" },
          "15%, 35%": { transform: "translateZ(0) rotate(90deg)" },
          "65%, 85%": { transform: "translateZ(0) rotate(270deg)" },
          "100%": { transform: "translateZ(0) rotate(360deg)" },
        },
        slide: {
          to: { transform: "translate(calc(100cqw - 100%), 0)" },
        },
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      /* ── RADIUS ──────────────────────────────────────────────────────────
         All three derive from one --radius variable, so changing that single
         value in globals.css rescales the whole UI's roundness coherently.
      ─────────────────────────────────────────────────────────────────────── */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      /* ── COLORS ──────────────────────────────────────────────────────────
         hsl(var(--x)) — with no alpha baked in — is what enables `/90`,
         `/10`, etc. Never hardcode a hex here.
      ─────────────────────────────────────────────────────────────────────── */
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
    },
  },

  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
};

export default config;
