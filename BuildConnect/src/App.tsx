import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Typography, Container, Paper, Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import theme from './theme/theme';
import { StoreContext, rootStore, useStore } from './stores/RootStore';
import LoginPage from '@/modules/authentication/pages/LoginPage';
import RegisterPage from '@/modules/authentication/pages/RegisterPage';

const HomeContent = observer(() => {
  const { authenticationStore, appTitle } = useStore();
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Paper elevation={0} sx={{ p: 5, textAlign: 'center', backgroundColor: 'transparent' }}>
        <Typography variant="h1" color="primary" gutterBottom>
          {appTitle}
        </Typography>
        
        {authenticationStore.isAuthenticated ? (
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Dobrodošli, {authenticationStore.user?.displayName}!
            </Typography>
            <Typography variant="h6" color="secondary" sx={{ mb: 4 }}>
              Prijavljeni ste kao: <strong>{authenticationStore.user?.role}</strong>
            </Typography>
            <Button variant="outlined" color="secondary" onClick={() => authenticationStore.logout()}>
              Odjavi se
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="h5" sx={{ mb: 4 }}>
              Povezujemo investitore i vrhunske izvođače radova.
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/login')}
              sx={{ mr: 2 }}
            >
              Kreni (Prijava)
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              onClick={() => navigate('/register')}
            >
              Registracija
            </Button>
          </Box>
        )}
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
          <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Routes>
              <Route path="/" element={<HomeContent />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </StoreContext.Provider>
  );
};

export default App;