// src/pages/AddRecord.jsx
import { Container, TextField, Button, Typography, Box, Paper, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeaders, isAuthenticated, getIdToken } from '../utils/auth';
import { useSearchParams } from "react-router-dom";


export default function AddRecord() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSubmit = async () => {
    // 檢查所有必要欄位：金額、分類、標題、圖片
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

      // 如果有選擇圖片，先處理上傳
      if (imageFile) {
        // 1. 向後端請求預簽名 URL
        console.log('Requesting upload URL...');
        
        // 使用標準 Auth Header (Cognito Authorizer 驗證後會傳遞 Claims 給 Lambda)
        const uploadRes = await axios.post(
          'https://ttxklr1893.execute-api.ap-southeast-1.amazonaws.com/prod/upload-url',
          {
            fileName: imageFile.name,
            contentType: imageFile.type
          },
          { headers: getAuthHeaders() }
        );

        const { uploadUrl, s3Key: key } = uploadRes.data;
        s3Key = key;

        // 2. 直接上傳圖片到 S3 (不需要 Auth Header，因為 Url 已經簽名了)
        // 注意：Content-Type 必須與步驟 1 請求的一致
        console.log('Uploading to S3...');
        await axios.put(uploadUrl, imageFile, {
          headers: {
            'Content-Type': imageFile.type
          }
        });
      }

      // 3. 儲存紀錄到 DynamoDB
      console.log('Saving record...');
      // 這裡維持原樣，因為如果是 NONE Authorizer 則不影響，如果是 Cognito 則需一致
      // 假設 /expenses 還是用原本的方式 (可能依賴 Lambda 內部邏輯或 API Gateway 設定)
      const response = await axios.post(
        'https://ttxklr1893.execute-api.ap-southeast-1.amazonaws.com/prod/expenses',
        {
          price: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date, // 傳送使用者選擇的日期
          s3Key: s3Key // 傳送 s3Key 給後端
        },
        {
          headers: getAuthHeaders()
        }
      );

      if (response.status === 201) {
        alert('新增成功！');
        navigate(-1);
      }
    } catch (error) {
      console.error('新增失敗詳細錯誤:', error);
      if (error.response) {
          console.error('Response Status:', error.response.status);
          console.error('Response Data:', error.response.data);
      }
      
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
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          新增紀錄
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <TextField
          fullWidth
          label="標題"
          placeholder="例如：早餐、計程車費"
          margin="normal"
          variant="outlined"
          value={formData.description}
          onChange={handleChange('description')}
        />

        <TextField
            fullWidth
            label="金額"
            type="number"
            margin="normal"
            placeholder="0"
            value={formData.amount}
            onChange={handleChange('amount')}
            InputProps={{
                startAdornment: <Typography color="text.secondary" sx={{ mr: 1 }}>$</Typography>
            }}
        />

        {/* 未來這裡建議改成 Select (下拉選單) */}
        <TextField
          fullWidth
          label="分類"
          placeholder="食、衣、住、行..."
          margin="normal"
          value={formData.category}
          onChange={handleChange('category')}
        />
        
        <TextField
          label="日期"
          type="date"
          value={formData.date}
          onChange={handleChange('date')}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />

        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          sx={{ mt: 2, mb: 1 }}
          fullWidth
        >
          上傳圖片
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>

        {imagePreview && (
          <Box mt={2} mb={2} position="relative" sx={{ width: '100%', height: '200px', overflow: 'hidden', borderRadius: 1, border: '1px solid #e0e0e0' }}>
            <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
            <IconButton 
                onClick={handleRemoveImage}
                sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                size="small"
            >
                <DeleteIcon />
            </IconButton>
          </Box>
        )}

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => navigate(-1)}
                disabled={loading}
            >
                取消
            </Button>
            <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? '儲存中...' : '儲存'}
            </Button>
        </Box>
      </Paper>
    </Container>
  )
}
