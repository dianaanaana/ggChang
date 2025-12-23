import { List, ListItemButton, ListItemText, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const friends = [
  { userId: "user_aaa", name: "Alex" },
  { userId: "user_bbb", name: "Ben" },
  { userId: "user_ccc", name: "Cindy" },
];

export default function Friends() {
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        我的朋友
      </Typography>

      <List>
        {friends.map((f) => (
          <ListItemButton
            key={f.userId}
            onClick={() => navigate(`/friends/${f.userId}`)}
          >
            <ListItemText primary={f.name} />
          </ListItemButton>
        ))}
      </List>
    </Container>
  );
}




