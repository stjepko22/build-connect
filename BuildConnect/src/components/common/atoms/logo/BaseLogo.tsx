import React from 'react';
import { Typography, Box } from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { useNavigate } from 'react-router-dom';

const BaseLogo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box 
      onClick={() => navigate('/')}
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      <EngineeringIcon sx={{ color: 'primary.main', fontSize: 28 }} />
      <Typography
        variant="h6"
        noWrap
        sx={{
          fontWeight: 900,
          letterSpacing: '-0.5px',
          color: 'secondary.main',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        BUILD<span style={{ color: '#FFB300' }}>CONNECT</span>
      </Typography>
    </Box>
  );
};

export default BaseLogo;