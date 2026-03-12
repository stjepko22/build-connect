import React from 'react';
import { observer } from "mobx-react-lite";
import { Box, Button, ButtonProps, CircularProgress, SxProps, Theme } from '@mui/material';

interface BaseLoadingButtonProps extends ButtonProps {
  isLoading: boolean;
  title: string;
}

const BaseLoadingButton = observer(({ 
  isLoading, 
  title, 
  disabled, 
  variant = "contained", 
  sx,
  ...props 
}: BaseLoadingButtonProps) => {
  
  // Spajamo proslijeđeni sx sa našim baznim stilovima
  const combinedSx: SxProps<Theme> = {
    position: 'relative',
    transition: 'all 0.2s ease-in-out',
    ...((sx as object) || {}),
  };

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        display: props.fullWidth ? 'block' : 'inline-block',
        width: props.fullWidth ? '100%' : 'auto' 
      }}
    >
      <Button
        {...props}
        variant={variant}
        disabled={disabled || isLoading}
        sx={combinedSx}
      >
        {/* Koristimo Box sa opacity kako bi gumb zadržao dimenzije teksta dok se vrti loader */}
        <Box component="span" sx={{ opacity: isLoading ? 0 : 1, display: 'flex', alignItems: 'center' }}>
          {title}
        </Box>
      </Button>

      {isLoading && (
        <CircularProgress
          size={24}
          sx={{
            color: variant === 'contained' ? 'inherit' : 'primary.main',
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
            zIndex: 1
          }}
        />
      )}
    </Box>
  );
});

export default BaseLoadingButton;

