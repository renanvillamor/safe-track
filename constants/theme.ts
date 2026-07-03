export const colors = {
  sage: "#8FA684",
  sageLight: "#EAF2E7",
  emerald: "#2F6D4F",
  emeraldDark: "#1F4B37",
  white: "#FFFFFF",
  softGray: "#F4F7F3",
  gray: "#8A948A",
  border: "#E1E8DD",
  textPrimary: "#1B2A20",
  textSecondary: "#5B6B5E",
  textMuted: "#8A948A",
  danger: "#C0442E",
  dangerLight: "#FBE7E3",
  warning: "#B8863A",
  warningLight: "#FBF2E1",
  success: "#2F6D4F",
  successLight: "#E6F0E9",
  info: "#3E6E8E",
  infoLight: "#E7F0F5",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const shadows = {
  soft: {
    shadowColor: "#1B2A20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  card: {
    shadowColor: "#1B2A20",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
} as const;

export const typography = {
  display: { fontSize: 28, fontWeight: "700" as const, color: colors.textPrimary },
  title: { fontSize: 22, fontWeight: "700" as const, color: colors.textPrimary },
  subtitle: { fontSize: 17, fontWeight: "600" as const, color: colors.textPrimary },
  body: { fontSize: 15, fontWeight: "400" as const, color: colors.textSecondary },
  bodyStrong: { fontSize: 15, fontWeight: "600" as const, color: colors.textPrimary },
  caption: { fontSize: 13, fontWeight: "500" as const, color: colors.textMuted },
  label: { fontSize: 12, fontWeight: "600" as const, color: colors.textMuted, letterSpacing: 0.4 },
};
