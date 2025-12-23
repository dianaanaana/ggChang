// src/components/MonthlySummaryCard.jsx
import { Card, Typography, Grid } from '@mui/material';

export default function MonthlySummaryCard({ monthlyExpense, monthlyIncome }) {
  return (
    <Card sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: 'white' }}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Card sx={{ p: 4, bgcolor: "#fee2e2" }}>
            <Typography variant="subtitle2" color="error">本月支出</Typography>
            <Typography variant="h4" fontWeight="bold" color="error">${monthlyExpense}</Typography>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ p: 4, bgcolor: "#dcfce7" }}>
            <Typography variant="subtitle2" color="success.main">本月收入</Typography>
            <Typography variant="h4" fontWeight="bold" color="success.main">${monthlyIncome}</Typography>
          </Card>
        </Grid>
      </Grid>
    </Card>
  );
}
