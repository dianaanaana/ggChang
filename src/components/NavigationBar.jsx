import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Collapse,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export default function NavigationBar({
  isLoggedIn = false,
  onLogout = () => {},
  friendRequests = [],
  onAcceptFriend = () => {},
  onRejectFriend = () => {}
}) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [openFriendRequests, setOpenFriendRequests] = useState(false);

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white' }}>
      <Toolbar>
        <IconButton
          onClick={() => setOpenMenu(true)}
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer open={openMenu} onClose={() => setOpenMenu(false)}>
          <List sx={{ width: 250 }}>
            <ListItemButton onClick={() => { navigate("/dashboard"); setOpenMenu(false); }}>
              <ListItemText primary="我的帳本" />
            </ListItemButton>

            <ListItemButton onClick={() => { navigate("/friends"); setOpenMenu(false); }}>
              <ListItemText primary="朋友" />
            </ListItemButton>

            <ListItemButton onClick={() => { navigate("/add-friend"); setOpenMenu(false); }}>
              <ListItemText primary="新增好友" />
            </ListItemButton>

            <ListItemButton onClick={() => setOpenFriendRequests(!openFriendRequests)}>
              <ListItemText primary="交友邀請" />
              {openFriendRequests ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openFriendRequests} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {friendRequests.map((req) => {
                  const requestId = req.requestId || req.id || req.friendSubOrRequestId;
                  const fromSub = req.fromSub;
                  const rawName =
                    req.fromUserName ||
                    req.senderEmail ||
                    req.fromEmail ||
                    req.fromSub ||
                    requestId ||
                    '未知用戶';

                  // 如果是電子郵件格式，只顯示 '@' 之前的部分
                  const displayName = rawName.includes('@')
                    ? rawName.split('@')[0]
                    : rawName;

                  return (
                    <Box key={requestId || displayName} sx={{ pl: 4, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        {displayName}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => onAcceptFriend(fromSub)}
                          sx={{ flex: 1 }}
                        >
                          接受
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => onRejectFriend(requestId)}
                          sx={{ flex: 1 }}
                        >
                          拒絕
                        </Button>
                      </Box>
                    </Box>
                  );
                })}
                {friendRequests.length === 0 && (
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="沒有邀請" />
                  </ListItemButton>
                )}
              </List>
            </Collapse>
          </List>
        </Drawer>

        <Typography
          variant="h4"
          component="div"
          sx={{ flexGrow: 1, color: '#271010ff' }}
        >
          記記好帳
        </Typography>

        {!isLoggedIn ? (
          <IconButton color="inherit" onClick={() => navigate('/login')}>
            <LoginIcon />
          </IconButton>
        ) : (
          <IconButton color="inherit" onClick={onLogout}>
            <LogoutIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}
