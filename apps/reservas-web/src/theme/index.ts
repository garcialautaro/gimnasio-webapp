import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    blue: '#0A6EB4',
    blueDeep: '#084B7A',
    green: '#4C6B57',
    greenDeep: '#31493B',
    smoke: '#F2F4F5',
    white: '#FFFFFF',
    ink: '#1B1F24',
  },
};

const semanticTokens = {
  colors: {
    'bg.canvas': colors.brand.smoke,
    'bg.surface': colors.brand.white,
    'bg.subtle': '#E7ECEF',
    'text.primary': colors.brand.ink,
    'text.muted': '#4C5A66',
    'border.default': '#D4DCE1',
    'accent.primary': colors.brand.blue,
    'accent.primary.hover': colors.brand.blueDeep,
    'accent.secondary': colors.brand.green,
    'accent.secondary.hover': colors.brand.greenDeep,
  },
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 600,
      borderRadius: '12px',
    },
    variants: {
      solid: {
        bg: 'accent.primary',
        color: 'white',
        _hover: { bg: 'accent.primary.hover' },
      },
      outline: {
        borderColor: 'accent.primary',
        color: 'accent.primary',
        _hover: { bg: 'bg.subtle' },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        bg: 'bg.surface',
        borderColor: 'border.default',
        borderWidth: '1px',
        borderRadius: '16px',
        boxShadow: 'sm',
      },
    },
  },
};

const styles = {
  global: {
    'html, body': {
      bg: 'bg.canvas',
      color: 'text.primary',
      height: '100%',
    },
  },
};

const fonts = {
  heading: 'var(--font-heading)',
  body: 'var(--font-body)',
};

export const theme = extendTheme({
  config,
  colors,
  semanticTokens,
  components,
  styles,
  fonts,
});
