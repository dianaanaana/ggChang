import { List, ListItemButton, ListItemText, Container, Typography, Paper, Box, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const friends = [
  { userId: "user_aaa", name: "Alex" },
  { userId: "user_bbb", name: "Ben" },
  { userId: "user_ccc", name: "Cindy" },
];

export default function Friends() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4, fontFamily: '"Noto Sans TC", "Roboto", sans-serif' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, textAlign: 'center' }}>
        我的朋友
      </Typography>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 3, bgcolor: '#f9f9f9' }}>
        <List>
          {friends.map((f) => (
            <ListItemButton
              key={f.userId}
              onClick={() => navigate(`/friends/${f.userId}`)}
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
              {/* 可加 avatar */}
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: '#1976d2' }}>
                  {f.name[0]}
                </Avatar>
                <ListItemText primary={f.name} primaryTypographyProps={{ fontWeight: 'medium', fontSize: '1rem' }} />
              </Box>
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </Container>
  );
}
