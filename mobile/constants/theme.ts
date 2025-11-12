/**
 * Joy App Theme
 * Consistent colors for birthday, gift-giving, and celebration theme
 */

export const Colors = {
  // Primary Brand Colors - Purple & Pink (Love & Celebration)
  primary: {
    purple: '#8b5cf6',
    purpleLight: '#a78bfa',
    purpleDark: '#7c3aed',
    pink: '#ec4899',
    pinkLight: '#f472b6',
    pinkDark: '#db2777',
  },

  // Secondary Colors - Warm & Joyful
  secondary: {
    coral: '#f97316',
    coralLight: '#fb923c',
    gold: '#f59e0b',
    goldLight: '#fbbf24',
    rose: '#f43f5e',
    roseLight: '#fb7185',
  },

  // Accent Colors
  accent: {
    sky: '#0ea5e9',
    emerald: '#10b981',
    amber: '#f59e0b',
  },

  // Neutral Colors
  neutral: {
    white: '#ffffff',
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
  },

  // Semantic Colors
  semantic: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },

  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
  },
};

export const Gradients = {
  // Primary gradients
  purple: ['#8b5cf6', '#7c3aed'],
  purplePink: ['#8b5cf6', '#ec4899'],
  pinkPurple: ['#ec4899', '#8b5cf6'],
  
  // Secondary gradients
  coral: ['#f97316', '#fb923c'],
  gold: ['#f59e0b', '#fbbf24'],
  rose: ['#f43f5e', '#fb7185'],
  
  // Feature gradients
  gift: ['#f59e0b', '#f97316'],
  message: ['#ec4899', '#f43f5e'],
  birthday: ['#a78bfa', '#fbbf24'],
  celebration: ['#ec4899', '#f59e0b'],
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 13,
  base: 14,
  md: 15,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  huge: 28,
  massive: 32,
};

export const FontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
};

