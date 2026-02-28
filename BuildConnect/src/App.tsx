import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './ui/themes/default/theme';
import LoginPage from '@/modules/authentication/pages/LoginPage';

import CreateJobPage from '@/modules/marketplace/jobs/pages/CreateJobPage';
import JobListPage from '@/modules/marketplace/jobs/pages/JobListPage';
import JobDetailsPage from '@/modules/marketplace/jobs/pages/JobDetailsPage';
import MyJobsPage from '@/modules/marketplace/jobs/pages/MyJobsPage';
import ProfilePage from '@/modules/user/pages/ProfilePage';
import DashboardPage from '@/modules/dashboard/pages/DashboardPage'; // NOVO
import LandingPage from '@/modules/landing/pages/LandingPage';
import MainLayout from '@/ui/layout/MainLayout';
import RootStoreContext from './core/context/RootStoreContext';
import { RootStore } from './core/stores/RootStore';
import RegistrationPage from './modules/authentication/pages/RegistrationPage';
import { useRootStore } from './core/hooks/useRootStore';

const rootStore = new RootStore();

type Role = 'INVESTITOR' | 'IZVODJAC';

interface RequireAuthProps {
  allowedRoles?: Role[];
}

const RequireAuth: React.FC<RequireAuthProps> = observer(({ allowedRoles }) => {
  const { authenticationStore } = useRootStore();
  const user = authenticationStore.user;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/marketplace" replace />;
  }

  return <Outlet />;
});

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
              {/* Posao detalji dostupni i preko /posao/:id ako želiš konzistentnost */}
              <Route path="/posao/:id" element={<JobDetailsPage />} /> 
              <Route path="/profil/:id" element={<ProfilePage />} />

              {/* Rute za prijavljene korisnike */}
              <Route element={<RequireAuth />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/moji-poslovi" element={<MyJobsPage />} />
              </Route>

              {/* Rute specifične za uloge */}
              <Route element={<RequireAuth allowedRoles={['INVESTITOR']} />}>
                <Route path="/objavi-posao" element={<CreateJobPage />} />
              </Route>
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
