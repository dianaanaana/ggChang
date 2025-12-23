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
import { exchangeCodeForTokens, isAuthenticated, logout as authLogout, getAuthHeaders, getUserId } from '../utils/auth'
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { startOfMonth, endOfMonth } from "date-fns";
import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';


const StyledCalendarWrapper = styled(Box)(({ theme }) => ({
  /* 整體字體 */
  '& .rbc-calendar': {
    fontFamily: theme.typography.fontFamily,
    backgroundColor: '#fff',
  },
  '& .rbc-date-cell': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* ❌ 移除所有外框與格線 */
  
  '& .rbc-month-view': {
    border: 'none',
  },
  '& .rbc-month-row': {
    border: 'none',
  },
  '& .rbc-day-bg': {
    border: 'none',
  },
  '& .rbc-day-bg + .rbc-day-bg': {
    borderLeft: 'none',
  },
  '& .rbc-header': {
    borderBottom: 'none',
    padding: '12px 0',
    fontWeight: 600,
    color: theme.palette.text.secondary,
    fontSize: '1.5rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  '& .rbc-toolbar-label': {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#333',
    letterSpacing: '1px',
  },

  /* ❌ 移除非本月灰底 */
  '& .rbc-off-range-bg': {
    backgroundColor: 'transparent',
    
  },
  '& .rbc-off-range .rbc-button-link': {
    opacity: 0.3,
  },
  /* 今天：非常淡的提示 */
  '& .rbc-today': {
    backgroundColor: `${theme.palette.primary.light}10`,
  },

  /* ✅ 日期格：整格置中 */
  '& .rbc-date-cell': {
    height: '100%',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none', // 避免點到數字
  },

  /* ✅ 日期數字本身 */
  '& .rbc-date-cell .rbc-button-link': {
    fontSize: '1.1rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
  },

  /* ❌ 移除事件邊框干擾 */
  '& .rbc-event': {
    border: 'none',
    boxShadow: 'none',
  },
  '& .rbc-day-bg:hover': {
  backgroundColor: `${theme.palette.primary.light}08`,
  }
  
}));



const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3, 
        px: 1 
      }}
    >
      <Typography
        fontWeight="medium"
        sx={{
          fontSize: '5rem',       // <- 直接在這裡改
          color: '#333',
          letterSpacing: '1px'
        }}
      >
        {toolbar.label}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button 
            variant="outlined" 
            size="small" 
            onClick={goToCurrent}
            sx={{ borderRadius: 2, textTransform: 'none', color: 'text.secondary', borderColor: 'divider' }}
        >
            Today
        </Button>
        <IconButton onClick={goToBack} size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={goToNext} size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};


const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});



function CalendarEvent({ event }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {event.imageUrl && (
        <Box
          component="img"
          src={event.imageUrl}
          sx={{
            width: "100%",
            height: 40,
            objectFit: "cover",
            borderRadius: 1,
            mb: 0.5,
          }}
        />
      )}
      <Typography variant="caption">
        {event.title}
      </Typography>
    </Box>
  );
}

export default function Dashboard({ userId = "me", isFriend = false }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [records, setRecords] = useState([]) // 儲存支出紀錄
  const [totalAmount, setTotalAmount] = useState(0) // 儲存總金額
  const [selectedRecord, setSelectedRecord] = useState(null) // 選中的紀錄 (用於顯示詳情)
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const [friendRequests, setFriendRequests] = useState([]);
  const [openFriendRequests, setOpenFriendRequests] = useState(false);  
  const [openMenu, setOpenMenu] = useState(false);
  const handleSelectSlot = (slotInfo) => {
  const date = format(slotInfo.start, "yyyy-MM-dd");
  navigate(`/add-record?date=${date}`);
};

  const monthlyRecords = records.filter((r) => {
    const date = new Date(r.createdAt);
    return date >= monthStart && date <= monthEnd;
  });  

  const monthlyExpense = monthlyRecords
    .filter((r) => r.type === "expense")
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const monthlyIncome = monthlyRecords
    .filter((r) => r.type === "income")
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const calendarEvents = records.map((r) => ({
    id: r.recordId,
    title: `$${r.amount}`,
    start: new Date(r.createdAt),
    end: new Date(r.createdAt),
    imageUrl: r.imageUrl,
    record: r, // 整包帶著，之後好用
  }));
  
  const eventPropGetter = (event) => {
    // 判斷支出或收入 (假設你的 record 裡有 type 欄位)
    const isExpense = event.record?.type === 'expense';
    
    return {
      style: {
        backgroundColor: isExpense ? '#fee2e2' : '#dcfce7', // 紅底 vs 綠底 (比較淡的顏色)
        color: isExpense ? '#ef4444' : '#22c55e', // 深紅 vs 深綠文字
        border: 'none',
        borderRadius: '6px',
        display: 'block',
        fontWeight: '600',
        fontSize: '0.8rem',
        padding: '2px 5px',
      },
    };
  };

  const fetchData = async () => {
    const targetUser = userId === "me" ? getUserId() : userId;
    if (!targetUser) {
      console.warn('No user id available to fetch expenses');
      return;
    }
    try {
      const response = await axios.get(
        `https://ttxklr1893.execute-api.ap-southeast-1.amazonaws.com/prod/expenses?userId=${encodeURIComponent(targetUser)}`,
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

  
  const fetchFriendRequests = async () => {
    try {
      const res = await axios.get('https://your-api-endpoint/friend-requests', {
        headers: getAuthHeaders()
      });
      setFriendRequests(res.data.items);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await axios.post(`https://your-api-endpoint/friend-requests/${requestId}/accept`, {}, {
        headers: getAuthHeaders()
      });
      fetchFriendRequests(); // 更新列表
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post(`https://your-api-endpoint/friend-requests/${requestId}/reject`, {}, {
        headers: getAuthHeaders()
      });
      fetchFriendRequests(); // 更新列表
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFriendRequests();
  }, []);


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
    <Box sx={{ minHeight: '100vh', bgcolor: '#F9FAFB', py: 4 }}>
      {/* 簡單的頂部導覽列 */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white' }}>
        <Toolbar>
          <IconButton onClick={() => setOpenMenu(true)} edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Drawer open={openMenu} onClose={() => setOpenMenu(false)}>
            <List sx={{ width: 250 }}>
              <ListItemButton onClick={() => navigate("/dashboard")}>
                <ListItemText primary="我的帳本" />
              </ListItemButton>

              <ListItemButton onClick={() => navigate("/friends")}>
                <ListItemText primary="朋友" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate("/add-friend")}>
                <ListItemText primary="新增好友" />
              </ListItemButton>
              <ListItemButton onClick={() => setOpenFriendRequests(!openFriendRequests)}>
                <ListItemText primary="交友邀請" />
                {openFriendRequests ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={openFriendRequests} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {friendRequests.map((req) => (
                    <ListItemButton key={req.id} sx={{ pl: 4 }}>
                      <ListItemText primary={req.fromUserName} />
                      <Button size="small" variant="contained" onClick={() => handleAccept(req.id)}>接受</Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => handleReject(req.id)}>拒絕</Button>
                    </ListItemButton>
                  ))}
                  {friendRequests.length === 0 && (
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemText primary="沒有新的邀請" />
                    </ListItemButton>
                  )}
                </List>
              </Collapse>
            </List>
          </Drawer>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, color: '#271010ff' }}>
            記記好帳
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
      {/* Calender 卡片區域 */}
      <Card 
        sx={{ 
          mt: 4, 
          p: 3, 
          borderRadius: 4, // 更圓潤
          boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', // 很淡的陰影
          border: '1px solid rgba(0,0,0,0.05)',
          width: '90%',          // 整體比螢幕窄
          mx: 'auto',            // 水平置中
        }}
      >
        <StyledCalendarWrapper sx={{ height: 600 }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            views={["month"]} // 只保留月視圖，介面更乾淨
            components={{
              event: CalendarEvent,
              toolbar: CustomToolbar, // 使用我們自製的 Toolbar
            }}
            eventPropGetter={eventPropGetter} // 套用顏色邏輯
            style={{ height: "100%" }}
          />
        </StyledCalendarWrapper>
      </Card>

      <Container maxWidth="sm" sx={{ mt: 4, pb: 10 }}>
        {/* 餘額卡片：改為純白簡約風格 */}
        <Card 
          sx={{ 
            p: 0, 
            mb: 4, 
            // 背景改純白
            bgcolor: '#FFFFFF', 
            // 文字改深色
            color: '#111827',
            // 加上柔和的大圓角與陰影，對齊上方日曆風格
            borderRadius: 4, 
            border: '1px solid #E5E7EB',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden'
          }}
        >

          <Box sx={{ p: 4 }}>
          {/* 標題文字變淡灰 */}
          <Typography variant="subtitle1" sx={{ color: '#6B7280', mb: 1 }}>
              本月結餘
          </Typography>
          {/* 金額變深黑 */}
          <Typography variant="h1" fontWeight="bold" sx={{ mb: 4, color: '#111827' }}>
              ${monthlyIncome - monthlyExpense}
          </Typography>

          <Grid container spacing={2}>
            {/* 支出區塊：淡紅色背景 */}
            <Grid item xs={6}>
              <Box sx={{ 
                  bgcolor: '#FEF2F2', // 淡紅色背景
                  p: 2, 
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
              }}>
                {/* Icon 背景改純白 */}
                {/* <Box sx={{ 
                  p: 1, 
                  bgcolor: '#FFFFFF', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
                }}>
                  <TrendingDownIcon color="error" />
                </Box> */}
                <Box>
                  <Typography variant="h3" sx={{ color: '#EF4444', fontWeight: 600 }}>本月支出</Typography>
                  <Typography variant="h4" sx={{ color: '#111827' }}>
                    ${monthlyExpense}
                  </Typography>
                </Box>
              </Box>
            </Grid>

              {/* 收入區塊：淡綠色背景 */}
            <Grid item xs={6}>
              <Box sx={{ 
                  bgcolor: '#F0FDF4', // 淡綠色背景
                  p: 2, 
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
              }}>
                  {/* <Box sx={{ 
                    p: 1, 
                    bgcolor: '#FFFFFF', 
                    borderRadius: '50%', 
                    display: 'flex',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    <TrendingUpIcon color="success" />
                  </Box> */}
                  <Box>
                    <Typography variant="h3" sx={{ color: '#10B981', fontWeight: 600 }}>本月收入</Typography>
                    <Typography variant="h4" sx={{ color: '#111827' }}>
                      ${monthlyIncome}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Card>

        {/* 新增按鈕：改為純黑現代風 */}
      <Button
        fullWidth
        // variant="contained"
        size="large"
        startIcon={<AddIcon />}
        sx={{ 
          mb: 4, 
          py: 2, // 稍微加高一點，手感比較好
          borderRadius: 4, // 跟上面的卡片圓角呼應
          bgcolor: '#111827', // 純黑色背景
          color: '#FFFFFF',
          textTransform: 'none', // 取消全大寫，看起來比較優雅
          fontSize: '2.5rem',
          fontWeight: 600,
          boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.2)', // 黑色陰影
          '&:hover': {
            bgcolor: '#000000', // hover 變全黑
            boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.3)',
          }
        }}
        onClick={() => navigate('/add-record')}
      >
        新增一筆紀錄
      </Button>

        {/* 操作區 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
           <Typography variant="h6" fontWeight="bold">消費紀錄</Typography>
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
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 1 }}>
                    <Box sx={{ flex: 1, pr: 2 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                            {selectedRecord.description || "未命名紀錄"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {new Date(selectedRecord.createdAt).toLocaleDateString('zh-TW', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            })}
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedRecord.imageUrl && (
                        <Box sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden', border: '1px solid #eee' }}>
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
                        <Typography variant="body2" fontWeight="bold" sx={{ px: 1.5, py: 0.5, bgcolor: '#f3f4f6', borderRadius: 1, color: 'text.secondary' }}>
                            {selectedRecord.category}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setSelectedRecord(null)} color="inherit">返回</Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(selectedRecord.recordId)}
                        sx={{ borderRadius: 2 }}
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
