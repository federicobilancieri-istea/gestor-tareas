/**
 * Tema de la app: colores, espaciados y radios.
 */

export const Colors = {
  // Fondos
  bg: "#F5F6FA",
  surface: "#FFFFFF",
  border: "#E5E7EB",

  // Acento principal – violeta
  accent: "#4F46E5",
  accentDim: "#EEF2FF",

  // Semánticos
  success: "#16A34A",
  danger: "#DC2626",

  // Texto
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
} as const;

export const Radius = {
  sm: 10,
  md: 12,
  pill: 20,
} as const;
