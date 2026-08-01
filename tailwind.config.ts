import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/entities/**/*.{ts,tsx}",
    "./src/shared/**/*.{ts,tsx}",
    "./tests/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-surface)",
        foreground: "var(--color-text)",
        white: "var(--base-white)",
        black: "var(--base-black)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        "text-muted": "var(--color-text-muted)",
        "text-strong": "var(--color-text-strong)",
        "text-placeholder": "var(--color-text-placeholder)",
        neutral: {
          25: "var(--neutral-25)",
          50: "var(--neutral-50)",
          100: "var(--neutral-100)",
          200: "var(--neutral-200)",
          300: "var(--neutral-300)",
          400: "var(--neutral-400)",
          500: "var(--neutral-500)",
          600: "var(--neutral-600)",
          700: "var(--neutral-700)",
          800: "var(--neutral-800)",
          900: "var(--neutral-900)",
          950: "var(--neutral-950)",
        },
        primary: {
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
        },
        brand: {
          DEFAULT: "var(--color-brand)",
          subtle: "var(--color-brand-subtle)",
          strong: "var(--color-brand-strong)",
        },
        danger: {
          DEFAULT: "var(--color-danger)",
          accent: "var(--color-danger-accent)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
      },
      fontFamily: {
        body: ["var(--font-booky)", "sans-serif"],
        display: ["var(--font-booky)", "sans-serif"],
      },
      fontSize: {
        "body-sm": ["var(--font-size-text-sm)", { lineHeight: "var(--line-height-text-sm)" }],
        "body-md": ["var(--font-size-text-md)", { lineHeight: "var(--line-height-text-md)" }],
        "auth-brand": ["25.1429px", { lineHeight: "33px" }],
        "auth-title": ["var(--font-size-display-sm)", { lineHeight: "var(--line-height-display-sm)" }],
        // Figma checkout card title (28px); paired line-height is applied
        // separately via `leading-9.5` so it composes with the shared
        // absolute leading scale below.
        "28": "28px",
      },
      letterSpacing: {
        auth: "-0.02em",
        "auth-helper": "-0.03em",
        // Generic Figma tracking values (named by the -0.0Nem they carry, so
        // callers outside the auth screens aren't stuck reusing "auth"-named
        // keys for an unrelated feature).
        tight2: "-0.02em",
        tight3: "-0.03em",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
        "4xl": "var(--radius-4xl)",
        panel: "28px",
        "5xl": "32px",
        xs: "6px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-lg": "0 0 20px rgba(203, 202, 202, 0.25)",
      },
      lineHeight: {
        // Fill the gaps in Tailwind's default absolute leading scale
        // (3..10 -> 12px..40px in 4px steps) with the values the Figma
        // cart/checkout screens use.
        "7.5": "1.875rem",
        "8.5": "2.125rem",
        "9.5": "2.375rem",
        "10.5": "2.625rem",
        "11": "2.75rem",
      },
      spacing: {
        xxs: "var(--space-xxs)",
        xs: "var(--space-xs)",
        "1.5": "var(--space-1_5)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
        "4xl": "var(--space-4xl)",
        "5xl": "var(--space-5xl)",
        "6xl": "var(--space-6xl)",
        "7xl": "var(--space-7xl)",
        "8xl": "var(--space-8xl)",
        "9xl": "var(--space-9xl)",
        "10xl": "var(--space-10xl)",
        "11xl": "var(--space-11xl)",
        logo: "33px",
        "layout-desktop-gutter": "var(--layout-desktop-gutter)",
        // Cart list cover art: mobile (Figma 393px) vs desktop (Figma 1440px).
        "cart-cover-w": "4.375rem",
        "cart-cover-h": "6.625rem",
        "cart-cover-w-lg": "5.75rem",
        "cart-cover-h-lg": "8.625rem",
        "cart-summary": "19.875rem",
        "cart-cta": "9.375rem",
        // Checkout review card (right column, desktop) and the gap between
        // the two checkout columns.
        "checkout-card": "29.875rem",
        "checkout-columns-gap": "3.625rem",
      },
      maxWidth: {
        canvas: "var(--layout-desktop-canvas)",
        auth: "25rem",
        "auth-intro": "18.125rem",
        content: "60rem",
        guard: "35rem",
        cart: "62.5rem",
      },
      minHeight: {
        "header-mobile": "var(--layout-mobile-header)",
        "header-desktop": "var(--layout-desktop-header)",
        "auth-stage": "calc(100vh - 7rem)",
        "guard-stage": "calc(100vh - 5rem)",
      },
      gridTemplateColumns: {
        "shell-user": "260px minmax(0, 1fr)",
        "shell-admin": "280px minmax(0, 1fr)",
      },
    },
  },
  plugins: [],
};

export default config;
