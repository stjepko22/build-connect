import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@/core/hooks/useRootStore';
import AuthPageShell from '../components/AuthPageShell';
import Login from '../components/Login';

const LoginPage: React.FC = observer(() => {
  const navigate = useNavigate();
  const { authenticationStore } = useRootStore();

  const handleBack = () => {
    if ((window.history.state?.idx ?? 0) > 0) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  if (authenticationStore.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthPageShell onBack={handleBack}>
      <Login authenticationStore={authenticationStore} />
    </AuthPageShell>
  );
});

export default LoginPage;
