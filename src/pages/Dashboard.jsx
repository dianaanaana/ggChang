// src/pages/Dashboard.jsx
import { Container, Card, Typography, Button, Box, Grid, IconButton, AppBar, Toolbar } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* 簡單的頂部導覽列 */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}>
            ExpenseTracker
          </Typography>
          <IconButton color="default" onClick={() => navigate('/')}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        
        {/* 餘額卡片：使用漸層背景 */}
        <Card 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', // 紫色漸層
            color: 'white' 
          }}
        >
          <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>目前餘額</Typography>
          <Typography variant="h2" component="div" fontWeight="bold">
            $12,500
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
            + $2,300 本月收入
          </Typography>
        </Card>

        {/* 操作區 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
           <Typography variant="h6" fontWeight="bold">近期紀錄</Typography>
           <Button variant="text" size="small">查看全部</Button>
        </Box>

        {/* 這裡可以放紀錄列表，目前先留空或放個佔位符 */}
        <Card sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
                <Typography fontWeight="500">午餐 - 牛肉麵</Typography>
                <Typography variant="caption" color="text.secondary">今天 12:30</Typography>
            </Box>
            <Typography color="error" fontWeight="bold">-$150</Typography>
        </Card>

        {/* 懸浮按鈕 (FAB) 風格的 Add 按鈕，或是寬版按鈕 */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          sx={{ 
            mt: 2, 
            py: 1.5, 
            borderRadius: 50, // 膠囊狀按鈕
            boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)' 
          }}
          onClick={() => navigate('/add-record')}
        >
          新增一筆紀錄
        </Button>
      </Container>
    </Box>
  )
}