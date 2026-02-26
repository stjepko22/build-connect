import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, DialogContent, IconButton } from '@mui/material';
import React from 'react';
import AuthenticationStore from '../stores/AuthenticationStore';
import Login from './Login';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  authenticationStore: AuthenticationStore;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose, authenticationStore }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 6, 
          p: 1,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)' 
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={onClose} sx={{ color: 'text.disabled', p: 1.25 }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ pb: 6, pt: 0, px: { xs: 3, md: 5 } }}>
        <Login 
          authenticationStore={authenticationStore} 
          onSuccess={onClose} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
