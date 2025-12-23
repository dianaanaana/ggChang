import { List, ListItemButton, ListItemText, Container, Typography, Paper, Box, Avatar, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuthenticated, logout as authLogout, getAuthHeaders } from "../utils/auth";
import NavigationBar from "../components/NavigationBar";
import axios from "axios";

const API_BASE = 'https://ttxklr1893.execute-api.ap-southeast-1.amazonaws.com/prod';

export default function Friends() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  // 獲取好友列表
  useEffect(() => {
    const fetchFriends = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/friends`, {
          headers: getAuthHeaders()
        });

        // 後端可能回傳 { items: [...] } 或直接回傳 [...]
        const friendsList = Array.isArray(response.data) ? response.data : (response.data?.items || []);
        setFriends(friendsList);
      } catch (error) {
        console.error('獲取好友列表失敗:', error);
        if (error.response?.status === 401) {
          authLogout();
          setIsLoggedIn(false);
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [isLoggedIn, navigate]);

  // 獲取好友邀請
  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (!isLoggedIn) return;

      try {
        const res = await axios.get(`${API_BASE}/friends/request`, {
          headers: getAuthHeaders(),
        });

        const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
        setFriendRequests(items);
      } catch (err) {
        console.error('獲取好友邀請失敗:', err);
      }
    };

    fetchFriendRequests();
  }, [isLoggedIn]);

  const handleAccept = async (fromSub) => {
    if (!fromSub) return;

    try {
      await axios.post(
        `${API_BASE}/friends/accept`,
        { fromSub },
        { headers: { 'Content-Type': 'application/json', ...getAuthHeaders() } }
      );

      // 重新獲取邀請列表
      const res = await axios.get(`${API_BASE}/friends/request`, {
        headers: getAuthHeaders(),
      });
      const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
      setFriendRequests(items);
    } catch (err) {
      console.error('接受好友邀請失敗:', err);
    }
  };

  const handleReject = async (requestId) => {
    console.warn('目前後端尚未提供 reject endpoint，requestId:', requestId);
    alert('目前尚未支援「拒絕」功能（後端未提供 reject API）。');
  };

  const handleLogout = () => {
    authLogout();
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F9FAFB' }}>
      <NavigationBar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        friendRequests={friendRequests}
        onAcceptFriend={handleAccept}
        onRejectFriend={handleReject}
      />

      <Container maxWidth="sm" sx={{ mt: 4, mb: 4, fontFamily: '"Noto Sans TC", "Roboto", sans-serif' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, textAlign: 'center' }}>
          我的朋友
        </Typography>

        <Paper elevation={3} sx={{ p: 2, borderRadius: 3, bgcolor: '#f9f9f9' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : friends.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography color="text.secondary">
                還沒有朋友，快去新增好友吧！
              </Typography>
            </Box>
          ) : (
            <List>
              {friends.map((f) => {
                // API 返回的數據格式：{ userSub, friendSub, friendEmail, createdAt }
                const friendId = f.friendSub || f.friendId || f.userId || f.sub;
                const friendEmail = f.friendEmail || f.email;

                // 如果有 email，只顯示 @ 之前的部分
                let displayName;
                if (friendEmail && friendEmail.includes('@')) {
                  displayName = friendEmail.split('@')[0];
                } else if (friendEmail) {
                  displayName = friendEmail;
                } else {
                  displayName = friendId ? `好友 ${friendId.substring(0, 8)}...` : '未知好友';
                }

                return (
                  <ListItemButton
                    key={friendId}
                    onClick={() => navigate(`/friends/${friendId}`)}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      bgcolor: '#fff',
                      boxShadow: 1,
                      '&:hover': {
                        bgcolor: '#1976d2',
                        color: '#fff',
                        boxShadow: 3
                      },
                      transition: '0.3s'
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: '#1976d2' }}>
                        {displayName ? displayName[0]?.toUpperCase() : '?'}
                      </Avatar>
                      <ListItemText
                        primary={displayName}
                        primaryTypographyProps={{ fontWeight: 'medium', fontSize: '1rem' }}
                      />
                    </Box>
                  </ListItemButton>
                );
              })}
            </List>
          )}
        </Paper>
    </Container>
    </Box>
  );
}
