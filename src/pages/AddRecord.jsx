// src/pages/AddRecord.jsx
import { Container, TextField, Button, Typography, Box, Paper, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';

export default function AddRecord() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={2} display="flex" alignItems="center">
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          新增紀錄
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <TextField fullWidth label="標題" placeholder="例如：早餐、計程車費" margin="normal" variant="outlined" />
        
        <TextField 
            fullWidth 
            label="金額" 
            type="number" 
            margin="normal" 
            placeholder="0"
            InputProps={{
                startAdornment: <Typography color="text.secondary" sx={{ mr: 1 }}>$</Typography>
            }}
        />
        
        {/* 未來這裡建議改成 Select (下拉選單) */}
        <TextField fullWidth label="分類" placeholder="食、衣、住、行..." margin="normal" />

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button 
                fullWidth 
                variant="outlined" 
                size="large"
                onClick={() => navigate(-1)}
            >
                取消
            </Button>
            <Button 
                fullWidth 
                variant="contained" 
                size="large"
                startIcon={<SaveIcon />}
            >
                儲存
            </Button>
        </Box>
      </Paper>
    </Container>
  )
}