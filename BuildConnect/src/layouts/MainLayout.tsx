import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '@/modules/navigation/components/Navbar';

const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Box>
      {/* Ovdje možemo kasnije dodati Footer */}
    </Box>
  );
};

export default MainLayout;