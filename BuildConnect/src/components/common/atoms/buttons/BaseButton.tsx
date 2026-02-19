import React from 'react';
import { Button, ButtonProps, CircularProgress, alpha, styled, Box } from '@mui/material';

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 10,
  padding: '10px 28px',
  fontWeight: 800,
  textTransform: 'none',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

interface BaseButtonProps extends ButtonProps {
  loading?: boolean;
}

const BaseButton: React.FC<BaseButtonProps> = ({ children, loading, disabled, ...props }) => {
  return (
    <StyledButton 
      disabled={loading || disabled} 
      {...props}
    >
      <Box component="span" sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        visibility: loading ? 'hidden' : 'visible' 
      }}>
        {children}
      </Box>
      
      {loading && (
        <CircularProgress 
          size={24} 
          color="inherit" 
          sx={{ 
            position: 'absolute',
            top: 'calc(50% - 12px)',
            left: 'calc(50% - 12px)'
          }} 
        />
      )}
    </StyledButton>
  );
};

export default BaseButton;