// Based on FRONTEND_UI_SYSTEM_GUIDE.md

export const colors = {
  primary: {
    main: '#D83A41',
    hover: '#E54a51',
    active: '#BC2F36',
    light: '#FFE6E9',
    dark: '#BC2F36',
  },
  neutrals: {
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#333333',
    textSecondary: '#666666',
    textDisabled: '#999999',
    border: '#E5E5E5',
    divider: '#F0F0F0',
  },
  semantic: {
    success: '#36B37E',
    warning: '#FFAB00',
    error: '#FF5630',
    info: '#0065FF',
  },
  status: {
    completed: { text: '#0065FF', bg: '#E6F0FF' },
    onTrack: { text: '#36B37E', bg: '#EBF7F2' },
    atRisk: { text: '#FFAB00', bg: '#FFF7E6' },
    delayed: { text: '#FF5630', bg: '#FFEBE6' },
    na: { text: '#999999', bg: '#F5F5F5' },
  }
};

export const typography = {
  fontFamily: "'IBM Plex Sans', sans-serif",
  monoFamily: "'IBM Plex Mono', monospace",
  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  }
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
};

export const borderRadius = {
  sm: '4px',
  base: '8px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
};

export const shadows = {
  sm: '0 2px 8px rgba(0, 0, 0, 0.06)',
  md: '0 4px 16px rgba(0, 0, 0, 0.15)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.15)',
};

export const sidebar = {
  width: '240px',
  collapsedWidth: '60px',
};

export const header = {
  height: '64px',
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  sidebar,
  header
};
