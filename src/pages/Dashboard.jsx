// src/pages/Dashboard.jsx
import { Container, Card, Typography, Button, Box, Grid, IconButton, AppBar, Toolbar, ImageList, ImageListItem, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios'
import { exchangeCodeForTokens, isAuthenticated, logout as authLogout, getAuthHeaders } from '../utils/auth'

export default function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [records, setRecords] = useState([]) // 儲存支出紀錄
  const [totalAmount, setTotalAmount] = useState(0) // 儲存總金額
  const [selectedRecord, setSelectedRecord] = useState(null) // 選中的紀錄 (用於顯示詳情)

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://ttxklr1893.execute-api.ap-southeast-1.amazonaws.com/prod/expenses',
        {
          headers: getAuthHeaders()
        }
      );
      
      // 根據 createdAt 由新到舊排序 (Newest First)
      const sortedRecords = (response.data.items || []).sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setRecords(sortedRecords);

      const sum = sortedRecords.reduce((acc, curr) => acc + Number(curr.amount), 0);
      setTotalAmount(sum);
    } catch (error) {
      console.error("抓取失敗:", error);
      if (error.response?.status === 401) {
        authLogout();
        setIsLoggedIn(false);
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    // 處理 Cognito 回調
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');

      if (code) {
        try {
          await exchangeCodeForTokens(code);
          setIsLoggedIn(true);
          // 清除 URL 中的 code 參數
          window.history.replaceState({}, document.title, '/');
        } catch (error) {
          console.error('登入失敗:', error);
          navigate('/login');
        }
      }
    };

    handleCallback();
    setIsLoggedIn(isAuthenticated());
  }, [location, navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    authLogout();
    setIsLoggedIn(false);
    navigate('/login');
  }

  const handleDelete = async (recordId) => {
    if (!window.confirm('確定要刪除這筆記錄嗎？')) {
      return;
    }

    try {
      await axios.delete(
        `https://ttxklr1893.execute-api.ap-southeast-1.amazonaws.com/prod/expenses/${recordId}`,
        {
          headers: getAuthHeaders()
        }
      );
      // 刪除成功後重新載入資料並關閉對話框
      setSelectedRecord(null);
      fetchData();
    } catch (error) {
      console.error('刪除失敗:', error);
      alert('刪除失敗：' + (error.response?.data?.error || error.message));
    }
  }

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
          {!isLoggedIn ? (
            <IconButton color="inherit" onClick={() => navigate('/login')}>
              <LoginIcon />
            </IconButton>
          ) : (
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4, pb: 10 }}>
        
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
            ${totalAmount}
          </Typography>
        </Card>

        {/* 操作區 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
           <Typography variant="h6" fontWeight="bold">近期紀錄</Typography>
        </Box>

        {/* 圖片牆列表 (Grid) */}
        <ImageList cols={3} gap={4}>
            {records.map((item) => (
                <ImageListItem 
                    key={item.recordId} 
                    onClick={() => setSelectedRecord(item)}
                    sx={{ 
                        cursor: 'pointer',
                        aspectRatio: '1 / 1', // 強制正方形
                        overflow: 'hidden',
                        borderRadius: 2
                    }}
                >
                    {item.imageUrl ? (
                        <img
                            src={item.imageUrl}
                            alt={item.description}
                            loading="lazy"
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' // 填滿並裁切
                            }}
                        />
                    ) : (
                        <Box 
                            sx={{ 
                                width: '100%', 
                                height: '100%', 
                                bgcolor: '#f5f5f5', 
                                display: 'flex', 
                                flexDirection: 'column',
                                alignItems: 'center', 
                                justifyContent: 'center',
                                border: '1px solid #e0e0e0'
                            }}
                        >
                            <Typography variant="h6" color="text.secondary" fontWeight="bold">
                                ${item.amount}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {item.category}
                            </Typography>
                        </Box>
                    )}
                </ImageListItem>
            ))}
        </ImageList>

        {/* 懸浮按鈕 (FAB) 風格的 Add 按鈕，或是寬版按鈕 */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          sx={{ 
            mt: 4, 
            py: 1.5, 
            borderRadius: 50, // 膠囊狀按鈕
            boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)' 
          }}
          onClick={() => navigate('/add-record')}
        >
          新增一筆紀錄
        </Button>
      </Container>

      {/* 詳情對話框 */}
      <Dialog 
        open={!!selectedRecord} 
        onClose={() => setSelectedRecord(null)}
        maxWidth="xs"
        fullWidth
      >
        {selectedRecord && (
            <>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    詳情
                    <Typography variant="caption" color="text.secondary">
                        {new Date(selectedRecord.createdAt).toLocaleString()}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedRecord.imageUrl && (
                        <Box sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                            <img 
                                src={selectedRecord.imageUrl} 
                                alt="Detail" 
                                style={{ width: '100%', display: 'block' }} 
                            />
                        </Box>
                    )}
                    <Typography variant="h4" color="error" fontWeight="bold" gutterBottom>
                        ${selectedRecord.amount}
                    </Typography>
                    <Box display="flex" gap={1} mb={1}>
                        <Typography variant="body1" fontWeight="bold" sx={{ px: 1, py: 0.5, bgcolor: '#f3f4f6', borderRadius: 1 }}>
                            {selectedRecord.category}
                        </Typography>
                    </Box>
                    <Typography variant="body1">
                        {selectedRecord.description || "無描述"}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setSelectedRecord(null)}>關閉</Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(selectedRecord.recordId)}
                    >
                        刪除
                    </Button>
                </DialogActions>
            </>
        )}
      </Dialog>
    </Box>
  )
}
