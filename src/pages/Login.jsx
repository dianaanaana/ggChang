// src/pages/Login.jsx
import { Container, TextField, Button, Typography, Box, Paper, InputAdornment } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AccountBalanceWalletTnIcon from '@mui/icons-material/AccountBalanceWallet'; // 需要圖示
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

// 根據當前網址自動選擇 redirect_uri 目前有登入問題 我先將redirect 寫死
const getRedirectUri = () => {
  const currentOrigin = window.location.origin
  if (currentOrigin.includes('localhost')) {
    return encodeURIComponent('http://localhost:5173/')
  }
  return encodeURIComponent('https://d14a9z9u68wcij.cloudfront.net/')
}

const COGNITO_LOGIN_URL =
  'https://ap-southeast-1corecotoj.auth.ap-southeast-1.amazoncognito.com/login' +
  '?client_id=7ru74bpjktaoluf5e5ub9hq1sj' +
  '&response_type=code' +
  '&scope=email+openid+phone'+
  '&redirect_uri=http://localhost:5173/'

export default function Login() {
  const navigate = useNavigate()

  const handleLogin = () => {
    window.location.href = COGNITO_LOGIN_URL
  }

  return (
    
    <Container maxWidth="xs">
      <Box mt={10} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleLogin}
        >
          Login with AWS
        </Button>
      </Box>
    </Container>
  )
}