import { createTheme } from '@mui/material/styles';

export const BRAND_COLORS = {
  heroGradient: 'linear-gradient(145deg, #0f0f0f 0%, #1b1b1b 45%, #2b2b2b 100%)',
  darkBase: '#0f0f0f',
  darkSurface: '#1b1b1b',
  darkSurfaceAlt: '#2b2b2b',
} as const;

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFB300', // Topla žuta/amber
      light: '#FFF8E1',
      dark: '#FFA000',
      contrastText: '#000', // Crni tekst na žutoj pozadini radi čitljivosti
    },
    secondary: {
      main: '#212121',
      light: '#484848',
      dark: '#000000',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overflowX: 'hidden',
          '@media (max-width: 899.95px)': {
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          },
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '#root': {
          '@media (max-width: 899.95px)': {
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          },
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});

export default theme;
