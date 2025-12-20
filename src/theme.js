// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: { // 這裡修正了錯誤
    mode: 'light',
    primary: {
      main: '#6366f1', // 現代感的靛藍色
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ec4899', // 活潑的粉色作為強調
    },
    background: {
      default: '#f3f4f6', // 淺灰背景
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  shape: {
    borderRadius: 16, // 圓角
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(99, 102, 241, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0,0,0,0.02)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
        }
      }
    }
  },
});

export default theme;