// src/pages/AddFriend.jsx
import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { getAuthHeaders } from '../utils/auth';

export default function AddFriend() {
  const [friendId, setFriendId] = useState('');
  const [status, setStatus] = useState({ message: '', type: 'success', open: false });

  const handleAddFriend = async () => {
    if (!friendId) return;

    try {
      const response = await axios.post(
        'https://your-api-endpoint/friends', // 你的 addfriend API
        { friendId },
        { headers: getAuthHeaders() }
      );

      setStatus({ message: '好友邀請已送出！', type: 'success', open: true });
      setFriendId('');
    } catch (error) {
      setStatus({ 
        message: error.response?.data?.error || '新增好友失敗', 
        type: 'error', 
        open: true 
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        新增好友
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="朋友的電子郵件地址"
          variant="outlined"
          fullWidth
          value={friendId}
          onChange={(e) => setFriendId(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddFriend}>
          加入
        </Button>
      </Box>

      <Snackbar
        open={status.open}
        autoHideDuration={3000}
        onClose={() => setStatus(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={status.type} sx={{ width: '100%' }}>
          {status.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
