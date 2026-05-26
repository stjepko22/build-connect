import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Box, Paper, alpha, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import { useRootStore } from '@/core/hooks/useRootStore';
import Login from '../components/Login';

const LoginPage: React.FC = observer(() => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { authenticationStore } = useRootStore();

  if (authenticationStore.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <BaseContainer maxWidth="xs">
      <Box sx={{ mb: 2 }}>
        <BaseButton variant="text" onClick={() => navigate('/')} sx={{ px: 0, fontWeight: 700 }}>
          Natrag na početnu
        </BaseButton>
      </Box>
      <Paper
        sx={{
          p: { xs: 4, md: '48px 72px' },
          borderRadius: 6,
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.1),
          boxShadow: 2,
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

