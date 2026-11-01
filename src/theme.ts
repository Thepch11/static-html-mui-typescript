import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#245a4b' },
    background: { default: '#f6f7f4', paper: '#ffffff' },
    text: { primary: '#192e28', secondary: '#56675f' },
  },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.045em' },
    h2: { fontWeight: 650, letterSpacing: '-0.025em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});
