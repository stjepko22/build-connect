import React from 'react';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../../hooks/useRootStore';
// PAŽNJA: Uvoziš LoginDialog, on je taj koji prima 'open' i 'onClose'
import LoginDialog from '../components/LoginDialog';

const LoginView: React.FC = observer(() => {
  const { authenticationStore } = useRootStore();

  return (
    <LoginDialog 
      open={authenticationStore.isLoginDialogOpen} 
      onClose={() => authenticationStore.setLoginDialogOpen(false)} 
      authenticationStore={authenticationStore}
    />
  );
});

export default LoginView;