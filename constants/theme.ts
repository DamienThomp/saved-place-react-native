import { TextStyle } from 'react-native';

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 18, xxl: 22, xxxl: 24, listBottom: 48 } as const;
const borderRadius = { sm: 6, md: 8, lg: 12, pill: 22, round: 60 } as const;
const typography = {
  caption: { fontSize: 12 },
  button: { fontSize: 16, fontWeight: '600' },
  label: { fontSize: 18, fontWeight: '500' },
  body: { fontSize: 20 },
  subtitle: { fontSize: 22, fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold' },
} satisfies Record<string, TextStyle>;

const colors = {
  white: '#FFFFFF',
  black: '#000000',
  destructive: 'red',
  success: 'green',
  overlay: {
    darkGlass: 'rgba(36, 36, 36, 0.8)',
    gradientEnd: 'rgba(37, 37, 37, 0.6)',
  },
  route: '#FF69B4',
} as const;

const shadows = {
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card: { elevation: 2 },
} as const;

const opacity = {
  pressed: 0.8,
  pressedStrong: 0.7,
  textSecondary: 0.7,
  textMuted: 0.8,
} as const;

export const tokens = { spacing, borderRadius, typography, colors, shadows, opacity } as const;

export type SpacingKey = keyof typeof tokens.spacing;
export type BorderRadiusKey = keyof typeof tokens.borderRadius;
