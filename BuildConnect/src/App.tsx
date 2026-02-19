import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Typography, Container, Paper } from '@mui/material';
import { observer } from 'mobx-react-lite';
import theme from './theme/theme';
import { StoreContext, rootStore, useStore } from './stores/RootStore';
import LoginPage from '@/modules/authentication/pages/LoginPage';
import RegisterPage from '@/modules/authentication/pages/RegisterPage';
import CreateJobPage from '@/modules/marketplace/jobs/pages/CreateJobPage';
import JobListPage from '@/modules/marketplace/jobs/pages/JobListPage';
import JobDetailsPage from '@/modules/marketplace/jobs/pages/JobDetailsPage';
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
          Povezujemo investitore i vrhunske izvođače radova.
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
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/marketplace" element={<JobListPage />} />
              <Route path="/marketplace/:id" element={<JobDetailsPage />} />
              <Route path="/objavi-posao" element={<CreateJobPage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </StoreContext.Provider>
  );
};

export default App;