import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '@/modules/navigation/components/Header';
import Footer from '@/modules/navigation/components/Footer';
import LoginView from '@/modules/authentication/components/LoginView';


const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Box>

      {/* Globalni login dijalog koji se okida preko AuthenticationStore-a */}
      <LoginView />

      <Footer />
    </Box>
  );
};

export default MainLayout;