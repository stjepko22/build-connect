import React from 'react';
import { Paper, alpha, useTheme } from '@mui/material';
import BaseContainer from '@/components/common/atoms/containers/BaseContainer';
import LoginView from '../components/LoginView';

const LoginPage: React.FC = () => {
  const theme = useTheme();

  return (
    <BaseContainer maxWidth="xs">
        <Paper 
          sx={{ 
            p: { xs: 4, md: "48px 72px" },
            borderRadius: 6,
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.1),
            boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
            bgcolor: 'background.paper',
            width: '100%'
          }}
        >
          <LoginView />
        </Paper>
    </BaseContainer>
  );
};

export default LoginPage;