import type { RestaurantTheme, ThemeCssVars } from './types';

export function createThemeCssVars(theme: RestaurantTheme): ThemeCssVars {
  return {
    '--brand-id': theme.id,
    '--brand-name': `"${theme.name}"`,
    '--color-primary': theme.colors.primary,
    '--color-primary-hover': theme.colors.primaryHover,
    '--color-primary-foreground': theme.colors.primaryForeground,
    '--color-secondary': theme.colors.secondary,
    '--color-secondary-foreground': theme.colors.secondaryForeground,
    '--color-accent': theme.colors.accent,
    '--color-accent-foreground': theme.colors.accentForeground,
    '--color-background': theme.colors.background,
    '--color-surface': theme.colors.surface,
    '--color-surface-elevated': theme.colors.surfaceElevated,
    '--color-foreground': theme.colors.foreground,
    '--color-muted': theme.colors.muted,
    '--color-muted-foreground': theme.colors.mutedForeground,
    '--color-border': theme.colors.border,
    '--color-ring': theme.colors.ring,
    '--color-success': theme.colors.success,
    '--color-warning': theme.colors.warning,
    '--color-danger': theme.colors.danger,
    '--hero-gradient-from': theme.colors.heroGradientFrom,
    '--hero-gradient-to': theme.colors.heroGradientTo,
    '--font-heading': theme.fonts.heading,
    '--font-body': theme.fonts.body,
    '--radius-sm': theme.radius.sm,
    '--radius-md': theme.radius.md,
    '--radius-lg': theme.radius.lg,
    '--radius-xl': theme.radius.xl,
    '--radius-full': theme.radius.full,
  };
}

export function themeToStyleObject(theme: RestaurantTheme): Record<string, string> {
  return createThemeCssVars(theme);
}
