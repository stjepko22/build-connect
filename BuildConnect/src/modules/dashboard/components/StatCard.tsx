import React from 'react';
import { Box, Typography, alpha, useTheme } from '@mui/material';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => {
  const theme = useTheme();
  const mainColor = color || theme.palette.primary.main;

  return (
    <Box sx={{
      p: 3,
      borderRadius: 4,
      border: '1px solid',
      borderColor: alpha(mainColor, 0.2),
      bgcolor: alpha(mainColor, 0.04),
      display: 'flex',
      alignItems: 'center',
      gap: 3
    }}>
      <Box sx={{
        width: 50,
        height: 50,
        borderRadius: 2,
        bgcolor: mainColor,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled', textTransform: 'uppercase' }}>
          {label}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 900, color: 'secondary.main' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatCard;

