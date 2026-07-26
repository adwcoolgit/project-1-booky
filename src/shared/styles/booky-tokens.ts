import designTokens from "../../../docs/source-of-truth/design/design-tokens.json";

export const bookyTokens = {
  fontFamily: designTokens.fontFamily,
  fontSize: designTokens.fontSize,
  lineHeight: designTokens.lineHeight,
  colors: designTokens.colors,
  radius: designTokens.radius,
  spacing: designTokens.spacing,
  shadow: designTokens.shadow,
  layout: designTokens.layout,
} as const;

export const bookySemanticTokens = {
  background: "var(--color-surface)",
  foreground: "var(--color-text)",
  muted: "var(--color-muted)",
  border: "var(--color-border)",
  brand: "var(--color-brand)",
  brandSubtle: "var(--color-brand-subtle)",
  danger: "var(--color-danger)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
} as const;
