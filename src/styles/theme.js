// src/styles/theme.js
import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    50: '#eef7ff',
    100: '#d6eaff',
    200: '#a7d2ff',
    300: '#79bbff',
    400: '#4aa3ff',
    500: '#1c8bff', // primary
    600: '#006fe0',
    700: '#0056b0',
    800: '#003b77',
    900: '#002245',
  },
};

const fonts = {
  heading: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
  body: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
};

const components = {
  Button: {
    baseStyle: { borderRadius: 'lg' },
    sizes: { lg: { h: 12, px: 6 }, md: { h: 10, px: 5 } },
    variants: {
      solid: (props) => ({
        bg: 'brand.500',
        color: 'white',
        _hover: { bg: 'brand.600' },
        _active: { bg: 'brand.700' },
      }),
      outline: {
        borderColor: 'brand.500',
        color: 'brand.600',
        _hover: { bg: 'brand.50' },
      },
    },
  },
  Input: {
    defaultProps: { size: 'md' },
    variants: {
      outline: {
        field: {
          borderRadius: 'md',
          _focus: { borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' },
        },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        rounded: 'xl',
        shadow: 'sm',
        border: '1px solid',
        borderColor: 'gray.200',
      },
    },
  },
};

const styles = {
  global: {
    'html, body, #__next': { height: '100%' },
    body: { bg: 'gray.50' },
  },
};

const theme = extendTheme({ colors, fonts, components, styles });
export default theme;

