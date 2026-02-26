import React from 'react';
import { Navigate } from 'react-router-dom';
import { Paper, alpha, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import BaseContainer from '@/components/common/atoms/containers/BaseContainer';
import { useRootStore } from '@/hooks/useRootStore';
import Login from '../components/Login';

const LoginPage: React.FC = observer(() => {
  const theme = useTheme();
  const { authenticationStore } = useRootStore();

  if (authenticationStore.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <BaseContainer maxWidth="xs">
      <Paper
        sx={{
          p: { xs: 4, md: '48px 72px' },
          borderRadius: 6,
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.1),
          boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
          bgcolor: 'background.paper',
          width: '100%',
        }}
      >
        <Login authenticationStore={authenticationStore} />
      </Paper>
    </BaseContainer>
  );
});

export default LoginPage;
