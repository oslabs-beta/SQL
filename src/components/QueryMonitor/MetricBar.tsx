import { Box, Typography, LinearProgress } from '@mui/material';

interface MetricBarProps {
  label: string;
  value: number;
  unit: string;
}

export const MetricBar = ({ label, value, unit }: MetricBarProps) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2">{value}{unit}</Typography>
    </Box>
    <LinearProgress 
      variant="determinate" 
      value={Math.min(100, (value/100) * 100)} 
      sx={{ height: 8, borderRadius: 1 }}
    />
  </Box>
);