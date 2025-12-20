// src/pages/Login.jsx
import { Container, TextField, Button, Typography, Box, Paper, InputAdornment } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AccountBalanceWalletTnIcon from '@mui/icons-material/AccountBalanceWallet'; // 需要圖示
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

export default function Login() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Logo 區域 */}
        <Box sx={{ mb: 3, bgcolor: 'primary.main', p: 2, borderRadius: '50%', color: 'white' }}>
            <AccountBalanceWalletTnIcon fontSize="large" />
        </Box>

        <Typography variant="h5" component="h1" gutterBottom fontWeight="bold" color="text.primary">
          歡迎回來
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          請登入以管理您的支出
        </Typography>

        <TextField 
          fullWidth 
          label="Email" 
          margin="normal" 
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <TextField 
          fullWidth 
          label="Password" 
          type="password" 
          margin="normal" 
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3, mb: 2, py: 1.5 }}
          onClick={() => navigate('/dashboard')}
        >
          登入
        </Button>

        <Button
          fullWidth
          size="small"
          onClick={() => navigate('/register')}
          sx={{ color: 'text.secondary' }}
        >
          還沒有帳號？ <Typography component="span" color="primary" variant="body2" fontWeight="bold">註冊</Typography>
        </Button>
      </Paper>
    </Container>
  )
}