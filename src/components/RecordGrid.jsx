// src/components/RecordGrid.jsx
import { ImageList, ImageListItem, Box, Typography, Dialog, DialogContent, DialogActions, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function RecordGrid({ records, selectedRecord, setSelectedRecord, handleDelete }) {
  return (
    <>
      <ImageList cols={3} gap={4}>
        {records.map((item) => (
          <ImageListItem 
            key={item.recordId} 
            onClick={() => setSelectedRecord(item)}
            sx={{ cursor: 'pointer', aspectRatio: '1 / 1', overflow: 'hidden', borderRadius: 2 }}
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.description}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                <Typography variant="h6" color="text.secondary" fontWeight="bold">${item.amount}</Typography>
                <Typography variant="caption" color="text.secondary">{item.category}</Typography>
              </Box>
            )}
          </ImageListItem>
        ))}
      </ImageList>

      {/* 詳情對話框 */}
      <Dialog open={!!selectedRecord} onClose={() => setSelectedRecord(null)} maxWidth="xs" fullWidth>
        {selectedRecord && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 1 }}>
              <Box sx={{ flex: 1, pr: 2 }}>
                <Typography variant="h6" fontWeight="bold">{selectedRecord.description || "未命名紀錄"}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(selectedRecord.createdAt).toLocaleDateString('zh-TW', { year:'numeric', month:'2-digit', day:'2-digit'})}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              {selectedRecord.imageUrl && (
                <Box sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden', border: '1px solid #eee' }}>
                  <img src={selectedRecord.imageUrl} alt="Detail" style={{ width: '100%', display: 'block' }} />
                </Box>
              )}
              <Typography variant="h4" color="error" fontWeight="bold" gutterBottom>${selectedRecord.amount}</Typography>
              <Box display="flex" gap={1} mb={1}>
                <Typography variant="body2" fontWeight="bold" sx={{ px: 1.5, py: 0.5, bgcolor:'#f3f4f6', borderRadius:1, color:'text.secondary'}}>
                  {selectedRecord.category}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => setSelectedRecord(null)} color="inherit">返回</Button>
              <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(selectedRecord.recordId)} sx={{ borderRadius: 2 }}>
                刪除
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  )
}
