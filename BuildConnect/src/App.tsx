import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Typography, Container, Paper } from '@mui/material';
import { observer } from 'mobx-react-lite';
import theme from './theme/theme';
import { StoreContext, rootStore, useStore } from './stores/RootStore';
import LoginPage from '@/modules/authentication/pages/LoginPage';
import RegisterPage from '@/modules/authentication/pages/RegisterPage';
import MainLayout from '@/layouts/MainLayout';

const HomePage = observer(() => {
  const { appTitle } = useStore();
  
  return (
    <Container maxWidth="md">
      <Paper elevation={0} sx={{ p: 5, textAlign: 'center', backgroundColor: 'transparent' }}>
        <Typography variant="h2" color="primary" gutterBottom sx={{ fontWeight: 800 }}>
          {appTitle}
        </Typography>
        <Typography variant="h5" color="secondary">
          Dobrodošli na centralno mjesto za građevinske usluge.
        </Typography>
      </Paper>
    </Container>
  );
});

const App: React.FC = () => {
  return (
    <StoreContext.Provider value={rootStore}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Rute koje koriste MainLayout (Navbar je vidljiv) */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              {/* Buduće rute idu ovdje */}
            </Route>

            {/* Rute bez Navbara (opcionalno, ali login često volimo bez) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Fallback na home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </StoreContext.Provider>
  );
};

export default App;