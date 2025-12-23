import { Container, TextField, Button, Typography, Box, Paper, IconButton, ToggleButton, ToggleButtonGroup  } from '@mui/material';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeaders, isAuthenticated } from '../utils/auth';
import { useSearchParams } from "react-router-dom";

export default function AddRecord() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [type, setType] = useState('expense'); // 收入 / 支出
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: searchParams.get("date") || new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleTypeChange = (event, newType) => {
    if (newType !== null) setType(newType);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.amount || !formData.category || !formData.description) {
      alert('請完整填寫金額、分類與標題');
      return;
    }
    if (!imageFile) {
      alert('請上傳一張圖片');
      return;
    }
    if (!isAuthenticated()) {
      alert('請先登入');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      let s3Key = null;
      if (imageFile) {
        const uploadRes = await axios.post(
          'https://ttxklr1893.execute-api.ap-southeast-1.amazonaws.com/prod/upload-url',
          { fileName: imageFile.name, contentType: imageFile.type },
          { headers: getAuthHeaders() }
        );
        const { uploadUrl, s3Key: key } = uploadRes.data;
        s3Key = key;
        await axios.put(uploadUrl, imageFile, { headers: { 'Content-Type': imageFile.type } });
      }

      const response = await axios.post(
        'https://ttxklr1893.execute-api.ap-southeast-1.amazonaws.com/prod/expenses',
        {
          price: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date, // 傳送使用者選擇的日期
          s3Key: s3Key, // 傳送 s3Key 給後端
          type: type // 新增 type 字段
        },
        { headers: getAuthHeaders() }
      );

      if (response.status === 201) {
        alert('新增成功！');
        navigate(-1);
      }
    } catch (error) {
      console.error('新增失敗詳細錯誤:', error);
      if (error.response?.status === 401) {
        alert('登入已過期，請重新登入');
        navigate('/login');
      } else {
        alert('新增失敗：' + (error.response?.data?.error || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={2} display="flex" alignItems="center">
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1, color: 'black' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" sx={{ color: 'black' }}>新增紀錄</Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {/* 收入/支出 Toggle */}
        <Box mb={3} display="flex" justifyContent="center">
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={handleTypeChange}
            aria-label="收支類型"
            sx={{
              '.MuiToggleButton-root': { color: 'black' },
              '.Mui-selected': {
                bgcolor: 'black',
                color: 'white',
                '&:hover': { bgcolor: '#333' }
              }
            }}
          >
            <ToggleButton value="income" aria-label="收入">收入</ToggleButton>
            <ToggleButton value="expense" aria-label="支出">支出</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <TextField
          fullWidth
          label="標題"
          placeholder="例如：早餐、計程車費"
          margin="normal"
          variant="outlined"
          value={formData.description}
          onChange={handleChange('description')}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
            '& .MuiInputLabel-root': { color: 'black' }
          }}
        />

        <TextField
          fullWidth
          label="金額"
          type="number"
          margin="normal"
          placeholder="0"
          value={formData.amount}
          onChange={handleChange('amount')}
          InputProps={{ startAdornment: <Typography color="text.primary" sx={{ mr: 1 }}>$</Typography> }}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
            '& .MuiInputLabel-root': { color: 'black' }
          }}
        />

        <FormControl fullWidth margin ="normal" >
          <InputLabel id="category-label" sx={{ color: 'black' }}>分類</InputLabel>
          <Select
            labelId="category-label"
            value={formData.category}
            label="分類"
            onChange={handleChange('category')}
            sx={{
              color: 'black',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
              '& .MuiSvgIcon-root': { color: 'black' } // 下拉箭頭顏色
            }}
          >
            <MenuItem value="食">食</MenuItem>
            <MenuItem value="衣">衣</MenuItem>
            <MenuItem value="住">住</MenuItem>
            <MenuItem value="行">行</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="日期"
          type="date"
          value={formData.date}
          onChange={handleChange('date')}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
            '& .MuiInputLabel-root': { color: 'black' }
          }}
        />

        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          sx={{ mt: 2, mb: 1, color: 'black', borderColor: 'black', '&:hover': { borderColor: 'black', bgcolor: '#f0f0f0' } }}
          fullWidth
        >
          上傳圖片
          <input type="file" hidden accept="image/*" onChange={handleImageChange} />
        </Button>

        {imagePreview && (
          <Box mt={2} mb={2} position="relative" sx={{ width: '100%', height: '200px', overflow: 'hidden', borderRadius: 1, border: '1px solid #e0e0e0' }}>
            <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            <IconButton onClick={handleRemoveImage} sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }} size="small">
              <DeleteIcon sx={{ color: 'black' }} />
            </IconButton>
          </Box>
        )}

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button fullWidth variant="outlined" size="large" onClick={() => navigate(-1)} disabled={loading} sx={{ color: 'black', borderColor: 'black', '&:hover': { bgcolor: '#f0f0f0', borderColor: 'black' } }}>
            取消
          </Button>
          <Button
            fullWidth
            size="large"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              backgroundColor: 'black',   // 主色
              color: 'white',             // 文字
              '&:hover': { backgroundColor: '#333' }, // hover 色
              '&.Mui-disabled': {          // disabled 狀態也保持黑色/灰色
                backgroundColor: '#555',
                color: '#ccc',
              },
            }}
          >
            {loading ? '儲存中...' : '儲存'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
