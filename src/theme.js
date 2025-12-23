// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1', // Indigo
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ec4899', // Pink
      light: '#f472b6',
      dark: '#db2777',
    },
    background: {
      default: '#f8fafc', // 更冷一點的淺灰，比純白更有質感
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b', // 接近黑色的深藍灰，比純黑柔和
      secondary: '#64748b',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", sans-serif', // 建議引入 Google Font: Plus Jakarta Sans
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600, borderRadius: 12 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // 按鈕圓角大一點看起來更親切
          boxShadow: 'none',
          padding: '10px 24px',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(99, 102, 241, 0.25)', // 更有質感的 hover 陰影
            transform: 'translateY(-1px)', // 微微上浮
          },
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
           background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', // 按鈕漸層
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px', // 卡片更圓潤
          boxShadow: '0px 10px 40px -10px rgba(0,0,0,0.08)', // 擴散感強的柔和陰影
          border: '1px solid rgba(255, 255, 255, 0.5)',
        },
      },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundImage: 'none', // 移除 MUI 預設的深色模式疊加層
            }
        }
    }
  },
});

export default theme;