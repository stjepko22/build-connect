import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import LoginPage from '@/modules/authentication/pages/LoginPage';

import CreateJobPage from '@/modules/marketplace/jobs/pages/CreateJobPage';
import JobListPage from '@/modules/marketplace/jobs/pages/JobListPage';
import JobDetailsPage from '@/modules/marketplace/jobs/pages/JobDetailsPage';
import MyJobsPage from '@/modules/marketplace/jobs/pages/MyJobsPage';
import ContractorProfilePage from '@/modules/marketplace/jobs/pages/ContractorProfilePage';
import LandingPage from '@/modules/landing/pages/LandingPage';
import MainLayout from '@/layouts/MainLayout';
import RootStoreContext from './context/RootStoreContext';
import { RootStore } from './stores/RootStore';
import RegistrationPage from './modules/authentication/pages/RegistrationPage';

const rootStore = new RootStore();
const App: React.FC = () => {
  return (
    <RootStoreContext.Provider value={rootStore}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/marketplace" element={<JobListPage />} />
              <Route path="/marketplace/:id" element={<JobDetailsPage />} />
              <Route path="/objavi-posao" element={<CreateJobPage />} />
              <Route path="/moji-poslovi" element={<MyJobsPage />} />
              <Route path="/profil/:id" element={<ContractorProfilePage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </RootStoreContext.Provider>
  );
};

export default App;