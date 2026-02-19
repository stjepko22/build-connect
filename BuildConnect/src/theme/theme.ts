import { createTheme } from '@mui/material/styles';

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
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});

export default theme;